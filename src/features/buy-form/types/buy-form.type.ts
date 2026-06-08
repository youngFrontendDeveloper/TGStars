export interface BuyFormData {
	discount_percent: number;
	star_rate: number;
	premium_prices: PremiumPrice[];
	star_prices: StarPrice[];
}

export interface PremiumPrice {
	months: number;
	price: number;
	stars_count: number;
}

export interface StarPrice {
	base_price: number;
	discount_percent: number;
	discounted_price: number;
	stars: number;
}
