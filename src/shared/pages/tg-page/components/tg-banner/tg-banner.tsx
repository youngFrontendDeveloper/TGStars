"use client";

// import Image from "next/image";
import Link from "next/link";
import React from "react";
import Lottie from "lottie-react";
import subscribeAnimation from "@/public/assets/tg/subscribe.json";
import { Button } from "@/shared/components/ui/button";
import TgIcon from "@/public/assets/icons/tg.svg";
// import bannerGif from "@/public/assets/gifs/aboutus.gif";

// import bannerImage from "@/public/assets/images/tg.png";

export const TgBanner = () => {
	return (
		<section className="flex w-full flex-col gap-6 rounded-2xl bg-white p-6 shadow-[0px_0px_11px_0px_#00000005] sm:flex-row sm:gap-8 sm:px-10 sm:py-[30px]">
			<h2 className="sr-only">Баннер подписки на канал TGStars в Телеграм</h2>
			<Lottie
					animationData={subscribeAnimation}
					loop
					autoplay
					className="h-auto w-full rounded-[32px] sm:h-[200px] sm:w-[200px]"
				/>
			{/* <Image
				src={bannerGif}
				alt="banner image"
				width={200}
				height={200}
				quality={100}
				className="h-auto w-full rounded-[32px] sm:h-[200px] sm:w-[200px]"
			/> */}
			<div className="flex flex-col gap-5">
				<p className="font-mts-extended text-xl/[22px] font-medium text-black">
					Подписывайтесь на наш Telegram
				</p>
				<p className="font-mts-text text-base/[22px] font-medium text-[#95A0A7]">
					Там мы публикуем новости из мира Telegram, розыгрыши и анонсы
				</p>
				<Link
					href="https://t.me/tgstarspage"
					target="_blank"
					className="mt-auto"
				>
					<Button className="flex h-11 w-full justify-center gap-1.5 text-center">
						<TgIcon className="white-icon" /> Подписаться
					</Button>
				</Link>
			</div>
		</section>
	);
};
