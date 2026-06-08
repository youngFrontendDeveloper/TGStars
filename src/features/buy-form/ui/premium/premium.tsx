import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { type PremiumPrice } from "../../types/buy-form.type";
import { UsernameInput } from "../username-input";
import { PremiumSelect } from "./premium-select";

type Props = {
	data: PremiumPrice[];
	username: string;
	setUsername: (value: string) => void;
	onBuyClick: (amount: number, value: number) => void;
};

export const Premium = ({ data, setUsername, username, onBuyClick }: Props) => {
	const [error, setError] = useState("");
	const [premiumState, setPremiumState] = useState("");
	const [isValidUsername, setIsValidUsername] = useState(false);

	const handleSubmit = () => {
		if (!premiumState || !username) {
			setError("Заполните все поля");
			return;
		}
		if (!isValidUsername) {
			setError("Указанного аккаунта не существует.");
			return;
		}
		const selectedPackage = data.find(
			(el) => String(el.months) === premiumState,
		);
		if (!selectedPackage) {
			setError("Выберите тариф");
			return;
		}
		onBuyClick(selectedPackage.price, selectedPackage.months);
	};

	return (
		<>
			<div className="flex flex-col gap-2">
				<p className="font-mts-text text-sm/[100%] font-medium text-black">
					Выберите подписку
				</p>
				<PremiumSelect
					data={data}
					value={premiumState}
					onValueChange={setPremiumState}
				/>
			</div>
			<UsernameInput
				setError={setError}
				value={username}
				onChange={setUsername}
				error={error}
				setValid={setIsValidUsername}
			/>
			<Button
				className="w-full justify-center px-6 sm:w-max"
				onClick={handleSubmit}
				disabled={!premiumState || !username}
			>
				Купить Premium
			</Button>
			<p className="font-mts-text text-base/[22px] text-center text-[#95A0A7]">
				Среднее время доставки Premium составляет 1 минуту. В случае неполадок
				со стороны Telegram возможны задержки.<br/>
				Внимание! У получателя не должно быть активной подписки Premium.
			</p>
		</>
	);
};