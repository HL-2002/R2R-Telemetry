import { create } from 'zustand'

// this will be the store for active session

/**
 * Creates a session store using Zustand.
 *
 * @param {Function} set - The set function provided by Zustand.
 * @returns {Object} - The session store object.
 */
const useSessionStore = create((set) => ({
  session: null,
  Runs: [],
  setSession: (session) => set({ session }),
  setRuns: (Runs) => set({ Runs }),
  addRun: (run) => set((state) => ({ Runs: [...state.Runs, run] }))
}))

export { useSessionStore }
