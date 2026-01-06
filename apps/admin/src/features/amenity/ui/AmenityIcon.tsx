import { cn } from "@zanadeal/ui";

export default function AmenityIcon({
	svg,
	className,
}: {
	svg: string;
	className?: string;
}) {
	const src = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

	return (
		<div
			className={cn(
				"flex size-9 items-center justify-center rounded-lg bg-muted text-foreground",
				className,
			)}
		>
			<span
				aria-hidden="true"
				className="size-4 bg-current"
				style={{
					maskImage: src,
					WebkitMaskImage: src,
					maskRepeat: "no-repeat",
					WebkitMaskRepeat: "no-repeat",
					maskPosition: "center",
					WebkitMaskPosition: "center",
					maskSize: "contain",
					WebkitMaskSize: "contain",
				}}
			/>
		</div>
	);
}
