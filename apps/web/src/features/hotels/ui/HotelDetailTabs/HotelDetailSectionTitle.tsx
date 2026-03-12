import type { PropsWithChildren } from "react";

const HotelDetailSectionTitle = ({ children }: PropsWithChildren) => {
	return <p className="font-semibold text-xl">{children}</p>;
};

export default HotelDetailSectionTitle;
