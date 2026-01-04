import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@zanadeal/ui/components/button";
import { useMemo, useState } from "react";
import { useCreateHotel, useHotel } from "../features/hotel/hotel.queries";

export const Route = createFileRoute("/mon-hotel")({
	component: MonHotelPage,
});

function MonHotelPage() {
	const [hotelIdInput, setHotelIdInput] = useState<string>("1");
	const hotelId = useMemo(() => {
		const v = hotelIdInput.trim();
		return v.length > 0 ? v : null;
	}, [hotelIdInput]);

	const hotelQuery = useHotel(hotelId);
	const createHotelMutation = useCreateHotel();

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [address, setAddress] = useState("");
	const [mapLink, setMapLink] = useState("");
	const [latitude, setLatitude] = useState("");
	const [longitude, setLongitude] = useState("");

	return (
		<div className="space-y-6 p-4">
			<div className="space-y-2">
				<h2 className="font-semibold text-xl">Mon hôtel</h2>
				<p className="text-sm opacity-80">
					API: <code>/api/hotels</code> (GET /:id, POST)
				</p>
			</div>

			<section className="space-y-3">
				<h3 className="font-medium">Récupérer un hôtel</h3>
				<div className="flex items-end gap-3">
					<label className="flex flex-col gap-1">
						<span className="text-sm">Hotel ID gggGG</span>
						<input
							className="rounded border px-3 py-2"
							value={hotelIdInput}
							onChange={(e) => setHotelIdInput(e.target.value)}
						/>
					</label>
					<Button variant={"secondary"}>feff</Button>
					<Button
						className="rounded border px-3 py-2"
						onClick={() => hotelQuery.refetch()}
						disabled={hotelId == null || hotelQuery.isFetching}
						type="button"
					>
						Refetch
					</Button>
				</div>

				{hotelQuery.isLoading && <p>Chargement…</p>}

				{hotelQuery.error && (
					<ErrorBlock title="Erreur GET" error={hotelQuery.error} />
				)}

				{hotelQuery.data && (
					<div className="rounded border p-3">
						<div className="font-medium">{hotelQuery.data.name}</div>
						<div className="text-sm opacity-80">{hotelQuery.data.address}</div>
						<div className="text-xs opacity-60">id: {hotelQuery.data.id}</div>
					</div>
				)}
			</section>

			<section className="space-y-3">
				<h3 className="font-medium">Créer un hôtel (protégé)</h3>
				<div className="grid max-w-md gap-3">
					<label className="flex flex-col gap-1">
						<span className="text-sm">Nom</span>
						<input
							className="rounded border px-3 py-2"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</label>
					<label className="flex flex-col gap-1">
						<span className="text-sm">Description</span>
						<input
							className="rounded border px-3 py-2"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</label>
					<label className="flex flex-col gap-1">
						<span className="text-sm">Adresse</span>
						<input
							className="rounded border px-3 py-2"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
						/>
					</label>
					<label className="flex flex-col gap-1">
						<span className="text-sm">Map link</span>
						<input
							className="rounded border px-3 py-2"
							value={mapLink}
							onChange={(e) => setMapLink(e.target.value)}
						/>
					</label>
					<label className="flex flex-col gap-1">
						<span className="text-sm">Latitude</span>
						<input
							className="rounded border px-3 py-2"
							value={latitude}
							onChange={(e) => setLatitude(e.target.value)}
						/>
					</label>
					<label className="flex flex-col gap-1">
						<span className="text-sm">Longitude</span>
						<input
							className="rounded border px-3 py-2"
							value={longitude}
							onChange={(e) => setLongitude(e.target.value)}
						/>
					</label>
					<button
						className="rounded border px-3 py-2"
						onClick={async () =>
							await createHotelMutation.mutateAsync({
								name,
								description,
								address,
								mapLink,
								latitude,
								longitude,
							})
						}
						disabled={createHotelMutation.isPending}
						type="button"
					>
						Créer
					</button>
				</div>

				{createHotelMutation.error && (
					<ErrorBlock title="Erreur POST" error={createHotelMutation.error} />
				)}

				{createHotelMutation.data && (
					<div className="rounded border p-3">
						Créé: {createHotelMutation.data.name} (id{" "}
						{createHotelMutation.data.id})
					</div>
				)}
			</section>
		</div>
	);
}

function ErrorBlock({ title, error }: { title: string; error: unknown }) {
	let message = "Erreur inconnue";
	let detail: string | null = null;

	if (error instanceof Error) {
		message = error.message;
	} else if (typeof error === "string") {
		message = error;
	}

	try {
		detail = JSON.stringify(error);
	} catch {
		detail = null;
	}

	return (
		<div className="rounded border p-3">
			<div className="font-medium">{title}</div>
			<div className="text-sm">{message}</div>
			{detail ? (
				<pre className="whitespace-pre-wrap text-xs opacity-80">{detail}</pre>
			) : null}
		</div>
	);
}
