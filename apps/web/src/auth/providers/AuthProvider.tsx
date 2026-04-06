import type { LoginInput, UpsertUserInput } from "@zanadeal/api/features/user";
import type { sendVerificationEmailType } from "@zanadeal/auth/routes/schemas";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useIntlayer } from "react-intlayer";
import { toast } from "sonner";
import { $fetch } from "@/lib/fetch";
import { orpc } from "@/lib/orpc";
import type { User } from "../../../../../packages/db/prisma/generated/client";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type LoginOptions = {
	onSuccess?: (user: User | null) => void | Promise<void>;
	onError?: (error: Error) => void | Promise<void>;
};

export type SignOutOptions = {
	onSuccess?: () => void | Promise<void>;
	onError?: (error: Error) => void | Promise<void>;
};

export type AuthResponseOK = {
	token: string;
	user: User;
};

export type AuthResponseKO = {
	code: string;
	message: string;
};

export type AuthResponse = AuthResponseOK | AuthResponseKO;

type SignUpWithEmailInput = UpsertUserInput & {
	callbackURL?: string;
};

const isAuthResponseOK = (
	data: AuthResponse | null | undefined,
): data is AuthResponseOK => {
	return !!data && "user" in data;
};

type AuthContextValue = {
	status: AuthStatus;
	user: User | null;
	loadSession: () => Promise<User | null | undefined>;
	refresh: () => Promise<void>;
	sendVerificationEmail: (body: sendVerificationEmailType) => Promise<void>;
	signInWithEmail: (
		input: LoginInput,
		options?: LoginOptions,
	) => Promise<User | undefined>;
	signUpWithEmail: (
		input: SignUpWithEmailInput,
		options?: LoginOptions,
	) => Promise<User | undefined>;
	signOut: (options?: SignOutOptions) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [status, setStatus] = useState<AuthStatus>("loading");
	const authT = useIntlayer("auth-provider");

	const loadSession = useCallback(async (): Promise<
		User | null | undefined
	> => {
		setStatus("loading");
		try {
			const data = await orpc.loadSession();
			if (!data?.session?.user) {
				setUser(null);
				setStatus("unauthenticated");
				return null;
			}
			const user = data.session.user as User;
			setUser(user);
			setStatus(user ? "authenticated" : "unauthenticated");
			return user;
		} catch (_error) {
			setUser(null);
			setStatus("unauthenticated");
			return null;
		}
	}, []);

	const refresh = useCallback(async (): Promise<void> => {
		await loadSession();
	}, [loadSession]);

	const signInWithEmail = async (
		{ email, password }: LoginInput,
		options?: LoginOptions,
	): Promise<User | undefined> => {
		try {
			const response = await $fetch<AuthResponse>(
				`${import.meta.env.VITE_API_URL}/api/auth/sign-in/email`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"content-type": "application/json",
					},
					body: JSON.stringify({ email, password }),
				},
			);

			if (response.error) {
				toast.error(authT.loginFailed.value, {
					description:
						response.error.message || authT.invalidEmailOrPassword.value,
				});
				return;
			}

			if (!isAuthResponseOK(response.data)) {
				toast.error(authT.loginFailed.value, {
					description: authT.invalidResponseFormat.value,
				});
				return;
			}

			setUser(response.data.user);
			setStatus("authenticated");
			options?.onSuccess?.(response.data.user);

			return response.data.user;
		} catch (error) {
			toast.error(authT.loginFailed.value, {
				description: authT.unexpectedError.value,
			});

			options?.onError?.(
				error instanceof Error
					? error
					: new Error("An unexpected error occurred."),
			);
			return;
		}
	};

	const sendVerificationEmail = async (body: sendVerificationEmailType) => {
		const { callbackURL, email } = body;
		try {
			const res = await $fetch(
				`${import.meta.env.VITE_API_URL}/api/auth/send-verification-email`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"content-type": "application/json",
					},
					body: JSON.stringify({
						email,
							callbackURL,
					}),
				},
			);

			if (!res || res.error) {
				toast.error(authT.failedToSendVerificationEmail.value, {
					description: res?.error?.message || authT.pleaseTryAgainLater.value,
				});
			} else {
				toast.success(authT.verificationEmailSent.value, {
					description: authT.checkInboxInstructions.value,
				});
			}
		} catch (_e) {
			toast.error(authT.failedToSendVerificationEmail.value, {
				description: authT.unexpectedError.value,
			});
		}
	};

	const signUpWithEmail = async (
		body: SignUpWithEmailInput,
		options?: LoginOptions,
	): Promise<User | undefined> => {
		try {
			const response = await $fetch<AuthResponse>(
				`${import.meta.env.VITE_API_URL}/api/auth/sign-up/email`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"content-type": "application/json",
					},
					body: JSON.stringify(body),
				},
			);

			if (response.error) {
				toast.error(authT.accountCreationFailed.value, {
					description:
						response.error.message || authT.cannotCreateAccount.value,
				});
				return;
			}

			if (!isAuthResponseOK(response.data)) {
				toast.error(authT.accountCreationFailed.value, {
					description: authT.invalidResponseFormat.value,
				});
				return;
			}

			console.log(response.data);

			setUser(response.data.user);
			setStatus("authenticated");
			options?.onSuccess?.(response.data.user);

			return response.data.user;
		} catch (error) {
			toast.error(authT.accountCreationFailed.value, {
				description: authT.unexpectedError.value,
			});

			options?.onError?.(
				error instanceof Error
					? error
					: new Error("An unexpected error occurred."),
			);
			return;
		}
	};

	const signOut = async (options?: SignOutOptions) => {
		try {
			const res = await $fetch(
				`${import.meta.env.VITE_API_URL}/api/auth/sign-out`,
				{
					method: "POST",
					credentials: "include",
				},
			);
			setUser(null);
			setStatus("unauthenticated");

			if (res.error) {
				toast.error(authT.signOutFailed.value, {
					description: res.error.message || authT.unableToSignOut.value,
				});
				return;
			}
		} catch (error) {
			toast.error(authT.signOutFailed.value, {
				description: authT.unexpectedError.value,
			});
			options?.onError?.(
				error instanceof Error
					? error
					: new Error("An unexpected error occurred."),
			);
			return;
		}
	};

	const value = useMemo<AuthContextValue>(
		() => ({
			status,
			user,
			loadSession,
			refresh,
			signInWithEmail,
			signUpWithEmail,
			sendVerificationEmail,
			signOut,
		}),
		[
			signOut,
			signUpWithEmail,
			sendVerificationEmail,
			status,
			refresh,
			user,
			signInWithEmail,
			loadSession,
		],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: refresh is stable (useCallback)
	useEffect(() => {
		loadSession();
	}, []);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
