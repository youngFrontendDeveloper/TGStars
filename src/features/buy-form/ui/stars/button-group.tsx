"use client";

import Star from "@/public/assets/icons/star.svg";

interface ButtonGroupProps {
	amounts: number[];
	onAmountClick: (amount: number) => void;
}

export const ButtonGroup = ({ amounts, onAmountClick }: ButtonGroupProps) => {
	return (
		<div className="flex flex-wrap gap-[8px]">
			{amounts.map((amount) => (
				<button
					key={amount}
					onClick={() => onAmountClick(amount)}
					className="font-montserrat flex h-[39px] w-[86px] md:w-fit items-center gap-[4px] rounded-[12px] bg-[#6F2CFF1A] px-[12px] py-[6px] text-[16px]/[22.8px] font-semibold text-[#8D00D0] transition-colors hover:bg-[#6F2CFF33]"
				>
					{amount} <Star className="pink-icon h-[16px] w-[16px]" />
				</button>
			))}
		</div>
	);
};
