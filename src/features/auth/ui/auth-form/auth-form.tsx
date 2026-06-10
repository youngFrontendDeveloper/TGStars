"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/shared/layouts/auth-provider/auth-provider";

import TgIcon from "@/public/assets/icons/tg.svg";

import { checkAuth, getAuthLink, getProfile } from "../../api/api";

export const AuthForm = () => {
	const [loading, setLoading] = useState(false);
	const [polling, setPolling] = useState(false);
	const [id, setId] = useState("");
	const { setAuthData, setOrderData } = useAuth();
	const router = useRouter();
	useEffect(() => {
		let intervalId: NodeJS.Timeout;
		if (polling) {
			intervalId = setInterval(async () => {
				try {
					const authData = await checkAuth(id);
					if (authData.authenticated && authData.user) {
						clearInterval(intervalId);
						setPolling(false);
						setLoading(false);

						// Очищаем реферальный код после успешной авторизации
						localStorage.removeItem("pending_referral_code");
						console.log("✅ Реферальный код очищен после авторизации");

						const userData = await getProfile();
						setAuthData(userData.user);
						setOrderData(userData.orders);
						setTimeout(() => router.push("/profile"), 500);
					}
				} catch (error) {
					console.error("Polling error:", error);
				}
			}, 2000);
			setTimeout(() => {
				if (intervalId) {
					clearInterval(intervalId);
					setPolling(false);
					setLoading(false);
					console.log("Polling timeout after 2 minutes");
				}
			}, 120_000);
		}
		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	}, [polling, setAuthData, setOrderData, id, router]);
	const handleAuth = async () => {
		try {
			const data = await getAuthLink();
			setLoading(true);
			const id = (data.auth_link as string).split("start=webauth_");
			const token = (data.auth_link as string).split("start=");
			setId(id[1]);
			const isMobile = () =>
				/android|iphone|ipad|ipod|opera mini/i.test(navigator.userAgent);
			if (isMobile()) {
				globalThis.window.location.href = `tg://resolve/?domain=TG_StarsAutobot&start=${token[1]}`;
			} else {
				globalThis.window.open(data.auth_link, "_blank");
			}
			globalThis.window.open(
				data.auth_link,
				"_blank",
				"width=600,height=700,noopener,noreferrer",
			);
			setPolling(true);
		} catch (error) {
			console.error("Failed to get auth link:", error);
			setLoading(false);
		}
	};
	return (
		<div className="flex w-full flex-col items-center gap-8 rounded-2xl bg-white px-10 py-[30px] shadow-[0px_0px_11px_0px_#00000005] sm:w-[350px]">
			<Image
				src="/assets/icons/logo-bigger-v2.svg"
				alt="TGStars"
				width={207}
				height={38}
			/>
			<Button
				onClick={handleAuth}
				disabled={loading || polling}
				maxWidth="251px"			
			>
				<TgIcon className="white-icon" />
				{loading || polling
					? "Проверка авторизации..."
					: "Войти через Telegram"}
			</Button>
			<p className="font-mts-text text-sm/[22px] text-[#95A0A7]">
				Нажимая кнопку &quot;Войти через Telegram&quot;, вы соглашаетесь с
				<Link
					href={"/public-offer"}
					className="!underline"
					target="_blank"
					rel="noopener noreferrer"
				>
					публичной офертой
				</Link>
				,
				<Link
					href={"/privacy-policy"}
					className="!underline"
					target="_blank"
					rel="noopener noreferrer"
				>
					политикой конфиденциальности
				</Link>
				, а также даёте cогласие на обработку персональных данных.
			</p>
		</div>
	);
};
