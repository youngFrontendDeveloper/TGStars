import Link from "next/link";

import FooterArrow from "@/public/assets/icons/footer-arrow.svg";

import Logo from "../../ui/logo/logo";

export const Footer = () => {
	return (
		<footer
			className="w-full lg:mt-[62px]"
			// style={{
			// 	gridTemplateColumns: "1fr 670px 1fr",
			// }}
		>
			{/* <footer
			className="flex w-full flex-col items-center justify-center gap-[24px] px-[16px] py-[32px] lg:mt-[62px] lg:grid lg:gap-0 lg:px-[50px] lg:py-[8px]"
			style={{
				gridTemplateColumns: "1fr 670px 1fr",
			}}
		> */}
			<div
				className="mx-auto flex h-[231px] w-full max-w-[1920px] flex-col items-center mt-[48px] lg:mt-0 lg:justify-center gap-[24px] lg:grid lg:h-[46px] lg:gap-0 lg:px-[50px] lg:py-0"
				style={{
					gridTemplateColumns: "1fr 690px 1fr",
				}}
			>
				<div className="flex items-center justify-center lg:justify-start">
					<Logo width={162.77} height={30} />
				</div>
				<div className="flex w-full flex-col items-center justify-center gap-[16px] py-[6px] lg:flex-row lg:gap-[20px] lg:py-0">
					<Link
						href={"https://t.me/TGStarsSupport"}
						target="_blank"
						className="font-montserrat flex items-center gap-[4px] text-[16px]/[22.8px] font-medium text-[#95A0A7]"
					>
						Связаться с нами
						<FooterArrow />
					</Link>
					<Link
						href={"/public-offer"}
						className="font-montserrat flex items-center gap-[4px] text-[16px]/[22.8px] font-medium text-[#95A0A7]"
					>
						Публичная оферта
						<FooterArrow />
					</Link>
					<Link
						href={"/privacy-policy"}
						className="font-montserrat flex items-center gap-[4px] text-[16px]/[22.8px] font-medium text-[#95A0A7]"
					>
						Политика конфиденциальности
						<FooterArrow />
					</Link>
				</div>
			</div>
		</footer>
	);
};
