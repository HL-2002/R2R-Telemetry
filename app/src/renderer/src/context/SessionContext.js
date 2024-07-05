import { create } from 'zustand'

// this will be the store for active session

/**
 * Creates a session store using Zustand.
 *
 * @param {Function} set - The set function provided by Zustand.
 * @returns {Object} - The session store object.
 */
const useSessionStore = create((set) => ({
  // default values
  // session is an object that represents the current session
  session: null,
  // Runs is an array of objects that represent the runs in the current session
  Runs: [],
  // Entries is an array of objects that represent the entries in the current session
  Entry: [],
  // methods to set the session, runs, and entries
  setSession: (session) => set({ session }),
  setRuns: (Runs) => set({ Runs }),
  addRun: (run) => set((state) => ({ Runs: [...state.Runs, run] })),
  setEntry: (Entry) => set({ Entry }),
  addEntry: (entry) => set((state) => ({ Entry: [...state.Entry, entry] }))
}))

export { useSessionStore }
