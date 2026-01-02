from core import mcp, datastore
import uuid, time

def run():
    try:
        assets = mcp.query("asset_register", source="asset_compliance_agent")["payload"]
        unpatched = [a for a in assets if str(a.get("patched", "")).lower() == "no"]

        datastore.insert_finding(
            str(uuid.uuid4()),
            "asset_compliance_agent",
            {"unpatched_count": len(unpatched), "details": unpatched},
            int(time.time())
        )
        return unpatched
    except Exception as e:
        print(f"Error in asset_compliance_agent: {e}")
        return []

if __name__ == "__main__":
    print(run())
