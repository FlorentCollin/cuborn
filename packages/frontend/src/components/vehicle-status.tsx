import { Badge } from "@/components/ui/badge";
import type { RouterOutputs } from "@/trpc";
import { Car, DoorClosed, Square } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function VehicleStatus({
	carData,
}: { carData: RouterOutputs["vehicleStatus"]["last"] }) {
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
						{getDoorStatus(carData.doorsFrontLeft)}
						<span className="text-sm text-muted-foreground justify-self-start">
							Front Right
						</span>
						{getDoorStatus(carData.doorsFrontRight)}
						<span className="text-sm text-muted-foreground justify-self-start">
							Rear Left
						</span>
						{getDoorStatus(carData.doorsRearLeft)}
						<span className="text-sm text-muted-foreground justify-self-start">
							Rear Right
						</span>
						{getDoorStatus(carData.doorsRearRight)}
						<span className="text-sm text-muted-foreground justify-self-start">
							Trunk
						</span>
						{getDoorStatus(carData.doorsTrunk)}
						<span className="text-sm text-muted-foreground justify-self-start">
							Hood
						</span>
						{getDoorStatus(carData.doorsHood)}
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
						{getWindowStatus(carData.windowFrontLeft)}
						<span className="text-sm text-muted-foreground justify-self-start">
							Front Right
						</span>
						{getWindowStatus(carData.windowFrontRight)}
						<span className="text-sm text-muted-foreground justify-self-start">
							Rear Left
						</span>
						{getWindowStatus(carData.windowRearLeft)}
						<span className="text-sm text-muted-foreground justify-self-start">
							Rear Right
						</span>
						{getWindowStatus(carData.windowRearRight)}
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
								carData.windowHeatingFront === "OFF" ? "outline" : "default"
							}
						>
							{carData.windowHeatingFront}
						</Badge>
						<span className="text-sm text-muted-foreground justify-self-start">
							Rear
						</span>
						<Badge
							variant={
								carData.windowHeatingRear === "OFF" ? "outline" : "default"
							}
						>
							{carData.windowHeatingRear}
						</Badge>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
