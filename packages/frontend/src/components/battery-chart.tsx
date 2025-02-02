import type { VehicleStatusBatteryLevelResponse } from "@/client";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export function BatteryChart({
	data,
}: { data: VehicleStatusBatteryLevelResponse }) {
	return (
		<ChartContainer
			config={{
				batteryLevel: {
					label: "Battery Level",
					color: "hsl(var(--chart-1))",
				},
			}}
			className=""
		>
			<AreaChart
				data={data}
				margin={{
					top: 5,
					right: 10,
					left: 10,
					bottom: 5,
				}}
			>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey="time"
					tickLine={false}
					axisLine={false}
					// tickFormatter={(value) => value.split("-").slice(1).join("/")}
					tickMargin={10}
				/>
				<YAxis
					dataKey="min_battery_level_percentage"
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) => `${value}%`}
					tickMargin={10}
					min={0}
					max={100}
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
	);
}
