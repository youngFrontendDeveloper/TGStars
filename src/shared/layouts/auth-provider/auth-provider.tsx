"use client";
import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import { getProfile } from "@/features/auth/api/api";

export interface User {
	id: 123;
	telegram_username: string;
	first_name: string;
	avatar_url: string;
	total_spent: number;
	total_stars: number;
	orders_count: number;
	discount_percent: number;
	registration_date: string;
}

export interface Order {
	id: number;
	stars_count?: number | null;
	amount: number;
	recipient_username: string;
	status: string;
	is_premium: boolean;
	premium_months?: number | null;
	created_at: string;
}

interface AuthContextType {
	user: User | undefined;
	orders: Order[];
	isAuthenticated: boolean;
	isLoading: boolean;
	setAuthData: (userData: User | undefined) => void;
	setOrderData: (orders: Order[]) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | undefined>(undefined);
	const [orders, setOrderData] = useState<Order[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Перехватываем реферальный код из URL при первом заходе
		if (globalThis.window !== undefined) {
			const urlParams = new URLSearchParams(globalThis.window.location.search);
			const refCode = urlParams.get("ref");
			
			if (refCode) {
				// Сохраняем в localStorage для использования при авторизации
				localStorage.setItem("pending_referral_code", refCode.toUpperCase());
				console.log('📎 Сохранён реферальный код:', refCode.toUpperCase());
				
				// Убираем ref из URL чтобы не мешался
				const newUrl = globalThis.window.location.pathname;
				globalThis.window.history.replaceState({}, "", newUrl);
			}
		}
		
		checkAuthHandle();
	}, []);

	const checkAuthHandle = async () => {
		try {
			setIsLoading(true);
			const profile = await getProfile();
			if (profile.user) {
				setUser(profile.user);
				setOrderData(profile.orders);
			}
		} catch (error) {
			console.error("Auth check failed:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const setAuthData = (userData: User | undefined) => {
		setUser(userData);
	};

	const logout = async () => {
		try {
			await fetch("https://tg-stars.ru/auth/logout", {
				method: "POST",
				credentials: "include",
			});
		} catch (error) {
			console.error("Logout failed:", error);
		} finally {
			setUser(undefined);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
				isLoading,
				setAuthData,
				logout,
				setOrderData,
				orders,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const useUser = () => {
	const { user, isAuthenticated, isLoading, orders } = useAuth();
	return { user, isAuthenticated, isLoading, orders };
};
