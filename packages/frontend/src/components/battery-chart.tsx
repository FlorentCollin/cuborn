import type { VehicleStatusResponse } from "@/client";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

export function BatteryChart({ data }: { data: VehicleStatusResponse }) {
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
			<LineChart
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
					dataKey="timestamp"
					tickLine={false}
					axisLine={false}
					// tickFormatter={(value) => value.split("-").slice(1).join("/")}
					tickMargin={10}
				/>
				<YAxis
					dataKey="batteryLevel"
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) => `${value}%`}
					tickMargin={10}
					min={0}
					max={100}
				/>
				<ChartTooltip content={<ChartTooltipContent />} />
				<Line
					type="monotone"
					dataKey="batteryLevel"
					strokeWidth={2}
					dot={{ strokeWidth: 2, r: 4 }}
					activeDot={{ r: 6 }}
				/>
			</LineChart>
		</ChartContainer>
	);
}
