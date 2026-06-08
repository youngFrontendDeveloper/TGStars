import { type PropsWithChildren } from "react";

export type DataType = object | null | undefined;
export type ErrorType = string | null | undefined;
export type ChildrenFnType<T> = (data: NonNullable<T>) => React.ReactNode;

const ErrorTitle = ({ children }: PropsWithChildren) => {
	return (
		<div>
			<h1 style={{ marginTop: "50px" }} className="title">
				{children}
			</h1>
		</div>
	);
};

export default function ErrorHandler<T extends DataType, E extends ErrorType>({
	data,
	errorMsg,
	message,
	children,
}: {
	data?: T;
	errorMsg?: E;
	message?: string;
	children: ChildrenFnType<T>;
}) {
	if (errorMsg) {
		return <ErrorTitle>{errorMsg}</ErrorTitle>;
	}

	if (!data || (Array.isArray(data) && data.length === 0)) {
		return <ErrorTitle>{message ?? "Something went wrong..."}</ErrorTitle>;
	}

	return <>{children(data)}</>;
}
