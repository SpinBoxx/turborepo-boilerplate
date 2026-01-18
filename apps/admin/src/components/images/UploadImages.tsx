import {
	Button,
	FileUpload,
	FileUploadDropzone,
	FileUploadItem,
	FileUploadItemDelete,
	FileUploadItemMetadata,
	FileUploadItemPreview,
	FileUploadList,
	FileUploadTrigger,
} from "@zanadeal/ui";
import { Upload, X } from "lucide-react";
import * as React from "react";
import { type SetStateAction, useEffect } from "react";
import { toast } from "sonner";

type UploadOptions = {
	maxFiles?: number;
	maxSize?: number;
};

interface Props {
	files: File[];
	setFiles: React.Dispatch<SetStateAction<File[]>>;
	onFileAccept?: (file: File) => void;
	options?: UploadOptions;
}

export function UploadImages({ files, setFiles, options }: Props) {
	const onFileReject = React.useCallback((file: File, message: string) => {
		toast(message, {
			description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
		});
	}, []);

	const MAX_FILES = options?.maxFiles || 2;
	const MAX_SIZE = options?.maxSize || 5 * 1024 * 1024;

	useEffect(() => {
		console.log(files);
	}, [files]);

	return (
		<FileUpload
			maxFiles={MAX_FILES}
			maxSize={MAX_SIZE}
			className="w-full"
			value={files}
			onValueChange={setFiles}
			onFileReject={onFileReject}
			multiple
			onUpload={(files) => {
				console.log("Uploading files...", files);
			}}
		>
			<FileUploadDropzone>
				<div className="flex flex-col items-center gap-1 text-center">
					<div className="flex items-center justify-center rounded-full border p-2.5">
						<Upload className="size-6 text-muted-foreground" />
					</div>
					<p className="font-medium text-sm">Drag & drop files here</p>
					<p className="text-muted-foreground text-xs">
						Or click to browse (max {MAX_FILES} files, up to{" "}
						{MAX_SIZE / 1024 / 1024}MB each)
					</p>
				</div>
				<FileUploadTrigger asChild>
					<Button variant="outline" size="sm" className="mt-2 w-fit">
						Browse files
					</Button>
				</FileUploadTrigger>
			</FileUploadDropzone>
			<FileUploadList>
				{files.map((file, _index) => (
					<FileUploadItem key={file.name} value={file}>
						<FileUploadItemPreview />
						<FileUploadItemMetadata />
						<FileUploadItemDelete asChild>
							<Button variant="ghost" size="icon" className="size-7">
								<X />
							</Button>
						</FileUploadItemDelete>
					</FileUploadItem>
				))}
			</FileUploadList>
		</FileUpload>
	);
}
