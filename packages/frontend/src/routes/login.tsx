import { SignIn } from "@/components/sign-in";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<SignIn />
		</div>
	);
}
