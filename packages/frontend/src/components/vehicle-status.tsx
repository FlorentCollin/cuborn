import type { VehicleStatusLastResponse } from "@/client";
import { Badge } from "@/components/ui/badge";
import { Car, DoorClosed, Lock, LockOpen, Square } from "lucide-react";
import { Card, CardContent } from "./ui/card";

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
		<div className="">
			{/* Lock Status */}
			<div className="flex gap-2 py-2">
				<div className="flex items-center gap-2">
					{carData.doorsLocked ? (
						<Lock className="h-4 w-4" />
					) : (
						<LockOpen className="h-4 w-4" />
					)}
					<h3 className="font-medium">
						{" "}
						{carData.doorsLocked ? "Vehicle Locked" : "Vehicle Unlocked"}{" "}
					</h3>
				</div>
			</div>

			{/* Doors Status */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
				<Card>
					<CardContent className="pt-6">
						<div className="space-y-4">
							<div className="flex items-center gap-2">
								<DoorClosed className="h-4 w-4" />
								<h3 className="font-medium">Doors</h3>
							</div>
							<div className="grid gap-3">
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">
										Front Left
									</span>
									{getDoorStatus(carData.doorsFrontLeft)}
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">
										Front Right
									</span>
									{getDoorStatus(carData.doorsFrontRight)}
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">
										Rear Left
									</span>
									{getDoorStatus(carData.doorsRearLeft)}
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">
										Rear Right
									</span>
									{getDoorStatus(carData.doorsRearRight)}
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">Trunk</span>
									{getDoorStatus(carData.doorsTrunk)}
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">Hood</span>
									{getDoorStatus(carData.doorsHood)}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Windows Status */}
				<Card>
					<CardContent className="pt-6">
						<div className="space-y-4">
							<div className="flex items-center gap-2">
								<Square className="h-4 w-4" />
								<h3 className="font-medium">Windows</h3>
							</div>
							<div className="grid gap-3">
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">
										Front Left
									</span>
									{getWindowStatus(carData.windowFrontLeft)}
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">
										Front Right
									</span>
									{getWindowStatus(carData.windowFrontRight)}
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">
										Rear Left
									</span>
									{getWindowStatus(carData.windowRearLeft)}
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">
										Rear Right
									</span>
									{getWindowStatus(carData.windowRearRight)}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Window Heating Status */}
				<Card>
					<CardContent className="pt-6">
						<div className="space-y-4">
							<div className="flex items-center gap-2">
								<Car className="h-4 w-4" />
								<h3 className="font-medium">Window Heating</h3>
							</div>
							<div className="grid gap-3">
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">Front</span>
									<Badge
										variant={
											carData.windowHeatingFront === "OFF"
												? "outline"
												: "default"
										}
									>
										{carData.windowHeatingFront}
									</Badge>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">Rear</span>
									<Badge
										variant={
											carData.windowHeatingRear === "OFF"
												? "outline"
												: "default"
										}
									>
										{carData.windowHeatingRear}
									</Badge>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
