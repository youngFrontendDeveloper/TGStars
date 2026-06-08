import { type ReactNode } from "react";
import * as v from "valibot";

type Schema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;

type RenderProps<
	P extends Schema | undefined,
	S extends Schema | undefined,
> = P extends Schema
	? S extends Schema
		? {
				params: v.InferOutput<P>;
				searchParams: v.InferOutput<S>;
			}
		: {
				params: v.InferOutput<P>;
			}
	: S extends Schema
		? {
				searchParams: v.InferOutput<S>;
			}
		: object;

type PageProps<
	P extends Schema | undefined,
	S extends Schema | undefined,
> = P extends Schema
	? S extends Schema
		? {
				params: Promise<v.InferInput<P>>;
				searchParams: Promise<v.InferInput<S>>;
			}
		: {
				params: Promise<v.InferInput<P>>;
			}
	: S extends Schema
		? {
				searchParams: Promise<v.InferInput<S>>;
			}
		: object;

export interface DefinePageOptions<
	P extends Schema | undefined = undefined,
	S extends Schema | undefined = undefined,
> {
	name: string;
	params?: P;
	searchParams?: S;
	render: (props: RenderProps<P, S>) => ReactNode;
	onError?: (error: unknown) => void | Promise<void>;
	fallback?: (error: unknown) => ReactNode;
}

export function definePage<
	P extends Schema | undefined = undefined,
	S extends Schema | undefined = undefined,
>(options: DefinePageOptions<P, S>) {
	const Page = async (props: PageProps<P, S>) => {
		let parsedParams;
		let parsedSearchParams;

		try {
			if (options.params != undefined) {
				const params = await (
					props as Extract<PageProps<P, S>, { params: unknown }>
				).params;

				parsedParams = await v.parseAsync(options.params, params);
			}

			if (options.searchParams != undefined) {
				const searchParams = await (
					props as Extract<PageProps<P, S>, { searchParams: unknown }>
				).searchParams;

				parsedSearchParams = await v.parseAsync(
					options.searchParams,
					searchParams,
				);
			}
		} catch (error) {
			const onErrorResult = options.onError?.(error);

			if (onErrorResult instanceof Promise) {
				await onErrorResult;
			}

			if (options.fallback != undefined) {
				return <>{options.fallback(error)}</>;
			}

			throw error;
		}

		const renderProps = {
			params: parsedParams,
			searchParams: parsedSearchParams,
		} as RenderProps<P, S>;

		return <>{options.render(renderProps)}</>;
	};

	if (process.env.NODE_ENV === "development") {
		Page.displayName = `${Page.name}(${options.name})`;
	}

	return Page;
}
