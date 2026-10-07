import { Button, ButtonView, Dialog, IconName } from "chop-logic-components";
import { useState } from "react";
import { MenuContent } from "./MenuContent";

const Menu = () => {
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
				className="menu__button"
				icon={IconName.Menu}
				label="Open menu"
				onClick={handleOpen}
				view={ButtonView.Icon}
			/>
			<Dialog
				isOpened={isOpen}
				onClose={handleClose}
				title="Menu"
				className="menu__dialog"
				bodyClassName="menu__content"
			>
				<MenuContent />
			</Dialog>
		</>
	);
};

export default Menu;
