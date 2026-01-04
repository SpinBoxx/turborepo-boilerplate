import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./auth/providers/AuthProvider";
import { ThemeProvider } from "./components/ThemeProvider";
import { createQueryClient } from "./lib/queryClient";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({
	routeTree,
	context: {
		user: null,
		auth: {
			getUser: () => null,
			loadSession: async () => null,
		},
	},
	defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Render the app
const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error('Missing root element with id="root"');
}

const RouterProviderWithContext = () => {
	const { user, getUser, loadSession } = useAuth();

	return (
		<RouterProvider
			router={router}
			context={{
				user,
				auth: {
					getUser,
					loadSession,
				},
			}}
		/>
	);
};

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	const queryClient = createQueryClient();
	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider>
					<AuthProvider>
						<RouterProviderWithContext />
					</AuthProvider>
					<Toaster />
				</ThemeProvider>
			</QueryClientProvider>
		</StrictMode>,
	);
}
