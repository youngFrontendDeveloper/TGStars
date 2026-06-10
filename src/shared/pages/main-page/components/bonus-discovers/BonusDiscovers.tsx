/* eslint-disable unicorn/filename-case */
"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import { useUser } from "@/shared/layouts/auth-provider/auth-provider";

import PresentIcon from "@/public/assets/icons/reff.svg";
import amethystImg from "@/public/assets/images/bonus/amethyst.png";
import diamondImg from "@/public/assets/images/bonus/diamond.png";
import emeraldImg from "@/public/assets/images/bonus/emerald.png";
import goldImg from "@/public/assets/images/bonus/gold.png";
import legendImg from "@/public/assets/images/bonus/legend.png";
import silverImg from "@/public/assets/images/bonus/silver.png";

type Discover = {
	name: string;
	img: StaticImageData;
	discoverPercent: number;
	discoverCondition: string;
	pillClass: string;
	badge?: string;
};

const getRowClassName = (rowIndex: number) => {
	if (rowIndex === 0) return "rounded-b-none md:rounded-b-[16px]";
	if (rowIndex === 1) return "rounded-t-none md:rounded-t-[16px]";
	return "";
};

export const BonusDiscovers = () => {
	const { user, isAuthenticated } = useUser();
	const profileHref = isAuthenticated ? "/profile" : "/auth";
	const currentDiscount =
		isAuthenticated && typeof user?.discount_percent === "number"
			? user.discount_percent
			: undefined;

	const discovers: Discover[] = [
		{
			name: "Silver",
			img: silverImg,
			discoverPercent: 1,
			discoverCondition: "Получите сразу после авторизации",
			pillClass: "bg-[#A8B4D41A] text-[#A8B4D4]",
		},
		{
			name: "Emerald",
			img: emeraldImg,
			discoverPercent: 2,
			discoverCondition: "Для перехода нужно потратить от 2000₽",
			pillClass: "bg-[#2DDFCA1A] text-[#2DDFCA]",
		},
		{
			name: "Gold",
			img: goldImg,
			discoverPercent: 3,
			discoverCondition: "Для перехода нужно потратить от 5000₽",
			pillClass: "bg-[#FEDB511A] text-[#FEDB51]",
		},
		{
			name: "Diamond",
			img: diamondImg,
			discoverPercent: 4,
			discoverCondition: "Для перехода нужно потратить от 12000₽",
			pillClass: "bg-[#7FDCFF1A] text-[#7FDCFF]",
		},
		{
			name: "Amethyst",
			img: amethystImg,
			discoverPercent: 5,
			discoverCondition: "Для перехода нужно потратить от 35000₽",
			pillClass: "bg-[#E274FF1A] text-[#E274FF]",
		},
		{
			name: "Legend",
			img: legendImg,
			discoverPercent: 6,
			discoverCondition: "Для перехода нужно потратить от 90000₽",
			pillClass: "bg-[#FF5C3B1A] text-[#FF5C3B]",
		},
	];

	let maxMatchedPercent = -1;
	if (typeof currentDiscount === "number" && currentDiscount > 0) {
		for (const item of discovers) {
			if (item.discoverPercent <= currentDiscount) {
				maxMatchedPercent = Math.max(maxMatchedPercent, item.discoverPercent);
			}
		}
	}

	const resolvedDiscovers =
		maxMatchedPercent >= 0
			? discovers.map((item) =>
					item.discoverPercent === maxMatchedPercent
						? { ...item, discoverCondition: "Текущий уровень" }
						: item,
				)
			: discovers;

	const rows: Discover[][] = [];
	let index = 0;
	for (const item of resolvedDiscovers) {
		const rowIndex = Math.floor(index / 3);
		if (!rows[rowIndex]) rows[rowIndex] = [];
		rows[rowIndex].push(item);
		index += 1;
	}

	return (
		// Бонусная программа
		<section className="relative -top-[4px]" id="bonus">
			<h2 className="sr-only">Бонусная программа при покупке звезд Телеграм</h2>
			<div className="font-mts-text mb-[20px] flex items-center gap-2 text-sm font-medium text-[#000000]">
				<PresentIcon className="h-[16px] w-[16px]" />
				<span className="font-mts-wide text-[16px] font-semibold leading-[23px]">
					Бонусная программа
				</span>
			</div>
			<div className="shadow-cus mb-[20px] box-border flex flex-col justify-between gap-5 rounded-[16px] border-[1px] border-[#FFFFFF] bg-[#F7F9FB] p-[24px] md:flex-row md:px-[15px] md:py-[25px]">
				<div className="">
					<p className="font-mts-wide text-center text-[16px] font-semibold leading-[24px] md:text-left">
						Авторизуйтесь и получите скидку прямо сейчас!
					</p>
					<p className="font-mts-text leading-1 text-center text-[14px] font-medium text-[#95A0A7] md:text-left">
						Скидка автоматически применится к Вашим заказам.{" "}
					</p>
				</div>
				<div className="w-full md:w-[85px]">
					<Link href={profileHref} className="w-full md:w-fit">
						<Button>Войти</Button>
					</Link>
				</div>
			</div>
			<div className="flex flex-col gap-[2px] md:gap-y-[20px]">
				{rows.map((row, rowIndex) => (
					<div
						key={`row-${rowIndex}`}
						className={`overflow-hidden rounded-[16px] bg-[#F7F9FC] bg-transparent shadow-none md:shadow-[0px_12px_24px_-16px_#0000003D] ${getRowClassName(
							rowIndex,
						)}`}
					>
						<div className="grid grid-cols-1 gap-[2px] md:grid-cols-3 md:gap-x-[2px]">
							{row.map((discover, index) => {
								const isLastItem = index === row.length - 1;
								const isLastCol = (index + 1) % 3 === 0;
								const borderClassName = [
									"border-[#E6ECF2]",
									!isLastItem ? "border-b" : "",
									!isLastCol
										? "md:border-r md:border-r-[2px]"
										: "md:border-r-0",
									"md:border-b-0",
								]
									.filter(Boolean)
									.join(" ");

								return (
									<div
										key={discover.name}
										className={`flex flex-col bg-white p-[24px] lg:px-[15px] lg:py-[25px] ${borderClassName}`}
									>
										{/* <div className="flex flex-col px-[15px] py-[25px]"> */}
										<Image
											src={discover.img}
											alt={discover.name}
											width={90}
											height={110}
											className="mb-[20px] h-[110px] w-[90px] self-center object-contain"
										/>
										<span
											className={`font-mts-wide mb-[20px] block flex h-[35px] w-full min-w-[140px] items-center justify-center rounded-full text-center text-[16px]/[22.75px] font-bold ${discover.pillClass}`}
										>
											{discover.name}
										</span>
										{/* <div className="flex items-center gap-2"> */}
										<p className="font-mts-wide mb-[4px] text-[16px]/[22.75px] font-semibold text-[#374151]">
											Скидка {discover.discoverPercent}%
										</p>
										{/* </div> */}
										<p className="font-mts-text relative text-[14px]/[22.8px] text-[#95A0A7]">
											{discover.discoverCondition}
										</p>
										{/* </div> */}
									</div>
								);
							})}
						</div>
					</div>
				))}
			</div>
		</section>
	);
};
