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
		<div className="p-2 lg:p-8">
			<CarDashboard />
		</div>
	);
}
