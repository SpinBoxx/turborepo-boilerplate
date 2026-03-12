import { HotelIcon, type LucideIcon, MailIcon, PhoneIcon } from "lucide-react";
import CopyButton from "@/components/buttons/CopyButton";
import { Card, CardContent } from "@/components/ui/card";
import HotelDescription from "../../components/HotelDescription";
import HotelEmail from "../../components/HotelEmail";
import HotelPhoneNumber from "../../components/HotelPhoneNumber";
import { useHotelContext } from "../../components/HotelProvider";
import HotelDetailSectionTitle from "./HotelDetailSectionTitle";

const HotelDetailInformationTab = () => {
	const { hotel } = useHotelContext();
	return (
		<div className="space-y-5">
			<div className="space-y-2">
				<HotelDetailSectionTitle>À propos de l'hôtel</HotelDetailSectionTitle>
				<HotelDescription className="text-muted-foreground" />
			</div>
			<div className="flex flex-col gap-3">
				<HotelDetailSectionTitle>Contact</HotelDetailSectionTitle>
				{hotel.email && (
					<ContactInfo
						icon={MailIcon}
						label="Email address"
						value={hotel.email}
					/>
				)}
				{hotel.phoneNumber && (
					<ContactInfo
						icon={PhoneIcon}
						label="Phone number"
						value={hotel.phoneNumber}
					/>
				)}
			</div>
		</div>
	);
};

export default HotelDetailInformationTab;

type ContactInfoProps = {
	icon: LucideIcon;
	label: string;
	value: string;
};

const ContactInfo = ({ icon: Icon, label, value }: ContactInfoProps) => {
	return (
		<div className="flex flex-row gap-4">
			<Card className="h-fit w-fit flex-none bg-secondary/50">
				<CardContent className="p-3">
					<Icon className="text-primary" />
				</CardContent>
			</Card>

			<div className="flex flex-col">
				<p className="text-primary text-sm">{label}</p>
				<div className="flex items-center gap-1">{value}</div>
			</div>
			<CopyButton variant={"ghost"} className="self-center" />
		</div>
	);
};
