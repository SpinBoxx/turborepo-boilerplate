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
		const n = Number(hotelIdInput);
		return Number.isFinite(n) && n > 0 ? n : null;
	}, [hotelIdInput]);

	const hotelQuery = useHotel(hotelId);
	const createHotelMutation = useCreateHotel();

	const [name, setName] = useState("");
	const [city, setCity] = useState("");

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
							inputMode="numeric"
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
						<div className="text-sm opacity-80">{hotelQuery.data.city}</div>
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
						<span className="text-sm">Ville</span>
						<input
							className="rounded border px-3 py-2"
							value={city}
							onChange={(e) => setCity(e.target.value)}
						/>
					</label>
					<button
						className="rounded border px-3 py-2"
						onClick={() => createHotelMutation.mutate({ name, city })}
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
