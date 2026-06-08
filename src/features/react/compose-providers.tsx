import {
	type ComponentType,
	type FunctionComponent,
	type PropsWithChildren,
} from "react";

export interface Provider<TProps> {
	Component: ComponentType<PropsWithChildren<TProps>>;
	props?: Omit<TProps, "children">;
}

export function createProvider<TProps>(
	Component: Provider<TProps>["Component"],
	props?: Provider<TProps>["props"],
): Provider<TProps> {
	return { Component, props };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function composeProviders<TProviders extends Provider<any>[]>(
	providers: TProviders,
): ComponentType<PropsWithChildren> {
	const ProviderComponent: FunctionComponent<PropsWithChildren> = ({
		children,
	}) => {
		const initialJsx = <>{children}</>;

		// eslint-disable-next-line unicorn/no-array-reduce
		return providers.reduceRight(
			(previousJSX, { Component: CurrentProvider, props = {} }) => (
				<CurrentProvider {...props}>{previousJSX}</CurrentProvider>
			),
			initialJsx,
		);
	};

	return ProviderComponent;
}
