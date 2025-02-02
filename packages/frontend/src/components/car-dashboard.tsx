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

	const { data: batteryLevelData, isLoading: isLoadingBatteryLevel } =
		$api.useQuery("get", "/vehicle-status/battery-level");

	if (isLoading || isLoadingBatteryLevel) {
		return <div>Loading...</div>;
	}
	if (!carData || !batteryLevelData) {
		return <div>could not fetch data</div>;
	}

	const isCarCharging = carData.charging_status === "CHARGING";
	const textColor = isCarCharging ? "text-green-500" : "";
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-xl">CUPRA Born Dashboard</h1>
				<Badge
					variant={
						carData.connection_status === "ONLINE" ? "default" : "secondary"
					}
				>
					{carData.connection_status}
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
							{carData.battery_level}%
						</div>
						<Progress value={carData.battery_level} className="mt-2" />
						<p className="mt-2 text-xs text-muted-foreground">
							Target: {carData.target_soc}%
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
						<div className="text-2xl font-bold">{carData.range_km} km</div>
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
									{carData.charging_status
										.replace(/_/g, " ")
										.replace("FOR CHARGING", "")}
								</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">Power</span>
								<span>{carData.charging_power_kw} kW</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">Rate</span>
								<span>{carData.charging_rate_kmph} km/h</span>
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
								<Badge variant="outline">{carData.climate_status}</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">
									Target Temperature
								</span>
								<span>{carData.target_temp_celsius}°C</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Vehicle Status Section */}
			<VehicleStatus carData={carData} />

			{/* Charts Section */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card className="col-span-2">
					<CardHeader>
						<CardTitle>Battery Level History</CardTitle>
					</CardHeader>
					<CardContent className="pt-2">
						<BatteryChart data={batteryLevelData} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
//<OdometerChart data={allCarData} />
