import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import * as React from "react";

export const Route = createRootRoute({
	component: RootComponent,
});

const queryClient = new QueryClient();

function RootComponent() {
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<Outlet />
				<TanStackRouterDevtools position="bottom-right" />
			</QueryClientProvider>
		</>
	);
}
