#!/usr/bin/env python3
import json
import os
import re
import subprocess
import sys

def main():
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    pytania_path = os.path.join(repo_root, "docs", "assets", "egzamin", "pytania.json")
    obszary_path = os.path.join(repo_root, "docs", "assets", "egzamin", "obszary.json")

    errors = []
    warnings = []

    # 1. Weryfikacja pliku obszary.json
    if not os.path.exists(obszary_path):
        errors.append(f"Brak pliku obszary.json pod ścieżką: {obszary_path}")
        obszary_ids = set()
    else:
        try:
            with open(obszary_path, "r", encoding="utf-8") as f:
                obszary_data = json.load(f)
            if not isinstance(obszary_data, list):
                errors.append("obszary.json musi zawierać listę obiektów.")
                obszary_ids = set()
            else:
                obszary_ids = {o.get("id") for o in obszary_data if isinstance(o, dict) and "id" in o}
        except Exception as e:
            errors.append(f"Błąd czytania/parsowania obszary.json: {e}")
            obszary_ids = set()

    # 2. Weryfikacja pliku pytania.json
    if not os.path.exists(pytania_path):
        errors.append(f"Brak pliku pytania.json pod ścieżką: {pytania_path}")
        print("BŁĄD: Plik z pytaniami nie istnieje.")
        sys.exit(1)

    try:
        with open(pytania_path, "r", encoding="utf-8") as f:
            pytania = json.load(f)
    except Exception as e:
        errors.append(f"Błąd czytania/parsowania pytania.json: {e}")
        print(f"BŁĄD: {e}")
        sys.exit(1)

    if not isinstance(pytania, list):
        errors.append("pytania.json musi być listą obiektów.")
        print("BŁĄD: pytania.json nie jest listą.")
        sys.exit(1)

    seen_ids = set()
    seen_pytania_texts = set()
    obszar_counts = {obs: 0 for obs in obszary_ids}
    ans_counts = {0: 0, 1: 0, 2: 0, 3: 0}

    id_pattern = re.compile(r"^inf03-[a-z0-9]+-[0-9]{3}$")

    for idx, q in enumerate(pytania):
        q_prefix = f"Pytanie #{idx + 1}"
        if not isinstance(q, dict):
            errors.append(f"{q_prefix}: nie jest obiektem JSON.")
            continue

        q_id = q.get("id")
        q_prefix = f"Pytanie ID '{q_id}'" if q_id else f"Pytanie #{idx + 1}"

        # Sprawdzenie pól
        required_fields = ["id", "obszar", "temat", "pytanie", "kod", "opcje", "poprawna", "wyjasnienie"]
        for field in required_fields:
            if field not in q:
                errors.append(f"{q_prefix}: brak wymaganego pola '{field}'.")

        # Validation of ID
        if not isinstance(q_id, str) or not q_id:
            errors.append(f"{q_prefix}: pole 'id' musi być niepustym napisem.")
        else:
            if q_id in seen_ids:
                errors.append(f"{q_prefix}: Zdublowane ID '{q_id}'.")
            seen_ids.add(q_id)

            if not id_pattern.match(q_id):
                errors.append(f"{q_prefix}: ID '{q_id}' nie pasuje do wzorca 'inf03-<obszar-skrót>-NNN' (np. inf03-html-001).")

        # Obszar
        obszar = q.get("obszar")
        if obszar not in obszary_ids:
            errors.append(f"{q_prefix}: nieznany obszar '{obszar}'. Dopuszczalne: {sorted(list(obszary_ids))}")
        else:
            obszar_counts[obszar] = obszar_counts.get(obszar, 0) + 1

        # Temat
        temat = q.get("temat")
        if not isinstance(temat, str):
            errors.append(f"{q_prefix}: pole 'temat' musi być ciągiem znaków.")
        elif temat != "" and not temat.startswith("https://"):
            # Powinna być ścieżka pliku w docs/
            # Może być podana jako "dzial-1/..." lub "docs/dzial-1/..."
            rel_path = temat if not temat.startswith("docs/") else temat[5:]
            full_path = os.path.join(repo_root, "docs", rel_path)
            if not os.path.exists(full_path):
                errors.append(f"{q_prefix}: pole 'temat' wskazuje nieistniejący plik '{temat}' (szukano: {full_path}).")

        # Pytanie tekst
        pytanie_text = q.get("pytanie")
        if not isinstance(pytanie_text, str) or not pytanie_text.strip():
            errors.append(f"{q_prefix}: pole 'pytanie' musi być niepustym tekstem.")
        else:
            norm_text = pytanie_text.strip().lower()
            if norm_text in seen_pytania_texts:
                errors.append(f"{q_prefix}: zdublowana treść pytania: '{pytanie_text[:50]}...'")
            seen_pytania_texts.add(norm_text)

        # Opcje
        opcje = q.get("opcje")
        if not isinstance(opcje, list) or len(opcje) != 4:
            errors.append(f"{q_prefix}: pole 'opcje' musi zawierać dokładnie 4 elementy.")
        else:
            for i, opt in enumerate(opcje):
                if not isinstance(opt, str) or not opt.strip():
                    errors.append(f"{q_prefix}: opcja {i+1} jest pusta lub nie jest napisem.")
            if len(set(opcje)) < len(opcje):
                errors.append(f"{q_prefix}: opcje odpowiedzi zawierają powtórzenia.")

        # Poprawna
        poprawna = q.get("poprawna")
        if not isinstance(poprawna, int) or poprawna < 0 or poprawna > 3:
            errors.append(f"{q_prefix}: pole 'poprawna' musi być liczbą całkowitą od 0 do 3.")
        else:
            ans_counts[poprawna] = ans_counts.get(poprawna, 0) + 1

        # Wyjaśnienie
        wyjasnienie = q.get("wyjasnienie")
        if not isinstance(wyjasnienie, str) or not wyjasnienie.strip():
            errors.append(f"{q_prefix}: pole 'wyjasnienie' musi być niepustym tekstem.")

    # 3. Porównanie z poprzednim commitem w git (HEAD:docs/assets/egzamin/pytania.json)
    try:
        git_cmd = subprocess.run(
            ["git", "show", "HEAD:docs/assets/egzamin/pytania.json"],
            cwd=repo_root,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8"
        )
        if git_cmd.returncode == 0 and git_cmd.stdout.strip():
            prev_pytania = json.loads(git_cmd.stdout)
            prev_dict = {q["id"]: q for q in prev_pytania if isinstance(q, dict) and "id" in q}
            curr_dict = {q["id"]: q for q in pytania if isinstance(q, dict) and "id" in q}

            for p_id, p_q in prev_dict.items():
                if p_id not in curr_dict:
                    warnings.append(f"OSTRZEŻENIE: ID '{p_id}' z poprzedniego commita zostało usunięte z banku.")
                else:
                    curr_q = curr_dict[p_id]
                    if curr_q.get("pytanie") != p_q.get("pytanie"):
                        errors.append(f"BŁĄD: ID '{p_id}' zostało użyte ponownie dla nowej/zmienionej treści pytania.")
    except Exception as e:
        # Prawdopodobnie brak pliku w HEAD przy pierwszym commicie
        pass

    # Podsumowanie i raport
    print("=== SPRAWDZANIE BANKU PYTAŃ INF.03 ===")
    print(f"Łączna liczba pytań: {len(pytania)}")
    print("\nLiczba pytań na obszar:")
    for obs, count in obszar_counts.items():
        print(f"  - {obs}: {count}")

    letters = ["A", "B", "C", "D"]
    print("\nRozkład poprawnych odpowiedzi:")
    for idx, count in ans_counts.items():
        pct = (count / len(pytania) * 100) if pytania else 0
        print(f"  - {letters[idx]} ({idx}): {count} ({pct:.1f}%)")

    if warnings:
        print("\n=== OSTRZEŻENIA ===")
        for w in warnings:
            print(f"  ⚠ {w}")

    if errors:
        print("\n=== BŁĘDY (KOD 1) ===")
        for e in errors:
            print(f"  ❌ {e}")
        sys.exit(1)

    print("\n✅ Wszystkie testy banku pytań zakończone pomyślnie!")
    sys.exit(0)

if __name__ == "__main__":
    main()
