import type { CarouselApi } from "@zanadeal/ui";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { buildCloudinaryImage, type CloudinaryVariant } from "@/lib/cloudinary";

// ─── Image types ────────────────────────────────────────────────────

export interface CarouselImageRef {
	url?: string | null;
	publicId?: string | null;
}

export interface CarouselImage {
	src: string;
	srcSet?: string;
	alt?: string;
}

// ─── Props ──────────────────────────────────────────────────────────

interface Props {
	images: CarouselImageRef[];
	variant?: CloudinaryVariant;
	responsiveWidths?: readonly number[];
	alt?: string;
	children: ReactNode | ((context: CarouselContextValue) => ReactNode);
}

// ─── Context ────────────────────────────────────────────────────────

export type CarouselContextValue = {
	images: CarouselImage[];
	states: {
		selectedIndex: number;
		mainApi: CarouselApi;
		thumbApi: CarouselApi;
	};
	actions: {
		onThumbClick: (index: number) => void;
		setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
		setMainApi: React.Dispatch<React.SetStateAction<CarouselApi>>;
		setThumbApi: React.Dispatch<React.SetStateAction<CarouselApi>>;
	};
};

const CarouselProviderContext = createContext<CarouselContextValue>(
	{} as CarouselContextValue,
);

export const useCarouselContext = () => useContext(CarouselProviderContext);

// ─── Helpers ────────────────────────────────────────────────────────

function buildImages(
	raw: CarouselImageRef[],
	variant: CloudinaryVariant,
	responsiveWidths: readonly number[],
	altPrefix: string,
): CarouselImage[] {
	const result: CarouselImage[] = [];

	for (let i = 0; i < raw.length; i++) {
		const img = raw[i];
		if (!img) continue;
		const built = buildCloudinaryImage(img, { variant, responsiveWidths });
		if (!built.src) continue;
		result.push({
			src: built.src,
			srcSet: built.srcSet,
			alt: `${altPrefix} ${i + 1}`,
		});
	}

	return result;
}

// ─── Provider ───────────────────────────────────────────────────────

const DEFAULT_WIDTHS = [400, 800, 1200] as const;

export default function CarouselProvider({
	images: rawImages,
	variant = "gallery",
	responsiveWidths = DEFAULT_WIDTHS,
	alt = "Photo",
	children,
}: Props) {
	const [mainApi, setMainApi] = useState<CarouselApi>();
	const [thumbApi, setThumbApi] = useState<CarouselApi>();
	const [selectedIndex, setSelectedIndex] = useState(0);

	const images = useMemo(
		() => buildImages(rawImages, variant, responsiveWidths, alt),
		[rawImages, variant, responsiveWidths, alt],
	);

	const onThumbClick = useCallback(
		(index: number) => {
			if (!mainApi || !thumbApi) return;
			mainApi.scrollTo(index);
		},
		[mainApi, thumbApi],
	);

	const onSelect = useCallback(() => {
		if (!mainApi || !thumbApi) return;
		const index = mainApi.selectedScrollSnap();
		setSelectedIndex(index);
		thumbApi.scrollTo(index);
	}, [mainApi, thumbApi]);

	useEffect(() => {
		if (!mainApi) return;
		onSelect();
		mainApi.on("select", onSelect);
		mainApi.on("reInit", onSelect);
		return () => {
			mainApi.off("select", onSelect);
			mainApi.off("reInit", onSelect);
		};
	}, [mainApi, onSelect]);

	const contextValue = useMemo<CarouselContextValue>(
		() => ({
			images,
			states: {
				selectedIndex,
				mainApi,
				thumbApi,
			},
			actions: {
				onThumbClick,
				setSelectedIndex,
				setMainApi,
				setThumbApi,
			},
		}),
		[images, selectedIndex, mainApi, thumbApi, onThumbClick],
	);

	return (
		<CarouselProviderContext.Provider value={contextValue}>
			{typeof children === "function" ? children(contextValue) : children}
		</CarouselProviderContext.Provider>
	);
}
