# Frontend Integration Guide

## Structure

```
Hackathon/
├── api/              # Flask API server (backend)
│   ├── __init__.py
│   ├── app.py        # Main Flask app with REST + WebSocket
│   └── README.md
│
├── frontend/         # React frontend (separate folder)
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── KPICards.js
│   │   │   ├── AgentGrid.js
│   │   │   ├── SimulationControl.js
│   │   │   ├── PolicyComparison.js
│   │   │   └── MetricsChart.js
│   │   └── services/
│   │       └── api.js
│   ├── public/
│   ├── package.json
│   └── README.md
│
└── [existing code unchanged]
```

## Quick Start

### 1. Install API Dependencies

```bash
# Already in requirements.txt, just install:
pip install -r requirements.txt
```

### 2. Start API Server

```bash
# From project root
python api/app.py
```

API runs on: `http://localhost:5000`

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Start Frontend

```bash
cd frontend
npm start
```

Frontend runs on: `http://localhost:3000`

## Features

✅ Real-time dashboard with KPIs
✅ Agent status grid
✅ Active assignments table
✅ Policy comparison
✅ Metrics charts
✅ Simulation controls

## API Integration

The API wraps existing code without modifications:
- Uses existing imports
- No changes to core logic
- Maintains all original functionality

## Notes

- API and frontend run separately
- Frontend communicates with API via REST and WebSocket
- All existing CLI functionality (`main.py`) remains unchanged
