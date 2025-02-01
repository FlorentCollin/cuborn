import { $api } from "@/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Battery, Gauge, Power, ThermometerSun } from "lucide-react";
import { BatteryChart } from "./battery-chart";
import { OdometerChart } from "./odometer-chart";
import { VehicleStatus } from "./vehicle-status";

export default function CarDashboard() {
	const { data: carData, isLoading } = $api.useQuery(
		"get",
		"/vehicle-status/last",
	);

	const { data: allCarData, isLoading: isLoadingAllCarData } = $api.useQuery(
		"get",
		"/vehicle-status",
	);

	if (isLoading || isLoadingAllCarData) {
		return <div>Loading...</div>;
	}
	if (!carData || !allCarData) {
		return <div>could not fetch data</div>;
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-xl">CUPRA Born Dashboard</h1>
				<Badge
					variant={
						carData.connectionStatus === "ONLINE" ? "default" : "secondary"
					}
				>
					{carData.connectionStatus}
				</Badge>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{/* Battery Card */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Battery Level</CardTitle>
						<Battery className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{carData.batteryLevel}%</div>
						<Progress value={carData.batteryLevel} className="mt-2" />
						<p className="mt-2 text-xs text-muted-foreground">
							Target: {carData.targetSoc}%
						</p>
					</CardContent>
				</Card>

				{/* Range Card */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Range</CardTitle>
						<Gauge className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{carData.rangeKm} km</div>
						<p className="text-xs text-muted-foreground">
							Estimated remaining range
						</p>
					</CardContent>
				</Card>

				{/* Charging Status Card */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Charging</CardTitle>
						<Power className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm">Status</span>
								<Badge variant="outline">
									{carData.chargingStatus.replace(/_/g, " ")}
								</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm">Power</span>
								<span>{carData.chargingPowerKw} kW</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm">Rate</span>
								<span>{carData.chargingRateKmph} km/h</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Climate Control Card */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Climate Control
						</CardTitle>
						<ThermometerSun className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm">Status</span>
								<Badge variant="outline">{carData.climateStatus}</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm">Target Temperature</span>
								<span>{carData.targetTempCelsius}°C</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Vehicle Status Section */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Vehicle Status</CardTitle>
				</CardHeader>
				<CardContent>
					<VehicleStatus carData={carData} />
				</CardContent>
			</Card>

			{/* Charts Section */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Battery Level History</CardTitle>
					</CardHeader>
					<CardContent className="pt-2">
						<BatteryChart data={allCarData} />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Odometer History</CardTitle>
					</CardHeader>
					<CardContent className="pt-2">
						<OdometerChart data={allCarData} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
