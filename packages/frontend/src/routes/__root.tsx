import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
	component: RootComponent,
});

const queryClient = new QueryClient();

function RootComponent() {
	return (
		<>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<QueryClientProvider client={queryClient}>
					<Outlet />
				</QueryClientProvider>
			</ThemeProvider>
		</>
	);
}
