export async function urlToFile(
	url: string,
	filename: string,
	mimeType?: string,
): Promise<File> {
	try {
		const response = await fetch(url);
		if (!response.ok)
			throw new Error(`Failed to fetch image: ${response.statusText}`);
		const blob = await response.blob();
		const type = mimeType || blob.type || "image/jpeg";
		return new File([blob], filename, { type, lastModified: Date.now() });
	} catch (error) {
		console.error("Error converting URL to File:", error);
		throw error;
	}
}

export function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});
}

export function base64ToFile(
	base64: string,
	filename: string,
	mimeType?: string,
): File {
	const arr = base64.split(",");
	const mime = mimeType || arr[0]?.match(/:(.*?);/)?.[1] || "image/jpeg";
	const bstr = atob(arr[1] || base64);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], filename, { type: mime, lastModified: Date.now() });
}
