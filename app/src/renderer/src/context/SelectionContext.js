import { create } from 'zustand'
import constants from '../constants'
const { AllgraphSafe } = constants

// create a store for the selection context
const useSelectionStore = create((set) => ({
  // default values

  // selections is an array of objects that represent the selected data points
  selections: [],
  safeSelections: [...AllgraphSafe],
  setSelection: (selection) => set({ selections: selection }),
  setSafeSelection: (selection) => set({ safeSelections: selection }),
  // Axis is the axis that the user is currently selecting
  Axis: 'time',
  setAxis: (axis) => set({ Axis: axis })
}))

export { useSelectionStore }
