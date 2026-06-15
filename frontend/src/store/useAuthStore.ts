import { create } from 'zustand';
import type {User, Session} from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    session: Session | null;
    setUser: (user: User | null, session: Session | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    setUser: (user, session) => set({ user, session }),
    logout: () => set({ user: null, session: null }),
}));
