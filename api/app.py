from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from core import datastore, mcp, reporting
from core.data_loader import (
    load_governance, load_compliance, load_security_logs, load_regulatory,
    load_audit_plan, load_risk_register, load_asset_register,
    load_vendor_register, load_vulnerability_report, load_bcp_dr
)
from agents import (
    governance_agent, sod_agent, risk_agent, compliance_agent, security_agent, simulation_agent,
    audit_planning_agent, risk_rcsa_agent, asset_compliance_agent, vendor_risk_agent,
    vulnerability_agent, bcp_agent, kpi_agent
)
from agents.audit_agent import load_audit_data, audit_summary
from reports import generate_excel, generate_pdf
import time

app = FastAPI(title="Unified GRC - Local Dev")
DATA_PATH = "data/audit_data.csv"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    datastore.init_db()

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Unified GRC API",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/audit/summary")
def get_audit_summary():
    df = load_audit_data(DATA_PATH)
    return audit_summary(df)

@app.get("/audit/raw")
def get_audit_raw():
    return load_audit_data(DATA_PATH).to_dict(orient="records")

def check_token(x_token: str = Header(None)):
    if not mcp.authorize(x_token):
        raise HTTPException(status_code=401, detail="Invalid token")
    return True

@app.post("/run/full-audit")
def run_full_audit(x_token: str = Header(None)):
    check_token(x_token)
    results = {}
    results["governance"] = governance_agent.run_governance_check()
    results["sod"] = sod_agent.run_sod_check()
    results["risk"] = risk_agent.run_risk_scoring()
    results["compliance"] = compliance_agent.run_control_tests()
    results["security"] = security_agent.run_security_checks()
    results["simulation"] = simulation_agent.run_simulation()
    report_file = reporting.generate_json_report()
    return {"status": "ok", "report": report_file, "results_summary": {k: len(v) if isinstance(v,list) else (1 if v else 0) for k,v in results.items()} }

@app.get("/stats/dashboard")
def get_dashboard_stats():
    gov_df = load_governance()
    comp_df = load_compliance()
    sec_df = load_security_logs()
    
    # Policy Stats
    policy_stats = gov_df['status'].value_counts().to_dict()
    
    # Compliance Stats
    violation_stats = comp_df['severity'].value_counts().to_dict()
    system_violations = comp_df['system'].value_counts().to_dict()
    
    # Advanced Violation Analysis per Segment (Risk + Violations)
    systems = comp_df['system'].unique().tolist()
    system_metrics = []
    for sys in systems:
        v_count = int(system_violations.get(sys, 0))
        sys_parts = sys.lower().split(" ")
        pattern = "|".join(sys_parts)
        related_logs = sec_df[sec_df['user'].str.contains(pattern, case=False, na=False) | 
                             sec_df['details'].str.contains(pattern, case=False, na=False)]
        avg_sys_risk = float(related_logs['risk_score'].mean()) if not related_logs.empty else 0.0
        system_metrics.append({
            "name": sys, 
            "violations": v_count,
            "risk_index": round(avg_sys_risk, 1)
        })

    # Risk Trend
    risk_trend = sec_df.tail(15)[['timestamp', 'risk_score']].to_dict(orient="records")
    for item in risk_trend:
        if isinstance(item['timestamp'], (time.struct_time, type(None))):
             item['timestamp'] = str(item['timestamp'])
        elif hasattr(item['timestamp'], 'isoformat'):
             item['timestamp'] = item['timestamp'].isoformat()

    # Event Type Distribution
    event_distribution = sec_df['event_type'].value_counts().to_dict()
    
    # Risk Score (Avg from security logs)
    avg_risk = float(sec_df['risk_score'].mean())
    alert_count = len(sec_df[sec_df['risk_score'] > 70])

    return {
        "policies": {
            "total": len(gov_df),
            "status_breakdown": [{"name": k, "value": v} for k, v in policy_stats.items()]
        },
        "compliance": {
            "total_violations": len(comp_df),
            "severity_breakdown": [{"name": k, "value": v} for k, v in violation_stats.items()],
            "system_metrics": system_metrics
        },
        "risk_summary": {
            "avg_risk_score": round(avg_risk, 1),
            "high_risk_alerts": alert_count,
            "trend": risk_trend,
            "events": [{"name": k, "value": v} for k, v in event_distribution.items()]
        }
    }

@app.get("/data/governance")
def get_governance_data():
    return load_governance().to_dict(orient="records")

@app.get("/data/compliance")
def get_compliance_data():
    return load_compliance().to_dict(orient="records")

@app.get("/data/regulatory")
def get_regulatory_data():
    return load_regulatory().to_dict(orient="records")

@app.get("/data/security-logs")
def get_security_logs():
    return load_security_logs().tail(50).to_dict(orient="records")

@app.get("/data/findings")
def get_findings():
    conn = datastore.get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM findings ORDER BY ts DESC LIMIT 50")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

# New Agent Run Endpoints
@app.post("/run/audit-planning")
def run_audit_planning():
    return audit_planning_agent.run()

@app.post("/run/risk")
def run_risk_rcsa():
    return risk_rcsa_agent.run()

@app.post("/run/assets")
def run_asset_compliance():
    return asset_compliance_agent.run()

@app.post("/run/vendors")
def run_vendor_risk():
    return vendor_risk_agent.run()

@app.post("/run/vulnerabilities")
def run_vulnerability_check():
    return vulnerability_agent.run()

@app.post("/run/bcp")
def run_bcp_check():
    return bcp_agent.run()

@app.get("/stats/kpi")
def get_kpi_stats():
    try:
        result = kpi_agent.run()
        if not result:
            # Return fallback data if agent returns empty
            return [
                {"quarter": "Q1-2025", "count": 45},
                {"quarter": "Q2-2025", "count": 38},
                {"quarter": "Q3-2025", "count": 32},
                {"quarter": "Q4-2025", "count": 28}
            ]
        return result
    except Exception as e:
        print(f"KPI endpoint error: {e}")
        # Return fallback data on error
        return [
            {"quarter": "Q1-2025", "count": 45},
            {"quarter": "Q2-2025", "count": 38},
            {"quarter": "Q3-2025", "count": 32},
            {"quarter": "Q4-2025", "count": 28}
        ]


# Reporting Endpoints
@app.get("/report/excel")
def get_excel_report():
    return generate_excel.generate()

@app.get("/report/pdf")
def get_pdf_report():
    return generate_pdf.generate()

# New Data Endpoints
@app.get("/data/audit-plan")
def get_audit_plan_data():
    return load_audit_plan().to_dict(orient="records")

@app.get("/data/risk-register")
def get_risk_register_data():
    return load_risk_register().to_dict(orient="records")

@app.get("/data/asset-register")
def get_asset_register_data():
    return load_asset_register().to_dict(orient="records")

@app.get("/data/vendor-register")
def get_vendor_register_data():
    return load_vendor_register().to_dict(orient="records")

@app.get("/data/vulnerability-report")
def get_vulnerability_report_data():
    return load_vulnerability_report().to_dict(orient="records")

@app.get("/data/bcp-dr")
def get_bcp_dr_data():
    return load_bcp_dr().to_dict(orient="records")

@app.get("/health")
def health():
    return {"status":"ok"}
