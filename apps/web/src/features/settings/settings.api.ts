import type { UpdateCurrentUserProfileInput } from "@zanadeal/api/features/user";
import { orpc } from "@/lib/orpc";

export async function getCurrentUserProfile() {
	return await orpc.user.me();
}

export async function updateCurrentUserProfile(
	input: UpdateCurrentUserProfileInput,
) {
	return await orpc.user.updateMe(input);
}