"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

import HeartIcon from "@/public/assets/icons/heart.svg";
import TgIcon from "@/public/assets/icons/tg-icon.svg";

const STORAGE_KEY = "tg_success_order";

type SuccessLocalData = {
	order_type: "stars" | "premium" | "ton";
	stars_count?: number;
	premium_months?: number;
	ton_amount?: number;
	amount_rub?: number;
	wallet_address?: string;
	recipient_name?: string;
	recipient_username?: string;
	recipient_avatar_url?: string;
	payment_method?: string;
	payment_id?: string;
	order_id?: string;
	status?: string;
};

type WebOrderStatusResponse = {
	success: boolean;
	order: {
		order_id: string;
		id: number;
		status: string;
		stars_count: number;
		amount: number;
		recipient_username: string;
		is_premium: boolean;
		premium_months: number | undefined;
		created_at: string | undefined;
		paid_at: string | undefined;
		completed_at: string | undefined;
		payment_method: string | undefined;
	};
};

type TonOrderStatusResponse = {
	success: boolean;
	order: {
		order_id: string;
		status: string;
		ton_amount: number;
		amount_rub: number;
		wallet_address: string;
		tx_hash?: string;
		created_at?: string;
		paid_at?: string;
		completed_at?: string;
	};
};

async function fetchWebOrderStatus(
	orderId: string,
): Promise<WebOrderStatusResponse | undefined> {
	try {
		const res = await fetch(
			`https://tg-stars.ru/api/web-order/status?order_id=${encodeURIComponent(orderId)}`,
			{ cache: "no-cache" },
		);
		if (!res.ok) return undefined;
		const data = (await res.json()) as WebOrderStatusResponse;
		if (!data?.order) return data;

		const order = {
			...data.order,
			premium_months: data.order.premium_months ?? undefined,
			created_at: data.order.created_at ?? undefined,
			paid_at: data.order.paid_at ?? undefined,
			completed_at: data.order.completed_at ?? undefined,
			payment_method: data.order.payment_method ?? undefined,
		};

		return { ...data, order };
	} catch {
		return undefined;
	}
}

async function fetchTonOrderStatus(
	orderId: string,
): Promise<TonOrderStatusResponse | undefined> {
	try {
		const res = await fetch(
			`https://tg-stars.ru/api/ton/order_status?order_id=${encodeURIComponent(orderId)}`,
			{ cache: "no-cache" },
		);
		if (!res.ok) return undefined;
		return (await res.json()) as TonOrderStatusResponse;
	} catch {
		return undefined;
	}
}

const truncateAddress = (address: string): string => {
	const trimmed = address.trim();
	if (trimmed.length <= 12) return trimmed;
	return `${trimmed.slice(0, 6)}...${trimmed.slice(-6)}`;
};

export const SuccessPageClient = () => {
	const [localOrder, setLocalOrder] = useState<SuccessLocalData | undefined>(
		undefined,
	);
	const [serverOrder, setServerOrder] = useState<
		| WebOrderStatusResponse["order"]
		| TonOrderStatusResponse["order"]
		| undefined
	>(undefined);

	// 1. Читаем localStorage при монтировании
	useEffect(() => {
		try {
			const raw = globalThis.localStorage.getItem(STORAGE_KEY);
			if (raw) {
				setLocalOrder(JSON.parse(raw));
			}
		} catch {
			setLocalOrder(undefined);
		}
	}, []);

	// 2. Определяем order_id для поллинга (localStorage приоритет)
	const targetOrderId = localOrder?.order_id;
	const isTonOrder =
		localOrder?.order_type === "ton" || targetOrderId?.startsWith("ton_");

	// 3. Поллинг статуса заказа через новый эндпоинт (без авторизации)
	const pollStatus = useCallback(async () => {
		if (!targetOrderId) return;

		const data = isTonOrder
			? await fetchTonOrderStatus(targetOrderId)
			: await fetchWebOrderStatus(targetOrderId);
		if (data?.success && data.order) {
			setServerOrder(data.order);

			// Обновляем статус в localStorage
			setLocalOrder((prev) => {
				if (!prev) return prev;
				const next = { ...prev, status: data.order.status };
				try {
					globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
				} catch {
					// noop
				}
				return next;
			});
		}
	}, [targetOrderId, isTonOrder]);

	useEffect(() => {
		if (!targetOrderId) return;

		const status = serverOrder?.status || localOrder?.status;
		const isFinal =
			status === "completed" || status === "error" || status === "refunded";
		if (isFinal) return;

		// Первый вызов сразу
		pollStatus();

		const intervalId = setInterval(() => {
			pollStatus();
		}, 5000);

		// Останавливаем через 5 минут
		const timeoutId = setTimeout(() => {
			clearInterval(intervalId);
		}, 300_000);

		return () => {
			clearInterval(intervalId);
			clearTimeout(timeoutId);
		};
	}, [targetOrderId, serverOrder?.status, localOrder?.status, pollStatus]);

	// === Вычисляемые значения ===

	const status = serverOrder?.status || localOrder?.status || "paid";

	const recipientLabel = useMemo(() => {
		if (localOrder?.order_type === "ton") {
			return truncateAddress(localOrder?.wallet_address || "TON кошелёк");
		}
		if (serverOrder && "wallet_address" in serverOrder) {
			return truncateAddress(serverOrder.wallet_address || "TON кошелёк");
		}
		if (localOrder?.recipient_name) return localOrder.recipient_name;
		if (localOrder?.recipient_username) return localOrder.recipient_username;
		if (serverOrder && "recipient_username" in serverOrder) {
			return serverOrder.recipient_username;
		}
		return "Получатель";
	}, [
		localOrder?.order_type,
		localOrder?.wallet_address,
		localOrder?.recipient_name,
		localOrder?.recipient_username,
		serverOrder,
	]);

	const isTon =
		localOrder?.order_type === "ton" ||
		(!!serverOrder && "ton_amount" in serverOrder);
	const isPremium =
		!isTon &&
		(localOrder?.order_type === "premium" ||
			(!!serverOrder &&
				"is_premium" in serverOrder &&
				(serverOrder.is_premium ?? false)));

	let infoTitle;
	if (isTon) {
		infoTitle = "Количество";
	} else if (isPremium) {
		infoTitle = "Срок подписки Premium";
	} else {
		infoTitle = "Количество";
	}

	const infoValue = (() => {
		if (isTon) {
			return `${localOrder?.ton_amount ?? (serverOrder && "ton_amount" in serverOrder ? serverOrder.ton_amount : 0)}`;
		}
		if (isPremium) {
			const premiumMonths =
				localOrder?.premium_months ??
				(serverOrder && "premium_months" in serverOrder
					? serverOrder.premium_months
					: 0);
			return `${premiumMonths ?? 0} месяца`;
		}
		const starsCount =
			localOrder?.stars_count ??
			(serverOrder && "stars_count" in serverOrder
				? serverOrder.stars_count
				: 0);
		return `${starsCount ?? 0}`;
	})();

	const infoSuffix = isTon ? "TON" : !isPremium ? "Stars" : undefined;

	const orderIdDisplay = (() => {
		if (serverOrder?.order_id) {
			if ("id" in serverOrder) return `Заказ #${serverOrder.id}`;
			return `Заказ #${serverOrder.order_id}`;
		}
		if (localOrder?.order_id) return `Заказ #${localOrder.order_id}`;
		return "Заказ";
	})();

	let paymentIdText = "";
	if (localOrder?.payment_id) {
		paymentIdText = `Номер платежа: ${localOrder.payment_id}`;
	} else if (localOrder?.payment_method) {
		paymentIdText = `Способ оплаты: ${localOrder.payment_method.toUpperCase()}`;
	} else if (
		serverOrder &&
		"payment_method" in serverOrder &&
		serverOrder.payment_method
	) {
		paymentIdText = `Способ оплаты: ${serverOrder.payment_method.toUpperCase()}`;
	}

	// === Прогресс-бар ===

	const activeIndex: number = (() => {
		switch (status) {
			case "created":
				return 0;
			case "paid":
				return 1;
			case "moderation":
			case "processing":
				return 2;
			case "completed":
				return 3;
			case "error":
			case "refunded":
			case "cancelled":
				return 3;
			default:
				return 1;
		}
	})();

	const isActive = (index: number) => index === activeIndex;
	const isCompleted = (index: number) => index < activeIndex;
	const isError =
		status === "error" || status === "refunded" || status === "cancelled";

	const circleColor = (index: number) => {
		if (isError && index === 3) return "#9333EA";
		if (isActive(index)) return "#9333EA";
		if (isCompleted(index)) return "#2563EB";
		return "#D1D5DB";
	};
	// const circleColor = (index: number) => {
	// 	if (isError && index === 3) return "#EF4444";
	// 	if (isActive(index)) return "#9333EA";
	// 	if (isCompleted(index)) return "#2563EB";
	// 	return "#D1D5DB";
	// };

	const textColor = (index: number) =>
		isActive(index) || isCompleted(index) ? "#374151" : "#9CA3AF";

	const showLoader = status === "paid" || status === "processing";

	const statusText = (() => {
		switch (status) {
			case "created":
				return "Ожидаем подтверждение оплаты...";
			case "paid":
				return "Оплата успешна! Ваш заказ в обработке...";
			case "moderation":
				return "Заказ на проверке...";
			case "processing":
				return "Отправляем заказ, это займет пару минут...";
			case "completed":
				return "Ваш заказ выполнен! Просим вас оставить положительный отзыв.";
			case "error":
			case "refunded":
				return "При выполнении заказа произошла ошибка.";
			case "cancelled":
				return "Заказ отменён.";
			default:
				return "Оплата успешна! Ваш заказ в обработке...";
		}
	})();

	const activeLinePercent = (() => {
		switch (activeIndex) {
			case 0:
				return "0%";
			case 1:
				return "33.333%";
			case 2:
				return "66.666%";
			default:
				return "90%";
		}
	})();

	const avatarSrc = localOrder?.recipient_avatar_url || undefined;
	const [avatarError, setAvatarError] = useState(false);

	// Если нет данных вообще — показываем заглушку
	// if (!localOrder && !serverOrder) {
	// 	return (
	// 		<div className="container !gap-5 py-4 sm:py-0">
	// 			<div className="mx-auto w-full max-w-[720px]">
	// 				<div className="rounded-2xl bg-white px-5 py-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:px-[40px] sm:py-[27px]">
	// 					<div className="flex flex-col items-center gap-4 py-8">
	// 						<div className="h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-[#2563EB]" />
	// 						<p className="font-montserrat text-[16px] text-[#95A0A7]">
	// 							Загрузка информации о заказе...
	// 						</p>
	// 					</div>
	// 				</div>
	// 			</div>
	// 		</div>
	// 	);
	// }

	return (
		<div className="container">
			<div className="mx-auto h-full w-full max-w-[720px]">
				<div className="mt-[18px] rounded-[16px] bg-[#F7F9FB] p-[24px] shadow-[0_12px_40px_rgba(15,23,42,0.08)] md:px-[40px] md:py-[30px] lg:mt-0">
					<div className="flex flex-col gap-[8px]">
						<h1 className="font-montserrat text-[20px]/[22.8px] font-[600] tracking-[-0.02em] text-black md:text-[20px]">
							{orderIdDisplay}
						</h1>
						{paymentIdText && (
							<p className="font-montserrat text-[14px] font-medium text-[#9CA3AF]">
								{paymentIdText}
							</p>
						)}
					</div>

					<div className="mt-[24px] grid grid-cols-1 gap-[16px] md:grid-cols-2 lg:mt-[33px]">
						<div className="flex flex-col gap-2">
							<p className="font-montserrat text-[14px] font-[600] text-black">
								Получатель
							</p>
							<div className="box-border flex h-[55px] items-center rounded-[12px] bg-[#EAEEF0] px-[16px] py-[7.5px]">
								<div className="flex w-full items-center justify-start gap-[15px]">
									<div className="relative z-0 h-[40px] w-[40px]">
										<div
											className="absolute -z-10 h-full w-full rounded-full blur-sm"
											style={{
												background:
													"linear-gradient(90deg, #2563EB 0%, #9333EA 100%)",
											}}
										/>
										<div className="h-[40px] w-[40px] overflow-hidden rounded-full bg-[#E5E7EB]">
											{avatarSrc && !avatarError ? (
												<Image
													src={avatarSrc}
													alt={recipientLabel}
													// width={40}
													// height={40}
													fill
													sizes="40px"
													className="rounded-full object-cover"
													onError={() => setAvatarError(true)}
												/>
											) : (
												<Image
													src="/assets/images/user.png"
													alt={recipientLabel}
													// width={40}
													// height={40}
													fill
													sizes="40px"
													className="rounded-full object-cover"
												/>
											)}
										</div>
									</div>
									<span className="font-montserrat block flex-1 truncate text-[16px]/[22.75px] font-semibold text-black">
										{recipientLabel}
									</span>
								</div>
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<p className="font-montserrat text-[14px] font-[600] text-black">
								{infoTitle}
							</p>
							<div className="flex h-[55px] items-center rounded-[12px] bg-[#EAEEF0] px-[16px] py-[7.5px]">
								<div className="flex w-full items-center justify-between">
									<span className="font-montserrat text-[16px]/[22.75px] font-semibold text-black">
										{infoValue}
									</span>
									{infoSuffix && (
										<span className="font-montserrat text-[16px]/[22.75px] font-bold text-[#95A0A7]">
											{infoSuffix}
										</span>
									)}
								</div>
							</div>
						</div>
					</div>

					<div className="mt-[24px] lg:mt-[33px]">
						<div className="relative">
							<div className="absolute left-5 right-5 top-[16px] h-[8px] rounded-full bg-[#EAEEF0]" />
							<div
								className="absolute left-5 top-4 h-[8px] rounded-full"
								style={{
									width: activeLinePercent,
									background: isError
										? "linear-gradient(90deg, #2563EB 48.59%, #9333EA 100%)"
										: "linear-gradient(90deg, #2563EB 48.59%, #2563EB 100%)",
								}}
							/>
							{/* <div
								className="absolute left-5 top-4 h-[8px] rounded-full"
								style={{
									width: activeLinePercent,
									background: isError
										? "linear-gradient(90deg, #2563EB 48.59%, #EF4444 100%)"
										: "linear-gradient(90deg, #2563EB 48.59%, #9333EA 100%)",
								}}
							/> */}
							<div className="relative flex items-center justify-between">
								{/* Шаг 0: Оплата */}
								<div className="flex flex-col items-center gap-2">
									<div
										className="flex h-[40px] w-[40px] items-center justify-center rounded-full text-white"
										style={{ backgroundColor: circleColor(0) }}
									>
										<Image
											src="/assets/icons/payment/cardpay.svg"
											alt="Оплата"
											width={20}
											height={20}
										/>
									</div>
									<span
										className="font-montserrat text-[14px] font-semibold"
										style={{ color: textColor(0) }}
									>
										Оплата
									</span>
								</div>

								{/* Шаг 1: Обработка */}
								<div className="flex flex-col items-center gap-2">
									<div
										className="flex h-[40px] w-[40px] items-center justify-center rounded-full text-white"
										style={{ backgroundColor: circleColor(1) }}
									>
										{showLoader && isActive(1) ? (
											<div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-white" />
										) : (
											<Image
												src="/assets/icons/payment/gears.svg"
												alt="Обработка"
												width={20}
												height={20}
											/>
										)}
									</div>
									<span
										className="font-montserrat text-[14px] font-semibold"
										style={{ color: textColor(1) }}
									>
										Обработка
									</span>
								</div>

								{/* Шаг 2: Доставка */}
								<div className="flex flex-col items-center gap-2">
									<div
										className="flex h-[40px] w-[40px] items-center justify-center rounded-full text-white"
										style={{ backgroundColor: circleColor(2) }}
									>
										{showLoader && isActive(2) ? (
											<div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-white" />
										) : (
											<Image
												src="/assets/icons/payment/star.svg"
												alt="Доставка"
												width={20}
												height={20}
											/>
										)}
									</div>
									<span
										className="font-montserrat text-[14px] font-semibold"
										style={{ color: textColor(2) }}
									>
										Доставка
									</span>
								</div>

								{/* Шаг 3: Результат */}
								<div className="flex flex-col items-center gap-2">
									<div
										className="flex h-[40px] w-[40px] items-center justify-center rounded-full text-white"
										style={{ backgroundColor: circleColor(3) }}
									>
										{isError ? (
											<Image
												src="/assets/icons/payment/failed.svg"
												alt="Ошибка"
												width={20}
												height={20}
											/>
										) : (
											<Image
												src="/assets/icons/payment/success.svg"
												alt="Успех"
												width={20}
												height={20}
											/>
										)}
									</div>
									<span
										className="font-montserrat text-[14px] font-semibold"
										style={{ color: textColor(3) }}
									>
										{(() => {
											if (isError) return "Ошибка";
											if (status === "completed") return "Успех!";
											return "Статус";
										})()}
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className="mt-[24px] text-center lg:mt-[33px]">
						<p className="font-inter text-[16px]/[22.75px] text-[#95A0A7]">
							{statusText}
						</p>
						<p className="font-inter text-[16px]/[22.75px] text-[#95A0A7]">
							{isError ? (
								"Пожалуйста, обратитесь в Техническую поддержку."
							) : (
								<>
									Возникли вопросы? Обратитесь в{" "}
									<a
										href="https://t.me/TGStarsSupport"
										target="_blank"
										rel="noopener noreferrer"
										className="border-b border-[#2563EB] text-[#2563EB] transition-colors hover:border-transparent hover:text-[#0077B8]"
									>
										Техническую поддержку
									</a>
									.
								</>
							)}
						</p>
					</div>

					<div className="mt-[24px] flex flex-col items-center gap-[12px] md:flex-row md:justify-between lg:mt-[33px]">
						<a
							href="https://t.me/TGStars_Reviews"
							target="_blank"
							rel="noopener noreferrer"
							className="font-inter group relative flex w-full items-center justify-center gap-[6px] overflow-hidden rounded-full bg-gradient-to-r from-[#2563EB] to-[#9333EA] px-6 py-[10.5px] text-[16px]/[22.8px] text-white shadow-[0_10px_30px_rgba(45,107,255,0.25)] before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-[#2563EB] before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100 md:w-full"
						>
							<span className="relative z-10 flex items-center gap-[6px]">
								Оставить отзыв{" "}
								<HeartIcon className="h-[24px] w-[24px] text-white transition-colors duration-300 group-hover:text-[#EF4444]" />
							</span>
						</a>
						<a
							href="https://t.me/TGStarsPage"
							target="_blank"
							rel="noopener noreferrer"
							className="font-inter align-center flex w-full items-center justify-center gap-[6px] rounded-full border border-[#E5E7EB] bg-white px-6 py-[10.5px] text-[16px]/[22.8px] text-[#9CA3AF] transition hover:bg-[#F9FAFB] md:w-full"
						>
							Наш Канал/Чат <TgIcon />
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};
