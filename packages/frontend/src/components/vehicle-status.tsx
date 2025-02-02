import type { VehicleStatusLastResponse } from "@/client";
import { Badge } from "@/components/ui/badge";
import { Car, DoorClosed, Lock, LockOpen, Square } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function VehicleStatus({
	carData,
}: { carData: VehicleStatusLastResponse }) {
	const getDoorStatus = (status: string) => {
		return (
			<Badge variant={status === "CLOSED" ? "outline" : "destructive"}>
				{status}
			</Badge>
		);
	};

	const getWindowStatus = (status: string) => {
		return (
			<Badge variant={status === "CLOSED" ? "outline" : "secondary"}>
				{status}
			</Badge>
		);
	};

	return (
		<div>
			{/* Doors Status */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Doors</CardTitle>
						<DoorClosed className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent className="grid grid-cols-2 gap-3 justify-items-end">
						<span className="text-sm text-muted-foreground justify-self-start">
							Front Left
						</span>
						{getDoorStatus(carData.doors_front_left)}
						<span className="text-sm text-muted-foreground justify-self-start">
							Front Right
						</span>
						{getDoorStatus(carData.doors_front_right)}
						<span className="text-sm text-muted-foreground justify-self-start">
							Rear Left
						</span>
						{getDoorStatus(carData.doors_rear_left)}
						<span className="text-sm text-muted-foreground justify-self-start">
							Rear Right
						</span>
						{getDoorStatus(carData.doors_rear_right)}
						<span className="text-sm text-muted-foreground justify-self-start">
							Trunk
						</span>
						{getDoorStatus(carData.doors_trunk)}
						<span className="text-sm text-muted-foreground justify-self-start">
							Hood
						</span>
						{getDoorStatus(carData.doors_hood)}
					</CardContent>
				</Card>

				{/* Windows Status */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Windows</CardTitle>
						<Square className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent className="grid grid-cols-2 gap-3 justify-items-end">
						<span className="text-sm text-muted-foreground justify-self-start">
							Front Left
						</span>
						{getWindowStatus(carData.window_front_left)}
						<span className="text-sm text-muted-foreground justify-self-start">
							Front Right
						</span>
						{getWindowStatus(carData.window_front_right)}
						<span className="text-sm text-muted-foreground justify-self-start">
							Rear Left
						</span>
						{getWindowStatus(carData.window_rear_left)}
						<span className="text-sm text-muted-foreground justify-self-start">
							Rear Right
						</span>
						{getWindowStatus(carData.window_rear_right)}
					</CardContent>
				</Card>

				{/* Window Heating Status */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Window Heating
						</CardTitle>
						<Car className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent className="grid grid-cols-2 gap-3 justify-items-end">
						<span className="text-sm text-muted-foreground justify-self-start">
							Front
						</span>
						<Badge
							variant={
								carData.window_heating_front === "OFF" ? "outline" : "default"
							}
						>
							{carData.window_heating_front}
						</Badge>
						<span className="text-sm text-muted-foreground justify-self-start">
							Rear
						</span>
						<Badge
							variant={
								carData.window_heating_rear === "OFF" ? "outline" : "default"
							}
						>
							{carData.window_heating_rear}
						</Badge>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
