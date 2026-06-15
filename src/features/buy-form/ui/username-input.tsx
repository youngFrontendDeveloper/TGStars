"use client";

import { useEffect, useState } from "react";

import { useUser } from "@/shared/layouts/auth-provider/auth-provider";

import UnvalidIcon from "@/public/assets/icons/unvalid.svg";
import ValidIcon from "@/public/assets/icons/valid.svg";

import { checkUsername } from "../api/api";

interface UsernameInputProps {
	value: string;
	onChange: (value: string) => void;
	error: string;
	setError: (val: string) => void;
	setValid: (val: boolean) => void;
}

export const UsernameInput = ({
	value,
	onChange,
	setError,
	setValid,
}: UsernameInputProps) => {
	const { user, isAuthenticated } = useUser();
	const canBuySelf = isAuthenticated && !!user?.telegram_username;
	const [validationState, setValidationState] = useState<
		"idle" | "pending" | "valid" | "invalid"
	>("idle");

	const handleBuySelf = () => {
		const rawUsername = user?.telegram_username?.trim() || "";
		const normalized = rawUsername.replace(/^@/, "");
		if (!normalized) return;
		setError("");
		onChange(normalized);
	};
	useEffect(() => {
		if (!value) {
			setError("");
			setValidationState("idle");
			return;
		}

		setValidationState("pending");
		const handler = setTimeout(async () => {
			try {
				const isValid = await checkUsername(value);
				if (isValid.valid) {
					setError("");
					setValid(true);
					setValidationState("valid");
				} else {
					setError("Указанного аккаунта не существует.");
					setValid(false);
					setValidationState("invalid");
				}
			} catch {
				setError("Указанного аккаунта не существует.");
				setValid(false);
				setValidationState("invalid");
			}
		}, 500);

		return () => clearTimeout(handler);
	}, [value, setError, setValid]);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex w-full items-center justify-between">
				<p className="font-montserrat text-[14px]/[100%] font-semibold text-black">
					Имя пользователя
				</p>
				{canBuySelf && (
					<button
						type="button"
						onClick={handleBuySelf}
						className="font-montserrat text-[14px]/[100%] font-medium text-[#95A0A7] transition-opacity hover:opacity-80"
					>
						Купить себе
					</button>
				)}
			</div>
			<div className="flex items-center gap-1 rounded-xl bg-[#EAEEF0] px-4 py-2.5">
				<p className="font-montserrat text-[16px]/[22.8px] font-medium text-[#95A0A7]">
					@
				</p>
				<input
					placeholder="Введите имя пользователя..."
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="font-montserrat w-full bg-transparent py-1.5 text-[16px]/[22.8px] font-medium text-[#1D2123] outline-none"
				/>
				{validationState === "valid" && (
					<ValidIcon className="h-4 w-4 shrink-0 text-[#22c55e]" />
				)}
				{validationState === "invalid" && (
					<UnvalidIcon className="h-4 w-4 shrink-0 text-[#ef4444]" />
				)}
			</div>
		</div>
	);
};
