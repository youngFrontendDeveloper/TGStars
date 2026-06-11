import { useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { useUser } from "@/shared/layouts/auth-provider/auth-provider";

import DiscountIcon from "@/public/assets/icons/discount.svg";
import ErrorIcon from "@/public/assets/icons/error.svg";

import { type StarPrice } from "../../types/buy-form.type";
import { UsernameInput } from "../username-input";
import { AmountInput } from "./amount-input";
import { ButtonGroup } from "./button-group";

type Props = {
	data: StarPrice[];
	discount_percent: number;
	star_rate: number;
	username: string;
	setUsername: (value: string) => void;
	onBuyClick: (amount: number, value: number) => void;
};

const MIN_STARS = 50;
const DEFAULT_STARS = 100;

const makeEven = (n: number) => (n % 2 === 0 ? n : n + 1);
const formatAmount = (value: number) =>
	(Math.floor(value * 1000) / 1000).toString();

export const Stars = ({
	data,
	discount_percent,
	star_rate,
	setUsername,
	username,
	onBuyClick,
}: Props) => {
	const { isAuthenticated, isLoading, user } = useUser();
	const [payAmount, setPayAmount] = useState("");
	const [receiveAmount, setReceiveAmount] = useState("");
	const [usernameError, setUsernameError] = useState("");
	const [starsError, setStarsError] = useState("");
	const [initialized, setInitialized] = useState(false);
	const [isValidUsername, setIsValidUsername] = useState(false);
	const showBonusLink = !isLoading && !isAuthenticated;

	const rate = star_rate * (1 - discount_percent / 100);

	useEffect(() => {
		if (!initialized && rate > 0 && data.length > 0) {
			const defaultPkg = data.find((el) => el.stars === DEFAULT_STARS);
			if (defaultPkg) {
				setReceiveAmount(DEFAULT_STARS.toString());
				setPayAmount(formatAmount(defaultPkg.discounted_price));
			} else {
				const baseAmount = DEFAULT_STARS * rate;
				setReceiveAmount(DEFAULT_STARS.toString());
				setPayAmount(formatAmount(baseAmount));
			}
			setInitialized(true);
		}
	}, [rate, data, initialized]);

	const validateStars = (stars: number) => {
		if (stars > 0 && stars < MIN_STARS) {
			setStarsError(`Минимальное количество звёзд: ${MIN_STARS}`);
		} else {
			setStarsError("");
		}
	};

	const handlePayChange = (v: string) => {
		setPayAmount(v);
		if (v.endsWith(".")) return;
		const payValue = Number(v);
		if (!v || Number.isNaN(payValue)) {
			setReceiveAmount("");
			setStarsError("");
			return;
		}
		let stars = Math.round(payValue / rate);
		stars = makeEven(stars);
		const newVal = stars.toString();
		if (newVal !== receiveAmount) setReceiveAmount(newVal);
		validateStars(stars);
	};

	const handleReceiveChange = (v: string) => {
		const starsRaw = Number(v.split(".")[0]);
		if (!v || Number.isNaN(starsRaw)) {
			setPayAmount("");
			setStarsError("");
			return;
		}
		const stars = Math.floor(starsRaw);
		const evenStr = stars.toString();
		setReceiveAmount(evenStr);

		const pkg = data.find((el) => el.stars === stars);
		if (pkg) {
			setPayAmount(formatAmount(pkg.discounted_price));
		} else {
			setPayAmount(formatAmount(stars * rate));
		}
		validateStars(stars);
	};

	const handleQuickPrice = (amount: number) => {
		setStarsError("");
		const pkg = data.find((el) => el.discounted_price === amount);
		if (!pkg) return;
		setPayAmount(formatAmount(pkg.discounted_price));
		setReceiveAmount(pkg.stars.toString());
	};

	const handleQuickStars = (amount: number) => {
		setStarsError("");
		const pkg = data.find((el) => el.stars === amount);
		if (!pkg) return;
		setReceiveAmount(amount.toString());
		setPayAmount(formatAmount(pkg.discounted_price));
	};

	const handleSubmit = () => {
		const stars = Number(receiveAmount);

		if (!payAmount || !receiveAmount) {
			setStarsError("Введите сумму");
			return;
		}
		if (!username) {
			setUsernameError("Введите имя пользователя");
			return;
		}
		if (!isValidUsername) {
			setUsernameError("Указанного аккаунта не существует.");
			return;
		}
		const payValue = Number(payAmount);
		if (payValue <= 0) {
			setStarsError("Введите корректную сумму");
			return;
		}
		if (stars < MIN_STARS) {
			setStarsError(`Минимальное количество звёзд: ${MIN_STARS}`);
			return;
		}
		onBuyClick(payValue, stars);
	};

	const stars = Number(receiveAmount) || 0;
	const hasStarsError = stars > 0 && stars < MIN_STARS;
	const isValid = payAmount && receiveAmount && username && !hasStarsError;

	return (
		<>
			<div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-4">
				<AmountInput
					label="Вы заплатите"
					placeholder="100"
					currency="₽"
					value={payAmount}
					onChange={handlePayChange}
					quickAmounts={data.slice(0, 3).map((el) => el.discounted_price)}
					onQuickAmountClick={handleQuickPrice}
					debounceDelay={500}
					additionalLabel={showBonusLink ? "Получить скидку" : undefined}
					additionalLabelLink={showBonusLink ? "#bonus" : undefined}
					additionalLabelIcon={showBonusLink ? DiscountIcon : undefined}
				/>

				<AmountInput
					label="Вы получите"
					placeholder="100"
					currency="Stars"
					value={receiveAmount}
					onChange={handleReceiveChange}
					debounceDelay={500}
				>
					<ButtonGroup
						amounts={data.slice(0, 3).map((el) => el.stars)}
						onAmountClick={handleQuickStars}
					/>
				</AmountInput>
			</div>

			{starsError && (
				<div className="flex items-center gap-1">
					<ErrorIcon />
					<p className="font-mts-text text-sm/[100%] font-medium text-[#FF5863]">
						{starsError}
					</p>
				</div>
			)}

			<UsernameInput
				value={username}
				onChange={setUsername}
				error={usernameError}
				setError={setUsernameError}
				setValid={setIsValidUsername}
			/>
			<Button
				className=" mb-[24px] w-[169px] px-6 sm:w-max lg:mb-[33px]"
				// className="relative -top-[1px] mb-[24px] w-full justify-center px-6 sm:w-max lg:mb-[33px]"
				onClick={handleSubmit}
				disabled={!isValid}
			>
				Купить Звёзды
			</Button>
			<p className="font-mts-text relative text-center text-[14px] leading-[22.8px] -tracking-[.2px] text-[#95A0A7] lg:text-[16px]">
				Среднее время зачисления Звёзд составляет 1 минуту. В случае неполадок
				со стороны Telegram возможны задержки в зачислении.
			</p>
		</>
	);
};
