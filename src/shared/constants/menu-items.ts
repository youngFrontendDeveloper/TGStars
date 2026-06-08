import Present from "@/public/assets/icons/present.svg";
import Profile from "@/public/assets/icons/profile.svg";
import Star from "@/public/assets/icons/star.svg";
import Tg from "@/public/assets/icons/tg.svg";
import type { ComponentType, SVGProps } from "react";
import type { User } from "../layouts/auth-provider/auth-provider";

export interface MenuItem {
  name: string;
  path: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const getMenuItems = (user: User | undefined): MenuItem[] => [
  {
    name: "Купить Звёзды",
    path: "/",
    icon: Star,
  },
  {
    name: "Купить подарки",
    path: "/present",
    icon: Present,
  },
  {
    name: "Мой профиль",
    path: user ? "/profile" : "/auth",
    icon: Profile,
  },
  {
    name: "Мы в Telegram",
    path: "/tg",
    icon: Tg,
  },
];