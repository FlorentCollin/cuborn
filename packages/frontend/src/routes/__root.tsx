import { ThemeProvider } from "@/components/theme-provider";
import type { AppRouterQueryUtils, trpc } from "@/trpc";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
	trpc: AppRouterQueryUtils;
}>()({
	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				{import.meta.env.MODE === "development" && (
					<ReactQueryDevtools initialIsOpen={false} />
				)}
				<Outlet />
			</ThemeProvider>
		</>
	);
}
