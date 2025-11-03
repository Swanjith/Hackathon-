# How to Run the Smart Queue Routing System (SQRS)

This guide provides step-by-step instructions for setting up, running, and understanding the SQRS project.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Running the Full Simulation](#running-the-full-simulation)
5. [Understanding the Output](#understanding-the-output)
6. [Customization](#customization)
7. [Troubleshooting](#troubleshooting)
8. [Project Structure](#project-structure)

---

## Prerequisites

Before running the project, ensure you have:

- **Python 3.8 or higher** (Python 3.12 recommended)
- **pip** (Python package installer)
- **Git** (optional, for cloning the repository)
- **~500MB free disk space** (for dependencies and output files)
- **Terminal/Command Line access**

### Check Your Python Version

```bash
python3 --version
# Should show Python 3.8 or higher
```

If Python 3 is not installed, install it using your system's package manager.

---

## Installation

### Step 1: Navigate to Project Directory

```bash
cd /home/dante/Hackathon
# Or wherever you've placed the project
```

### Step 2: Create Virtual Environment (Recommended)

Creating a virtual environment isolates project dependencies:

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate

# On Windows:
# venv\Scripts\activate
```

You should see `(venv)` in your terminal prompt when activated.

### Step 3: Install Dependencies

Install all required Python packages:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Expected Output:**
```
Collecting numpy>=1.24.0
Collecting pandas>=2.0.0
...
Successfully installed numpy-2.x.x pandas-2.x.x ...
```

**Installation Time:** ~2-5 minutes depending on your internet connection.

### Step 4: Verify Installation

Test that all modules can be imported:

```bash
python3 -c "import numpy, pandas, lightgbm, scipy; print('✓ All dependencies installed successfully!')"
```

---

## Quick Start

### Basic Run

Run the complete simulation with default settings:

```bash
python3 main.py
```

**What happens:**
1. Generates 30 synthetic agents
2. Generates 5000 historical interactions for training
3. Trains ML models (Uplift and Capacity models)
4. Runs 150 batches of customer arrivals
5. Tests 3 routing policies (CUCB-OTA, FCFS, Skill-Greedy)
6. Generates visualizations and reports

**Expected Runtime:** ~25-35 seconds (after optimizations)

**Output Location:** `data/logs/`

---

## Running the Full Simulation

### Default Configuration

The project uses default settings from `config.py`:

- **30 Agents**
- **50 customers per batch** (Poisson distributed)
- **150 batches** total
- **3 routing policies** compared

### Custom Configuration

Edit `config.py` to modify simulation parameters:

```python
# Example: Change number of agents
NUM_AGENTS = 50  # Default: 30

# Example: Change batch size
NUM_CUSTOMERS_PER_BATCH = 100  # Default: 50

# Example: Change number of batches in main.py
# Look for: n_batches = 150
```

Then run:

```bash
python3 main.py
```

### Running Specific Components

#### Test Data Generation Only

```bash
python3 -c "
from data.synthetic_data import SyntheticDataGenerator
gen = SyntheticDataGenerator()
print(f'Generated {len(gen.agents)} agents')
print(f'Generated {len(gen.historical_data)} historical interactions')
"
```

#### Test Models Only

```bash
python3 -c "
from data.synthetic_data import SyntheticDataGenerator
from models.uplift_model import UpliftModel, CapacityModel

data_gen = SyntheticDataGenerator()
uplift_model = UpliftModel()
capacity_model = CapacityModel()

uplift_model.train(data_gen.historical_data, data_gen.agents)
capacity_model.train(data_gen.historical_data, data_gen.agents)
print('✓ Models trained successfully')
"
```

#### Test Routing Only

```bash
python3 -c "
from data.synthetic_data import SyntheticDataGenerator
from models.uplift_model import UpliftModel, CapacityModel
from routing.scoring import RoutingScorer
from routing.assignment import AssignmentSolver

# Setup
data_gen = SyntheticDataGenerator()
uplift_model = UpliftModel()
capacity_model = CapacityModel()
uplift_model.train(data_gen.historical_data, data_gen.agents)
capacity_model.train(data_gen.historical_data, data_gen.agents)

# Test routing
scorer = RoutingScorer(uplift_model, capacity_model)
customers = data_gen.generate_customer_batch(10)
agents = data_gen.agents

RS_matrix, _ = scorer.compute_routing_matrix(customers, agents)
assignments = AssignmentSolver.hybrid_solve(RS_matrix, customers, agents)
print(f'✓ Routed {len(assignments)} customers')
"
```

---

## Understanding the Output

### Console Output

During execution, you'll see:

```
============================================================
   Smart Queue Routing System (SQRS)
   CUCB-OTA: Causal Uplift + Optimal Transport
============================================================

✓ Generated 30 agents
✓ Generated 5000 historical interactions

Training Uplift Model (X-Learner)...
✓ Uplift model trained on 5000 samples
Training Capacity Model (AHT Predictor)...
✓ Capacity model trained

============================================================
Running CUCB-OTA Simulation
============================================================
CUCB-OTA Batches: 100%|████████████| 150/150 [00:25<00:00,  5.89it/s]

Batch 20: CSAT=0.742, AHT=5.12, SLA=87.50%, λ_aht=0.145
...

CUCB-OTA Summary:
  Total Assignments: 7524
  Avg CSAT: 0.7583
  Avg AHT: 5.23 min
  SLA Met Rate: 88.42%
  Fairness (Gini): 0.247
```

### Generated Files

After running, check `data/logs/` for:

1. **`policy_comparison.png`**
   - Visual comparison of all policies
   - Metrics: CSAT, AHT, SLA, Fairness, Throughput

2. **`*_metrics.csv`**
   - `CUCB-OTA_metrics.csv`
   - `FCFS_metrics.csv`
   - `Skill-Greedy_metrics.csv`
   - Detailed per-batch metrics

3. **`*_convergence.png`**
   - `cucb_convergence.png` - Shows metric convergence over batches

4. **`agent_workload.png`**
   - Distribution of assignments across agents
   - CSAT vs AHT scatter plot

5. **`ope_interactions.csv`**
   - Logged interactions for off-policy evaluation

6. **`final_report_*.txt`**
   - Comprehensive text summary
   - Policy comparison table
   - Performance statistics

### Key Metrics Explained

- **CSAT (Customer Satisfaction):** Higher is better (0.0-1.0 scale)
- **AHT (Average Handle Time):** Lower is better (in minutes)
- **SLA Met Rate:** Percentage of interactions meeting SLA thresholds
- **Fairness (Gini):** Lower is better (0.0 = perfect equality)
- **Throughput:** Customers routed per batch

---

## Customization

### Modifying Simulation Parameters

Edit `config.py`:

```python
# Data Generation
NUM_AGENTS = 50              # Number of agents
NUM_CUSTOMERS_PER_BATCH = 100  # Average customers per batch

# Constraint Budgets
MAX_AHT_MINUTES = 10.0       # Maximum average handle time
MAX_SLA_VIOLATION_RATE = 0.20  # Max 20% SLA violations
FAIRNESS_GINI_THRESHOLD = 0.4  # Max Gini coefficient

# SLA Thresholds (in minutes)
SLA_THRESHOLDS = {
    'voice': 8,    # 8 minutes for voice
    'chat': 5,     # 5 minutes for chat
    'email': 120   # 120 minutes for email
}
```

### Adding New Routing Policies

1. Add policy function to `simulation/simulator.py`:

```python
def my_custom_policy(customers: pd.DataFrame,
                    agents: pd.DataFrame,
                    scorer: RoutingScorer) -> List[Tuple[int, int]]:
    """Your custom routing logic"""
    assignments = []
    # ... your logic here ...
    return assignments
```

2. Register in `main.py`:

```python
policies = [
    ('CUCB-OTA', cucb_ota_policy),
    ('FCFS', fcfs_policy),
    ('Skill-Greedy', skill_based_greedy_policy),
    ('My-Policy', my_custom_policy)  # Add here
]
```

### Changing Model Parameters

Edit `config.py`:

```python
UPLIFT_MODEL_PARAMS = {
    'n_estimators': 200,     # More trees (slower, more accurate)
    'max_depth': 7,          # Deeper trees
    'learning_rate': 0.05,    # Slower learning
    'random_state': 42
}
```

---

## Troubleshooting

### Common Issues

#### 1. "ModuleNotFoundError: No module named 'X'"

**Solution:**
```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Reinstall requirements
pip install -r requirements.txt
```

#### 2. "Permission denied" when creating directories

**Solution:**
```bash
# Ensure you have write permissions
chmod -R 755 data/ models/
```

#### 3. "UserWarning: FigureCanvasAgg is non-interactive"

**Status:** This is **normal** and **expected** in headless environments.
- Plots are saved to files successfully
- No action needed

#### 4. LightGBM warnings about "No further splits"

**Status:** This is **normal** during training with small datasets.
- Models still train correctly
- No action needed

#### 5. Out of Memory Errors

**Solution:**
- Reduce `NUM_AGENTS` in `config.py`
- Reduce `NUM_CUSTOMERS_PER_BATCH`
- Reduce number of batches in `main.py`

#### 6. Very Slow Execution

**Check:**
- Are you using the virtual environment? (`venv`)
- Try reducing batch size or number of agents
- Ensure optimizations are in place (no `iterrows()` warnings)

### Performance Tips

1. **Use Virtual Environment:** Always activate `venv` before running
2. **Reduce Batch Size:** For testing, use smaller batches
3. **Close Other Applications:** Free up memory and CPU
4. **Use SSD:** Faster I/O for data logging

---

## Project Structure

```
Hackathon/
├── config.py                 # Configuration parameters
├── main.py                   # Main entry point
├── requirements.txt          # Python dependencies
├── README.md                 # Project overview
├── HOW_TO_RUN.md            # This file
├── ANALYSIS.md              # Code analysis document
├── OPTIMIZATION_SUMMARY.md   # Optimization details
│
├── data/
│   ├── __init__.py
│   ├── synthetic_data.py     # Data generation
│   └── logs/                 # Output files (generated)
│
├── models/
│   ├── __init__.py
│   ├── uplift_model.py       # ML models
│   └── saved/                # Saved models (if implemented)
│
├── routing/
│   ├── __init__.py
│   ├── scoring.py           # Routing score computation
│   └── assignment.py        # Assignment algorithms
│
├── evaluation/
│   ├── __init__.py
│   ├── metrics.py           # Performance metrics
│   └── ope.py               # Off-policy evaluation
│
├── simulation/
│   ├── __init__.py
│   ├── simulator.py         # Simulation engine
│   └── visualizer.py        # Visualization tools
│
└── venv/                     # Virtual environment (created)
```

---

## Advanced Usage

### Running with Different Seeds

For reproducible results:

```python
# In main.py or your script
import numpy as np
np.random.seed(42)  # Set before data generation
```

### Profiling Performance

```bash
# Install profiler
pip install line_profiler

# Profile main execution
kernprof -l main.py
python3 -m line_profiler main.py.lprof
```

### Running Tests

```bash
# Run quick validation
python3 -c "
from routing.scoring import RoutingScorer
from routing.assignment import AssignmentSolver
print('✓ Routing modules work')
"

# Test data generation
python3 -c "
from data.synthetic_data import SyntheticDataGenerator
gen = SyntheticDataGenerator()
print(f'✓ Generated {len(gen.agents)} agents')
"
```

---

## Quick Reference

### Essential Commands

```bash
# Setup (one-time)
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run simulation
python3 main.py

# Check output
ls -lh data/logs/

# View results
# Open data/logs/policy_comparison.png
# Or: cat data/logs/final_report_*.txt
```

### File Locations

- **Configuration:** `config.py`
- **Main Script:** `main.py`
- **Output Files:** `data/logs/`
- **Dependencies:** `requirements.txt`

---

## Getting Help

1. **Check Logs:** Review console output for error messages
2. **Verify Installation:** Run dependency check commands
3. **Check Configuration:** Ensure `config.py` has valid values
4. **Review Documentation:** See `README.md` for algorithm details

---

## Next Steps

After successfully running the project:

1. ✅ Explore the generated visualizations in `data/logs/`
2. ✅ Review `OPTIMIZATION_SUMMARY.md` to understand performance improvements
3. ✅ Modify `config.py` to experiment with different parameters
4. ✅ Try adding custom routing policies
5. ✅ Analyze the metrics CSV files for deeper insights

---

**Happy Routing! 🚀**

For detailed algorithm explanations, see `README.md`.
For optimization details, see `OPTIMIZATION_SUMMARY.md`.

