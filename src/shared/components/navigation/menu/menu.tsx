import Link from "next/link";

import { useAuth } from "@/shared/layouts/auth-provider/auth-provider";

import { getMenuItems } from "../../../constants/menu-items";

// type menuItems={
//   name: string,
//   path: string,
//   icon: React.ComponentType,
// }
export const Menu = () => {
	const { user } = useAuth();

	return (
		<ul>
			{getMenuItems(user).map((item) => {
				const Icon = item.icon; // присваиваем компонент переменной
				return (
					<li key={item.name}>
						<Link
							href={item.path}
							className="font-mts-text flex items-center gap-2 rounded-[38px] p-0.5 px-4 py-2.5 text-sm/[100%] font-medium text-[#374151]"
						>
							<Icon className="h-5 w-5" />
							{item.name}
						</Link>
					</li>
				);
			})}
		</ul>
	);
};
