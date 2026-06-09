"use client";

import { createToaster, Toast, Toaster } from "@ark-ui/react";
import { useEffect, useRef, useState } from "react";

import { getReferralsInfo } from "@/features/auth";
import { Button } from "@/shared/components/ui/button";
import { useUser } from "@/shared/layouts/auth-provider/auth-provider";

import Copy from "@/public/assets/icons/copy.svg";
import People from "@/public/assets/icons/people.svg";
import TgStar from "@/public/assets/icons/tg-star.svg";
import defaultUser from "@/public/assets/images/user.png";

type ToastProps = {
	title: string;
	description: string;
	id: string;
	type?: "success" | "error" | "warning" | "info";
};
// const resolveAvatarUrl = (url?: string | null): string | null => {
// 	if (!url) return null;
// 	if (url.startsWith("data:")) return url;
// 	if (url.startsWith("http")) return url;
// 	if (url.startsWith("/")) return `https://tg-stars.ru${url}`;
// 	return null;
// };

const resolveAvatarUrl = (url?: string | null): string | undefined => {
	if (!url) return undefined;
	if (url.startsWith("data:")) return url;
	if (url.startsWith("http")) return url;
	if (url.startsWith("/")) return `https://tg-stars.ru${url}`;
	return undefined;
};
export const Profile = () => {
	const { user } = useUser();
	const levels = [
		{ name: "Silver", percent: 1, textClass: "text-[#A8B4D4]" },
		{ name: "Emerald", percent: 2, textClass: "text-[#2DDFCA]" },
		{ name: "Gold", percent: 3, textClass: "text-[#FEDB51]" },
		{ name: "Diamond", percent: 4, textClass: "text-[#7FDCFF]" },
		{ name: "Amethyst", percent: 5, textClass: "text-[#E274FF]" },
		{ name: "Legend", percent: 6, textClass: "text-[#FF5C3B]" },
	];
	let currentLevel = levels[0];
	for (const level of levels) {
		if ((user?.discount_percent ?? 0) >= level.percent) {
			currentLevel = level;
		}
	}

	const [refState, setRefState] = useState<
		| {
				referral_link?: string;
				referral_balance?: number;
				can_withdraw?: boolean;
				referrals_count?: number;
				min_withdraw?: number;
		  }
		| undefined
	>(undefined);

	const [copySuccess, setCopySuccess] = useState("");
	const [avatarError, setAvatarError] = useState(false);

	const toaster = useRef(
		createToaster({
			placement: "bottom-end",
			overlap: true,
			gap: 24,
		}),
	);

	const copyToClipboard = async () => {
		if (!refState?.referral_link) return;
		try {
			await navigator.clipboard.writeText(refState.referral_link);
			setCopySuccess("Скопировано!");
			setTimeout(() => setCopySuccess(""), 2000);
		} catch (error) {
			console.error("Ошибка копирования:", error);
			setCopySuccess("Ошибка!");
		}
	};

	useEffect(() => {
		const getData = async () => {
			const data = await getReferralsInfo();
			setRefState(data);
		};

		getData();
	}, []);

	useEffect(() => {
		setAvatarError(false);
	}, [user?.avatar_url]);

	const handleWithdraw = async () => {
		console.log("response");

		if ((refState?.referral_balance || 0) < (refState?.min_withdraw || 0)) {
			toaster?.current.error({
				title: "Ошибка",
				description: `Можно вывести минимум ${refState?.min_withdraw} звезд`,
			});
			return;
		}

		// const res = await fetch("https://tg-stars.ru/api/referral/withdraw");
		const res = await fetch("https://tg-stars.ru/api/referral/withdraw", {
			method: "POST",
		});
		const data = await res.json();

		console.log(data);

		if (data.success) {
			const newRefferalBalance =
				(refState?.referral_balance || 0) - (data.stars_count || 0);
			setRefState({ ...refState, referral_balance: newRefferalBalance });
			toaster.current.success({
				title: "Успешно ",
				description:
					"Заказ на вывод 450 звезд создан. Звезды будут отправлены на @my_username в течение нескольких минут.",
				type: "success",
			});
		} else {
			toaster.current.error({
				title: "Ошибка",
				description: "Произошла ошибка на сервере, попробуйте позже",
			});
		}
	};

	const resolvedAvatar = resolveAvatarUrl(user?.avatar_url);
	const showAvatar = resolvedAvatar && !avatarError;

	return (
		<section className="flex flex-col gap-5">
			<h2 className="font-mts-extended text-xl/[22px] font-medium text-black">
				Профиль
			</h2>
			<div className="flex w-full flex-col gap-[2px] rounded-[16px] bg-[#E1E8F0] shadow-[0px_0px_11px_0px_#00000005] overflow-hidden sm:flex-row">
				<div className="flex flex-col items-center justify-between gap-6 border-b bg-[#F7F9FB] border-[#F2F4F4] p-6 sm:w-[200px] sm:border-r sm:px-4 sm:py-6">
					<div className="flex flex-col items-center gap-4">
						<div className="relative z-0 h-[78px] w-[78px] rounded-full">
							<div
								className="absolute -z-10 h-full w-full rounded-full blur-sm"
								style={{
									background:
										"linear-gradient(90deg, #2563EB 0%, #9333EA 100%)",
								}}
							/>
							{showAvatar ? (
								<img
									src={resolvedAvatar}
									alt={user?.first_name || ""}
									width={78}
									height={78}
									className="h-full w-full rounded-full object-cover"
									onError={() => setAvatarError(true)}
								/>
							) : (
								<img
									src={defaultUser.src}
									alt={user?.first_name || ""}
									width={78}
									height={78}
									className="h-full w-full rounded-full object-cover"
								/>
							)}
						</div>
						<p className="font-mts-wide text-lg/[100%] font-bold text-[#95A0A7]">
							{user?.first_name}
						</p>
					</div>
					<div className="flex w-[170px] flex-col gap-1 sm:w-full">
						<div className="flex items-center justify-between">
							<p className="table-text py-0">Куплено:</p>
							<p className="table-text flex items-center gap-0.5 py-0">
								{user?.total_stars || 0} <TgStar />
							</p>
						</div>
						<div className="flex items-center justify-between">
							<p className="table-text py-0">Уровень:</p>
							<p
								className={`table-text font-mts-wide py-0 font-bold uppercase ${currentLevel.textClass}`}
							>
								{currentLevel.name}
							</p>
						</div>
					</div>
				</div>
				<div className="flex flex-1 flex-col gap-4 p-6 bg-[#F7F9FB] sm:gap-8 sm:px-4 sm:py-6">
					<div className="flex flex-col gap-2">
						<p className="font-mts-text text-sm/[100%] font-medium text-black">
							Ваша реферальная ссылка:
						</p>
						<div className="flex w-full items-center justify-between gap-2 rounded-xl bg-[#F2F4F5] px-4 sm:px-2">
							<div className="flex w-[333px] flex-1 items-center gap-2">
								<People />
								<p className="table-text max-w-[333px] overflow-hidden text-ellipsis text-nowrap">
									{refState?.referral_link}
								</p>
							</div>
							<div className="relative">
								<button
									onClick={copyToClipboard}
									className="h-5 w-5 cursor-pointer transition-opacity hover:opacity-80"
									title="Копировать ссылку"
								>
									<Copy />
								</button>

								{copySuccess && (
									<div className="absolute -top-8 right-4 translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white">
										{copySuccess}
									</div>
								)}
							</div>
						</div>
						<div className="flex flex-col gap-2 sm:flex-row">
							<div className="flex w-full justify-between rounded-xl bg-[#F2F4F5] px-2">
								<p className="table-text">Реферальный баланс:</p>
								<p className="table-text flex items-center gap-0.5">
									{refState?.referral_balance || 0} <TgStar />
								</p>
							</div>
							<Button className="w-[97px]" onClick={handleWithdraw}>
								Вывести
							</Button>
							<Toaster toaster={toaster.current}>
								{(toast: ToastProps) => (
									<Toast.Root
										key={toast.id}
										className="flex w-[300px] flex-col gap-3 rounded-2xl border border-[#F2F4F4] bg-white p-4"
									>
										<Toast.Title className="font-mts-text text-lg/[100%] font-medium">
											{toast.title}
										</Toast.Title>
										<Toast.Description className="font-mts-text text-sm/[16px] font-normal text-[#95A0A7] sm:text-base/[22px]">
											{toast.description}
										</Toast.Description>
									</Toast.Root>
								)}
							</Toaster>
						</div>
						<p className="font-mts-text flex flex-col text-sm/[22px] font-normal text-[#95A0A7] sm:text-base/[22px]">
							Приглашено друзей: {refState?.referrals_count}
						</p>
					</div>
					<p className="font-mts-text flex flex-col text-sm/[22px] font-normal text-[#95A0A7] sm:text-base/[22px]">
						Присоединяйтесь к нашей реферальной программе — делитесь своей
						уникальной ссылкой с друзьями и получайте 5% от их покупок в Звездах
						на ваш реферальный баланс!
					</p>
				</div>
			</div>
		</section>
	);
};
