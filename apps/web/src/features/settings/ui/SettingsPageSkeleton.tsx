import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPageSkeleton() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-8 w-72" />
			<Skeleton className="h-24 w-full" />
		</div>
	);
}