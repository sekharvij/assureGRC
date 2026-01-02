# Unified GRC Platform

A modern Governance, Risk, and Compliance (GRC) platform featuring a real-time analytics dashboard and AI-ready architecture.

## 🚀 Quick Start

### 1. Prerequisites

- Python 3.13+
- Node.js & npm

### 2. Backend Setup (FastAPI)

The backend serves as the analytics engine, processing CSV data from the `data/` directory.

```bash
# Navigate to project root
cd grc_platform_repo

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the Backend Server
python -m uvicorn api.app:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at [http://localhost:8000](http://localhost:8000) and documentation at [/docs](http://localhost:8000/docs).

### 3. Frontend Setup (React)

The frontend is built with React, Vite, and Lucide icons.

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the Frontend Development Server
npm run dev
```

The dashboard will be available at [http://localhost:5173](http://localhost:5173).

## 📊 Dashboard Features

- **Governance:** Manage policies and stakeholders.
- **Compliance:** Track regulatory violations and severity.
- **Risk Index:** Real-time composite risk scoring from system logs.
- **Regulatory Hub:** View and map regulatory clauses.
- **Security Logs:** Live stream of system events and unauthorized access attempts.

## 📁 Data Source

All analytics are derived from the CSV files located in `/data`:

- `governance_policies.csv`
- `compliance_violations.csv`
- `regulatory_requirements.csv`
- `security_logs.csv`

## 🛠 Tech Stack

- **Frontend:** React, Vite, Axios, Lucide-React
- **Backend:** FastAPI, Pandas (Data Analytics), SQLAlchemy
- **Style:** Vanilla CSS (Modern Light Theme)
