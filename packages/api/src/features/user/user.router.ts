import { ORPCError } from "@orpc/server";
import { adminProcedure } from "../../index";
import {
	CurrentUserProfileSchema,
	CreateManagedUserInputSchema,
	DeactivateManagedUserInputSchema,
	ManagedUserSchema,
	UpdateCurrentUserProfileInputSchema,
	UpdateManagedUserInputSchema,
} from "./schemas/user.schema";
import {
	createManagedUser,
	deactivateManagedUser,
	getCurrentUserProfile,
	getManagedUserByEmail,
	getManagedUserById,
	getUserByEmail,
	listManagedUsers,
	updateCurrentUserProfile,
	updateManagedUser,
} from "./user.store";
import { protectedProcedure } from "../..";

export const userRouter = {
	me: protectedProcedure
		.route({
			method: "GET",
			path: "/users/me",
			summary: "Get current user profile",
			tags: ["User"],
		})
		.output(CurrentUserProfileSchema)
		.handler(async ({ context }) => {
			const profile = await getCurrentUserProfile(context.session.user.id);
			if (!profile) {
				throw new ORPCError("NOT_FOUND");
			}

			return profile;
		}),
	updateMe: protectedProcedure
		.route({
			method: "PATCH",
			path: "/users/me",
			summary: "Update current user profile",
			tags: ["User"],
		})
		.input(UpdateCurrentUserProfileInputSchema)
		.output(CurrentUserProfileSchema)
		.handler(async ({ input, context }) => {
			const userWithEmail = await getUserByEmail(input.email);
			if (userWithEmail && userWithEmail.id !== context.session.user.id) {
				throw new ORPCError("CONFLICT", {
					message: "A user with this email already exists.",
				});
			}

			return await updateCurrentUserProfile(context.session.user.id, input);
		}),
	listManaged: adminProcedure
		.route({
			method: "GET",
			path: "/users/managed",
			summary: "List admin and hotel reviewer users",
			tags: ["User"],
		})
		.output(ManagedUserSchema.array())
		.handler(async () => {
			return await listManagedUsers();
		}),
	createManaged: adminProcedure
		.route({
			method: "POST",
			path: "/users/managed",
			summary: "Create an admin or hotel reviewer user",
			tags: ["User"],
		})
		.input(CreateManagedUserInputSchema)
		.output(ManagedUserSchema)
		.handler(async ({ input }) => {
			const existingUser = await getManagedUserByEmail(input.email);
			if (existingUser) {
				throw new ORPCError("CONFLICT", {
					message: "A user with this email already exists.",
				});
			}

			return await createManagedUser(input);
		}),
	updateManaged: adminProcedure
		.route({
			method: "PATCH",
			path: "/users/managed/{id}",
			summary: "Update an admin or hotel reviewer user",
			tags: ["User"],
		})
		.input(UpdateManagedUserInputSchema)
		.output(ManagedUserSchema)
		.handler(async ({ input }) => {
			const existingUser = await getManagedUserById(input.id);
			if (!existingUser) {
				throw new ORPCError("NOT_FOUND");
			}

			if (input.email && input.email !== existingUser.email) {
				const userWithEmail = await getManagedUserByEmail(input.email);
				if (userWithEmail) {
					throw new ORPCError("CONFLICT", {
						message: "A user with this email already exists.",
					});
				}
			}

			return await updateManagedUser(input);
		}),
	deactivateManaged: adminProcedure
		.route({
			method: "DELETE",
			path: "/users/managed/{id}",
			summary: "Deactivate an admin or hotel reviewer user",
			tags: ["User"],
		})
		.input(DeactivateManagedUserInputSchema)
		.output(ManagedUserSchema)
		.handler(async ({ input, context }) => {
			const currentUser = context.session?.user;
			if (!currentUser) {
				throw new ORPCError("UNAUTHORIZED");
			}

			if (input.id === currentUser.id) {
				throw new ORPCError("BAD_REQUEST", {
					message: "You cannot deactivate your own account.",
				});
			}

			const existingUser = await getManagedUserById(input.id);
			if (!existingUser) {
				throw new ORPCError("NOT_FOUND");
			}

			return await deactivateManagedUser(input.id);
		}),
};
