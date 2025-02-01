import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { $api } from "../client";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	const { data, error, isLoading } = $api.useQuery(
		"get",
		"/vehicle-status/last",
	);
	return (
		<div className="p-2">
			<h3>Welcome Home!</h3>
			<div className="font-mono">{JSON.stringify(data, null, 2)}</div>
		</div>
	);
}
