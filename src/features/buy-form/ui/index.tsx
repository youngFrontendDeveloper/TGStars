"use client";

import { memo, useEffect, useState } from "react";

import { useIsMobile } from "@/hooks/use-is-mobile";

import { getBuyFormData } from "../api/api";
import { type BuyFormData } from "../types/buy-form.type";
import { getTabItems } from "./constants";
import { Payment } from "./payment";
import { Premium } from "./premium/premium";
import { Stars } from "./stars/stars";
import { TabSwitcher } from "./tab-switcher";
import { Ton } from "./ton/ton";
import { type SectionType } from "./types";

export const BuyForm = memo(() => {
	const [section, setSection] = useState<SectionType>("stars");
	const [username, setUsername] = useState("");
	const [walletAddress, setWalletAddress] = useState("");
	const [showPayment, setShowPayment] = useState(false);
	const [selectedAmount, setSelectedAmount] = useState<
		{ amount: number; value: number } | undefined
	>(undefined);
	const isMobile = useIsMobile();

	// тестовые данные
	// const [data] = useState({
	// 	discount_percent: 10,
	// 	star_rate: 1,
	// 	premium_prices: [],
	// 	star_prices: [
	// 		{
	// 			stars: 100,
	// 			base_price: 100,
	// 			discounted_price: 90,
	// 			discount_percent: 10,
	// 		},
	// 	],
	// });

	const [data, setData] = useState<BuyFormData>({
		discount_percent: 0,
		star_rate: 0,
		premium_prices: [],
		star_prices: [],
	});

	const handleChangeSection = (value: SectionType) => {
		setSection(value);
		setUsername("");
		setWalletAddress("");
		setShowPayment(false);
	};

	const handleBuyClick = (amount: number, value: number, wallet?: string) => {
		if (amount) {
			setSelectedAmount({ amount, value });
		}
		setWalletAddress(wallet?.trim() || "");
		setShowPayment(true);
	};

	useEffect(() => {
		const fetchData = async () => {
			const stateData = await getBuyFormData();
			setData(stateData);
			// console.log(stateData);
		};
		fetchData();
	}, []);

	return (
		<div className="relative flex w-full flex-col rounded-[16px] border-[1px] border-[#fff] bg-[#F7F9FB] p-[24px] shadow-[0px_0px_11px_0px_#00000005] md:px-[40px] md:py-[30px]">
			{!showPayment && (
				<>
					<TabSwitcher
						items={getTabItems(isMobile)}
						activeTab={section}
						onTabChange={handleChangeSection}
					/>

					{section === "stars" && (
						<Stars
							data={data.star_prices}
							discount_percent={data.discount_percent}
							star_rate={data.star_rate}
							setUsername={setUsername}
							username={username}
							onBuyClick={(amount, value) => handleBuyClick(amount, value)}
						/>
					)}
					{section === "ton" && (
						<Ton
							onBuyClick={(amount, value, wallet) =>
								handleBuyClick(amount, value, wallet)
							}
						/>
					)}
					{section === "premium" && (
						<Premium
							data={data.premium_prices}
							setUsername={setUsername}
							username={username}
							onBuyClick={(amount, value) => handleBuyClick(amount, value)}
						/>
					)}
				</>
			)}

			{showPayment && (
				<Payment
					selectedAmount={selectedAmount}
					section={section}
					username={username}
					walletAddress={walletAddress}
					handleClose={() => {
						// setSection("stars");
						setShowPayment(false);
					}}
				/>
			)}
		</div>
	);
});

BuyForm.displayName = "BuyForm";
