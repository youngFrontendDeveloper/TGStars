import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/shared/layouts/auth-provider/auth-provider";

import { getMenuItems } from "../../../constants/menu-items";

const getIconClassName = (isActive: boolean, index: number): string => {
	if (isActive && index === 0) {
		return "text-[#FFCF09]";
	} else if (isActive && index !== 0) {
		return "text-white";
	} else if (!isActive && index === 0) {
		return "group-hover:text-[#FFCF09]";
	} else {
		return "group-hover:text-white";
	}
};

interface MenuProps {
	className?: string;
	setIsMenuOpen: (isOpen: boolean) => void;
}

export const Menu = ({ className, setIsMenuOpen }: MenuProps) => {
	const { user } = useAuth();
	const pathname = usePathname();

	return (
		<ul
			className={`flex w-full max-w-[400px] flex-col gap-[16px] rounded-bl-[20px] rounded-br-[20px] bg-[#E1E8F0] p-[24px] shadow-[0px_4px_10px_0px_#0000001A] lg:w-auto lg:flex-row lg:gap-0 lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none ${className}`}
		>
			{getMenuItems(user).map((item, index) => {
				const Icon = item.icon; // присваиваем компонент переменной
				const isActive = pathname === item.path;

				return (
					<li
						onClick={() => setIsMenuOpen(false)}
						key={item.name}
						className="w-full min-w-fit max-w-[250px] text-[#374151] hover:text-white"
					>
						<Link
							href={item.path}
							className={`group flex items-center gap-[7px] rounded-[38px] p-[16px] text-[14px] hover:bg-[#2563EB] lg:px-[16px] lg:py-[10px] ${
								isActive ? "bg-[#2563EB] text-white" : "bg-[transparent]"
							}`}
						>
							<span className={`${getIconClassName(isActive, index)}`}>
								<Icon
									className={`h-fill w-fill text-[inherit] transition-colors duration-300`}
								/>
							</span>
							<span className="font-montserrat font-semibold text-[inherit] transition-colors duration-300 group-hover:text-white">
								{item.name}
							</span>
						</Link>
					</li>
				);
			})}
		</ul>
	);
};
