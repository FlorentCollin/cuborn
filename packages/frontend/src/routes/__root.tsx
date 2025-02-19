import { ThemeProvider } from "@/components/theme-provider";
import { trpc } from "@/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { httpBatchLink } from "@trpc/client";

export const Route = createRootRoute({
	component: RootComponent,
});

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
	links: [
		httpBatchLink({
			url:
				import.meta.env.MODE === "production"
					? "http://apollo.taila4c2d3.ts.net:3000/trpc"
					: "http://localhost:3000/trpc",
			async headers() {
				return {
					// authorization: getAuthCookie(),
				};
			},
		}),
	],
});

function RootComponent() {
	return (
		<>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<trpc.Provider client={trpcClient} queryClient={queryClient}>
					<QueryClientProvider client={queryClient}>
						{import.meta.env.MODE === "development" && (
							<ReactQueryDevtools initialIsOpen={false} />
						)}
						<Outlet />
					</QueryClientProvider>
				</trpc.Provider>
			</ThemeProvider>
		</>
	);
}
