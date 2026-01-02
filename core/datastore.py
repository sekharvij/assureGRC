import sqlite3
import json
from pathlib import Path
from typing import Any, Dict

DB_PATH = Path(__file__).resolve().parents[1] / "grc_prod.db"

def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_conn()
    c = conn.cursor()
    c.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        source TEXT,
        action TEXT,
        details TEXT,
        ts INTEGER
    )""")
    c.execute("""
    CREATE TABLE IF NOT EXISTS findings (
        id TEXT PRIMARY KEY,
        agent TEXT,
        payload TEXT,
        ts INTEGER
    )""")
    conn.commit()
    conn.close()

def insert_audit_log(audit_id: str, source: str, action: str, details: Dict[str,Any], ts: int):
    conn = get_conn()
    conn.execute(
        "INSERT INTO audit_logs(id,source,action,details,ts) VALUES (?,?,?,?,?)",
        (audit_id, source, action, json.dumps(details), ts)
    )
    conn.commit()
    conn.close()

def insert_finding(fid: str, agent: str, payload: Dict[str,Any], ts: int):
    conn = get_conn()
    conn.execute(
        "INSERT INTO findings(id,agent,payload,ts) VALUES (?,?,?,?)",
        (fid, agent, json.dumps(payload), ts)
    )
    conn.commit()
    conn.close()
