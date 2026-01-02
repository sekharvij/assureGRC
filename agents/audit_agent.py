import pandas as pd

def load_audit_data(path):
    try:
        return pd.read_csv(path)
    except Exception as e:
        print(f"Error loading audit data: {e}")
        return pd.DataFrame(columns=['status', 'entity', 'open_issues', 'risk_rating', 'audit_type'])

def audit_summary(df):
    if df.empty:
        return {
            "open_audits": 0,
            "total_entities": 0,
            "open_issues": 0,
            "risk_distribution": {},
            "status_distribution": {},
            "entities_by_risk": {},
            "issues_by_risk": {}
        }
    
    return {
        "open_audits": int((df['status'] != 'Final Report').sum()),
        "total_entities": int(df['entity'].nunique()),
        "open_issues": int(df['open_issues'].sum()),
        "risk_distribution": df['risk_rating'].value_counts().to_dict(),
        "status_distribution": df['status'].value_counts().to_dict(),
        "entities_by_risk": df.groupby('risk_rating')['entity'].nunique().to_dict(),
        "issues_by_risk": df.groupby('risk_rating')['open_issues'].sum().to_dict()
    }