import type { Room } from "@zanadeal/api/features/room/room.schemas";
import { fileToBase64, urlToFile } from "@zanadeal/utils";
import { Euro, ForkKnife, Image, Info, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { FormStepperFooter } from "@/components/stepper/FormStepper/FormStepperFooter";
import FormStepperNav from "@/components/stepper/FormStepper/FormStepperNav";
import {
	type FormStepperStep,
	Stepper,
	StepperContent,
	StepperPanel,
} from "@/components/stepper/FormStepper/FormStepperProvider";
import { useAppForm } from "@/hooks/useAppForm";
import { useCreateRoom, useUpdateRoom } from "../../rooms.queries";
import RoomAmenitiesStep from "./steps/RoomAmenitiesStep";
import RoomImagesStep from "./steps/RoomImagesStep";
import RoomInformationsFormStep from "./steps/RoomInformationsFormStep";
import RoomPricesFormStep from "./steps/RoomPricesFormStep/RoomPricesFormStep";
import { getInitValues } from "./upsertRoom.config";

interface Props {
	room?: Room;
	hotelId: string;
}

export default function UpsertRoomForm({ room, hotelId }: Props) {
	const [files, setFiles] = useState<File[]>([]);
	const createRoom = useCreateRoom();
	const updateRoom = useUpdateRoom(room?.id ?? "");
	const form = useAppForm({
		defaultValues: getInitValues(hotelId, room),
		onSubmit: async ({ value }) => {
			const imagesBase64 = await Promise.all(files.map(fileToBase64));

			if (room) {
				await updateRoom.mutateAsync({
					...value,
					images: imagesBase64.map((base64) => ({ base64 })),
				});
			} else {
				await createRoom.mutateAsync({
					...value,
					images: imagesBase64.map((base64) => ({ base64 })),
				});
			}
		},
	});

	useEffect(() => {
		if (room?.images.length) {
			Promise.all(
				room.images.map((image, index) =>
					urlToFile(image.url, `room-image-${index}.jpg`, "image/jpeg"),
				),
			).then((files) => {
				setFiles(files);
			});
		}
	}, [room?.images]);

	const steps: FormStepperStep[] = [
		{
			content: <RoomInformationsFormStep form={form} />,
			title: "Informations",
			icon: <Info />,
		},
		{
			content: <RoomAmenitiesStep form={form} />,
			title: "Services",
			icon: <ForkKnife />,
		},
		{
			content: <RoomPricesFormStep form={form} />,
			title: "Tarifs",
			icon: <Euro />,
		},
		{
			content: <RoomImagesStep form={form} files={files} setFiles={setFiles} />,
			title: "Images",
			icon: <Image />,
		},
	];

	return (
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="grid gap-4"
			>
				<Stepper
					defaultValue={1}
					stepsCount={steps.length}
					className="space-y-8"
				>
					<FormStepperNav steps={steps} />

					<StepperPanel className="text-sm">
						{steps.map((step, index) => (
							<StepperContent
								key={index}
								value={index + 1}
								className="flex w-full"
							>
								{step.content}
							</StepperContent>
						))}
						<FormStepperFooter>
							<form.AppForm>
								<form.SubmitButton variants={{}}>
									<Save />
									Sauvegarder
								</form.SubmitButton>
							</form.AppForm>
						</FormStepperFooter>
					</StepperPanel>
				</Stepper>
			</form>
		</div>
	);
}
