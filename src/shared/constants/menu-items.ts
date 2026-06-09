import type { ComponentType, SVGProps } from "react";

import Present from "@/public/assets/icons/present.svg";
import Profile from "@/public/assets/icons/profile.svg";
import Star from "@/public/assets/icons/star.svg";
import Tg from "@/public/assets/icons/tg.svg";

import type { User } from "../layouts/auth-provider/auth-provider";

export interface MenuItem {
	name: string;
	path: string;
	icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const getMenuItems = (user: User | undefined): MenuItem[] => [
	{
		name: "Купить\u00A0Звёзды",
		path: "/",
		icon: Star,
	},
	{
		name: "Купить\u00A0подарки",
		path: "/present",
		icon: Present,
	},
	{
		name: "Мой\u00A0профиль",
		path: user ? "/profile" : "/auth",
		icon: Profile,
	},
	{
		name: "Мы\u00A0в\u00A0Telegram",
		path: "/tg",
		icon: Tg,
	},
];
