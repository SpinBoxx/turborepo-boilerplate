import { Instagram } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, type LinkProps, useMatch } from "@tanstack/react-router";
import { cn } from "@zanadeal/ui";
import { useIntlayer } from "react-intlayer";
import { Separator } from "@/components/ui/separator";
import { constants } from "@/constants/contants";
import Logo from "../../components/Logo";
import ToggleThemeButton from "../../components/theme/ToggleThemeButton";
import Container from "../container";

type FooterLink = { title: string; linkProps: LinkProps };

const Footer = ({ className }: { className?: string }) => {
	const content = useIntlayer("footer");

	const hotelDetailMatch = useMatch({
		from: "/_app/$hotelId/",
		shouldThrow: false,
	});

	const sections: { title: string; links: FooterLink[] }[] = [
		{
			title: content.companyTitle.value,
			links: [
				{
					title: content.about.value,
					linkProps: {
						to: "/about",
					},
				},
				{ title: content.contact.value, linkProps: { to: "/contact" } },
			],
		},
		{
			title: content.legalTitle.value,
			links: [
				{
					title: content.termsAndConditionsOfSale.value,
					linkProps: {
						to: "/terms-and-conditions-of-sale",
					},
				},
				{
					title: content.termsOfService.value,
					linkProps: {
						to: "/terms-of-service",
					},
				},
			],
		},
	];

	return (
		<footer
			className={cn(
				"relative bottom-0 left-1/2 w-screen -translate-x-1/2 border-t bg-muted dark:bg-card",
				hotelDetailMatch && "hidden md:block",
				className,
			)}
		>
			<Container>
				<div className="px-2 pt-6 pb-12">
					<div className="mt-6 grid grid-cols-2 gap-12 sm:grid-cols-4 lg:grid-cols-6">
						<div className="col-span-full lg:col-span-2">
							<Link to="/" className="inline-flex items-center gap-2">
								<Logo />
							</Link>
							<p className="mt-1.5 text-muted-foreground">
								{content.description.value}
							</p>
						</div>

						{sections.map(({ title, links }) => (
							<div key={title}>
								<h3 className="font-semibold text-lg">{title}</h3>
								<ul className="mt-3 flex flex-col gap-2">
									{links.map(({ title, linkProps }) => (
										<li key={title}>
											<Link
												{...linkProps}
												className="text-muted-foreground hover:text-primary"
											>
												{title}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>

				<Separator />

				<div className="flex flex-col-reverse items-center justify-center gap-6 px-2 pt-6 pb-4 sm:flex-row sm:justify-between">
					<p className="font-medium text-muted-foreground text-sm">
						&copy; {new Date().getFullYear()} {constants.COMPANY_NAME}
						{". "}
						{content.allRightsReserved.value}
					</p>

					<div className="flex items-center gap-4">
						<ToggleThemeButton iconClassName="size-5.5" />
						<Link to="/">
							<HugeiconsIcon
								icon={Instagram}
								className="size-6 text-muted-foreground"
							/>
						</Link>
					</div>
				</div>
			</Container>
		</footer>
	);
};

export default Footer;
