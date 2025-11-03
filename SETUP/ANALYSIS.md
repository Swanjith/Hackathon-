# SQRS Code Analysis & Optimization Plan

## Executive Summary
This document outlines identified performance bottlenecks, code quality issues, and optimization strategies for the Smart Queue Routing System.

---

## 🔴 Critical Performance Issues

### 1. Nested `iterrows()` in Routing Score Computation
**Location:** `routing/scoring.py:40-41`
**Impact:** O(K×M) iterations with slow pandas row access
**Current:** Double loop with `iterrows()` - very slow
**Fix:** Vectorize using numpy operations or batch feature extraction

### 2. Unnecessary DataFrame Copies
**Location:** 
- `simulation/simulator.py:71` - copies agents every batch
- `routing/assignment.py:118` - full DataFrame copy
**Impact:** Memory overhead and GC pressure
**Fix:** Use views or update in-place where possible

### 3. Inefficient Capacity Tracking
**Location:** `routing/assignment.py:53-58`
**Impact:** Creates full nested dictionary structure upfront
**Fix:** Lazy initialization or vectorized capacity checks

### 4. Repeated Dictionary/Series Access
**Location:** Multiple files
**Impact:** Repeated lookups in hot loops
**Fix:** Cache frequently accessed values

---

## 🟡 Code Quality Issues

### 1. Magic Numbers
- Hardcoded SLA thresholds in `scoring.py:66`
- Magic numbers (0.5, 0.3, 0.2) in multiple places
**Fix:** Move to config constants

### 2. Variable Naming
- Short variable names (K, M, i, j)
- Generic names (pairs, X, y)
**Fix:** More descriptive names

### 3. Missing Type Hints
- Some function parameters lack type hints
- Return types not always specified

### 4. Redundant Calculations
- SLA thresholds computed repeatedly
- Capacity checks done multiple times

---

## 🟢 Optimization Strategy

### Phase 1: Vectorization
- Replace `iterrows()` with vectorized numpy operations
- Batch feature extraction
- Use DataFrame.apply() or vectorized numpy where possible

### Phase 2: Caching & Memoization
- Cache SLA thresholds
- Pre-compute channel indices
- Cache agent capacity states

### Phase 3: Memory Optimization
- Eliminate unnecessary copies
- Use views where appropriate
- Optimize data structures

### Phase 4: Algorithmic Improvements
- Early termination in greedy algorithms
- Pre-filter invalid assignments
- Optimize Hungarian algorithm inputs

---

## Metrics to Track
- Execution time per batch
- Memory usage
- Function call counts
- Cache hit rates

