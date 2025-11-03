# Frontend Quick Start Guide

## ✅ What Was Created

### Structure
```
Hackathon/
├── api/                    # NEW: Flask API backend
│   ├── __init__.py
│   ├── app.py              # REST + WebSocket API
│   └── README.md
│
├── frontend/               # NEW: React frontend
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
└── [all existing code unchanged]
```

## 🚀 How to Run

### Step 1: Install API Dependencies
```bash
cd /home/dante/Hackathon
source venv/bin/activate
pip install flask flask-cors flask-socketio
```

### Step 2: Start API Server (Terminal 1)
```bash
cd /home/dante/Hackathon
python api/app.py
```

**Expected output:**
```
SQRS API Server Starting...
API will be available at: http://localhost:5000
```

### Step 3: Install Frontend Dependencies (Terminal 2)
```bash
cd /home/dante/Hackathon/frontend
npm install
```

**Note:** You need Node.js installed. If not:
```bash
# Check if node is installed
node --version

# If not, install Node.js (Ubuntu/Debian):
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 4: Start Frontend (Terminal 2)
```bash
cd /home/dante/Hackathon/frontend
npm start
```

**Expected output:**
```
Compiled successfully!
You can now view sqrs-frontend in the browser.
  Local:            http://localhost:3000
```

### Step 5: Open Browser
Navigate to: **http://localhost:3000**

## 📊 Frontend Features

✅ **Real-Time Dashboard**
   - CSAT, AHT, SLA Met Rate, Fairness KPIs
   - Auto-updates every 2 seconds

✅ **Agent Status Grid**
   - All 30 agents with load indicators
   - Per-channel capacity visualization
   - Agent performance metrics

✅ **Active Assignments**
   - Recent customer-agent assignments
   - Channel breakdown
   - CSAT and AHT per assignment

✅ **Policy Comparison**
   - CUCB-OTA vs FCFS vs Skill-Greedy
   - Side-by-side metrics comparison

✅ **Metrics Charts**
   - Time series visualization
   - CSAT, AHT, SLA, Fairness trends

✅ **Simulation Controls**
   - Start/Stop simulation
   - Select policy
   - Set number of batches

## 🔌 API Endpoints

The API provides these endpoints (all under `/api/`):

- `GET /health` - Health check
- `GET /config` - Configuration
- `GET /metrics/current` - Current KPIs
- `GET /metrics/historical` - Historical data
- `GET /agents` - All agents
- `GET /assignments/active` - Active assignments
- `GET /constraints/dual` - Dual variables
- `GET /policies/compare` - Policy comparison
- `POST /simulation/start` - Start simulation
- `POST /simulation/stop` - Stop simulation

## 🎯 Integration Details

### ✅ What's Preserved
- All existing Python code unchanged
- `main.py` still works (CLI mode)
- All modules (models/, routing/, etc.) untouched
- No breaking changes

### ✅ What's New
- `api/` folder with Flask wrapper
- `frontend/` folder with React dashboard
- API connects to existing code via imports
- Frontend connects to API via REST/WebSocket

### ✅ Connection Flow
```
Frontend (React) → HTTP/WebSocket → Flask API → Python Modules → Data
```

## 🐛 Troubleshooting

### Issue: "Cannot connect to API server"
**Solution:** Make sure `python api/app.py` is running in another terminal

### Issue: "Module not found" in API
**Solution:** Run from project root: `python api/app.py` (not from api/ folder)

### Issue: npm install fails
**Solution:** Make sure Node.js is installed:
```bash
node --version  # Should show v18+ or v20+
```

### Issue: Port 3000 or 5000 already in use
**Solution:** 
- Change API port in `api/app.py`: `port=5001`
- Change frontend port: `PORT=3001 npm start`

## 📝 Next Steps

1. **Customize Dashboard:** Edit `frontend/src/components/` files
2. **Add Features:** Extend `api/app.py` with new endpoints
3. **Styling:** Modify CSS files in `frontend/src/components/`
4. **Real-Time:** WebSocket already configured for live updates

## ✨ Demo Flow

1. Start API: `python api/app.py`
2. Start Frontend: `cd frontend && npm start`
3. Open browser: `http://localhost:3000`
4. Click "Start Simulation" with CUCB-OTA policy
5. Watch real-time updates as batches process!

---

**All existing code remains functional - no breaking changes!**

