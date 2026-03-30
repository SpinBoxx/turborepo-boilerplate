import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	cn,
} from "@zanadeal/ui";
import { OctagonAlert } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { useDeleteRoom } from "../../rooms.queries";

interface Props {
	children: ReactNode;
	id: string;
	className?: string;
}

export default function DeleteRoomAlertDialog({
	children,
	className,
	id,
}: Props) {
	const { isPending, mutateAsync } = useDeleteRoom();

	const onConfirmHandler = async () => {
		toast.promise(mutateAsync({ id }), {
			loading: "Deleting room...",
			success: "Room deleted successfully",
			error: "Failed to delete room",
		});
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild className={cn("", className)}>
				{children}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="w-full">
						<div>
							<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
								<OctagonAlert className="h-7 w-7 text-destructive" />
							</div>
							<p className="text-center">
								Are you absolutely sure to delete this room?
							</p>
						</div>
					</AlertDialogTitle>
					<AlertDialogDescription className="text-center text-[15px]">
						This action cannot be undone. This will permanently delete your room
						and remove all its data.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="mt-2 sm:justify-center">
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirmHandler}
						variant="destructive"
						disabled={isPending}
					>
						Confirm
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
