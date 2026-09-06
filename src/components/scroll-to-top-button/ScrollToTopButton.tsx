import { Button, ButtonView, IconName } from "chop-logic-components";
import { useEffect, useState } from "react";

const ScrollToTopButton = ({ className }: { className?: string }) => {
	const [isVisible, setIsVisible] = useState(false);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	useEffect(() => {
		const handleScroll = () => setIsVisible(window.scrollY > 300);

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<Button
			icon={IconName.ArrowUpCircle}
			onClick={scrollToTop}
			className={className}
			view={ButtonView.Icon}
			style={{ display: isVisible ? "block" : "none" }}
		/>
	);
};

export default ScrollToTopButton;
