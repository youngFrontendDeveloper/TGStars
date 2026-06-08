import King from "@/public/assets/icons/king.svg";
import Star from "@/public/assets/icons/new-star.svg";
import Ton from "@/public/assets/icons/ton.svg";

import { type TabItem } from "./types";

export const TAB_ITEMS: TabItem[] = [
	{
		name: "Купить Звёзды",
		icon: Star,
		id: "stars",
	},
	{
		name: "Купить Премиум",
		icon: King,
		id: "premium",
		stroke: true,
	},
	{
		name: "Купить TON",
		icon: Ton,
		id: "ton",
	},
];

export const PRICE_BUTTONS = [500, 1000, 2000];
