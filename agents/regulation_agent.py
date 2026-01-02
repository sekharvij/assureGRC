from core.control_map import CONTROL_MAP

def run(dataset):
    """
    Returns the regulatory mappings for a given dataset.
    """
    return CONTROL_MAP.get(dataset, {
        "error": f"No regulatory mapping found for dataset: {dataset}",
        "available_datasets": list(CONTROL_MAP.keys())
    })

if __name__ == "__main__":
    # Test with risk register
    print(run("risk_register"))
