export type UserLike = {
	roles?: readonly string[] | null;
};

export type RoleLike = string;

export function hasRole(user: UserLike | null | undefined, role: RoleLike) {
	return !!user?.roles?.includes(role);
}

export function isAdmin(user: UserLike | null | undefined) {
	return hasRole(user, "ADMIN");
}

export function isUser(user: UserLike | null | undefined) {
	return hasRole(user, "USER");
}
