export const getAuthLink = async () => {
	// Получаем сохранённый реферальный код из localStorage
const refCode = globalThis.window !== undefined
		? localStorage.getItem("pending_referral_code")
		: undefined;
	
	// Добавляем ref параметр если есть
	const url = refCode 
		? `https://tg-stars.ru/auth/telegram?ref=${refCode}`
		: "https://tg-stars.ru/auth/telegram";
	
	const res = await fetch(url, {
		credentials: "include",
	});
	const data = await res.json();
	return data;
};

export const checkAuth = async (token: string) => {
	try {
		const response = await fetch(
			`https://tg-stars.ru/auth/check?token=${token}`,
			{
				credentials: "include",
			},
		);
		if (!response.ok) {
			console.error(`Auth check failed: ${response.status}`);
			return { authenticated: false };
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Auth check error:", error);
		return { authenticated: false };
	}
};

export const getProfile = async () => {
	const res = await fetch("https://tg-stars.ru/api/user/profile", {
		credentials: "include",
		cache: "no-cache",
	});
	const data = await res.json();
	return data;
};

export const getReferralsInfo = async () => {
	const res = await fetch("https://tg-stars.ru/api/referral/stats", {
		credentials: "include",
	});
	const data = await res.json();
	return data;
};
