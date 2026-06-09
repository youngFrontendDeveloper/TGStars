import { BuyForm } from "@/features/buy-form";
import { definePage } from "@/features/next/define-page";
import { CustomAccordion } from "@/shared/components/ui/accordion";

import { Bonus } from "./components/bonus";
import { BonusDiscovers } from "./components/bonus-discovers";

export const MainPage = definePage({
	name: "MainPage",
	async render() {
		return (
			<>
				<h1 className="sr-only">Купить звезды Телеграм, Премиум, TON</h1>
				<div className="container">
					<section className="relative z-0 flex items-center justify-center">
						<BuyForm />
						{/* Градиентный фон под формой    */}
						<div className="-z-10 hidden h-[70%] w-full grid-cols-6 opacity-70 blur-[50px] md:absolute md:grid">
							<div className="mt-10 h-full w-full bg-[#3BC7FF]"></div>
							<div className="h-full w-full bg-[#B34BFF]"></div>
							<div className="h-full w-full bg-[#3E5BFF]"></div>
							<div className="h-full w-full bg-[#FF7A35]"></div>
							<div className="h-full w-full bg-[#FF4D7E]"></div>
							<div className="-mt-10 h-full w-full bg-[#9A4BFF]"></div>
						</div>
					</section>					
					
					<Bonus />    {/* Реферальная программа    */} 
					<BonusDiscovers />   {/* Бонусная программа  */} 
					{/* Часто задаваемые вопросы  */} 
					<CustomAccordion
						items={[
							{
								id: "1",
								title: "Что такое Telegram Stars?",
								content:
									"Telegram Stars - это премиум-функция, которая позволяет пользователям выделять и улучшать свои сообщения. Их можно использовать, чтобы ваши сообщения выделялись в групповых чатах или каналах.",
							},
							{
								id: "2",
								title: "Сколько времени занимает доставка?",
								content:
									"Обычно доставка происходит мгновенно или в течение нескольких минут после подтверждения оплаты. В редких случаях, при высокой нагрузке, это может занять до 30 минут.",
							},
							{
								id: "3",
								title: "Безопасно ли покупать звёзды Telegram?",
								content:
									"Да, это абсолютно безопасно. Мы используем надёжные способы оплаты и не запрашиваем ваш пароль от Telegram или какую-либо конфиденциальную информацию. Нам нужен только ваш юзернейм для доставки звёзд.",
							},
							{
								id: "4",
								title: "Какие способы оплаты вы принимаете?",
								content:
									"Мы принимаем СБП (Система Быстрых Платежей), банковские карты, СберПэй и криптовалюту. Все платежи обрабатываются безопасно.",
							},
							{
								id: "5",
								title: "Могу ли я получить возврат, если возникнут проблемы?",
								content:
									"Да, мы предоставляем полный возврат, если звёзды не были доставлены на ваш аккаунт. Пожалуйста, свяжитесь с нашей службой поддержки, если у вас возникли какие-либо проблемы с заказом.",
							},
						]}
					/>
				</div>
			</>
		);
	},
});
