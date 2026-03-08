import {
	Carousel as CarouselComponent,
	CarouselContent,
	CarouselItem,
} from "@zanadeal/ui";
import { cn } from "@/lib/utils";
import { useCarouselContext } from "./CarouselProvider";

export function Carousel() {
	const { images, actions, states } = useCarouselContext();
	const { onThumbClick, setMainApi, setThumbApi } = actions;
	const { selectedIndex } = states;

	if (!images.length) return null;

	return (
		<div className="flex w-full flex-col gap-3">
			{/* Main slide */}
			<CarouselComponent
				setApi={setMainApi}
				opts={{ align: "start" }}
				className="w-full overflow-hidden rounded-xl"
			>
				<CarouselContent>
					{images.map((image, index) => (
						<CarouselItem
							key={index}
							className="relative aspect-video w-full overflow-hidden"
						>
							<img
								src={image.src}
								srcSet={image.srcSet}
								sizes="(max-width: 768px) 100vw, 80vw"
								alt={image.alt ?? `Slide ${index + 1}`}
								loading={index === 0 ? "eager" : "lazy"}
								decoding="async"
								className="aspect-video w-full object-cover"
							/>
						</CarouselItem>
					))}
				</CarouselContent>
			</CarouselComponent>

			{/* Thumbnails */}
			{images.length > 1 && (
				<CarouselComponent
					setApi={setThumbApi}
					opts={{
						containScroll: "keepSnaps",
						dragFree: true,
					}}
					className="w-full"
				>
					<CarouselContent className="-ml-2 flex-row">
						{images.map((image, index) => (
							<CarouselItem
								key={index}
								className="basis-1/5 cursor-pointer pl-2 sm:basis-1/6 md:basis-1/8"
								onClick={() => onThumbClick(index)}
							>
								<div
									className={cn(
										"relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
										index === selectedIndex
											? "border-primary opacity-100"
											: "border-transparent opacity-40 hover:opacity-70",
									)}
								>
									<img
										src={image.src}
										alt={image.alt ?? `Thumb ${index + 1}`}
										loading="lazy"
										decoding="async"
										className="absolute inset-0 size-full object-cover"
									/>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
				</CarouselComponent>
			)}
		</div>
	);
}
