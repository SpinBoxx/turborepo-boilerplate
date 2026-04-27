import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UpdateCurrentUserProfileInput } from "@zanadeal/api/features/user";
import {
	getCurrentUserProfile,
	updateCurrentUserProfile,
} from "./settings.api";

export function settingsKeys() {
	return {
		all: ["settings"] as const,
		currentUserProfile: () => ["settings", "current-user-profile"] as const,
	};
}

export function useCurrentUserProfile() {
	return useQuery({
		queryKey: settingsKeys().currentUserProfile(),
		queryFn: getCurrentUserProfile,
	});
}

export function useUpdateCurrentUserProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: UpdateCurrentUserProfileInput) =>
			updateCurrentUserProfile(input),
		onSuccess: async (profile) => {
			queryClient.setQueryData(
				settingsKeys().currentUserProfile(),
				profile,
			);

			await queryClient.invalidateQueries({ queryKey: settingsKeys().all });
		},
	});
}