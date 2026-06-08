import { definePage } from "@/features/next/define-page";

import { DevelopBannerV2 } from "./develop-banner-v2/develop-banner-v2";

export const PresentPage = definePage({
	name: "PresentPage",
	render() {
		return (
			<section className="w-full">
				<h1 className="sr-only">
					Купите подарки для Telegram на TGStars					
				</h1>
				<div className="container">
					{/* <DevelopBanner /> */}
					<DevelopBannerV2 />
				</div>
			</section>
		);
	},
});
