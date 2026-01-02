import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parents[1] / "data"

def load_governance():
    return pd.read_csv(DATA_DIR / "governance_policies.csv")

def load_regulatory():
    return pd.read_csv(DATA_DIR / "regulatory_requirements.csv")

def load_compliance():
    return pd.read_csv(DATA_DIR / "compliance_violations.csv")

def load_security_logs():
    df = pd.read_csv(DATA_DIR / "security_logs.csv", parse_dates=["timestamp"])
    return df

def load_audit_plan():
    return pd.read_csv(DATA_DIR / "audit_plan.csv")

def load_risk_register():
    return pd.read_csv(DATA_DIR / "risk_register.csv")

def load_asset_register():
    return pd.read_csv(DATA_DIR / "asset_register.csv")

def load_vendor_register():
    return pd.read_csv(DATA_DIR / "vendor_register.csv")

def load_vulnerability_report():
    return pd.read_csv(DATA_DIR / "vulnerability_report.csv")

def load_bcp_dr():
    return pd.read_csv(DATA_DIR / "bcp_dr.csv")
