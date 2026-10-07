import { ThemeSwitcher } from "@components";
import {
	IconName,
	Menu,
	type MenuItem,
	OrientationMode,
} from "chop-logic-components";
import "./Menu.styles.css";

const menuItems: MenuItem[] = [
	{
		label: "Home",
		id: "home-page",
		icon: IconName.Home,
		link: "/",
		target: "_self",
	},
	{
		label: "Blog",
		id: "blog-page",
		icon: IconName.BookOpen,
		link: "/blog",
		target: "_self",
	},
	{
		label: "About",
		id: "about-page",
		icon: IconName.Info,
		link: "/about",
		target: "_self",
	},
	{
		label: "Privacy Policy",
		id: "privacy-policy-page",
		icon: IconName.Briefcase,
		link: "/privacy-policy",
		target: "_self",
	},
];

export const MenuContent = () => {
	return (
		<>
			<Menu
				items={menuItems}
				mode={OrientationMode.Vertical}
				className="menu__links"
			/>
			<div className="menu__settings">
				<ThemeSwitcher className="menu__item" />
			</div>
		</>
	);
};
