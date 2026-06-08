import { type ButtonHTMLAttributes } from "react";

export const Button = ({
	children,
	className,
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
	return (
		<button
			{...props}
			className={`font-mts-text relative flex cursor-pointer items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-[#2563EB] to-[#9333EA] px-3 py-2.5 text-base/[22px] font-medium text-white before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-[#2563EB] before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100 ${className}`}
		>
			{children}
			{/* <div className="relative z-10 flex items-center gap-1.5">{children}</div> */}
		</button>
	);
};
