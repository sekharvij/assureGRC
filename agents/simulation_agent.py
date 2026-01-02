import uuid, time
from core import mcp, datastore

def run_simulation(scenario="unencrypted_s3"):
    sec = mcp.query("security_logs", source="simulation_agent")["payload"]
    high = [e for e in sec if e.get("risk_score",0) > 85]
    impact = len(high) * 10
    f = {"scenario": scenario, "impact_score": impact, "events": len(high)}
    fid = str(uuid.uuid4())
    datastore.insert_finding(fid, "simulation_agent", f, int(time.time()))
    return f
