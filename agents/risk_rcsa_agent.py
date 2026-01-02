from core import mcp, datastore
import uuid, time

def run():
    try:
        risks = mcp.query("risk_register", source="risk_rcsa_agent")["payload"]
        # Assuming residual_risk is a number in the CSV
        high = [r for r in risks if float(r.get("residual_risk", 0)) >= 12]

        datastore.insert_finding(
            str(uuid.uuid4()),
            "risk_rcsa_agent",
            {"high_risk_count": len(high), "risks": high},
            int(time.time())
        )
        return high
    except Exception as e:
        print(f"Error in risk_rcsa_agent: {e}")
        return []

if __name__ == "__main__":
    print(run())
