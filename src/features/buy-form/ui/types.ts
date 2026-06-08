export type SectionType = "stars" | "premium" | "ton";

export interface TabItem {
	name: string;
	icon: React.ComponentType<{ className?: string }>;
	stroke?: boolean;
	id: SectionType;
}
