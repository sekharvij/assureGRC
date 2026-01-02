from core.data_loader import load_governance
from agents.governance_agent import run_governance_check

def test_load_governance():
    df = load_governance()
    assert 'policy_id' in df.columns

def test_governance_findings():
    res = run_governance_check()
    assert isinstance(res, list)
