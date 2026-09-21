import { ThemeSwitcher } from "@components";
import { Button, ButtonView, Dialog, IconName } from "chop-logic-components";
import { useState } from "react";
import "./Settings.styles.css";

const Settings = ({ className }: { className?: string }) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleOpen = () => {
		setIsOpen(true);
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	return (
		<>
			<Button
				className={className}
				icon={IconName.Settings}
				label="Toggle color theme"
				onClick={handleOpen}
				view={ButtonView.Icon}
			/>
			<Dialog
				isOpened={isOpen}
				onClose={handleClose}
				icon={IconName.Settings}
				title="Settings"
			>
				<div className="settings__content">
					<ThemeSwitcher className="settings__item" />
				</div>
			</Dialog>
		</>
	);
};

export default Settings;
