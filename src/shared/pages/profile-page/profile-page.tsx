import { BuyForm } from "@/features/buy-form";
import { definePage } from "@/features/next/define-page";

import { History } from "./components/history";
import { Profile } from "./components/profile";

export const ProfilePage = definePage({
	name: "ProfilePage",
	render() {
		return (
			<section className="m-auto">
				<h1 className="sr-only">Страница профиля пользователя</h1>
				<div className="container">
					<Profile />
					<section className="mb-[48px] flex flex-col lg:mb-[58px]">
						<h2 className="font-mts-extended text-[20px]/[22.8px] font-semibold text-black mb-[20px]">
							Купить Звёзды
						</h2>
						<BuyForm />
					</section>
					<History />
				</div>
			</section>
		);
	},
});
