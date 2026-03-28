import type { LoginInput, UpsertUserInput } from "@zanadeal/api/features/user";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
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
	signInWithEmail: (
		input: LoginInput,
		options?: LoginOptions,
	) => Promise<User | undefined>;
	signUpWithEmail: (
		input: UpsertUserInput,
		options?: LoginOptions,
	) => Promise<User | undefined>;
	signOut: (options?: SignOutOptions) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [status, setStatus] = useState<AuthStatus>("loading");

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
				toast.error("Login failed", {
					description: response.error.message || "Invalid email or password.",
				});
				return;
			}

			if (!isAuthResponseOK(response.data)) {
				toast.error("Login failed", {
					description: "Invalid response format.",
				});
				return;
			}

			setUser(response.data.user);
			setStatus("authenticated");
			options?.onSuccess?.(response.data.user);

			return response.data.user;
		} catch (error) {
			toast.error("Login failed", {
				description: "An unexpected error occurred. Please try again later.",
			});

			options?.onError?.(
				error instanceof Error
					? error
					: new Error("An unexpected error occurred."),
			);
			return;
		}
	};

	const signUpWithEmail = async (
		body: UpsertUserInput,
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
				toast.error("Account creation failed", {
					description:
						response.error.message ||
						"Cannot create your account. Try again later.",
				});
				return;
			}

			if (!isAuthResponseOK(response.data)) {
				toast.error("Account creation failed", {
					description: "Invalid response format.",
				});
				return;
			}

			console.log(response.data);

			setUser(response.data.user);
			setStatus("authenticated");
			options?.onSuccess?.(response.data.user);

			return response.data.user;
		} catch (error) {
			toast.error("Account creation failed", {
				description: "An unexpected error occurred. Please try again later.",
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
				toast.error("Sign out failed", {
					description:
						res.error.message || "Unable to sign out. Try again later.",
				});
				return;
			}
		} catch (error) {
			toast.error("Sign out failed", {
				description: "An unexpected error occurred. Please try again later.",
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
			signOut,
		}),
		[
			signOut,
			signUpWithEmail,
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
