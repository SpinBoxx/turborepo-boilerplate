import { UpsertUserInputSchema } from "../schemas/user.schema";

export const verifyUserSignUp = async (body: any) => {
	return await UpsertUserInputSchema.safeParseAsync(body);
};
