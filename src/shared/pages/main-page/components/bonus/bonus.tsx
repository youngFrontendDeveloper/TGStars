"use client";

import Lottie from "lottie-react";
// import Image from "next/image";
import Link from "next/link";
import bonusAnimation from "@/public/assets/tg/bonus.json";
import { useUser } from "@/shared/layouts/auth-provider/auth-provider";

// import bonusGif from "@/public/assets/gifs/bonus.gif";

export const Bonus = () => {
	const { isAuthenticated } = useUser();
	const profileHref = isAuthenticated ? "/profile" : "/auth";

	return (
		// Реферальная программа

		<section className="box-border flex h-auto flex-col-reverse items-center justify-between gap-[40px] rounded-[16px] bg-gradient-to-b from-[#262C55] from-[16.45%] to-[#46386E] to-[82.49%] p-[24px] shadow-[0px_8px_10px_-6px_#0000000D] md:h-[278px] md:flex-row md:gap-0 md:p-10 mb-[32px] lg:mb-[50px]">
			<h2 className="sr-only">Реферальная программа в TGStars</h2>
			<div className="">
				<div className="w-full max-w-[280px]">
					<p className="font-mts-wide text-[32px] font-bold leading-[30px] text-white">
						Реферальная программа
					</p>
					<p className="font-mts-text mt-[14px] text-[14px] leading-[22px] text-white md:text-[16px]">
						Получайте 5% Звёзд от покупок друзей на ваш баланс
					</p>
				</div>
				<Link
					href={profileHref}
					className="font-mts-text mt-[33px] box-border inline-block w-full rounded-full border border-2 border-[#EAEEF0] px-[25px] py-[10px] text-center font-medium text-white md:w-fit"
				>
					Присоединиться
				</Link>
			</div>
			<div className="">
				<Lottie
					animationData={bonusAnimation}
					loop
					autoplay
					className="h-[280px] w-[280px] md:h-[200px] md:w-[200px]"
				/>
				{/* <Image
          src={bonusGif}
          alt="Бонус"
          width={280}
          height={280}
          className="h-[280px] w-[280px] object-contain rounded-[25px] md:h-[200px] md:w-[200px] rounded-[32px]"
        /> */}
			</div>
		</section>
	);
};
