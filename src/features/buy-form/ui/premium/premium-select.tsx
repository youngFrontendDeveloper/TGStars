import { useEffect, useRef, useState } from "react";

import PremuimIcon from "@/public/assets/icons/premium.svg";
import SelectArrow from "@/public/assets/icons/select-arrow.svg";

import { type PremiumPrice } from "../../types/buy-form.type";

type Props = {
	data: PremiumPrice[];
	value: string;
	onValueChange: (value: string) => void;
	placeholder?: string;
};

export const PremiumSelect = ({
	data,
	value,
	onValueChange,
	placeholder = "Выберите нужный тариф",
}: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState<
		PremiumPrice | undefined
	>(() => data.find((item) => String(item.months) === value) || undefined);
	const selectRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				selectRef.current &&
				!selectRef.current.contains(event.target as Node) &&
				contentRef.current &&
				!contentRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		const option =
			data.find((item) => String(item.months) === value) || undefined;
		setSelectedOption(option);
	}, [value, data]);

	const handleOptionClick = (item: PremiumPrice) => {
		onValueChange(String(item.months));
		setSelectedOption(item);
		setIsOpen(false);
	};

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="relative flex flex-col items-center" ref={selectRef}>
			<button
				type="button"
				onClick={toggleDropdown}
				className={`md:[16px] flex w-full items-center justify-between rounded-[12px] border-none bg-[#F2F4F5] px-[16px] outline-none transition-all py-[12px] md:hover:w-[620px] ${isOpen && "md:w-[620px]"}`}
				style={{
					transition: "0.4s",
					boxShadow: isOpen
						? "0px 10px 15px 0px rgba(0, 0, 0, 0.2)"
						: "0px 10px 15px 0px rgba(0, 0, 0, 0.1)",
				}}
				onMouseEnter={(e) => {
					if (!isOpen) {
						e.currentTarget.style.boxShadow =
							"0px 10px 15px 0px rgba(0, 0, 0, 0.2)";
					}
				}}
				onMouseLeave={(e) => {
					if (!isOpen) {
						e.currentTarget.style.boxShadow =
							"0px 10px 15px 0px rgba(0, 0, 0, 0.1)";
					}
				}}
			>
				<div className="flex items-center gap-[12px]">
					<PremuimIcon className="h-auto w-[22px] md:w-[27px]" />
					<div className="flex flex-col items-start">
						<p className="font-montserrat text-left text-[16px]/[20.8px] font-semibold text-black">
							{selectedOption
								? `${selectedOption.months} месяцев`
								: placeholder}
						</p>
						<p className="font-montserrat text-left text-[14px]/[20.8px] font-medium text-[#95A0A7]">
							Telegram Premium
						</p>
					</div>
				</div>
				<SelectArrow className={`h-5 w-5 transition-transform duration-200`} />
			</button>

			{isOpen && (
				<div
					ref={contentRef}
					className="absolute top-[65px] z-[100] mt-2 w-full rounded-[12px] bg-white py-2 shadow-lg md:w-[620px]"
				>
					<div className="w-full">
						{data.map((item) => {
							const monthlyPrice = Math.round(item.price / item.months);
							return (
								<button
									type="button"
									key={item.months}
									onClick={() => handleOptionClick(item)}
									className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-[#F8FAFC] ${selectedOption?.months === item.months ? "bg-[#F8FAFC]" : ""}`}
								>
									<div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3">
										<div className="flex items-center gap-2">
											<PremuimIcon />
											<p className="font-montserrat block text-[16px]/[22.8px] font-medium text-black sm:hidden">
												{item.months} месяцев
											</p>
										</div>
										<div className="flex flex-col items-start">
											<p className="font-montserrat hidden text-[16px]/[22.8px] font-medium text-black sm:block">
												{item.months} месяцев
											</p>
											<p className="font-montserrat text-[14px]/[20.75px] font-medium text-[#95A0A7] sm:text-[16px]/[22.8px]">
												Telegram Premium
											</p>
										</div>
									</div>
									<div className="flex flex-col items-end gap-1 sm:gap-0">
										<p className="font-montserrat text-[16px]/[22.8px] font-medium text-[#8B5CF6]">
											{Math.round(item.price)}₽
										</p>
										<p className="font-montserrat text-[14px]/[20.75px] font-medium text-[#95A0A7] sm:text-[16px]/[22.8px]">
											{monthlyPrice}₽ в месяц
										</p>
									</div>
								</button>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};
