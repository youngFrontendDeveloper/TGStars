"use client";

import { useEffect, useMemo, useState } from "react";

import { useUser } from "@/shared/layouts/auth-provider/auth-provider";

const getStatusInfo = (status: string) => {
	switch (status) {
		case "completed":
			return { color: "bg-[#D6FFD3]", text: "Успех" };
		case "error":
			return { color: "bg-[#FFD3D3]", text: "Ошибка" };
		default:
			return { color: "bg-[#D2CC39]", text: "В процессе" };
	}
};

const formatDateOnly = (value: string) => {
	const raw = value?.trim();
	if (!raw) return value;

	const firstPart = raw.split(/[\sT]/)[0] ?? raw;

	if (/^(?:\d{2}\.){2}\d{4}$/.test(firstPart)) return firstPart;
	if (/^\d{4}-\d{2}-\d{2}$/.test(firstPart)) {
		const [y, m, d] = firstPart.split("-");
		return `${d}.${m}.${y}`;
	}
	if (/^\d{2}-\d{2}-\d{4}$/.test(firstPart)) {
		return firstPart.replaceAll("-", ".");
	}
	if (/^\d{4}(?:\/\d{2}){2}$/.test(firstPart)) {
		const [y, m, d] = firstPart.split("/");
		return `${d}.${m}.${y}`;
	}
	if (/^(?:\d{2}\/){2}\d{4}$/.test(firstPart)) {
		return firstPart.replaceAll("/", ".");
	}

	const parsed = new Date(raw);
	if (!Number.isNaN(parsed.getTime())) {
		const dd = String(parsed.getDate()).padStart(2, "0");
		const mm = String(parsed.getMonth() + 1).padStart(2, "0");
		const yyyy = parsed.getFullYear();
		return `${dd}.${mm}.${yyyy}`;
	}

	return firstPart;
};

export const History = () => {
	const { orders } = useUser();

	const itemsPerPage = 8;
	const [page, setPage] = useState(1);
	const totalPages = Math.max(1, Math.ceil(orders?.length / itemsPerPage));

	useEffect(() => {
		if (page > totalPages) {
			setPage(totalPages);
		}
	}, [page, totalPages]);

	const pagedOrders = useMemo(() => {
		const start = (page - 1) * itemsPerPage;
		return orders?.slice(start, start + itemsPerPage);
	}, [orders, page]);

	return (
		<section className="flex flex-col">
			<h2 className="font-mts-extended mb-[20px] text-[20px]/[22.8px] font-semibold text-black">
				История заказов
			</h2>
			<div className="w-full rounded-2xl bg-white px-4 py-6 sm:p-0">
				{orders?.length === 0 ? (
					<p className="font-mts-text flex flex-col text-[14px]/[22.8px] font-normal text-[#95A0A7] sm:p-4 sm:text-[16px]/[22.8px]">
						Тут пока ничего нет
					</p>
				) : (
					<>
						<div className="flex flex-col gap-7">
							{pagedOrders?.map((el, i) => (
								<div
									key={`${el.id}-${el.created_at}-${i}`}
									className={`flex w-full items-start justify-between border-b border-[#EAEEF0] pb-4 sm:hidden ${
										i % 2 === 0 ? "bg-[#F2F4F5]" : "bg-transparent"
									}`}
								>
									<div className="flex flex-col gap-6">
										<div className="flex flex-col items-start gap-2">
											<p className="table-text py-0">#{el.id}</p>
											<p className="table-header py-0 text-[14px]/[22.8px]">
												{formatDateOnly(el.created_at)}
											</p>
										</div>
										<div className="flex flex-col items-start gap-2">
											<p className="table-text py-0">
												{el.is_premium
													? `${el.premium_months} month Telegram Premium`
													: `${el.stars_count} Telegram Stars`}
											</p>
											<p className="table-header py-0 text-[14px]/[22.8px]">
												{el.recipient_username}
											</p>
										</div>
									</div>
									<p
										className={`font-mts-text whitespace-nowrap rounded-full ${getStatusInfo(el.status).color} px-5 py-1 text-[12px]/[22.8px] text-black`}
									>
										{getStatusInfo(el.status).text}
									</p>
								</div>
							))}
						</div>
						<div className="hidden flex-col sm:flex">
							<div className="table">
								<p className="table-header">Заказ</p>
								<p className="table-header">Дата</p>
								<p className="table-header">Товар</p>
								<p className="table-header">Получатель</p>
								<p className="table-header">Статус</p>
							</div>
							{pagedOrders?.map((el, i) => (
								<div
									className={`table items-center ${
										i % 2 === 0 ? "bg-[#F2F4F5]" : "bg-transparent"
									}`}
									key={`${el.id}-${el.created_at}-${i}`}
								>
									<p className="table-text">#{el.id}</p>
									<p className="table-text">{formatDateOnly(el.created_at)}</p>
									<p className="table-text">
										{el.is_premium
											? `${el.premium_months} month Telegram Premium`
											: `${el.stars_count} Telegram Stars`}
									</p>
									<p className="table-text">{el.recipient_username}</p>
									<div
										className={`flex items-center justify-center self-stretch ${getStatusInfo(el.status).color} text-black`}
									>
										<span className="font-mts-text inline-block whitespace-nowrap text-[12px]/[22.8px] md:text-[16px]">
											{getStatusInfo(el.status).text}
										</span>
									</div>
								</div>
							))}
						</div>
						{totalPages > 1 && (
							<div className="flex items-center justify-center gap-4 border-t border-[#EAEEF0] pl-[13px] pr-[14px] pt-[17px] xs:pl-0 xs:pr-0 md:py-[8px]">
								<button
									type="button"
									onClick={() => setPage((prev) => Math.max(1, prev - 1))}
									disabled={page === 1}
									aria-label="Предыдущая страница"
									className="text-[#9CA3AF] transition hover:text-[#111827] disabled:cursor-not-allowed disabled:opacity-40 sm:hidden"
								>
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M15 18l-6-6 6-6" />
									</svg>
								</button>
								<div className="flex flex-1 items-center justify-center gap-[30px]">
									{Array.from({ length: totalPages }, (_, idx) => {
										const pageNumber = idx + 1;
										const isActive = pageNumber === page;
										return (
											<button
												key={pageNumber}
												type="button"
												onClick={() => setPage(pageNumber)}
												aria-current={isActive ? "page" : undefined}
												className={`font-mts-text text-[16px] font-[500] transition ${
													isActive
														? "text-[#111827]"
														: "text-[#9CA3AF] hover:text-[#111827]"
												}`}
											>
												{pageNumber}
											</button>
										);
									})}
								</div>
								<button
									type="button"
									onClick={() =>
										setPage((prev) => Math.min(totalPages, prev + 1))
									}
									disabled={page === totalPages}
									aria-label="Следующая страница"
									className="text-[#9CA3AF] transition hover:text-[#111827] disabled:cursor-not-allowed disabled:opacity-40 sm:hidden"
								>
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M9 6l6 6-6 6" />
									</svg>
								</button>
							</div>
						)}
					</>
				)}
			</div>
		</section>
	);
};
