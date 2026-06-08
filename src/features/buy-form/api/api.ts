export const getBuyFormData = async () => {
	const response = await fetch("https://tg-stars.ru/api/prices", {
		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await response.json();
	return data;
};

export const checkUsername = async (username: string) => {
	const response = await fetch("https://tg-stars.ru/api/validate_username", {
		method: "POST",
		body: JSON.stringify({ username }),
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await response.json();
	return data;
};

export type PaymentMethod = "sbp" | "card" | "sberpay" | "crypto";

export type CreateStarsOrderRequest = {
	order_type: "stars";
	stars_count: number;
	recipient_username: string;
	payment_method: PaymentMethod;
};

export type CreatePremiumOrderRequest = {
	order_type: "premium";
	premium_months: number;
	recipient_username: string;
	payment_method: PaymentMethod;
};

export type CreateOrderRequest =
	| CreateStarsOrderRequest
	| CreatePremiumOrderRequest;

export const getPaymentLink = async (order: CreateOrderRequest) => {
	const res = await fetch("https://tg-stars.ru/api/order/create", {
		method: "POST",
		body: JSON.stringify(order),
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await res.json();

	return data;
};

export type TonSettings = {
	success: boolean;
	ton_enabled: boolean;
	ton_rate_rub: number;
	ton_min_purchase_ton: number;
	ton_min_purchase_rub: number;
	ton_max_purchase_rub: number | null;
};

export type TonCalculateResponse = {
	success: boolean;
	amount_rub: number;
	ton_amount: number;
	ton_rate_rub: number;
};

export type CreateTonOrderRequest = {
	wallet_address: string;
	amount_rub: number;
	payment_method?: PaymentMethod;
};

export type CreateTonOrderResponse = {
	success: boolean;
	payment_url?: string;
	order_id?: string;
	ton_amount?: number;
	error?: string;
};

export const getTonSettings = async (): Promise<TonSettings> => {
	const res = await fetch("https://tg-stars.ru/api/ton/settings", {
		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await res.json();
	return data;
};

export const calculateTon = async (
	amountRub: number,
): Promise<TonCalculateResponse> => {
	const res = await fetch(
		`https://tg-stars.ru/api/ton/calculate?amount_rub=${encodeURIComponent(amountRub)}`,
		{
			headers: {
				"Content-Type": "application/json",
			},
		},
	);
	const data = await res.json();
	return data;
};

export const createTonOrder = async (
	order: CreateTonOrderRequest,
): Promise<CreateTonOrderResponse> => {
	const res = await fetch("https://tg-stars.ru/api/ton/create_order", {
		method: "POST",
		body: JSON.stringify(order),
		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await res.json();
	return data;
};
