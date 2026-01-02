from core import mcp, datastore
import uuid, time

def run():
    try:
        plans = mcp.query("audit_plan", source="audit_planning_agent")["payload"]
        overdue = [p for p in plans if p.get("status") != "Completed"]

        datastore.insert_finding(
            str(uuid.uuid4()),
            "audit_planning_agent",
            {"overdue_count": len(overdue), "details": overdue},
            int(time.time())
        )
        return overdue
    except Exception as e:
        print(f"Error in audit_planning_agent: {e}")
        return []

if __name__ == "__main__":
    print(run())
