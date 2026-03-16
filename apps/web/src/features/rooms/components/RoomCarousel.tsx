import { Carousel } from "@/components/carousel/Carousel";
import CarouselProvider from "@/components/carousel/CarouselProvider";
import { useRoomContext } from "./RoomProvider";

export default function RoomCarousel() {
	const { room } = useRoomContext();

	return (
		<CarouselProvider
			images={room.images}
			variant="gallery"
			responsiveWidths={[600, 900, 1200]}
			alt={room.title}
		>
			<Carousel />
		</CarouselProvider>
	);
}
