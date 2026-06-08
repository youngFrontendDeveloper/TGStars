"use client";

import Star from "@/public/assets/icons/star.svg";

interface ButtonGroupProps {
	amounts: number[];
	onAmountClick: (amount: number) => void;
}

export const ButtonGroup = ({ amounts, onAmountClick }: ButtonGroupProps) => {
	return (
		<div className="flex flex-wrap gap-2">
			{amounts.map((amount) => (
				<button
					key={amount}
					onClick={() => onAmountClick(amount)}
					className="font-mts-text flex items-center gap-1 rounded-xl bg-[#6F2CFF1A] px-3 py-1.5 text-base/[22px] font-medium text-[#8D00D0] transition-colors hover:bg-[#6F2CFF33]"
				>
					{amount} <Star className="pink-icon h-4 w-4" />
				</button>
			))}
		</div>
	);
};
