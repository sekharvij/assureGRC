from collections import Counter
from datetime import datetime

def quarterly_trend(records, date_field):
    q = Counter()
    for r in records:
        try:
            # Handle potential non-string or invalid date formats gracefully
            date_val = r.get(date_field)
            if not date_val:
                continue
            d = datetime.fromisoformat(str(date_val))
            q[f"Q{((d.month-1)//3)+1}-{d.year}"] += 1
        except (ValueError, TypeError):
            continue
    return [{"quarter": k, "count": v} for k, v in sorted(q.items())]
