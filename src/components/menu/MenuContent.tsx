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
	},
	{
		label: "Blog",
		id: "blog-page",
		icon: IconName.BookOpen,
		link: "/blog",
	},
	{
		label: "About",
		id: "about-page",
		icon: IconName.Info,
		link: "/about",
	},
];

export const MenuContent = () => {
	return (
		<div className="menu__content">
			<Menu
				items={menuItems}
				mode={OrientationMode.Vertical}
				className="menu__links"
			/>
			<div className="menu__settings">
				<ThemeSwitcher className="menu__item" />
			</div>
		</div>
	);
};
