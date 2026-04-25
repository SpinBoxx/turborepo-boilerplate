import type {
	CreateManagedUserInput,
	DeactivateManagedUserInput,
	UpdateManagedUserInput,
} from "@zanadeal/api/features/user";
import { orpc } from "@/lib/orpc";

export async function listManagedUsers() {
	return orpc.user.listManaged();
}

export async function createManagedUser(input: CreateManagedUserInput) {
	return orpc.user.createManaged(input);
}

export async function updateManagedUser(input: UpdateManagedUserInput) {
	return orpc.user.updateManaged(input);
}

export async function deactivateManagedUser(input: DeactivateManagedUserInput) {
	return orpc.user.deactivateManaged(input);
}
