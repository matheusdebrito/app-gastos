"""Teste de integração do esquema SQL em SQLite real e descartável.

Não substitui a validação da ponte expo-sqlite em Android.
"""
import pathlib
import re
import sqlite3
import unittest

SOURCE = pathlib.Path(__file__).resolve().parents[1] / "src" / "data" / "database.ts"


def schema_sql():
    source = SOURCE.read_text(encoding="utf-8")
    match = re.search(r"await tx\.execAsync\(`(CREATE TABLE.*?CREATE INDEX.*?);?\s*`\);", source, re.S)
    if not match:
        raise AssertionError("DDL de migração não encontrada; atualizar este teste se a migração mudar")
    return match.group(1)


class SQLiteIntegrationTest(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        self.db.execute("PRAGMA foreign_keys=ON")
        self.db.executescript(schema_sql())
        self.db.execute("INSERT INTO categories(id,type,name) VALUES (?,?,?)", ("cat-exp", "expense", "Alimentação"))
        self.db.execute("INSERT INTO categories(id,type,name) VALUES (?,?,?)", ("cat-inc", "income", "Salário"))
        self.db.commit()

    def tearDown(self):
        self.db.close()

    def test_categoria_duplicada_case_insensitive(self):
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("INSERT INTO categories(id,type,name) VALUES (?,?,?)", ("duplicate","expense","alimentação"))

    def test_fk_impede_lancamento_sem_categoria(self):
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute(
                "INSERT INTO entries(id,type,category_id,amount_cents,due_date) VALUES (?,?,?,?,?)",
                ("entry", "expense", "missing", 250, "2026-11-09"))

    def test_nao_aceita_valor_zero(self):
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute(
                "INSERT INTO entries(id,type,category_id,amount_cents,due_date) VALUES (?,?,?,?,?)",
                ("entry", "expense", "cat-exp", 0, "2026-11-09"))

    def test_posicao_de_serie_nao_duplicada(self):
        self.db.execute(
            "INSERT INTO series(id,kind,type,category_id,amount_cents,start_date,description,months) VALUES (?,?,?,?,?,?,?,?)",
            ("serie", "recurring", "expense", "cat-exp", 250, "2026-11-09", "", 2))
        self.db.execute(
            "INSERT INTO entries(id,type,category_id,amount_cents,due_date,series_id,position) VALUES (?,?,?,?,?,?,?)",
            ("entry1", "expense", "cat-exp", 250, "2026-11-09", "serie", 1))
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute(
                "INSERT INTO entries(id,type,category_id,amount_cents,due_date,series_id,position) VALUES (?,?,?,?,?,?,?)",
                ("entry2", "expense", "cat-exp", 250, "2026-11-09", "serie", 1))

    def test_transferencia_rollback(self):
        self.db.execute("INSERT INTO categories(id,type,name) VALUES (?,?,?)", ("dest", "expense", "Lazer"))
        self.db.execute(
            "INSERT INTO entries(id,type,category_id,amount_cents,due_date) VALUES (?,?,?,?,?)",
            ("entry", "expense", "cat-exp", 250, "2026-11-09"))
        self.db.commit()
        with self.assertRaises(sqlite3.IntegrityError):
            with self.db:
                self.db.execute("UPDATE entries SET category_id=? WHERE category_id=?",("dest","cat-exp"))
                self.db.execute("INSERT INTO categories(id,type,name) VALUES (?,?,?)",("bad","expense","Lazer"))
        found=self.db.execute("SELECT category_id FROM entries WHERE id='entry'").fetchone()
        self.assertEqual(found[0],"cat-exp")


if __name__ == "__main__":
    unittest.main()
