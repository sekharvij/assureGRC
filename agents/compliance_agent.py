import uuid, time
from core import mcp, datastore

def run_control_tests():
    sec = mcp.query("security_logs", source="compliance_agent")["payload"]
    findings = []
    reset_events = [e for e in sec if "Password reset" in e.get("details","")]
    if len(reset_events) == 0:
        f = {"issue": "no_password_reset_events", "description": "No password reset events found; verify password policy and logs"}
        fid = str(uuid.uuid4())
        datastore.insert_finding(fid, "compliance_agent", f, int(time.time()))
        findings.append(f)
    return findings
