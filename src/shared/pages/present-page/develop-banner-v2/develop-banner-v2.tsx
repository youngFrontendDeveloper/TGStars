import Link from "next/link";

export const DevelopBannerV2 = () => {
	return (
		<section className="flex flex-col gap-4 rounded-[16px] border-[1px] border-[#FFFFFF] bg-[#F7F9FB] px-[40px] py-[30px] shadow-[0_8px_10px_-6px_#0000000D]">
			<h1 className="font-montserrat text-[20px] font-medium leading-[22px]">
				Раздел в разработке
			</h1>
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
		</section>
	);
};
