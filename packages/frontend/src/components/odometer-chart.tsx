import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const data = [
	{ date: "2025-01-25", odometerKm: 41800 },
	{ date: "2025-01-26", odometerKm: 41850 },
	{ date: "2025-01-27", odometerKm: 41900 },
	{ date: "2025-01-28", odometerKm: 41950 },
	{ date: "2025-01-29", odometerKm: 42000 },
	{ date: "2025-01-30", odometerKm: 42050 },
	{ date: "2025-01-31", odometerKm: 42100 },
	{ date: "2025-02-01", odometerKm: 42119 },
];

export function OdometerChart() {
	return (
		<ChartContainer
			config={{
				odometerKm: {
					label: "Odometer",
					color: "hsl(var(--chart-2))",
				},
			}}
			className="min-h-[300px]"
		>
			<LineChart
				data={data}
				margin={{
					top: 5,
					right: 10,
					left: 10,
					bottom: 20,
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
					tickFormatter={(value) => `${value} km`}
					tickMargin={10}
				/>
				<ChartTooltip content={<ChartTooltipContent />} />
				<Line
					type="monotone"
					dataKey="odometerKm"
					strokeWidth={2}
					dot={{ strokeWidth: 2, r: 4 }}
					activeDot={{ r: 6 }}
				/>
			</LineChart>
		</ChartContainer>
	);
}
