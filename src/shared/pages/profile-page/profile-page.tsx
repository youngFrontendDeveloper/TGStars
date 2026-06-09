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
					<section className="flex flex-col gap-5">
						<h2 className="font-mts-extended text-xl/[22px] font-medium text-black">
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
