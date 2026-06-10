"use client";

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
	const [isMobile, setIsMobile] = useState<boolean>(false);

	useEffect(() => {
		const mediaQuery = globalThis.matchMedia(
			`(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
		);

		setIsMobile(mediaQuery.matches);

		const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
		mediaQuery.addEventListener("change", handler);

		return () => mediaQuery.removeEventListener("change", handler);
	}, []);

	return isMobile;
}
