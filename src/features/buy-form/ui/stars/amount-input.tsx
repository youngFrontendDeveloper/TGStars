"use client";

import { useEffect, useState } from "react";

interface AmountInputProps {
	label: string;
	placeholder: string;
	currency: string;
	value?: string;
	onChange?: (value: string) => void;
	quickAmounts?: number[];
	onQuickAmountClick?: (amount: number) => void;
	children?: React.ReactNode;
	debounceDelay?: number;
	additionalLabel?: string;
	additionalLabelLink?: string;
	additionalLabelIcon?: React.ComponentType<{ className?: string }>;
	strikeValue?: string;
}

export const AmountInput = ({
	label,
	placeholder,
	currency,
	value = "",
	onChange,
	quickAmounts = [500, 1000],
	onQuickAmountClick,
	children,
	debounceDelay = 300,
	additionalLabel,
	additionalLabelLink,
	additionalLabelIcon,
	strikeValue,
}: AmountInputProps) => {
	const [internalValue, setInternalValue] = useState(value);
	const AdditionalLabelIcon = additionalLabelIcon;

	const [isExternal, setIsExternal] = useState(false);

	useEffect(() => {
		setIsExternal(true);
		setInternalValue(value);
	}, [value]);

	useEffect(() => {
		if (isExternal) {
			setIsExternal(false);
			return;
		}

		const t = setTimeout(() => {
			onChange?.(internalValue);
		}, debounceDelay);

		return () => clearTimeout(t);
	}, [internalValue, isExternal, onChange, debounceDelay]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value;
		const normalized = raw.replace(",", ".");

		if (normalized === "" || /^\d*\.?\d*$/.test(normalized)) {
			setInternalValue(normalized);
		}
	};

	const handleQuickAmountClickLocal = (amount: number) => {
		setInternalValue(amount.toString());
		onQuickAmountClick?.(amount);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Escape") setInternalValue("");
	};

	const displayCurrency = currency === "₽" ? "Руб" : currency;

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-start justify-between">
				<p className="font-mts-text text-[14px]/[100%] font-medium text-black">
					{label}
				</p>
				{additionalLabel && additionalLabelLink && (
					<a
						href={additionalLabelLink}
						className="font-mts-text inline-flex items-center gap-1 text-[14px] font-[500] leading-none text-[#95A0A7]"
					>
						{additionalLabel}
						{AdditionalLabelIcon && (
							<span className="inline-flex h-3 w-3 items-center justify-center">
								<AdditionalLabelIcon className="h-3 w-3 shrink-0" />
							</span>
						)}
					</a>
				)}
			</div>

			<div className="relative flex items-center gap-1 rounded-xl bg-[#EAEEF0] px-4 py-2.5 transition-colors">
				<input
					placeholder={placeholder}
					value={internalValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					className="font-mts-wide w-[calc(100%-35px)] bg-transparent py-1.5 text-[16px]/[22.8px] font-bold text-[#1D2123] outline-none placeholder:text-[#95A0A7]"
					type="text"
					inputMode="decimal"
				/>

				<div className="flex items-center gap-2">
					{strikeValue && (
						<span className="font-mts-text whitespace-nowrap text-[12px] font-medium text-[#95A0A7] line-through">
							{strikeValue}
						</span>
					)}
					<p className="font-mts-wide text-[16px]/[22.8px] font-bold text-[#95A0A7]">
						{displayCurrency}
					</p>
				</div>
			</div>

			{!children && quickAmounts.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{quickAmounts.map((amount) => (
						<button
							key={amount}
							type="button"
							onClick={() => handleQuickAmountClickLocal(amount)}
							className="font-mts-text rounded-xl bg-[#2C6FFF1A] px-3 py-1.5 text-[16px]/[22.8px] font-medium text-[#6F2CFF] transition-colors hover:bg-[#6F2CFF33]"
						>
							{amount} {currency === "₽" ? "₽" : ""}
						</button>
					))}
				</div>
			)}

			{children}
		</div>
	);
};
