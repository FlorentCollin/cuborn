import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/trpc";
import { Battery, Gauge, ThermometerSun, TrendingUp, Zap } from "lucide-react";
import { BatteryChart } from "./battery-chart";
import { VehicleStatus } from "./vehicle-status";

export default function CarDashboard() {
	const { data, isLoading } = trpc.vehicleStatus.last.useQuery();
	const { data: stats } = trpc.vehicleStatus.statsThisMonth.useQuery();

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (!data) {
		return <div>could not fetch data</div>;
	}

	const isCarCharging = data.chargingStatus === "CHARGING";
	const textColor = isCarCharging ? "text-green-500" : "";
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-xl">CUPRA Born Dashboard</h1>
				<Badge
					variant={data.connectionStatus === "ONLINE" ? "default" : "secondary"}
				>
					{data.connectionStatus}
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
							{data.batteryLevel}%
						</div>
						<Progress value={data.batteryLevel} className="mt-2" />
						<p className="mt-2 text-xs text-muted-foreground">
							Target: {data.targetSoc}%
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
						<div className="text-2xl font-bold">{data.rangeKm} km</div>
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
									{data.chargingStatus
										.replace(/_/g, " ")
										.replace("FOR CHARGING", "")}
								</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">Power</span>
								<span>{data.chargingRateKmph} kW</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">Rate</span>
								<span>{data.chargingRateKmph} km/h</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Climate Control Card */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Monthly Stats</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">Distance</span>
								<span>{stats?.kmThisMonth} km</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">
									Total Battery Used
								</span>
								<span>{stats?.batteryUsedPercentage}%</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Charts Section */}
			<BatteryChart />

			{/* Vehicle Status Section */}
			<VehicleStatus carData={data} />
		</div>
	);
}
//<OdometerChart data={allCarData} />
