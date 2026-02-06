import { fileToBase64 } from "@zanadeal/utils";
import type { Dispatch } from "react";
import { UploadImages } from "@/components/images/UploadImages";
import { withForm } from "@/hooks/useAppForm";
import { ROOM_UPSERT_DEFAULT_VALUES } from "../upsertRoom.config";

const RoomImagesStep = withForm({
	defaultValues: ROOM_UPSERT_DEFAULT_VALUES,
	props: {
		files: [] as File[],
		setFiles: (() => {}) as Dispatch<React.SetStateAction<File[]>>,
	},
	render: function Render({ form, files, setFiles }) {
		return (
			<div className="w-full space-y-4">
				<form.AppField name="images" mode="array">
					{(field) => (
						<UploadImages
							files={files}
							setFiles={setFiles}
							onFileAccept={async (file) => {
								const base64 = await fileToBase64(file);
								field.pushValue({ base64 });
							}}
							options={{
								maxFiles: 7,
							}}
						/>
					)}
				</form.AppField>
			</div>
		);
	},
});

export default RoomImagesStep;
