import json, time, uuid
from core import datastore

def generate_json_report():
    conn = datastore.get_conn()
    cur = conn.cursor()
    cur.execute("SELECT * FROM findings ORDER BY ts DESC")
    rows = cur.fetchall()
    arr = []
    for r in rows:
        try:
            payload = json.loads(r["payload"])
        except Exception:
            payload = r["payload"]
        arr.append({"id": r["id"], "agent": r["agent"], "payload": payload, "ts": r["ts"]})
    conn.close()
    out = {"generated_at": int(time.time()), "findings": arr}
    fname = f"reports/report-{int(time.time())}.json"
    import os, pathlib
    pathlib.Path("reports").mkdir(exist_ok=True)
    with open(fname, "w") as f:
        json.dump(out, f, indent=2)
    return fname
