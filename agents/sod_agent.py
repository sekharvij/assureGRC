import uuid, time
from core import mcp, datastore

SOD_RULES = [
    {"id": "SOD-1", "desc": "Maker and Approver separation", "maker_roles": ["maker"], "approver_roles": ["approver"]}
]

def run_sod_check():
    res = mcp.query("security_logs", source="sod_agent")
    payload = res["payload"]
    user_role_map = {}
    for event in payload:
        user = event.get("user")
        if user == "admin":
            user_role_map.setdefault(user, set()).add("approver")
        if user == "ops-user":
            user_role_map.setdefault(user, set()).add("maker")
    findings = []
    for u, roles in user_role_map.items():
        if "maker" in roles and "approver" in roles:
            f = {"issue": "sod_violation", "user": u, "roles": list(roles)}
            fid = str(uuid.uuid4())
            datastore.insert_finding(fid, "sod_agent", f, int(time.time()))
            findings.append(f)
    return findings
