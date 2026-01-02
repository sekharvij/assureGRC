from core import mcp, datastore
import uuid, time

def run():
    try:
        vendors = mcp.query("vendor_register", source="vendor_risk_agent")["payload"]
        high_risk = [v for v in vendors if str(v.get("risk_rating", "")).lower() == "high"]

        datastore.insert_finding(
            str(uuid.uuid4()),
            "vendor_risk_agent",
            {"high_risk_vendors_count": len(high_risk), "details": high_risk},
            int(time.time())
        )
        return high_risk
    except Exception as e:
        print(f"Error in vendor_risk_agent: {e}")
        return []

if __name__ == "__main__":
    print(run())
