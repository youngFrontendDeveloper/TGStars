import { useEffect, useRef, useState } from "react";

import Card from "@/public/assets/icons/card.svg";
import Sber from "@/public/assets/icons/sber.svg";
import SBP from "@/public/assets/icons/sbp.svg";
import SelectArrow from "@/public/assets/icons/select-arrow.svg";

import { type PaymentType } from "../payment/payment";

type PaymentOption = {
	icon: React.ReactNode;
	title: string;
	desc: string;
	value: PaymentType;
};

type Props = {
	payment: PaymentType | undefined;
	setPayment: (val: PaymentType) => void;
};

export const PaymentSelect = ({ payment, setPayment }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const selectRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	const paymentOptions: PaymentOption[] = [
		{
			icon: <SBP />,
			title: "СБП",
			desc: "Быстрая оплата из приложения банка",
			value: "sbp",
		},
		{
			icon: <Card />,
			title: "Карта",
			desc: "Оплата по карте с вводом реквизитов",
			value: "card",
		},
		// {
		// 	icon: <Crypto />,
		// 	title: "Криптовалюта",
		// 	desc: "Оплата в USDT / BTC / ETH",
		// 	value: "crypto",
		// },
		{
			icon: <Sber />,
			title: "SberPay",
			desc: "Удобная оплата через SberPay",
			value: "sberpay",
		},
	];

	const selectedItem = payment
		? paymentOptions.find((item) => item.value === payment)
		: undefined;

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

	const handleOptionClick = (option: PaymentOption) => {
		setPayment(option.value);
		setIsOpen(false);
	};

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="flex flex-col gap-[8px]" ref={selectRef}>
			<p className="font-mts-wide text-[14px]/[100%] font-semibold text-black">
				Способ оплаты
			</p>
			<div className="relative flex flex-col items-center">
				<button
					type="button"
					onClick={toggleDropdown}
					className={`flex h-[65px] w-full items-center justify-between rounded-xl bg-[#EAEEF0] px-4 py-3 outline-none transition-colors ${isOpen && "md:w-[620px]"} hover:md:w-[620px]`}
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
					<div className="flex items-center gap-3">
						{selectedItem && selectedItem.icon}
						<div className="flex flex-col items-start">
							<p className="font-mts-wide text-left text-[16px]/[22.8px] font-semibold text-black">
								{selectedItem ? selectedItem.title : "Выберите метод оплаты"}
							</p>
						</div>
					</div>
					<SelectArrow
						className={`h-5 w-5 transition-transform duration-200`}
					/>
				</button>

				{isOpen && (
					<div
						ref={contentRef}
						className="z-[100] absolute top-[65px] mt-2 w-full rounded-xl bg-white py-2 shadow-lg md:w-[620px]"
					>
						<div className="w-full">
							{paymentOptions.map((item) => (
								<button
									type="button"
									key={item.value}
									onClick={() => handleOptionClick(item)}
									className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-[#F8FAFC] ${payment === item.value ? "bg-[#F8FAFC]" : ""}`}
								>
									<div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3">
										<div className="flex items-center justify-start gap-2">
											{item.icon}
											<p className="font-mts-wide block w-max text-[16px]/[22.8px] font-semibold text-black sm:hidden">
												{item.title}
											</p>
										</div>
										<div className="flex flex-col items-start">
											<p className="font-mts-widet hidden text-[16px]/[22.8px] font-semibold text-black sm:block">
												{item.title}
											</p>
											<p className="font-mts-text text-left text-[16px]/[22.8px] font-medium text-[#95A0A7]">
												{item.desc}
											</p>
										</div>
									</div>
								</button>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
