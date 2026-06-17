import { Accordion } from "@ark-ui/react";
import { clsx } from "clsx";
import { type ReactNode } from "react";

import Arrow from "@/public/assets/icons/faq-arrow.svg";
import Question from "@/public/assets/icons/question.svg";

export interface AccordionItem {
	id: string;
	title: string;
	content?: ReactNode;
}

export interface AccordionProps {
	className?: string;
	items: AccordionItem[];
	collapsible?: boolean;
}

export function CustomAccordion({
	className,
	items,
	collapsible = true,
}: AccordionProps) {
	return (
		<section className="relative -top-[5px] flex flex-col gap-5 ">
			<h2 className="font-montserrat flex items-center gap-[6px] text-[16px]/[22.8px] font-semibold text-black">
				<Question />
				Часто задаваемые вопросы
			</h2>
			<Accordion.Root
				className={clsx("flex w-full flex-col gap-0.5 rounded-2xl shadow-[0_0_11px_0_rgba(0,0,0,0.02)]", className)}
				collapsible={collapsible}
			>
				{items.map((item, i) => (
					<Accordion.Item
						key={item.id}
						className={`bg-[#F7F9FB] px-[24px] md:px-4 ${i === 0 && "rounded-t-2xl"} ${i === items.length - 1 && "rounded-b-2xl"}`}
						value={item.id}
					>
						<Accordion.ItemTrigger className="group flex w-full items-center justify-between py-[20px] text-left text-gray-900 transition-colors">
							<span className="font-montserrat text-[16px]/[22.8px] font-medium text-black">
								{item.title}
							</span>
							<Accordion.ItemIndicator>
								<Arrow className="transition-transform duration-200 group-data-[state=open]:rotate-180" />
							</Accordion.ItemIndicator>
						</Accordion.ItemTrigger>
						<Accordion.ItemContent className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
							<div className="font-inter max-w-[628px] pb-2 text-[14px]/[22.8px] font-normal text-black">
								{item.content}
							</div>
						</Accordion.ItemContent>
					</Accordion.Item>
				))}
			</Accordion.Root>
		</section>
	);
}
