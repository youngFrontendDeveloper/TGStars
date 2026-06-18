import Image from "next/image";

import { definePage } from "@/features/next/define-page";

import { AuthForm } from "../../../features/auth";

export const AuthPage = definePage({
	name: "AuthPage",
	async render() {
		return (
			<section className="w-full">
				<h1 className="sr-only">Страница входа в профиль TGStars</h1>
				<div className="container h-full items-center">
					<div className="relative z-0 flex h-full w-full items-center justify-center">
						<AuthForm />
						<Image
							src="./assets/images/backlight.svg"
							width={597}
							height={490}
							className="absolute -z-10"
							alt="background"
						/>
					</div>
				</div>
			</section>
		);
	},
});
// import { definePage } from "@/features/next/define-page";

// import { AuthForm } from "../../../features/auth";

// export const AuthPage = definePage({
// 	name: "AuthPage",
// 	async render() {
// 		return (
// 			<section className="w-full">
// 				<h1 className="sr-only">Страница входа в профиль TGStars</h1>
// 				<div className="container h-full items-center">
// 					<div className="relative z-0 flex h-full items-center justify-center">
// 						<AuthForm />
// 						<div className="-z-10 hidden h-[312px] w-full max-w-[496px] opacity-70 blur-[50px] lg:absolute lg:grid">
// 							{/* <div className="-z-10 hidden h-[70%] w-full grid-cols-6 opacity-70 blur-[50px] md:absolute md:grid"> */}
// 							<div className="mt-10 h-full w-full bg-[#3BC7FF]"></div>
// 							<div className="h-full w-full bg-[#B34BFF]"></div>
// 							<div className="h-full w-full bg-[#3E5BFF]"></div>
// 							<div className="h-full w-full bg-[#FF7A35]"></div>
// 							<div className="h-full w-full bg-[#FF4D7E]"></div>
// 							<div className="-mt-10 h-full w-full bg-[#9A4BFF]"></div>
// 						</div>
// 					</div>
// 				</div>
// 			</section>
// 		);
// 	},
// });
