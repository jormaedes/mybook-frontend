import { create } from 'zustand';
import type { User } from '../../types/types';
import { getMe, logoutAPI, loginFetch } from '@/lib/api';

interface AuthState {
	user: User | null;
	status: "loading" | "authenticated" | "unauthenticated";
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	init: () => Promise<void>;
	setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()((set) => {
	return {
		user: null,
		status: 'loading',

		login: async (email: string, password: string) => {
			try {
				set({ status: 'loading'});
				const res = await loginFetch(email, password);
				set({ user: res.user, status: 'authenticated' });
			} catch (error) {
				set({ status: 'unauthenticated' });
				throw error;
			}
		},

		logout: async () => {
			try {
				set({ status: 'loading'});
				await logoutAPI();
			} finally {
				set({ user: null, status: 'unauthenticated' });
			}
		},

		setUser: (user) => {
			set({ user, status: 'authenticated' });
		},

		init: async () => {
			try {
				set({ status: 'loading'});
				const res = await getMe();
				set({ user: res.user, status: 'authenticated' });
			} catch {
				set({ user: null, status: 'unauthenticated' });
			}
		}
	};
});
