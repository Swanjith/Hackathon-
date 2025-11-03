# SQRS Refactoring Plan - Complete Analysis & Strategy

## Executive Summary

This document outlines the comprehensive refactoring plan for the Smart Queue Routing System (SQRS), covering:
1. **Backend Algorithm Optimization** - Performance improvements while maintaining exact behavior
2. **Frontend shadcn/ui Integration** - Modern UI overhaul with type-safe architecture
3. **Testing & Validation** - Comprehensive test coverage

---

## Phase 1: Backend Algorithm Refinement

### 1.1 Current Architecture Analysis

#### Core Components:
```
├── config.py                    # Configuration (dataclass)
├── data/synthetic_data.py      # Data generation
├── models/uplift_model.py      # X-Learner CATE model
├── routing/
│   ├── scoring.py              # Routing score computation
│   └── assignment.py           # Hungarian/Greedy assignment
├── simulation/
│   ├── simulator.py            # Main simulation engine
│   └── visualizer.py          # Results visualization
├── evaluation/
│   ├── metrics.py             # Metrics tracking
│   └── ope.py                 # Off-policy evaluation
└── api/app.py                  # Flask API server
```

#### Data Flow:
1. **Customer Arrival** → `generate_customer_batch()`
2. **Routing Score Computation** → `compute_routing_matrix()` 
   - Calls `predict_uplift()` K×M times (bottleneck!)
   - Calls `predict_aht()` K×M times
   - Calls `check_capacity()` K×M times
3. **Assignment** → `hybrid_solve()`
   - Hungarian for voice (one-to-one)
   - Greedy for chat/email (one-to-many)
4. **Outcome Simulation** → `simulate_interaction_outcome()`
5. **Metrics Recording** → `record_batch()`

### 1.2 Complexity Analysis (Current)

| Operation | Current Complexity | Bottleneck |
|-----------|-------------------|------------|
| `compute_routing_matrix()` | O(K × M × P) | Model predictions in loop |
| `predict_uplift()` | O(1) per call | Called K×M times sequentially |
| `solve_hungarian()` | O(min(K,M)³) | Optimal, no change needed |
| `solve_greedy_with_capacity()` | O(K×M×log(K×M)) | Good, can optimize sorting |
| `record_batch()` | O(K) | Linear append, acceptable |

**Where:**
- K = number of customers per batch (~50)
- M = number of agents (~30)
- P = cost of single model prediction (~10-50ms)
- **Total per batch: ~15-75 seconds** (if K×M=1500 predictions @ 10-50ms each)

### 1.3 Identified Optimization Opportunities

#### 🔴 Critical (High Impact):
1. **Batch Model Predictions**
   - **Issue**: Sequential `predict_uplift()` and `predict_aht()` calls
   - **Impact**: 20-40x speedup possible
   - **Solution**: Add `predict_batch()` methods that process arrays
   - **Risk**: Low - pure refactoring, same outputs

2. **Capacity Check Caching**
   - **Issue**: Repeated capacity checks for same (agent, channel)
   - **Impact**: 2-3x speedup
   - **Solution**: LRU cache with invalidation on load updates
   - **Risk**: Low - cache can be disabled if issues

#### 🟡 Medium (Moderate Impact):
3. **Vectorized Updates**
   - **Issue**: Individual DataFrame `at[]` accesses in loop
   - **Impact**: 3-5x speedup for agent state updates
   - **Solution**: Collect updates, batch apply
   - **Risk**: Low - same final state

4. **Metrics Aggregation**
   - **Issue**: List append, then DataFrame creation
   - **Impact**: 2x speedup for large simulations
   - **Solution**: Pre-allocated arrays or periodic DataFrame updates
   - **Risk**: Low - same metrics output

#### 🟢 Low (Code Quality):
5. **Variable Naming**
   - Replace `K`, `M`, `i`, `j` with descriptive names
   - Extract magic numbers to config
   - Add type hints everywhere

6. **Modularity**
   - Extract complex logic into pure functions
   - Single responsibility principle
   - Clear separation of concerns

### 1.4 Optimization Strategy

#### Step 1: Add Batch Prediction APIs (Non-Breaking)
```python
# Add to UpliftModel and CapacityModel
def predict_uplift_batch(self, customers, agents, customer_indices, agent_indices, exploration=False):
    """Process all pairs in single batch"""
    # Batch featurize
    # Batch predict
    # Return arrays
    pass

def predict_aht_batch(self, customers, agents, customer_indices, agent_indices):
    """Batch AHT prediction"""
    pass

def check_capacity_batch(self, agents, agent_indices, channels):
    """Batch capacity checks"""
    pass
```

#### Step 2: Update Routing Scorer (Backward Compatible)
- Add `use_batch_predictions` flag (default: True)
- Fallback to individual calls if False (for testing)
- Maintain exact same output

#### Step 3: Optimize Assignment Solver
- Use `np.partition` for top-K instead of full sort (if applicable)
- Pre-compute channel mappings once

#### Step 4: Vectorized Agent Updates
- Collect all updates in dict/arrays
- Single DataFrame update operation

### 1.5 Code Quality Improvements

#### Naming Conventions:
- `K` → `num_customers` ✅ (already done)
- `M` → `num_agents` ✅ (already done)
- Extract magic numbers to config

#### Type Hints:
- Add comprehensive type hints
- Use `typing` module for complex types
- Add return type annotations

#### Documentation:
- Docstrings for all public methods
- Algorithm complexity notes
- Example usage in docstrings

#### Error Handling:
- Try-except blocks with specific exceptions
- Logging for debugging
- Graceful degradation

### 1.6 Future-Proofing

#### Abstraction Layers:
```python
# Abstract base class for models
class MLModelInterface(ABC):
    @abstractmethod
    def predict_batch(self, features: np.ndarray) -> np.ndarray:
        pass

# Plugin architecture for policies
class RoutingPolicy(ABC):
    @abstractmethod
    def assign(self, customers, agents, scorer) -> List[Tuple[int, int]]:
        pass
```

#### Feature Flags:
```python
class FeatureFlags:
    ENABLE_BATCH_PREDICTIONS = True
    ENABLE_CAPACITY_CACHE = True
    ENABLE_VECTORIZED_UPDATES = True
    ENABLE_PERFORMANCE_METRICS = True
```

#### Data Collection Points:
- Log routing decisions for future ML training
- Track performance metrics
- Collect failure cases

---

## Phase 2: Frontend shadcn/ui Integration

### 2.1 Current Frontend Structure

```
frontend/
├── src/
│   ├── App.js                  # Main app (class component)
│   ├── components/
│   │   ├── Dashboard.js        # Main dashboard
│   │   ├── KPICards.js         # Metrics cards
│   │   ├── AgentGrid.js        # Agent display
│   │   ├── MetricsChart.js     # Charts
│   │   ├── PolicyComparison.js # Policy comparison
│   │   └── SimulationControl.js # Start/stop controls
│   └── services/
│       └── api.js              # API client
```

#### Current Issues:
- Uses class components (should migrate to hooks)
- No TypeScript
- Custom CSS (should use Tailwind)
- No shadcn/ui components
- Basic error handling

### 2.2 Migration Strategy

#### Step 1: Initialize shadcn/ui
```bash
cd frontend
npx shadcn@latest init
# Select: TypeScript, Tailwind, App Router
```

#### Step 2: Install Required Components
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add tabs
npx shadcn@latest add badge
npx shadcn@latest add skeleton
npx shadcn@latest add toast
npx shadcn@latest add select
npx shadcn@latest add input
```

#### Step 3: TypeScript Migration
- Convert `.js` → `.tsx`
- Define API types
- Add proper interfaces

#### Step 4: Component-by-Component Migration
1. **KPICards** → shadcn/ui `Card` components
2. **AgentGrid** → shadcn/ui `Table` with `Badge` status
3. **MetricsChart** → Keep Recharts, wrap in `Card`
4. **SimulationControl** → shadcn/ui `Button` + `Dialog`
5. **Dashboard** → Layout with shadcn/ui components

### 2.3 Required Views

#### 1. Dashboard (Real-time Overview)
- KPI cards (CSAT, AHT, SLA, Fairness)
- Live metrics chart
- Agent status grid
- Recent assignments table

#### 2. Agent Panel
- Agent list with availability
- Skills display
- Current load indicators
- Performance metrics per agent

#### 3. Queue Management
- Customer queue with routing status
- Assignment history
- Wait time indicators
- Channel distribution

#### 4. Routing Visualization
- Real-time routing decisions
- Score matrix visualization
- Assignment flow diagram
- Algorithm explanation

#### 5. Analytics
- Historical performance
- Policy comparison charts
- Trend analysis
- Export capabilities

#### 6. Settings
- Configuration panel
- Feature flags
- Model parameters
- System settings

### 2.4 State Management

#### Recommended: Zustand (Lightweight)
```typescript
// stores/simulationStore.ts
interface SimulationState {
  isRunning: boolean
  metrics: Metrics
  agents: Agent[]
  assignments: Assignment[]
  
  // Actions
  startSimulation: (batches: number, policy: string) => Promise<void>
  stopSimulation: () => void
  updateMetrics: (metrics: Metrics) => void
}
```

#### React Query for API:
```typescript
// hooks/useSimulation.ts
export function useSimulation() {
  return useQuery({
    queryKey: ['simulation'],
    queryFn: () => api.getSimulationStatus(),
    refetchInterval: 2000
  })
}
```

### 2.5 WebSocket Integration

```typescript
// hooks/useWebSocket.ts
export function useWebSocket(url: string) {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  
  useEffect(() => {
    const socket = io(url)
    socket.on('metrics_update', setMetrics)
    return () => socket.disconnect()
  }, [url])
  
  return metrics
}
```

---

## Phase 3: Testing & Validation

### 3.1 Backend Testing

#### Unit Tests:
```python
# tests/test_routing.py
def test_compute_routing_matrix_same_output():
    """Verify batch and individual predictions give same results"""
    # Generate test data
    # Run both methods
    # Assert arrays are equal (within tolerance)
    
def test_assignment_solver_optimality():
    """Verify Hungarian gives optimal solution"""
    
def test_capacity_constraints():
    """Verify capacity not violated"""
```

#### Integration Tests:
```python
def test_end_to_end_routing():
    """Full simulation run, verify metrics"""
    
def test_multiple_policies():
    """Run all policies, verify no crashes"""
```

#### Performance Benchmarks:
```python
def benchmark_routing_matrix():
    """Time routing matrix computation"""
    # Before optimization: ~30s
    # After optimization: <1s (expected)
```

### 3.2 Frontend Testing

#### Component Tests:
```typescript
// Dashboard.test.tsx
it('renders KPI cards', () => {
  render(<Dashboard />)
  expect(screen.getByText('CSAT')).toBeInTheDocument()
})

it('updates metrics on WebSocket message', () => {
  // Mock WebSocket
  // Emit metrics_update
  // Assert UI updates
})
```

#### E2E Tests (Playwright):
```typescript
test('start simulation flow', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Start Simulation')
  await expect(page.locator('text=Running')).toBeVisible()
})
```

### 3.3 Validation Checklist

- [ ] Routing accuracy: 100% match with original
- [ ] Performance: >10x improvement
- [ ] Memory usage: No increase
- [ ] API contracts: No breaking changes
- [ ] UI components: All shadcn/ui
- [ ] Real-time updates: Working
- [ ] Error handling: Graceful everywhere
- [ ] Type safety: Full TypeScript coverage
- [ ] Accessibility: WCAG AA compliant
- [ ] Responsive: Mobile/tablet/desktop

---

## Implementation Order

### Week 1: Backend Optimization
1. ✅ Analysis complete
2. Add batch prediction APIs
3. Update routing scorer
4. Optimize assignment solver
5. Vectorized updates
6. Unit tests
7. Performance benchmarks

### Week 2: Frontend Setup & Migration
1. Initialize shadcn/ui
2. TypeScript setup
3. Migrate components one-by-one
4. State management (Zustand)
5. React Query integration
6. WebSocket connection

### Week 3: Features & Testing
1. Implement all required views
2. Comprehensive testing
3. Performance validation
4. Documentation
5. Migration guide

---

## Risk Mitigation

### Backend:
- **Risk**: Batch predictions give different results
- **Mitigation**: Compare outputs, add tolerance checks
- **Rollback**: Feature flag to disable batch mode

### Frontend:
- **Risk**: Breaking UI during migration
- **Mitigation**: Component-by-component, test each
- **Rollback**: Keep old components, switch via config

### Integration:
- **Risk**: API changes break frontend
- **Mitigation**: Version API, maintain backward compatibility
- **Rollback**: Support both old and new endpoints

---

## Success Metrics

### Performance:
- Routing matrix computation: **<1s** (from ~30s)
- Overall simulation: **10x faster**
- Memory usage: **No increase**

### Code Quality:
- Test coverage: **>80%**
- TypeScript coverage: **100%**
- Cyclomatic complexity: **<10 per function**

### User Experience:
- Page load: **<2s**
- Real-time updates: **<100ms latency**
- Responsive: **All screen sizes**

---

## Next Steps

1. **Review this plan** - Get approval on approach
2. **Start Phase 1.1** - Add batch prediction APIs
3. **Test incrementally** - Verify behavior at each step
4. **Document as we go** - Keep notes of changes
5. **Measure performance** - Track improvements

