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
  setSession: (session) => set({ session })
}))

export { useSessionStore }
