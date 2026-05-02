import type { BookingStatus } from "../../../../db/prisma/generated/enums";

export type BookingStatsInvalidateEventType =
	| "booking.created"
	| "booking.reviewed";

export type BookingStatsInvalidateEvent = {
	bookingId?: string;
	eventId: string;
	hotelId?: string;
	occurredAt: string;
	status?: BookingStatus;
	type: BookingStatsInvalidateEventType;
};

type BookingStatsInvalidateListener = (
	event: BookingStatsInvalidateEvent,
) => void;

const listeners = new Set<BookingStatsInvalidateListener>();

function createEventId() {
	return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export function publishBookingStatsInvalidate(
	event: Omit<BookingStatsInvalidateEvent, "eventId" | "occurredAt"> & {
		occurredAt?: Date | string;
	},
) {
	const payload: BookingStatsInvalidateEvent = {
		...event,
		eventId: createEventId(),
		occurredAt:
			event.occurredAt instanceof Date
				? event.occurredAt.toISOString()
				: (event.occurredAt ?? new Date().toISOString()),
	};

	for (const listener of listeners) {
		listener(payload);
	}

	return payload;
}

export function subscribeToBookingStatsInvalidations(
	listener: BookingStatsInvalidateListener,
) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}
