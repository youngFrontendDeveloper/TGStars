import { useEffect, useRef, useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { useUser } from "@/shared/layouts/auth-provider/auth-provider";

import ErrorIcon from "@/public/assets/icons/error.svg";
import TonIcon from "@/public/assets/icons/ton.svg";
import UnvalidIcon from "@/public/assets/icons/unvalid.svg";
import ValidIcon from "@/public/assets/icons/valid.svg";

import { calculateTon, getTonSettings, type TonSettings } from "../../api/api";
import { getDiscount } from "../../utils/get-discount";
import { PRICE_BUTTONS } from "../constants";
import { AmountInput } from "../stars/amount-input";

const roundTo = (value: number, decimals: number) => {
	const factor = 10 ** decimals;
	return Math.round(value * factor) / factor;
};

const formatNumber = (value: number, decimals: number) => {
	const fixed = roundTo(value, decimals).toFixed(decimals);
	if (decimals === 0) return fixed;
	return fixed.replace(/\.?0+$/, "");
};

const TON_DISABLED_ERROR = "Покупка TON временно недоступна";

const isValidTonAddress = (value: string) => {
	const trimmed = value.trim();
	if (!trimmed) return false;
	const raw = /^0:[\dA-Fa-f]{64}$/;
	const base64 = /^(UQ|EQ|kQ)[\w-]{40,}$/;
	return raw.test(trimmed) || base64.test(trimmed);
};

type Props = {
	onBuyClick: (
		amountRub: number,
		tonAmount: number,
		walletAddress: string,
	) => void;
};

export const Ton = ({ onBuyClick }: Props) => {
	const [payAmount, setPayAmount] = useState("");
	const [receiveAmount, setReceiveAmount] = useState("");
	const [walletAddress, setWalletAddress] = useState("");
	const [error, setError] = useState("");
	const [settings, setSettings] = useState<TonSettings | undefined>(undefined);
	const [isLoadingSettings, setIsLoadingSettings] = useState(true);
	const [isCalculating, setIsCalculating] = useState(false);
	const calcRequestId = useRef(0);
	const ignoreNextPayChangeRef = useRef(false);
	const ignoreNextReceiveChangeRef = useRef(false);

	const { user, isAuthenticated } = useUser();
	const discountPercent = isAuthenticated
		? getDiscount(user?.total_spent || 0)
		: 0;
	const discountFactor = 1 - discountPercent / 100;
	const hasDiscount = discountPercent > 0;

	const addressValid = isValidTonAddress(walletAddress);
	const hasAddress = walletAddress.trim().length > 0;

	useEffect(() => {
		let isMounted = true;
		const loadSettings = async () => {
			setIsLoadingSettings(true);
			try {
				const data = await getTonSettings();
				if (isMounted) {
					setSettings(data);
					if (!data.ton_enabled) {
						setError(TON_DISABLED_ERROR);
					}
				}
			} catch {
				if (isMounted) {
					setError("Не удалось загрузить настройки TON");
				}
			} finally {
				if (isMounted) setIsLoadingSettings(false);
			}
		};
		loadSettings();
		return () => {
			isMounted = false;
		};
	}, []);

	const applyPayChange = async (v: string) => {
		if (error !== TON_DISABLED_ERROR) {
			setError("");
		}
		setPayAmount(v);
		if (v.endsWith(".")) return;
		const payValue = Number(v);
		if (!v || Number.isNaN(payValue)) {
			ignoreNextReceiveChangeRef.current = true;
			setReceiveAmount("");
			return;
		}
		const baseAmount =
			discountFactor > 0 ? payValue / discountFactor : payValue;
		calcRequestId.current += 1;
		const requestId = calcRequestId.current;
		setIsCalculating(true);
		try {
			const data = await calculateTon(baseAmount);
			if (requestId !== calcRequestId.current) return;
			if (data?.success) {
				const ton = formatNumber(data.ton_amount, 2);
				if (ton !== receiveAmount) {
					ignoreNextReceiveChangeRef.current = true;
					setReceiveAmount(ton);
				}
				if (settings && settings.ton_rate_rub !== data.ton_rate_rub) {
					setSettings((prev) =>
						prev
							? {
									...prev,
									ton_rate_rub: data.ton_rate_rub,
									ton_min_purchase_rub:
										prev.ton_min_purchase_ton * data.ton_rate_rub,
								}
							: prev,
					);
				}
			} else {
				setError(
					(data as { error?: string })?.error || "Не удалось рассчитать сумму",
				);
			}
		} catch {
			if (requestId === calcRequestId.current) {
				setError("Не удалось рассчитать сумму");
			}
		} finally {
			if (requestId === calcRequestId.current) setIsCalculating(false);
		}
	};

	const handlePayChange = async (v: string) => {
		if (ignoreNextPayChangeRef.current) {
			ignoreNextPayChangeRef.current = false;
			return;
		}
		await applyPayChange(v);
	};

	const handleReceiveChange = (v: string) => {
		if (ignoreNextReceiveChangeRef.current) {
			ignoreNextReceiveChangeRef.current = false;
			return;
		}
		if (error !== TON_DISABLED_ERROR) {
			setError("");
		}
		setReceiveAmount(v);
		if (v.endsWith(".")) return;
		const ton = Number(v);
		if (!v || Number.isNaN(ton)) {
			ignoreNextPayChangeRef.current = true;
			setPayAmount("");
			return;
		}
		if (!settings?.ton_rate_rub) return;
		const baseAmount = ton * settings.ton_rate_rub;
		const discountedPay = formatNumber(baseAmount * discountFactor, 0);
		if (discountedPay !== payAmount) {
			ignoreNextPayChangeRef.current = true;
			setPayAmount(discountedPay);
		}
	};

	const handleQuickPrice = (amount: number) => {
		ignoreNextPayChangeRef.current = true;
		const discountedPay = formatNumber(amount * discountFactor, 0);
		void applyPayChange(discountedPay);
	};

	const handleSubmit = () => {
		if (error !== TON_DISABLED_ERROR) {
			setError("");
		}
		const payValue = Number(payAmount);
		const ton = Number(receiveAmount);
		const baseAmount =
			discountFactor > 0 ? payValue / discountFactor : payValue;

		if (settings && !settings.ton_enabled) {
			setError(TON_DISABLED_ERROR);
			return;
		}
		if (!payAmount || !receiveAmount) {
			setError("Введите сумму");
			return;
		}
		if (
			Number.isNaN(payValue) ||
			payValue <= 0 ||
			Number.isNaN(ton) ||
			ton <= 0
		) {
			setError("Введите корректную сумму");
			return;
		}
		if (!addressValid) {
			setError("Введите корректный адрес кошелька TON");
			return;
		}

		if (settings) {
			if (ton < settings.ton_min_purchase_ton) {
				setError(
					`Минимальная покупка: ${settings.ton_min_purchase_ton} TON (${formatNumber(settings.ton_min_purchase_rub, 0)} ₽)`,
				);
				return;
			}
			if (
				typeof settings.ton_max_purchase_rub === "number" &&
				baseAmount > settings.ton_max_purchase_rub
			) {
				setError(
					`Максимальная сумма покупки: ${formatNumber(settings.ton_max_purchase_rub, 0)} ₽`,
				);
				return;
			}
		}

		onBuyClick(baseAmount, ton, walletAddress.trim());
	};

	const isFormReady =
		payAmount &&
		receiveAmount &&
		walletAddress &&
		addressValid &&
		!isLoadingSettings &&
		(settings?.ton_enabled ?? true);

	return (
		<>
			<div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-4">
				<AmountInput
					label="Вы заплатите"
					placeholder="1000"
					currency="₽"
					value={payAmount}
					onChange={handlePayChange}
					quickAmounts={PRICE_BUTTONS}
					onQuickAmountClick={handleQuickPrice}
					debounceDelay={500}
					strikeValue={
						hasDiscount && payAmount && !Number.isNaN(Number(payAmount))
							? `${formatNumber(Number(payAmount) / discountFactor, 0)} ₽`
							: undefined
					}
				/>

				<AmountInput
					label="Вы получите"
					placeholder="0"
					currency="TON"
					value={receiveAmount}
					onChange={handleReceiveChange}
					debounceDelay={500}
					quickAmounts={[]}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<p className="font-mts-text text-[14px]/[100%] font-medium text-black">
					Адрес кошелька TON
				</p>
				<div className="flex items-center gap-2 rounded-xl bg-[#EAEEF0] px-4 py-2.5">
					<TonIcon className="h-5 w-5 shrink-0 text-[#95A0A7]" />
					<input
						placeholder="Введите адрес кошелька TON..."
						value={walletAddress}
						onChange={(e) => setWalletAddress(e.target.value)}
						className="font-mts-wide w-full bg-transparent py-1.5 text-[16px]/[22.8px] font-medium text-[#1D2123] outline-none placeholder:text-[#95A0A7]"
					/>
					{hasAddress && addressValid && (
						<ValidIcon className="h-5 w-5 shrink-0 text-[#22c55e]" />
					)}
					{hasAddress && !addressValid && (
						<UnvalidIcon className="h-5 w-5 shrink-0 text-[#ef4444]" />
					)}
				</div>
			</div>

			{error && (
				<div className="flex items-center gap-1">
					<ErrorIcon />
					<p className="font-mts-text text-[14px]/[100%] font-medium text-[#FF5863]">
						{error}
					</p>
				</div>
			)}

			<Button
				className="relative -top-[1px] mb-[24px] w-full justify-center px-6 md:w-max lg:mb-[33px]"
				onClick={handleSubmit}
				disabled={!isFormReady || isCalculating}
			>
				Купить TON
			</Button>

			<p className="font-mts-text relative -top-[3px] text-center text-[14px] leading-[22.8px] text-[#95A0A7] lg:text-[16px]">
				Среднее время перевода TON составляет 1 минуту. В случае неполадок со
				стороны TON Network возможны задержки перевода.
			</p>
		</>
	);
};
