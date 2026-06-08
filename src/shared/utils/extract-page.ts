type BasePayloadPages<T extends string | number | symbol> = {
	[key in T]?: {
		docs: Array<{
			__typename?: string;
			id: string;
			pages?: Array<{
				__typename?: string;
				slug?: string | null;
				title?: string | null;
			}> | null;
		}> | null;
	} | null;
};

export function extractPage<T extends BasePayloadPages<K>, K extends keyof T>(
	rawData: T | undefined,
	key: K,
):
	| NonNullable<NonNullable<NonNullable<T[K]>["docs"]>[number]["pages"]>[number]
	| undefined {
	if (!rawData) return undefined;

	if (!(key in rawData)) return undefined;

	return rawData?.[key]?.docs?.at(0)?.pages?.at(0);
}
