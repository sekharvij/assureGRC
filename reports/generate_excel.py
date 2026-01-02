import pandas as pd
import os

def generate():
    try:
        # Create reports directory if it doesn't exist
        os.makedirs("reports", exist_ok=True)
        
        # Load risk data
        risks_file = "data/risk_register.csv"
        if os.path.exists(risks_file):
            risks = pd.read_csv(risks_file)
            output_path = "reports/Internal_Audit_Report.xlsx"
            with pd.ExcelWriter(output_path) as w:
                risks.to_excel(w, sheet_name="Risk Register", index=False)
            return {"status": "success", "file": output_path}
        else:
            return {"status": "error", "message": "Risk register data not found"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    print(generate())
