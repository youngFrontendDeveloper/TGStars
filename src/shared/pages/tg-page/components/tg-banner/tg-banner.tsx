"use client";

import Lottie from "lottie-react";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";

import TgIcon from "@/public/assets/icons/tg.svg";
import subscribeAnimation from "@/public/assets/tg/subscribe.json";

export const TgBanner = () => {
	return (
		<section className="flex w-full flex-col items-center gap-[24px] rounded-[16px] bg-[#F7F9FB] p-[24px] shadow-[0px_0px_11px_0px_#00000005] lg:flex-row lg:gap-[33px] lg:px-[40px] lg:py-[30px]">
			<h2 className="sr-only">Баннер подписки на канал TGStars в Телеграм</h2>
			<Lottie
				animationData={subscribeAnimation}
				loop
				autoplay
				className="flex h-auto w-full max-w-[350px] justify-center rounded-[32px] lg:h-[200px] lg:w-[200px] lg:min-w-[200px]"
			/>
			<div className="flex flex-col">
				<p className="font-mts-extended mb-[20px] text-[20px]/[22.8px] font-semibold text-black">
					Подписывайтесь на наш Telegram
				</p>
				<p className="font-mts-wide mb-[20px] text-[16px]/[22px] font-semibold text-[#95A0A7] lg:mb-[43px]">
					Там мы публикуем новости из мира Telegram, розыгрыши и анонсы
				</p>
				<Link
					href="https://t.me/tgstarspage"
					target="_blank"
					className="mt-auto"
				>
					<Button maxWidth="358px" className="mx-auto">
						<TgIcon className="white-icon" />
						Подписаться
					</Button>
				</Link>
			</div>
		</section>
	);
};
