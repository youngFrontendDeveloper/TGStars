import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  maxWidth?: string;
}

export const Button = ({
	children,
	className,
	maxWidth = "auto",
	...props
}:ButtonProps) => {
	return (
		<button
			{...props}
			className={`font-mts-wide w-full h-[44px] relative flex cursor-pointer items-center justify-center gap-[6px] overflow-hidden rounded-[859px] bg-gradient-to-r from-[#2563EB] to-[#9333EA] text-[16px] font-medium leading-[22.8px] text-white hover:bg-gradient-to-r hover:from-[#2563EB] hover:to-[#2563EB] hover:text-white ${className}`}
			style={{ maxWidth, ...props.style }}
		>
			{children}
		</button>
	);
};

// import { type ButtonHTMLAttributes } from "react";

// export const Button = ({
// 	children,
// 	className,
// 	...props
// }: ButtonHTMLAttributes<HTMLButtonElement>) => {
// 	return (
// 		<button
// 			{...props}
// 			className={`font-mts-text relative flex gap-[6px] cursor-pointer items-center overflow-hidden rounded-[859px] bg-gradient-to-r from-[#2563EB] to-[#9333EA] px-[14px] py-[10.5px] text-[16px] font-medium leading-[22.8px] text-white before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-[#2563EB] before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100 ${className}`}
// 		>
// 			 <div className="relative z-10 flex items-center gap-1.5">{children}</div>
// 		</button>
// 	);
// };
