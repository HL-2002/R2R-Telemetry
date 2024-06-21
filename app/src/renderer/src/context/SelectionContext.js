import { create } from 'zustand'

const useSelectionStore = create((set) => ({
  selections: [],
  setSelection: (selection) => set({ selections: selection }),
  Axis: 'time',
  setAxis: (axis) => set({ Axis: axis })
}))

export { useSelectionStore }
