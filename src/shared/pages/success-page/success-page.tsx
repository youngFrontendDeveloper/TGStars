import { definePage } from "@/features/next/define-page";
import { SuccessPageClient } from "./success-page.client";

export const SuccessPage = definePage({
	name: "SuccessPage",
	render() {
		return <SuccessPageClient />;
	},
});
