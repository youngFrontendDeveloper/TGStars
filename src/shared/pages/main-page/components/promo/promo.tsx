"use client";

import dynamic from "next/dynamic";

import stickerData from "@/public/sticker.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export const Promo = () => {
	const items = [
		{
			title: "7 153+",
			text: "Покупок",
		},
		{
			title: "400+",
			text: "Довольных клиентов",
		},
		{
			title: "3 576 512",
			text: "Отправлено Звезд",
		},
	];

	return (
		<section className="flex w-full flex-col gap-6 rounded-2xl bg-white p-6 shadow-[0px_0px_11px_0px_#00000005] sm:gap-8 sm:px-10 sm:py-[30px]">
			<div className="flex w-full flex-col gap-6 sm:flex-row sm:gap-8">
				<div className="flex w-full justify-center sm:w-[150px] sm:flex-shrink-0">
					<Lottie
						animationData={stickerData}
						loop={true}
						autoplay={true}
						className="h-auto max-w-full"
					/>
				</div>
				<div className="flex flex-col items-center gap-6 sm:items-start sm:justify-between sm:gap-0">
					<p className="font-mts-extended text-center text-lg/[145%] text-black sm:text-left sm:text-xl/[22px]">
						Покупайте Telegram Stars дешевле, чем где-либо.
					</p>
					<p className="font-mts-text text-center text-base/[22px] font-medium text-[#95A0A7] sm:text-left">
						Лучший курс на рынке, моментальная доставка Звезд после оплаты и
						круглосуточная работа сайта.
					</p>
				</div>
			</div>
			<div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-0">
				{items.map((el, i) => (
					<div
						className="flex flex-col items-center gap-2 sm:items-start"
						key={i}
					>
						<p className="font-mts-extended text-xl/[22px] text-black">
							{el.title}
						</p>
						<p className="font-mts-text text-base/[22px] font-normal text-[#95A0A7]">
							{el.text}
						</p>
					</div>
				))}
			</div>
		</section>
	);
};
