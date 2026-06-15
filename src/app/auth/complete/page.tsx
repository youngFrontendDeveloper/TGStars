"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { checkAuth, getProfile } from "@/features/auth/api/api";
import { useAuth } from "@/shared/layouts/auth-provider/auth-provider";

function AuthCompleteContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { setAuthData, setOrderData } = useAuth();
	const [status, setStatus] = useState("Проверка авторизации...");

	useEffect(() => {
		const token = searchParams.get("token");

		if (!token) {
			setStatus("Токен не найден");
			setTimeout(() => router.push("/auth"), 2000);
			return;
		}

		const authenticate = async () => {
			try {
				const authData = await checkAuth(token);

				if (authData.authenticated && authData.user) {
					setStatus("Авторизация успешна! Перенаправление...");

					// Очищаем реферальный код после успешной авторизации
					localStorage.removeItem("pending_referral_code");
					console.log("✅ Реферальный код очищен после авторизации");

					const userData = await getProfile();
					setAuthData(userData.user);
					setOrderData(userData.orders);
					setTimeout(() => router.push("/profile"), 500);
				} else {
					setStatus("Ошибка авторизации. Попробуйте снова.");
					setTimeout(() => router.push("/auth"), 2000);
				}
			} catch (error) {
				console.error("Auth error:", error);
				setStatus("Ошибка авторизации");
				setTimeout(() => router.push("/auth"), 2000);
			}
		};

		authenticate();
	}, [searchParams, router, setAuthData, setOrderData]);

	return (
		<div className="container items-center pt-36">
			<div className="mx-auto flex w-full flex-col items-center gap-8 rounded-2xl bg-white px-10 py-[30px] shadow-[0px_0px_11px_0px_#00000005] sm:w-[350px]">
				<p className="font-montserrat text-[28px]/[28px] font-bold text-[#1D2123]">
					TGStars
				</p>
				<p className="font-inter text-[16px] text-[#95A0A7]">{status}</p>
			</div>
		</div>
	);
}

export default function AuthCompletePage() {
	return (
		<Suspense
			fallback={
				<div className="container items-center pt-36">
					<div className="mx-auto flex w-full flex-col items-center gap-8 rounded-2xl bg-white px-10 py-[30px] shadow-[0px_0px_11px_0px_#00000005] sm:w-[350px]">
						<p className="font-montserrat text-[28px]/[28px] font-bold text-[#1D2123]">
							TGStars
						</p>
						<p className="font-inter text-[16px] text-[#95A0A7]">Загрузка...</p>
					</div>
				</div>
			}
		>
			<AuthCompleteContent />
		</Suspense>
	);
}
