import { type PropsWithChildren } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Footer } from "@/shared/components/navigation/footer";
import { Header } from "@/shared/components/navigation/header";
import { AuthProvider } from "@/shared/layouts/auth-provider/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
	icons: {
		icon: "/assets/icons/favicon.svg",
	},
	title: "TG Stars | Купить Телеграм Звёзды и Премиум",
	description:
		"Покупайте Звёзды Телеграм по минимальному курсу с моментальной доставкой. На 33% выгоднее, чем в Телеграме",
	verification: {
		yandex: "488e0dd2cc171ef6",
		google: "THUBNx7_SqUcg4tDXGOU2Ywp5N9TZGo5xjK3tbQDfc",
	},
	openGraph:{title:"TG Stars",description:"Купить Telegram Stars",type:"website"},
	twitter:{card:"summary_large_image"},
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="ru">
			<body className="flex min-h-screen w-full flex-col bg-[#E1E8F0] lg:gap-[70px]">
				<a href="#main-content" className="skip-link">Пропустить навигацию</a>
					<AuthProvider>
					<Header />
					<main id="main-content" className="flex flex-1 pt-20 sm:pt-0">{children}</main>
					<Footer />
				</AuthProvider>

				<Script id="yandex-metrika" strategy="afterInteractive">
					{`
						(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
						m[i].l=1*new Date();
						for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
						k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
						(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

						ym(106839675, "init", {
							clickmap:true,
							trackLinks:true,
							accurateTrackBounce:true,
							webvisor:true
						});
					`}
				</Script>
				<noscript>
					<div>
						<img
							src="https://mc.yandex.ru/watch/106839675"
							style={{ position: "absolute", left: "-9999px" }}
							alt="" loading="lazy"
						/>
					</div>
				</noscript>
			</body>
		</html>
	);
}
