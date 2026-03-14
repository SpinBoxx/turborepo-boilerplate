import {
	Badge,
	Button,
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	Spinner,
} from "@zanadeal/ui";
import { BedDouble, PlusCircleIcon, PlusIcon } from "lucide-react";
import { RoomCard } from "@/features/rooms/components/room";
import UpsertRoomDialog from "../../components/dialogs/UpsertRoomDialog";
import { useRoomListContext } from "../../hooks/useRoomListParams";

export default function DisplayRoomsByHotel() {
	const { hotels, isPending, isError, errorMessage } = useRoomListContext();

	if (isPending) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Spinner />
					</EmptyMedia>
					<EmptyTitle>Chargement des chambres...</EmptyTitle>
				</EmptyHeader>
			</Empty>
		);
	}

	if (isError) {
		return <div className="text-destructive text-sm">{errorMessage}</div>;
	}

	if (!hotels.length) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<BedDouble />
					</EmptyMedia>
					<EmptyTitle>Aucune chambre</EmptyTitle>
					<EmptyDescription>
						Aucun hôtel ne correspond à votre recherche, ou aucune chambre n'a
						encore été créée.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<div className="flex flex-col gap-8">
			{hotels.map((hotel) => (
				<div key={hotel.id} className="flex flex-col gap-4">
					<h2 className="relative flex items-center gap-3 pl-4 font-semibold text-lg after:absolute after:top-1/2 after:left-0 after:h-6 after:w-1.5 after:-translate-y-1/2 after:rounded-full after:bg-indigo-500 after:content-['']">
						{hotel.name}
						<Badge variant={"outline"}>{hotel.rooms.length}</Badge>
						<UpsertRoomDialog hotelId={hotel.id}>
							<Button size={"icon"} variant={"outline"}>
								<PlusIcon className="size-6" />
							</Button>
						</UpsertRoomDialog>
					</h2>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
						{hotel.rooms.map((room) => (
							<RoomCard key={room.id} room={room} />
						))}
					</div>
				</div>
			))}
		</div>
	);
}
