from agents.risk_agent import run_risk_scoring
def test_risk_scoring():
    res = run_risk_scoring()
    assert isinstance(res, list)
