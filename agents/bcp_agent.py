from core import mcp, datastore
import uuid, time

def run():
    try:
        bcp_data = mcp.query("bcp_dr", source="bcp_agent")["payload"]
        failed_tests = [p for p in bcp_data if str(p.get("status", "")).lower() == "fail"]

        datastore.insert_finding(
            str(uuid.uuid4()),
            "bcp_agent",
            {"failed_bcp_tests_count": len(failed_tests), "details": failed_tests},
            int(time.time())
        )
        return failed_tests
    except Exception as e:
        print(f"Error in bcp_agent: {e}")
        return []

if __name__ == "__main__":
    print(run())
