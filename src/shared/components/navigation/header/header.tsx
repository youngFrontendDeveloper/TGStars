"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/shared/layouts/auth-provider/auth-provider";

import { Button } from "../../ui/button";
import Logo from "../../ui/logo/logo";
import { Menu } from "../menu/menu";

export const Header = () => {
	const { user, logout } = useAuth();
	const pathname = usePathname();
	const [menu, setMenu] = useState(false);
	const handleLogout = async () => {
		await logout();
		setMenu(false);
	};
	return (
		<header
			className={`sticky top-0 z-10 w-full ${menu && "h-screen bg-[#0000001A] sm:bg-none"} sm:h-auto`}
		>
			<div className="flex w-full items-center justify-between bg-[#E1E8F0] px-6 py-6 md:bg-[#EAEEF0] md:shadow-[0px_10px_15px_0px_#0000001A] md:backdrop-blur-[78.7px] lg:px-[50px] lg:py-[14px]">
				<Logo
					width={162.77}
					height={30}
					className="order-2 shrink-0 sm:order-1"
				/>

				<Menu className="order-1 sm:order-2" />

				{user ? (
					<Button onClick={handleLogout} className="order-3 ml-[75px]">
						Выйти
					</Button>
				) : (
					<Link
						href={"/auth"}
						className={`font-mts-wide order-3 ml-[75px] items-center rounded-full bg-gradient-to-r from-[#2563EB] to-[#9333EA] px-[18px] py-[10px] text-[16px] font-medium leading-[22.8px] text-white transition-colors duration-300 hover:bg-[#2563EB] hover:from-[#2563EB] hover:to-[#2563EB]`}
					>
						Войти
					</Link>
				)}
			</div>
		</header>
	);
};
