import time, uuid
from core import mcp, datastore

def run_governance_check():
    res = mcp.query("policies", source="governance_agent")
    findings = []
    for p in res["payload"]:
        from datetime import datetime
        lr = p.get("last_review_date")
        import dateutil.parser as dp
        try:
            if lr:
                dt = dp.parse(lr)
                age_days = (datetime.utcnow() - dt).days
            else:
                age_days = 9999
        except Exception:
            age_days = 9999
        if p.get("status", "").lower() != "active" or age_days > 365:
            f = {"issue": "policy_not_current", "policy_id": p.get("policy_id"), "status": p.get("status"), "last_review_age_days": age_days}
            findings.append(f)
            fid = str(uuid.uuid4())
            datastore.insert_finding(fid, "governance_agent", f, int(time.time()))
    return findings
