import { $api } from "@/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Battery, Gauge, ThermometerSun, Zap } from "lucide-react";
import { BatteryChart } from "./battery-chart";
import { VehicleStatus } from "./vehicle-status";

export default function CarDashboard() {
	const { data: carData, isLoading } = $api.useQuery(
		"get",
		"/vehicle-status/last",
	);

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (!carData) {
		return <div>could not fetch data</div>;
	}

	const isCarCharging = carData.chargingStatus === "CHARGING";
	const textColor = isCarCharging ? "text-green-500" : "";
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
						<Battery className={`h-4 w-4 text-muted-foreground ${textColor}`} />
					</CardHeader>
					<CardContent>
						<div className={`text-2xl font-bold ${textColor}`}>
							{carData.batteryLevel}%
						</div>
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
						<Zap
							className={`h-4 w-4 text-muted-foreground ${isCarCharging ? "animate-pulse text-green-500" : ""}`}
						/>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">Status</span>
								<Badge variant={isCarCharging ? "default" : "outline"}>
									{carData.chargingStatus
										.replace(/_/g, " ")
										.replace("FOR CHARGING", "")}
								</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">Power</span>
								<span>{carData.chargingRateKmph} kW</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">Rate</span>
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
								<span className="text-sm text-muted-foreground">Status</span>
								<Badge variant="outline">{carData.climateStatus}</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">
									Target Temperature
								</span>
								<span>{carData.targetTempCelsius}°C</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Charts Section */}
			<BatteryChart />

			{/* Vehicle Status Section */}
			<VehicleStatus carData={carData} />
		</div>
	);
}
//<OdometerChart data={allCarData} />
