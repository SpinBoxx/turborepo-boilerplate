import { Skeleton } from "@zanadeal/ui";

const HotelDetailMapSkeleton = () => {
	return (
		<div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
			<div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(255,255,255,0.22)_25%,rgba(255,255,255,0.22)_26%,transparent_27%,transparent_74%,rgba(255,255,255,0.22)_75%,rgba(255,255,255,0.22)_76%,transparent_77%),linear-gradient(transparent_24%,rgba(255,255,255,0.22)_25%,rgba(255,255,255,0.22)_26%,transparent_27%,transparent_74%,rgba(255,255,255,0.22)_75%,rgba(255,255,255,0.22)_76%,transparent_77%)] bg-size-[72px_72px] opacity-40" />
			<div className="absolute inset-x-5 top-5 flex items-start justify-between">
				<div className="space-y-2">
					<Skeleton className="h-4 w-28 bg-background/70" />
					<Skeleton className="h-3 w-44 bg-background/60" />
				</div>
				<Skeleton className="size-10 rounded-full bg-background/70" />
			</div>
			<div className="absolute inset-0 flex items-center justify-center">
				<div className="relative flex items-center justify-center">
					<Skeleton className="size-24 rounded-full bg-background/30" />
					<Skeleton className="absolute size-10 rounded-full bg-background/75" />
					<Skeleton className="absolute top-[58%] h-6 w-6 rotate-45 rounded-sm bg-background/75" />
				</div>
			</div>
			<div className="absolute inset-x-5 bottom-5 flex justify-between gap-3">
				<Skeleton className="h-12 flex-1 rounded-xl bg-background/65" />
				<Skeleton className="h-12 w-24 rounded-xl bg-background/65" />
			</div>
		</div>
	);
};

export default HotelDetailMapSkeleton;
