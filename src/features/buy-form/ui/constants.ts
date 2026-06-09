import King from "@/public/assets/icons/king.svg";
import Star from "@/public/assets/icons/new-star.svg";
import Ton from "@/public/assets/icons/ton.svg";

import { type TabItem } from "./types";

export const getTabItems = (isMobile: true | false): TabItem[] => [
	{
		name: isMobile ? "Звёзды" : "Купить\u00A0Звёзды",
		icon: Star,
		id: "stars",
	},
	{
		name: isMobile ? "Премиум" : "Купить\u00A0Премиум",
		icon: King,
		id: "premium",
		stroke: true,
	},
	{
		name: isMobile ? "TON" : "Купить\u00A0TON",
		icon: Ton,
		id: "ton",
	},
];

export const PRICE_BUTTONS = [500, 1000, 2000];

// import King from "@/public/assets/icons/king.svg";
// import Star from "@/public/assets/icons/new-star.svg";
// import Ton from "@/public/assets/icons/ton.svg";

// import { type TabItem } from "./types";

// export const TAB_ITEMS: TabItem[] = [
// 	{
// 		name: "Купить Звёзды",
// 		icon: Star,
// 		id: "stars",
// 	},
// 	{
// 		name: "Купить Премиум",
// 		icon: King,
// 		id: "premium",
// 		stroke: true,
// 	},
// 	{
// 		name: "Купить TON",
// 		icon: Ton,
// 		id: "ton",
// 	},
// ];

// export const PRICE_BUTTONS = [500, 1000, 2000];
