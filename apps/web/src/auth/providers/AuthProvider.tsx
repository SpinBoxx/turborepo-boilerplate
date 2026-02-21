import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { toast } from "sonner";
import { orpc } from "@/lib/orpc";

type PrivateDataOutput = Awaited<ReturnType<typeof orpc.privateData>>;
type SessionUser = NonNullable<PrivateDataOutput["user"]>;

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type SignInWithEmailInput = {
	email: string;
	password: string;
};

export type AuthUser = SessionUser;

export type SignInOptions = {
	onSuccess?: (user: SessionUser | null) => void | Promise<void>;
	onError?: (error: Error) => void | Promise<void>;
};

export type SignOutOptions = {
	onSuccess?: () => void | Promise<void>;
	onError?: (error: Error) => void | Promise<void>;
};

type AuthContextValue = {
	status: AuthStatus;
	user: SessionUser | null;
	getUser: () => SessionUser | null;
	loadSession: () => Promise<SessionUser | null>;
	refresh: () => Promise<void>;
	signInWithEmail: (
		input: SignInWithEmailInput,
		options?: SignInOptions,
	) => Promise<void>;
	signOut: (options?: SignOutOptions) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getApiBaseUrl() {
	return (
		import.meta.env.VITE_API_URL?.toString() ?? "http://localhost:8080" // apps/server default
	);
}

function joinUrl(base: string, path: string) {
	return `${base.replace(/\/$/, "")}${path}`;
}

function isUnauthorizedError(error: unknown): boolean {
	if (!error || typeof error !== "object") return false;

	const anyError = error as Record<string, unknown>;
	const code = anyError.code;
	if (code === "UNAUTHORIZED") return true;

	const status = anyError.status;
	if (typeof status === "number" && status === 401) return true;

	const message = anyError.message;
	if (
		typeof message === "string" &&
		message.toUpperCase().includes("UNAUTHORIZED")
	) {
		return true;
	}

	return false;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<SessionUser | null>(null);
	const [status, setStatus] = useState<AuthStatus>("loading");
	const userRef = useRef<SessionUser | null>(null);

	const loadSession = useCallback(async (): Promise<SessionUser | null> => {
		setStatus("loading");
		try {
			const data = await orpc.privateData();
			const nextUser = data.user ?? null;
			userRef.current = nextUser;
			setUser(nextUser);
			setStatus(nextUser ? "authenticated" : "unauthenticated");
			return nextUser;
		} catch (error) {
			userRef.current = null;
			setUser(null);
			setStatus("unauthenticated");
			if (!isUnauthorizedError(error)) {
				toast.error("Impossible de récupérer la session", {
					description:
						error instanceof Error
							? error.message
							: "Une erreur inattendue est survenue.",
				});
			}
			return null;
		}
	}, []);

	const getUser = useCallback(() => userRef.current, []);

	const refresh = useCallback(async (): Promise<void> => {
		await loadSession();
	}, [loadSession]);

	const signInWithEmail = useCallback(
		async (
			{ email, password }: SignInWithEmailInput,
			options?: SignInOptions,
		): Promise<void> => {
			try {
				const response = await fetch(
					joinUrl(getApiBaseUrl(), "/api/auth/sign-in/email"),
					{
						method: "POST",
						credentials: "include",
						headers: {
							"content-type": "application/json",
						},
						body: JSON.stringify({ email, password }),
					},
				);

				if (!response.ok) {
					// Do not display backend-provided details to avoid leaking whether an
					// account exists or not.
					const description =
						response.status === 401
							? "Identifiants invalides."
							: "Connexion impossible.";
					throw new Error(description);
				}

				const nextUser = await loadSession();
				if (options?.onSuccess) {
					await options.onSuccess(nextUser);
				}
				return;
			} catch (error) {
				const err =
					error instanceof Error ? error : new Error("Connexion impossible.");

				const description =
					err.message && err.message.trim().length > 0
						? err.message
						: "Connexion impossible.";
				toast.error("Connexion impossible", { description });

				if (options?.onError) {
					await options.onError(err);
					return;
				}
				throw err;
			}
		},
		[loadSession],
	);

	const signOut = useCallback(async (options?: SignOutOptions) => {
		try {
			const response = await fetch(
				joinUrl(getApiBaseUrl(), "/api/auth/sign-out"),
				{
					method: "POST",
					credentials: "include",
				},
			);

			if (!response.ok) {
				const err = new Error("Déconnexion impossible");
				toast.error(err.message);
				if (options?.onError) {
					await options.onError(err);
					return;
				}
				throw err;
			}

			setUser(null);
			userRef.current = null;
			setStatus("unauthenticated");
			if (options?.onSuccess) {
				await options.onSuccess();
			}
		} catch (error) {
			const err =
				error instanceof Error
					? error
					: new Error("Une erreur inattendue est survenue.");
			toast.error("Déconnexion impossible", { description: err.message });
			if (options?.onError) {
				await options.onError(err);
				return;
			}
			throw err;
		}
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({
			status,
			user,
			getUser,
			loadSession,
			refresh,
			signInWithEmail,
			signOut,
		}),
		[getUser, loadSession, refresh, signInWithEmail, signOut, status, user],
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
