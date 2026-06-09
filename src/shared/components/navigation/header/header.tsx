"use client";

import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/shared/layouts/auth-provider/auth-provider";

import BurgerMenu from "@/public/assets/icons/icon-burger-menu.svg";
import CloseMenu from "@/public/assets/icons/icon-close.svg";

import { Button } from "../../ui/button";
import Logo from "../../ui/logo/logo";
import { Menu } from "../menu/menu";

export const Header = () => {
	const { user, logout } = useAuth();
	const [menu, setMenu] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const handleLogout = async () => {
		await logout();
		setMenu(false);
	};
	return (
		<header
			className={`sticky top-0 z-10 h-[92px] w-full bg-[#E1E8F0] lg:h-[70px] lg:bg-[#EAEEF0] lg:shadow-[0px_10px_15px_0px_#0000001A]`}
			// className={`sticky top-0 z-10 w-full ${menu && "h-screen bg-[#0000001A] sm:bg-none"} sm:h-auto`}
		>
			<div className="flex h-full w-full items-center justify-between p-[24px] lg:px-[50px] lg:py-[15px] lg:backdrop-blur-[78.7px]">
				<Logo
					width={162.77}
					height={30}
					className="order-2 shrink-0 lg:order-1"
				/>
				<nav className={`order-1 lg:order-2 lg:w-[650px]`}>
					<Menu
						setIsMenuOpen={setIsMenuOpen}
						className={`absolute top-[68px] flex transition-transform duration-300 ${isMenuOpen ? "translate-x-[-24px]" : "-translate-x-[150%]"} lg:relative lg:top-0 lg:translate-x-0`}
					/>
					<div
						className="flex w-[22px] cursor-pointer items-center justify-center lg:hidden"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						{isMenuOpen ? (
							<CloseMenu />
						) : (
							<BurgerMenu className={`h-fill w-fill text-[inherit]`} />
						)}
					</div>
				</nav>

				{user ? (
					<Button onClick={handleLogout} className="order-3 ml-0 xl:ml-[75px]">
						Выйти
					</Button>
				) : (
					<Link
						href={"/auth"}
						className={`font-mts-wide order-3 ml-0 items-center rounded-[859px] bg-gradient-to-r from-[#2563EB] to-[#9333EA] px-[18px] py-[10px] text-[16px] font-medium leading-[22.8px] text-white transition-colors duration-300 hover:bg-[#2563EB] hover:from-[#2563EB] hover:to-[#2563EB] xl:ml-[75px]`}
					>
						Войти
					</Link>
				)}
			</div>
		</header>
	);
};
