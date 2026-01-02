import time, uuid, os, json
from core import datastore

SERVICE_TOKEN = os.getenv("MCP_SERVICE_TOKEN", "dev-token")  # in prod set to strong token

def authorize(token):
    return token == SERVICE_TOKEN

def log_access(source, resource, params):
    aid = str(uuid.uuid4())
    ts = int(time.time())
    datastore.insert_audit_log(aid, source, f"query:{resource}", {"params": params}, ts)
    return aid

from core.data_loader import (
    load_governance, load_regulatory, load_compliance, load_security_logs,
    load_audit_plan, load_risk_register, load_asset_register,
    load_vendor_register, load_vulnerability_report, load_bcp_dr
)

RESOURCES = {
    "audit_plan": load_audit_plan,
    "risk_register": load_risk_register,
    "asset_register": load_asset_register,
    "vendor_register": load_vendor_register,
    "vulnerability_report": load_vulnerability_report,
    "bcp_dr": load_bcp_dr,
}

def query(resource, params=None, source="agent"):
    params = params or {}
    aid = log_access(source, resource, params)
    
    # Existing resources
    if resource == "policies":
        return {"audit_id": aid, "payload": load_governance().to_dict(orient="records")}
    if resource == "regulations":
        return {"audit_id": aid, "payload": load_regulatory().to_dict(orient="records")}
    if resource == "violations":
        return {"audit_id": aid, "payload": load_compliance().to_dict(orient="records")}
    if resource == "security_logs":
        df = load_security_logs()
        return {"audit_id": aid, "payload": df.to_dict(orient="records")}
    
    # New resources
    if resource in RESOURCES:
        return {
            "audit_id": aid,
            "source": source,
            "payload": RESOURCES[resource]().to_dict(orient="records")
        }
        
    raise ValueError(f"Resource '{resource}' not allowed or unknown")
