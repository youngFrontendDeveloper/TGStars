import Image from "next/image";
import Link from "next/link";
import FooterArrow from "@/public/assets/icons/footer-arrow.svg";

export const Footer = () => {
	return (
		<footer
			className="flex w-full flex-col items-center gap-6 px-4 py-[32px] lg:grid lg:gap-0 lg:px-[50px] lg:py-2"
			style={{
				gridTemplateColumns: "1fr 670px 1fr",
			}}
		>
			<div className="flex items-center justify-center lg:justify-start">
				<Image
					src="/assets/icons/logo.svg"
					alt="TGStars"
					width={150}
					height={28}
				/>
			</div>
			<div className="flex w-full max-w-[670px] flex-col items-center justify-center gap-5 py-1.5 lg:flex-row lg:justify-end lg:py-1">
				<Link
					href={"https://t.me/TGStarsSupport"}
					className="font-mts-text flex items-center gap-1 text-base/[22px] font-medium text-[#95A0A7]"
				>
					Связаться с нами
					<FooterArrow />
				</Link>
				<Link
					href={"/public-offer"}
					className="font-mts-text flex items-center gap-1 text-base/[22px] font-medium text-[#95A0A7]"
				>
					Публичная оферта
					<FooterArrow />
				</Link>
				<Link
					href={"/privacy-policy"}
					className="font-mts-text flex items-center gap-1 text-base/[22px] font-medium text-[#95A0A7]"
				>
					Политика конфиденциальности
					<FooterArrow />
				</Link>
			</div>
		</footer>
	);
};