export type UserLike = {
	disabledAt?: Date | string | null;
	roles?: readonly string[] | null;
};

export type RoleLike = string;

export function hasRole(user: UserLike | null | undefined, role: RoleLike) {
	return !user?.disabledAt && !!user?.roles?.includes(role);
}

export function isAdmin(user: UserLike | null | undefined) {
	return hasRole(user, "ADMIN");
}

export function isUser(user: UserLike | null | undefined) {
	return hasRole(user, "USER");
}

export function isHotelReviewer(user: UserLike | null | undefined) {
	return hasRole(user, "HOTEL_REVIEWER");
}
