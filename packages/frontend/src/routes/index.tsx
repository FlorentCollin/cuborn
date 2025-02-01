import CarDashboard from "@/components/car-dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<div className="p-2 lg:p-8">
			<CarDashboard />
		</div>
	);
}
