"use client";

import { createToaster, Toast, Toaster } from "@ark-ui/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { getReferralsInfo } from "@/features/auth";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { Button } from "@/shared/components/ui/button";
import { useUser } from "@/shared/layouts/auth-provider/auth-provider";

import Copy from "@/public/assets/icons/copy.svg";
import People from "@/public/assets/icons/people.svg";
import TgStar from "@/public/assets/icons/star-with-border.svg";
import defaultUser from "@/public/assets/images/user.png";

type ToastProps = {
	title: string;
	description: string;
	id: string;
	type?: "success" | "error" | "warning" | "info";
};

const resolveAvatarUrl = (url?: string | null): string | undefined => {
	if (!url) return undefined;
	if (url.startsWith("data:")) return url;
	if (url.startsWith("http")) return url;
	if (url.startsWith("/")) return `https://tg-stars.ru${url}`;
	return undefined;
};
export const Profile = () => {
	const { user } = useUser();
	const isMobile = useIsMobile();
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

		// console.log(data);

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
		<section className="mb-[48px] flex flex-col md:mb-[58px]">
			<h2 className="font-montserrat mb-[20px] text-[20px]/[22.8px] font-semibold text-black">
				Профиль
			</h2>
			<div className="mx-auto flex w-full flex-col gap-[2px] overflow-hidden rounded-[16px] bg-[#E1E8F0] shadow-[0px_0px_11px_0px_#00000005] md:max-w-[670px] md:flex-row">
				<div className="width-full flex flex-col items-center justify-between gap-[17px] border-b border-[#F2F4F4] bg-[#F7F9FB] p-[24px] sm:border-r md:w-[200px] md:px-[15px] md:py-[25px] lg:gap-[24px]">
					<div className="flex flex-col items-center gap-[15px]">
						<div className="relative z-0 h-[78px] w-[78px] rounded-full">
							<div
								className="absolute -z-10 h-full w-full rounded-full blur-sm"
								style={{
									background:
										"linear-gradient(90deg, #2563EB 0%, #9333EA 100%)",
								}}
							/>
							{showAvatar ? (
								<Image
									src={resolvedAvatar}
									alt={user?.first_name || ""}
									// width={78}
									// height={78}
									fill
									sizes="78px"
									className="rounded-full object-cover"
									onError={() => setAvatarError(true)}
								/>
							) : (
								<Image
									src={defaultUser.src}
									alt={user?.first_name || ""}
									// width={78}
									// height={78}
									fill
									sizes="78px"
									className="rounded-full object-cover"
								/>
							)}
						</div>
						<p className="font-montserrat text-[18px]/[100%] font-bold text-[#95A0A7]">
							{user?.first_name}
						</p>
					</div>
					<div className="flex flex-col gap-1 sm:w-full">
						<div className="flex items-center justify-between md:order-[2]">
							<p className="table-text">Уровень:</p>
							<p
								className={`ont-montserrat-bold text-[15px] font-bold uppercase ${currentLevel.textClass}`}
							>
								{currentLevel.name}
							</p>
						</div>

						<div className="flex items-center justify-between">
							<p className="table-text">Куплено:</p>
							<p className="table-text flex items-center gap-0.5 py-0">
								{user?.total_stars || 0} <TgStar />
							</p>
						</div>
					</div>
				</div>
				<div className="flex flex-1 flex-col gap-[17px] bg-[#F7F9FB] p-[24px]">
					<div className="flex flex-col gap-[8px]">
						<p className="font-montserrat text-[14px]/[100%] font-semibold text-black">
							Ваша реферальная ссылка:
						</p>
						<div className="flex h-[45px] w-full items-center justify-between gap-[8px] rounded-[12px] bg-[#EAEEF0] px-[16px] py-[11px] lg:px-[8px]">
							<div className="flex w-full max-w-[333px] flex-1 items-center gap-[8px]">
								<People className="w-[16px] min-w-[16px]" />
								<p className="table-text w-full overflow-hidden text-ellipsis text-nowrap text-black">
									{refState?.referral_link}
								</p>
							</div>
							<div className="relative">
								<button
									onClick={copyToClipboard}
									className="cursor-pointer transition-opacity hover:opacity-80"
									title="Копировать ссылку"
								>
									<Copy className="w-[16px]" />
								</button>

								{copySuccess && (
									<div className="absolute -top-8 right-4 translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-[12px] text-white">
										{copySuccess}
									</div>
								)}
							</div>
						</div>
						<div className="flex flex-col gap-[8px] md:flex-row">
							<div className="flex h-[45px] w-full justify-between rounded-[12px] bg-[#EAEEF0] px-[16px] py-[11px] lg:px-[8px]">
								<p className="table-text bg-[#EAEEF0] text-black">
									Реферальный баланс:
								</p>
								<p className="table-text flex items-center gap-[4px]">
									{refState?.referral_balance || 0} <TgStar />
								</p>
							</div>
							<Button
								maxWidth={isMobile ? "100%" : "97px"}
								onClick={handleWithdraw}
							>
								Вывести
							</Button>
							<Toaster toaster={toaster.current}>
								{(toast: ToastProps) => (
									<Toast.Root
										key={toast.id}
										className="flex w-[300px] flex-col gap-3 rounded-2xl border border-[#F2F4F4] bg-white p-4"
									>
										<Toast.Title className="font-montserrat text-[18px]/[100%] font-medium">
											{toast.title}
										</Toast.Title>
										<Toast.Description className="font-inter text-[14px]/[16px] font-normal text-[#95A0A7] sm:text-[16px]/[22.8px]">
											{toast.description}
										</Toast.Description>
									</Toast.Root>
								)}
							</Toaster>
						</div>
						<p className="font-inter flex flex-col text-[14px]/[22.75px] font-normal text-[#95A0A7] md:text-[16px]">
							Приглашено друзей: {refState?.referrals_count}
						</p>
					</div>
					<p className="font-inter flex flex-col text-[14px]/[22.75px] font-normal text-[#95A0A7] md:text-[16px]">
						Присоединяйтесь к нашей реферальной программе — делитесь своей
						уникальной ссылкой с друзьями и получайте 5% от их покупок в Звездах
						на ваш реферальный баланс!
					</p>
				</div>
			</div>
		</section>
	);
};
