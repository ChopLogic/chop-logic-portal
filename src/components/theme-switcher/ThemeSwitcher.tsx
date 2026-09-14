import { THEME_STORAGE_KEY } from "@constants";
import {
	CL_DARK_THEME_CLASS,
	CL_LIGHT_THEME_CLASS,
	Switch,
} from "chop-logic-components";
import { useState } from "react";

const ThemeSwitcher = () => {
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
		<Switch
			checked={isDark}
			onChange={toggleTheme}
			label={isDark ? "Dark Theme" : "Light Theme"}
			name="theme-switcher"
		/>
	);
};

export default ThemeSwitcher;
