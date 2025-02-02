import type { VehicleStatusResponse } from "@/client";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

export function OdometerChart({ data }: { data: VehicleStatusResponse }) {
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
					dataKey="created_at"
					tickLine={false}
					axisLine={false}
					// tickFormatter={(value) => value.split("-").slice(1).join("/")}
					tickMargin={10}
				/>
				<YAxis
					dataKey="odometer_km"
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) => `${value} km`}
					tickMargin={10}
				/>
				<ChartTooltip content={<ChartTooltipContent />} />
				<Line
					type="monotone"
					dataKey="odometer_km"
					strokeWidth={2}
					dot={{ strokeWidth: 0, r: 0 }}
				/>
			</LineChart>
		</ChartContainer>
	);
}
