import { THEME_STORAGE_KEY } from "@constants";
import {
	Button,
	ButtonView,
	CL_DARK_THEME_CLASS,
	CL_LIGHT_THEME_CLASS,
	IconName,
} from "chop-logic-components";
import { useState } from "react";

// Rendered client:only, so the theme applied by the FOUC-prevention script is already on the page.
const ThemeSwitcher = ({ className }: { className?: string }) => {
	const [isDark, setIsDark] = useState(() =>
		document.documentElement.classList.contains(CL_DARK_THEME_CLASS),
	);

	const toggleTheme = () => {
		const nextIsDark = !isDark;
		const nextClass = nextIsDark ? CL_DARK_THEME_CLASS : CL_LIGHT_THEME_CLASS;

		document.documentElement.classList.remove(
			CL_LIGHT_THEME_CLASS,
			CL_DARK_THEME_CLASS,
		);
		document.documentElement.classList.add(nextClass);
		localStorage.setItem(THEME_STORAGE_KEY, nextClass);
		setIsDark(nextIsDark);
	};

	return (
		<Button
			icon={isDark ? IconName.Sun : IconName.Moon}
			label="Toggle color theme"
			onClick={toggleTheme}
			className={className}
			view={ButtonView.Icon}
		/>
	);
};

export default ThemeSwitcher;
