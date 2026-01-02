from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import letter
import os

def generate():
    try:
        # Create reports directory if it doesn't exist
        os.makedirs("reports", exist_ok=True)
        
        output_path = "reports/RBI_Audit_Report.pdf"
        doc = SimpleDocTemplate(output_path, pagesize=letter)
        styles = getSampleStyleSheet()
        
        elements = [
            Paragraph("RBI IT Audit Summary", styles["Title"]),
            Spacer(1, 12),
            Paragraph("Key Findings & Risk Summary", styles["Heading2"]),
            Spacer(1, 12),
            Paragraph("This report provides a summary of the IT audit findings aligned with RBI Cyber Security Framework requirements. "
                      "The assessment covers risk management, asset security, and business continuity protocols.", styles["Normal"]),
            Spacer(1, 12),
            Paragraph("Confidentiality Notice:", styles["Heading3"]),
            Paragraph("This document contains sensitive information regarding the bank's security posture and must be handled according to data privacy policies.", styles["Normal"])
        ]
        
        doc.build(elements)
        return {"status": "success", "file": output_path}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    print(generate())
