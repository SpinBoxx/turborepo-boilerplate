import { Carousel } from "@/components/carousel/Carousel";
import CarouselProvider from "@/components/carousel/CarouselProvider";
import { useHotelContext } from "./HotelProvider";

export default function HotelCarousel() {
	const { hotel } = useHotelContext();

	return (
		<CarouselProvider
			images={hotel.images}
			variant="room-gallery"
			responsiveWidths={[600, 900, 1200]}
			alt={hotel.name}
		>
			<Carousel />
		</CarouselProvider>
	);
}
