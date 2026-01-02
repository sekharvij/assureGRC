import uuid, time
from core import mcp, datastore

def run_security_checks():
    sec = mcp.query("security_logs", source="security_agent")["payload"]
    findings = []
    admin_failures = [e for e in sec if e.get("user") == "admin" and "Login Failure" in e.get("event_type","")]
    if len(admin_failures) > 5:
        f = {"issue": "suspicious_admin_failures", "count": len(admin_failures)}
        fid = str(uuid.uuid4())
        datastore.insert_finding(fid, "security_agent", f, int(time.time()))
        findings.append(f)
    downloads = [e for e in sec if "Large data download" in e.get("details","") and e.get("risk_score",0) > 80]
    for d in downloads:
        f = {"issue": "sensitive_download", "user": d.get("user"), "risk_score": d.get("risk_score")}
        fid = str(uuid.uuid4())
        datastore.insert_finding(fid, "security_agent", f, int(time.time()))
        findings.append(f)
    return findings
