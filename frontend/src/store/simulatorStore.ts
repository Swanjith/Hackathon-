import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Metrics {
  csat: number
  aht: number
  sla_met_rate: number
  gini: number
  throughput: number
  total_assignments: number
}

interface Agent {
  agent_id: string
  name: string
  current_load: number
  avg_csat: number
  avg_aht: number
  status: 'available' | 'busy' | 'offline'
  [key: string]: any
}

interface Assignment {
  customer_id: string
  agent_id: string
  channel: string
  assigned_at: string
}

interface SimulatorState {
  // Metrics
  metrics: Metrics
  historicalMetrics: Metrics[]
  
  // Agents
  agents: Agent[]
  selectedAgent: Agent | null
  
  // Assignments
  assignments: Assignment[]
  
  // Simulation control
  simulationStatus: {
    is_running: boolean
    current_batch: number
    elapsed_time: number
  }
  
  // Dual variables
  dualVariables: {
    lambda_aht: number
    lambda_sla: number
    lambda_fairness: number
  }
  
  // Actions
  setMetrics: (metrics: Metrics) => void
  addHistoricalMetric: (metric: Metrics) => void
  setAgents: (agents: Agent[]) => void
  setSelectedAgent: (agent: Agent | null) => void
  setAssignments: (assignments: Assignment[]) => void
  setSimulationStatus: (status: SimulatorState['simulationStatus']) => void
  setDualVariables: (vars: SimulatorState['dualVariables']) => void
  reset: () => void
}

const initialState = {
  metrics: {
    csat: 0,
    aht: 0,
    sla_met_rate: 0,
    gini: 0,
    throughput: 0,
    total_assignments: 0,
  },
  historicalMetrics: [],
  agents: [],
  selectedAgent: null,
  assignments: [],
  simulationStatus: {
    is_running: false,
    current_batch: 0,
    elapsed_time: 0,
  },
  dualVariables: {
    lambda_aht: 0.1,
    lambda_sla: 0.1,
    lambda_fairness: 0.1,
  },
}

export const useSimulatorStore = create<SimulatorState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setMetrics: (metrics) => set({ metrics }),
      
      addHistoricalMetric: (metric) => set((state) => ({
        historicalMetrics: [...state.historicalMetrics.slice(-99), metric], // Keep last 100
      })),
      
      setAgents: (agents) => set({ agents }),
      
      setSelectedAgent: (agent) => set({ selectedAgent: agent }),
      
      setAssignments: (assignments) => set({ assignments }),
      
      setSimulationStatus: (simulationStatus) => set({ simulationStatus }),
      
      setDualVariables: (dualVariables) => set({ dualVariables }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'sqrs-simulator-storage',
      partialize: (state) => ({
        historicalMetrics: state.historicalMetrics,
        dualVariables: state.dualVariables,
      }),
    }
  )
)
