"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/shared/layouts/auth-provider/auth-provider";
import CloseMenu from "@/public/assets/icons/closeMenu.svg";
import loginMobile from "@/public/assets/icons/login.png";
import LoginIcon from "@/public/assets/icons/login.svg";
import Menu from "@/public/assets/icons/menu.svg";
import Present from "@/public/assets/icons/present.svg";
import Profile from "@/public/assets/icons/profile.svg";
import Star from "@/public/assets/icons/star.svg";
import NewStar from "@/public/assets/icons/new-star.svg";
import Tg from "@/public/assets/icons/tg.svg";
import { Button } from "../../ui/button";

export const Header = () => {
	const { user, logout } = useAuth();
	const links = [
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
			<div className="flex w-full items-center md:bg-[#EAEEF0] px-6 py-6 bg-[#E1E8F0] lg:px-[50px] lg:py-[14px] md:shadow-[0px_10px_15px_0px_#0000001A] md:backdrop-blur-[78.7px] md:shadow-[0px_10px_15px_0px_#0000001A]">
				<Link href={"/"} className="shrink-0">
					<Image
						src="/assets/icons/logo.svg"
						alt="TGStars"
						width={185}
						height={30}
						priority
					/>
				</Link>
				<div className="hidden flex-1 justify-center lg:flex">
					<div className="h-11 rounded-[14px]  p-0.5 flex max-w-[670px] w-full">
						{links.map((el, i) => {
							const isActive = pathname === el.path;
							let Icon = el.icon;
							let iconClassName = "inactive-icon";

							if (el.path === "/") {
								if (isActive) {
									Icon = NewStar;
									iconClassName = "";
								} else {
									Icon = Star;
									iconClassName = "inactive-icon";
								}
							} else if (isActive) {
								iconClassName = "header-active-icon";
							}

							return (
								<Link
									href={el.path}
									key={i}
									className={`font-mts-text flex items-center gap-2 rounded-[38px]  p-0.5 px-4 py-2.5 text-sm/[100%] font-medium text-[#374151] ${pathname === el.path && "bg-[#2563EB] text-white"}`}
								>
									<Icon className={iconClassName} />
									{el.name}
								</Link>
							);
						})}
					</div>
				</div>
				<div className="hidden shrink-0 lg:flex" style={{ width: "150px", justifyContent: "flex-end" }}>
					{user ? (
						<Button onClick={handleLogout}>
							<LoginIcon />
							Выйти
						</Button>
					) : (
						<Link href={"/auth"}>
							<Button>
								<LoginIcon />
								Войти
							</Button>
						</Link>
					)}
				</div>
				<button onClick={() => setMenu(!menu)} className="block lg:hidden ml-auto">
					{menu ? <CloseMenu /> : <Menu />}
				</button>
			</div>
			{menu && (
				<div className="-mt-0.5 block sm:hidden">
					<div className="flex h-max flex-col gap-6 rounded-b-3xl bg-[#E1E8F0] px-6 pb-6 shadow-[0px_4px_10px_0px_#0000001A]">
						<div className="flex w-full flex-col gap-4">
							{links.map((el, i) => {
								const isActive = pathname === el.path;
								let Icon = el.icon;
								let iconClassName = "inactive-icon";

								if (el.path === "/") {
									if (isActive) {
										Icon = Star;
										iconClassName = "active-icon-gold";
									} else {
										Icon = Star;
										iconClassName = "inactive-icon";
									}
								} else if (isActive) {
									iconClassName = "active-icon";
								}

								return (
									<Link
										href={el.path}
										key={i}
										onClick={() => setMenu(false)}
										className={`font-mts-text flex items-center gap-2 rounded-[14px] p-4 text-sm/[100%] font-medium text-[#808080] ${pathname === el.path && "bg-white text-black"}`}
									>
										<Icon className={iconClassName} />
										{el.name}
									</Link>
								);
							})}
						</div>
						{user ? (
							<Button
								className="w-full justify-center"
								onClick={handleLogout}
							>
								<Image src={loginMobile} alt="logout" width={24} height={24} />
								Выйти
							</Button>
						) : (
							<Link href={"/auth"} className="w-full">
								<Button
									className="w-full justify-center"
									onClick={() => setMenu(false)}
								>
									<Image src={loginMobile} alt="login" width={24} height={24} />
									Войти
								</Button>
							</Link>
						)}
					</div>
				</div>
			)}
		</header>
	);
};
