import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/shared/layouts/auth-provider/auth-provider";

import { getMenuItems } from "../../../constants/menu-items";

export const Menu = ({ className }: { className?: string }) => {
	const { user } = useAuth();
	const pathname = usePathname();

	return (
		<ul className={`flex ${className}`}>
			{getMenuItems(user).map((item, index) => {
				const Icon = item.icon; // присваиваем компонент переменной
				const isActive = pathname === item.path;

				return (
					<li key={item.name} className="text-[#374151] hover:text-white">
						<Link
							href={item.path}
							className={`group flex items-center gap-[8px] rounded-[38px] px-[16px] py-[10px] text-[14px] hover:bg-[#2563EB] ${
								isActive ? "bg-[#2563EB] text-white" : "bg-[transparent]"
							}`}
						>
							<Icon
								className={`h-fill w-fill text-[inherit] transition-colors duration-300 ${
									index === 0
										? "group-hover:text-[#FFCF09]"
										: "group-hover:text-white"
								} 
								${
									index === 0 && isActive ? "text-[#FFCF09]" : "text-white"
								}`}
							/>
							<span className="font-mts-wide font-semibold text-[inherit] group-hover:text-white">
								{item.name}
							</span>
						</Link>
					</li>
				);
			})}
		</ul>
	);
};
