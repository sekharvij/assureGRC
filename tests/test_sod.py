from agents.sod_agent import run_sod_check
def test_sod():
    res = run_sod_check()
    assert isinstance(res, list)
