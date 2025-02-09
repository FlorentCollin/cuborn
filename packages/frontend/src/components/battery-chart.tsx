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
	);
}
