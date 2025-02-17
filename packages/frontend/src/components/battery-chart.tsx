import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { type RouterInputs, trpc } from "@/trpc";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

type BatteryLevelInput = RouterInputs["vehicleStatus"]["batteryLevelHistory"];

export function BatteryChart() {
	const [timeRange, setTimeRange] =
		useState<BatteryLevelInput["timeRange"]>("1 day");
	const { data } = trpc.vehicleStatus.batteryLevelHistory.useQuery({
		timeRange: timeRange,
	});

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 border-b py-5">
				<CardTitle>Battery Level History</CardTitle>
				<Select
					value={timeRange}
					onValueChange={(v) =>
						setTimeRange(v as BatteryLevelInput["timeRange"])
					}
				>
					<SelectTrigger
						className="w-[160px] rounded-lg sm:ml-auto"
						aria-label="Select a value"
					>
						<SelectValue placeholder="Last day" />
					</SelectTrigger>
					<SelectContent className="rounded-xl">
						<SelectItem value="90 day" className="rounded-lg">
							Last 3 months
						</SelectItem>
						<SelectItem value="30 day" className="rounded-lg">
							Last 30 days
						</SelectItem>
						<SelectItem value="7 day" className="rounded-lg">
							Last 7 days
						</SelectItem>
						<SelectItem value="1 day" className="rounded-lg">
							Last day
						</SelectItem>
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className="">
				<ChartContainer
					config={{
						batteryLevel: {
							label: "Battery Level",
						},
					}}
					className="aspect-auto h-[250px] w-full"
				>
					<AreaChart data={data}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="time"
							tickLine={false}
							axisLine={false}
							tickFormatter={(value) => new Date(value).toLocaleString()}
							tickMargin={10}
						/>
						<YAxis
							dataKey="min_battery_level_percentage"
							tickLine={false}
							axisLine={false}
							tickFormatter={(value) => `${value}%`}
							tickMargin={10}
							domain={[0, 100]}
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<Area
							type="monotone"
							dataKey="min_battery_level_percentage"
							dot={true}
							strokeWidth={2}
							connectNulls={true}
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
