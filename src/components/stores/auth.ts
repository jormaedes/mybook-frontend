import { create } from 'zustand';
import type { User } from '../../types/types';
import { getMe, logoutAPI, loginFetch } from '@/lib/api'


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
				const res = await loginFetch(email, password);
				set({ user: res, status: 'authenticated' });
				console.log(res);
			} catch (error) {
				set({ status: 'unauthenticated' });
			}
		},

		logout: async () => {
			await logoutAPI();
			set({ user: null, status: 'unauthenticated' });
		},

		setUser: (user) => {
			set({ user, status: 'authenticated' });
		},

		init: async () => {
			try {
				const user = await getMe();
				set({ user: user, status: 'authenticated' });
			} catch (error) {
				set({ status: 'unauthenticated' });
			}
		}
	}
});