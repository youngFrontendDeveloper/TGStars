import Image from "next/image";
import Link from "next/link";

import bannerImage from "@/public/assets/images/develop.png";

export const DevelopBanner = () => {
	return (
		<section className="flex w-full flex-col gap-6 rounded-2xl bg-[#F7F9FB] p-6 shadow-[0px_0px_11px_0px_#00000005] sm:flex-row sm:gap-8 sm:px-10 sm:py-20">
			<Image
				src={bannerImage}
				alt="banner image"
				width={400}
				height={250}
				quality={100}
				className="h-auto w-full sm:h-[200px] sm:w-[241px]"
			/>
			<div className="flex flex-col gap-5">
				<h1 className="font-montserrat text-[20px]/[22.8px] font-medium text-black">
					Раздел в разработке
				</h1>
				<p className="font-montserrat text-[16px]/[22.8px] font-medium text-[#95A0A7]">
					Извините за строительный шум — утка уже всё чинит. Скоро здесь будет
					что‑то классное.
				</p>
				<p className="font-montserrat text-[16px]/[22.8px] font-medium text-[#95A0A7]">
					А пока можете подписаться на наш{" "}
					<Link
						href="https://t.me/tgstarspage"
						className="font-medium text-[#399AD1]"
					>
						Telegram канал
					</Link>
					, чтобы не пропустить новости и анонсы.
				</p>
			</div>
		</section>
	);
};
