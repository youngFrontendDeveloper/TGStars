"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import { useUser } from "@/shared/layouts/auth-provider/auth-provider";

import blurImage from "@/public/assets/images/bonus.png";
import bonusAnimation from "@/public/assets/tg/bonus.json";

const LottiePlayer = dynamic(
	() =>
		import("@/shared/components/ui/lottie-player").then((m) => m.LottiePlayer),
	{
		ssr: false,
		loading: () => (
			<Image
				src={blurImage.src}
				alt="Стикер Telegram"
				width={280}
				height={280}
			/>
		),
	},
);

// const LottiePlayer = dynamic(
// 	() =>
// 		import("@/shared/components/ui/lottie-player").then((m) => m.LottiePlayer),
// 	{ ssr: false },
// );

export const Bonus = () => {
	const { isAuthenticated } = useUser();
	const profileHref = isAuthenticated ? "/profile" : "/auth";

	return (
		// Реферальная программа

		<section className="mb-[32px] box-border flex h-auto flex-col-reverse items-center justify-between gap-[40px] rounded-[16px] bg-gradient-to-b from-[#262C55] from-[16.45%] to-[#46386E] to-[82.49%] p-[24px] shadow-[0px_8px_10px_-6px_#0000000D] md:h-[278px] md:flex-row md:gap-0 md:p-10 lg:mb-[50px]">
			<h2 className="sr-only">Реферальная программа в TGStars</h2>
			<div className="">
				<div className="w-full max-w-[280px]">
					<p className="font-montserrat text-[32px] font-bold leading-[30px] text-white">
						Реферальная программа
					</p>
					<p className="font-inter mt-[14px] text-[14px] leading-[22px] text-white md:text-[16px]">
						Получайте 5% Звёзд от покупок друзей на ваш баланс
					</p>
				</div>
				<Link
					href={profileHref}
					className="font-montserrat mt-[33px] box-border inline-block w-full rounded-full border border-2 border-[#EAEEF0] px-[25px] py-[10px] text-center font-medium text-white md:w-fit"
				>
					Присоединиться
				</Link>
			</div>
			<div className="">
				{/* old */}
				{/* <Lottie
					animationData={bonusAnimation}
					loop
					autoplay
					className="h-[280px] w-[280px] md:h-[200px] md:w-[200px]"
				/> */}
				{/* works */}
				<LottiePlayer
					animationData={bonusAnimation}
					className="h-[280px] w-[280px] md:h-[200px] md:w-[200px]"
				/>
			</div>
		</section>
	);
};
