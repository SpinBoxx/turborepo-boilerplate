import type { Room } from "@zanadeal/api/features/room/room.schemas";
import { useAppForm } from "@/hooks/useAppForm";
import { getInitValues } from "./upsertRoom.config";

interface Props {
	room?: Room;
	hotelId: string;
}

export default function UpsertRoomForm({ room, hotelId }: Props) {
	const _form = useAppForm({
		defaultValues: getInitValues(hotelId, room),
		onSubmit: async ({ value }) => {
			console.log(value);
		},
	});

	return <div>form {hotelId}</div>;
}
