import CarDashboard from "@/components/car-dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomeComponent,
	loader: ({ context: { trpcUtils } }) => {
		trpcUtils.vehicleStatus.last.ensureData();
		trpcUtils.vehicleStatus.batteryLevelHistory.ensureData({
			timeRange: "1 day",
		});
		trpcUtils.vehicleStatus.batteryLevelHistory.ensureData({
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
