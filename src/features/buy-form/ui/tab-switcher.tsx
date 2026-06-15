"use client";

import clsx from "clsx";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";

import { type SectionType, type TabItem } from "./types";

interface TabSwitcherProps {
	items: TabItem[];
	activeTab: string;
	onTabChange: (value: SectionType) => void;
}

export const TabSwitcher = ({
	items,
	activeTab,
	onTabChange,
}: TabSwitcherProps) => {
	return (
		<>
			<div className="mx-auto mb-[24px] hidden h-full w-fit rounded-[68px] bg-[#EAEEF0] p-[4px] md:flex">
				{items.map((item) => (
					<button
						key={item.id}
						onClick={() => onTabChange(item.id)}
						className={clsx(
							"font-montserrat flex h-full items-center gap-[8px] rounded-[68px] px-[14px] py-[10px] text-[14px] font-semibold text-[#808080] transition-colors",
							activeTab === item.id && "bg-white text-black",
						)}
					>
						<item.icon
							className={clsx({
								"active-icon-gold":
									activeTab === item.id && item.id === "stars",
								"active-icon-ton": activeTab === item.id && item.id === "ton",
								"active-icon-premium":
									activeTab === item.id &&
									item.id === "premium" &&
									!item.stroke,
								"active-icon-premium-stroke":
									activeTab === item.id && item.id === "premium" && item.stroke,
								"active-icon":
									activeTab === item.id &&
									!item.stroke &&
									item.id !== "ton" &&
									item.id !== "premium" &&
									item.id !== "stars",
								"active-icon-stroke":
									activeTab === item.id &&
									item.stroke &&
									item.id !== "premium" &&
									item.id !== "stars",
								"inactive-icon": activeTab !== item.id && !item.stroke,
								"inactive-icon-stroke": activeTab !== item.id && item.stroke,
							})}
						/>
						{item.name}
					</button>
				))}
			</div>

			<MobileTabSwitcher
				items={items}
				activeTab={activeTab}
				onTabChange={onTabChange}
			/>
		</>
	);
};

interface MobileTabSwitcherProps {
	items: TabItem[];
	activeTab: string;
	onTabChange: (value: SectionType) => void;
}

const MobileTabSwitcher = ({
	items,
	activeTab,
	onTabChange,
}: MobileTabSwitcherProps) => {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		dragFree: true,
		containScroll: "trimSnaps",
		align: "center",
		skipSnaps: false,
	});

	useEffect(() => {
		if (!emblaApi) return;

		const activeIndex = items.findIndex((item) => item.id === activeTab);
		if (activeIndex !== -1) {
			emblaApi.scrollTo(activeIndex);
		}
	}, [emblaApi, activeTab, items]);

	return (
		<div className="relative mx-auto mb-[24px] h-[48px] w-full max-w-[278px] md:hidden">
			<div
				className="overflow-hidden rounded-[68px] bg-[#EAEEF0] p-[4px]"
				ref={emblaRef}
			>
				<div className="flex">
					{items.map((item) => (
						<div
							key={item.id}
							className="relative min-w-0 max-w-[calc(90vw-2rem)] flex-[0_0_auto]"
						>
							<button
								onClick={() => onTabChange(item.id)}
								className={clsx(
									"font-montserrat flex items-center justify-center gap-[8px] whitespace-nowrap rounded-[68px] px-[14px] py-[10px] text-[14px]/[100%] font-semibold text-[#808080] transition-colors",
									activeTab === item.id && "bg-white text-black",
								)}
								style={{ minWidth: "fit-content" }}
							>
								<item.icon
									className={clsx("flex-shrink-0", {
										"active-icon-gold":
											activeTab === item.id && item.id === "stars",
										"active-icon-ton":
											activeTab === item.id && item.id === "ton",
										"active-icon-premium":
											activeTab === item.id &&
											item.id === "premium" &&
											!item.stroke,
										"active-icon-premium-stroke":
											activeTab === item.id &&
											item.id === "premium" &&
											item.stroke,
										"active-icon":
											activeTab === item.id &&
											!item.stroke &&
											item.id !== "ton" &&
											item.id !== "premium" &&
											item.id !== "stars",
										"active-icon-stroke":
											activeTab === item.id &&
											item.stroke &&
											item.id !== "premium" &&
											item.id !== "stars",
										"inactive-icon": activeTab !== item.id && !item.stroke,
										"inactive-icon-stroke":
											activeTab !== item.id && item.stroke,
									})}
								/>
								<span className="truncate">{item.name}</span>
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

// *************** Old ************
// "use client";

// import clsx from "clsx";
// import useEmblaCarousel from "embla-carousel-react";
// import { useEffect } from "react";

// import { type SectionType, type TabItem } from "./types";

// interface TabSwitcherProps {
// 	items: TabItem[];
// 	activeTab: string;
// 	onTabChange: (value: SectionType) => void;
// }

// export const TabSwitcher = ({
// 	items,
// 	activeTab,
// 	onTabChange,
// }: TabSwitcherProps) => {
// 	return (
// 		<>
// 			<div className="mx-auto mb-[24px] hidden h-12 w-max rounded-[68px] bg-[#EAEEF0] p-1 sm:flex">
// 				{items.map((item) => (
// 					<button
// 						key={item.id}
// 						onClick={() => onTabChange(item.id)}
// 						className={clsx(
// 							"font-montserrat flex items-center gap-2 rounded-[68px] p-0.5 px-[14px] py-3 text-[14px]/[100%] font-medium text-[#808080] transition-colors",
// 							activeTab === item.id && "bg-white text-black",
// 						)}
// 					>
// 						<item.icon
// 							className={clsx({
// 								"active-icon-gold":
// 									activeTab === item.id && item.id === "stars",
// 								"active-icon-ton": activeTab === item.id && item.id === "ton",
// 								"active-icon-premium":
// 									activeTab === item.id &&
// 									item.id === "premium" &&
// 									!item.stroke,
// 								"active-icon-premium-stroke":
// 									activeTab === item.id && item.id === "premium" && item.stroke,
// 								"active-icon":
// 									activeTab === item.id &&
// 									!item.stroke &&
// 									item.id !== "ton" &&
// 									item.id !== "premium" &&
// 									item.id !== "stars",
// 								"active-icon-stroke":
// 									activeTab === item.id &&
// 									item.stroke &&
// 									item.id !== "premium" &&
// 									item.id !== "stars",
// 								"inactive-icon": activeTab !== item.id && !item.stroke,
// 								"inactive-icon-stroke": activeTab !== item.id && item.stroke,
// 							})}
// 						/>
// 						{item.name}
// 					</button>
// 				))}
// 			</div>

// 			<MobileTabSwitcher
// 				items={items}
// 				activeTab={activeTab}
// 				onTabChange={onTabChange}
// 			/>
// 		</>
// 	);
// };

// interface MobileTabSwitcherProps {
// 	items: TabItem[];
// 	activeTab: string;
// 	onTabChange: (value: SectionType) => void;
// }

// const MobileTabSwitcher = ({
// 	items,
// 	activeTab,
// 	onTabChange,
// }: MobileTabSwitcherProps) => {
// 	const [emblaRef, emblaApi] = useEmblaCarousel({
// 		dragFree: true,
// 		containScroll: "trimSnaps",
// 		align: "center",
// 		skipSnaps: false,
// 	});

// 	useEffect(() => {
// 		if (!emblaApi) return;

// 		const activeIndex = items.findIndex((item) => item.id === activeTab);
// 		if (activeIndex !== -1) {
// 			emblaApi.scrollTo(activeIndex);
// 		}
// 	}, [emblaApi, activeTab, items]);

// 	return (
// 		<div className="relative mx-auto mb-[24px] w-full max-w-[90vw] sm:hidden">
// 			<div
// 				className="overflow-hidden rounded-[68px] bg-[#EAEEF0] p-[3.5px]"
// 				ref={emblaRef}
// 			>
// 				<div className="flex">
// 					{items.map((item) => (
// 						<div
// 							key={item.id}
// 							className="relative min-w-0 max-w-[calc(90vw-2rem)] flex-[0_0_auto]"
// 						>
// 							<button
// 								onClick={() => onTabChange(item.id)}
// 								className={clsx(
// 									"font-montserrat flex items-center justify-center gap-2 whitespace-nowrap rounded-[68px] px-4 py-[12.5px] text-[14px]/[100%] font-medium text-[#808080] transition-colors",
// 									activeTab === item.id && "bg-white text-black",
// 								)}
// 								style={{ minWidth: "fit-content" }}
// 							>
// 								<item.icon
// 									className={clsx("flex-shrink-0", {
// 										"active-icon-gold":
// 											activeTab === item.id && item.id === "stars",
// 										"active-icon-ton":
// 											activeTab === item.id && item.id === "ton",
// 										"active-icon-premium":
// 											activeTab === item.id &&
// 											item.id === "premium" &&
// 											!item.stroke,
// 										"active-icon-premium-stroke":
// 											activeTab === item.id &&
// 											item.id === "premium" &&
// 											item.stroke,
// 										"active-icon":
// 											activeTab === item.id &&
// 											!item.stroke &&
// 											item.id !== "ton" &&
// 											item.id !== "premium" &&
// 											item.id !== "stars",
// 										"active-icon-stroke":
// 											activeTab === item.id &&
// 											item.stroke &&
// 											item.id !== "premium" &&
// 											item.id !== "stars",
// 										"inactive-icon": activeTab !== item.id && !item.stroke,
// 										"inactive-icon-stroke":
// 											activeTab !== item.id && item.stroke,
// 									})}
// 								/>
// 								<span className="truncate">{item.name}</span>
// 							</button>
// 						</div>
// 					))}
// 				</div>
// 			</div>
// 		</div>
// 	);
// };
