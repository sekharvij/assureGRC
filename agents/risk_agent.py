import uuid, time
from core import mcp, datastore

def run_risk_scoring():
    res = mcp.query("violations", source="risk_agent")
    regs = mcp.query("regulations", source="risk_agent")["payload"]
    severity_map = {"Low": 1, "Medium": 3, "High": 7, "Critical": 10}
    findings = []
    for v in res["payload"]:
        sev = v.get("severity", "Low")
        score = severity_map.get(sev, 1)
        impact = v.get("impact", v.get("impact", 1))
        final = score * (impact or 1)
        f = {"violation_id": v.get("violation_id"), "score": final, "severity": sev}
        fid = str(uuid.uuid4())
        datastore.insert_finding(fid, "risk_agent", f, int(time.time()))
        findings.append(f)
    return findings
