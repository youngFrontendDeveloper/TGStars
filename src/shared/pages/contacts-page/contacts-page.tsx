import { definePage } from "@/features/next/define-page";

export const ContactsPage = definePage({
	name: "ContactsPage",

	render() {
		return (			
			<section className="container !gap-5">
				<h1 className="font-mts-extended pt-2 text-xl/[22px] font-medium text-black sm:pt-0">
					Контакты
				</h1>
				{/* <p className="font-mts-extended pt-2 text-xl/[22px] font-medium text-black sm:pt-0">
					Контакты
				</p> */}
				<div className="flex flex-col gap-6 rounded-2xl bg-white p-6 sm:gap-8 sm:px-10 sm:py-[30px]">
					<div className="flex flex-col gap-2">
						<p className="docs-header">Наша почта</p>
						<a href="mailto:tgstars@inbox.ru" className="docs-text text-[#95A0A7]">
							tgstars@inbox.ru
						</a>
					</div>
					<div className="flex flex-col gap-2">
						<p className="docs-header">Поддержка в Telegram</p>
						<a href="https://t.me/TGStarsSupport" target="_blank" className="docs-text text-[#95A0A7]">
							@TGStarsSupport
						</a>
					</div>
				</div>
			</section>			
		);
	},
}
			
);