import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const data = [
	{ date: "2025-01-25", batteryLevel: 80 },
	{ date: "2025-01-26", batteryLevel: 72 },
	{ date: "2025-01-27", batteryLevel: 65 },
	{ date: "2025-01-28", batteryLevel: 59 },
	{ date: "2025-01-29", batteryLevel: 52 },
	{ date: "2025-01-30", batteryLevel: 45 },
	{ date: "2025-01-31", batteryLevel: 39 },
	{ date: "2025-02-01", batteryLevel: 57 },
];

export default function BatteryChart() {
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
					dataKey="date"
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) => value.split("-").slice(1).join("/")}
					tickMargin={10}
				/>
				<YAxis
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
