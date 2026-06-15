"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { useUser } from "@/shared/layouts/auth-provider/auth-provider";

import Back from "@/public/assets/icons/back.svg";
import defaultUser from "@/public/assets/images/user.png";

import { checkUsername, createTonOrder, getPaymentLink } from "../../api/api";
import { getDiscount } from "../../utils/get-discount";
import { PaymentSelect } from "../payment-select";
import { type SectionType } from "../types";

export type PaymentType = "sbp" | "card" | "crypto" | "sberpay";
const STORAGE_KEY = "tg_success_order";

const resolveAvatarUrl = (url?: string) => {
	if (!url) return undefined;
	if (url.startsWith("data:")) return url;
	if (url.startsWith("http")) return url;
	return `https://tg-stars.ru${url}`;
};

type PaymentProps = {
	selectedAmount:
		| {
				amount: number;
				value: number;
		  }
		| undefined;
	section: SectionType;
	username: string;
	walletAddress?: string;
	handleClose: () => void;
};

export const Payment = ({
	selectedAmount,
	section,
	username,
	walletAddress,
	handleClose,
}: PaymentProps) => {
	const [payment, setPayment] = useState<PaymentType>("sbp");
	const [user, setUser] = useState<
		{ avatar_url?: string; name?: string } | undefined
	>(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const [authError, setAuthError] = useState(false);

	const { user: userState } = useUser();

	useEffect(() => {
		if (section === "ton") {
			const trimmed = walletAddress?.trim() || "";
			const shortAddress =
				trimmed.length > 12
					? `${trimmed.slice(0, 6)}...${trimmed.slice(-6)}`
					: trimmed || "TON кошелёк";
			setUser({ name: shortAddress });
			return;
		}

		if (!username) return;

		const getData = async () => {
			const data = await checkUsername(username);
			const avatarUrl = data.user_data?.avatar_url;
			const resolvedAvatarUrl = resolveAvatarUrl(avatarUrl);
			setUser({
				name: data.user_data.name,
				avatar_url: resolvedAvatarUrl,
			});
		};
		getData();
	}, [username, section, walletAddress]);

	const calculateTotal = () => {
		if (!selectedAmount) return 0;

		const discount = getDiscount(userState?.total_spent || 0);
		if (section === "ton") {
			return (
				Math.round(((selectedAmount.amount * (100 - discount)) / 100) * 1000) /
				1000
			);
		}

		return (
			Math.round(((selectedAmount.amount * (100 - discount)) / 100) * 1000) /
			1000
		);
	};

	const handlePayment = async () => {
		if (!payment) {
			return;
		}

		if (section === "ton" && !userState) {
			setAuthError(true);
			return;
		}

		setAuthError(false);
		setIsLoading(true);

		try {
			if (section === "ton") {
				if (!selectedAmount || !walletAddress) return;
				const data = await createTonOrder({
					wallet_address: walletAddress.trim(),
					amount_rub: selectedAmount.amount,
					payment_method: payment,
				});

				if (data?.payment_url) {
					try {
						const payload = {
							order_type: "ton" as const,
							ton_amount: data?.ton_amount,
							amount_rub: selectedAmount.amount,
							wallet_address: walletAddress.trim(),
							payment_method: payment,
							order_id: data?.order_id,
							status: "created" as const,
						};
						globalThis.localStorage.setItem(
							STORAGE_KEY,
							JSON.stringify(payload),
						);
					} catch {
						// noop
					}
					globalThis.window.location.href = data.payment_url;
				} else if (data?.error) {
					console.error("Ошибка создания TON заказа:", data.error);
				} else {
					console.error("Не удалось получить ссылку на оплату TON:", data);
				}
				return;
			}

			const orderBody =
				section === "stars"
					? {
							order_type: "stars" as const,
							payment_method: payment,
							recipient_username: username,
							stars_count: selectedAmount?.value || 0,
						}
					: {
							order_type: "premium" as const,
							payment_method: payment,
							recipient_username: username,
							premium_months: selectedAmount?.value || 0,
						};

			const data = await getPaymentLink(orderBody);

			try {
				const payload = {
					...orderBody,
					recipient_name: user?.name,
					recipient_avatar_url: user?.avatar_url,
					order_id: data?.order_id || data?.orderId || data?.id,
					payment_id: data?.payment_id || data?.paymentId || data?.payment,
					status: "processing" as const,
				};
				globalThis.localStorage.setItem(
					"tg_success_order",
					JSON.stringify(payload),
				);
			} catch {
				// noop
			}

			if (data?.payment_url) {
				globalThis.window.location.href = data.payment_url;
			} else if (data?.url) {
				globalThis.window.location.href = data.url;
			} else if (typeof data === "string") {
				globalThis.window.location.href = data;
			} else {
				console.error("Не удалось получить ссылку на оплату:", data);
			}
		} catch (error) {
			console.error("Ошибка при получении ссылки на оплату:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col gap-[24] md:gap-[33px]">
			<button onClick={handleClose} className="cursor-pointer">
				<Back />
			</button>

			<div className="grid w-full grid-cols-1 gap-[16px] md:grid-cols-2">
				<div className="flex flex-col gap-2">
					<p className="font-montserrat text-[14px]/[100%] font-semibold text-black">
						Получатель
					</p>
					<div className="flex items-center gap-[15px] rounded-xl bg-[#EAEEF0] px-[16px] py-[7.5px]">
						<div className="relative z-0 h-[40px] w-[40px] min-w-[40px] rounded-full">
							<div
								className="absolute -z-10 h-full w-full rounded-full blur-sm"
								style={{
									background:
										"linear-gradient(90deg, #2563EB 0%, #9333EA 100%)",
								}}
							/>
							{user?.avatar_url ? (
								<Image
									src={user.avatar_url}
									alt="username"
									fill
									sizes="40px"
									// width={40}
									// height={40}
									className="rounded-full object-cover"
									onError={(e) => {
										(e.currentTarget as HTMLImageElement).style.display =
											"none";
									}}
								/>
							) : (
								<Image
									src={defaultUser}
									alt="default avatar"
									fill
									sizes="40px"
									// width={40}
									// height={40}
									className="rounded-full"
								/>
							)}
						</div>
						<p className="font-montserrat bg-transparent py-1.5 text-[16px]/[22.8px] font-bold text-[#1D2123] outline-none placeholder:text-[#95A0A7]">
							{user?.name || "Загрузка..."}
						</p>
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<p className="font-montserrat text-[14px]/[100%] font-semibold text-black">
						Количество
					</p>
					<div className="relative flex items-center gap-1 rounded-xl bg-[#EAEEF0] px-[16px] py-[10px] transition-colors">
						<p className="font-montserrat w-[calc(100%-35px)] bg-transparent py-1.5 text-[16px]/[22.8px] font-bold text-[#1D2123] outline-none placeholder:text-[#95A0A7]">
							{section === "stars" && selectedAmount?.value}
							{section === "premium" && selectedAmount?.value + " месяцев"}
							{section === "ton" && selectedAmount?.value}
						</p>
						<p className="font-montserrat text-[16px]/[22.8px] font-bold text-[#95A0A7]">
							{section === "stars" && "Stars"}
							{section === "ton" && "TON"}
						</p>
					</div>
				</div>
			</div>

			<PaymentSelect payment={payment} setPayment={setPayment} />

			<div className="flex flex-col gap-[24px]">
				<div className="flex w-full items-center justify-between rounded-xl border-2 border-[#F6F6F6] px-6 py-2.5">
					<p className="font-montserrat text-[16px]/[22.8px] font-semibold text-black">
						Итого:
					</p>
					<p className="font-montserrat text-[16px]/[22.8px] font-semibold text-black">
						{calculateTotal()} Руб.
					</p>
				</div>

				{authError && (
					<div className="flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">
						<span className="mt-0.5 text-[18px] leading-none">🔐</span>
						<p className="font-inter text-[14px]/[20.75px] text-orange-700">
							Для покупки TON необходимо{" "}
							<Link
								href="/auth"
								className="font-semibold underline underline-offset-2"
							>
								авторизоваться
							</Link>
						</p>
					</div>
				)}

				<Button
					className="w-full justify-center px-6 md:w-max"
					disabled={!payment || isLoading}
					onClick={handlePayment}
				>
					{isLoading ? "Загрузка..." : "К оплате"}
				</Button>
			</div>

			<p className="font-inter text-center text-[14px]/[22.8px] text-[#95A0A7] md:text-[16px]/[22.8px]">
				{section === "ton" ? (
					<>
						Для покупки TON необходимо{" "}
						<Link href={"/auth"} className="text-[#0098EA]">
							Авторизоваться
						</Link>
						. Совершая покупку, вы подтверждаете, что прочли и согласны со всеми
						пунктами{" "}
						<Link
							href={"/public-offer"}
							target="_blank"
							className="text-[#0098EA]"
						>
							Условия сервиса
						</Link>
						.
					</>
				) : (
					<>
						Отключите VPN перед оплатой. Совершая покупку, вы подтверждаете, что
						прочли и согласны со всеми пунктами{" "}
						<Link
							href={"/public-offer"}
							target="_blank"
							className="text-[#0098EA]"
						>
							Условия сервиса
						</Link>
						.
					</>
				)}
			</p>
		</div>
	);
};
