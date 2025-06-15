import { CarDashboard } from "@/components/car-dashboard";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomeComponent,
	loader: async ({ context: { trpc } }) => {
		try {
			await trpc.vehicleStatus.last.ensureData();
		} catch (e) {
			throw redirect({ to: "/login" });
		}
		trpc.vehicleStatus.batteryLevelHistory.ensureData({
			timeRange: "1 day",
		});
		trpc.vehicleStatus.batteryLevelHistory.ensureData({
			timeRange: "7 day",
		});
	},
});

function HomeComponent() {
	return (
		<div>
			<EnvironmentBanner />
			<div className="p-2 lg:p-8">
				<CarDashboard />
			</div>
		</div>
	);
}

type Environment = "prod" | "test";
function EnvironmentBanner() {
	let environment: Environment = "prod";
	if (window.location.hostname.includes("cuborn-test")) {
		environment = "test";
	}
	if (environment === "test") {
		return (
			<div className="sticky top-0 z-50 bg-yellow-300 text-black text-center text-xs py-1 font-semibold">
				TEST enviroment with fake data
			</div>
		);
	}

	return <></>;
}
