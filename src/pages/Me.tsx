import { useQuery } from "@tanstack/react-query";
import { fetchMe, getAuthToken, setAuthToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";

const Me = () => {
	const navigate = useNavigate();
	const token = getAuthToken();
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["me"],
		queryFn: async () => await fetchMe<any>(),
		enabled: !!token,
	});

	if (!token) {
		return (
			<div className="max-w-md mx-auto p-6 space-y-4">
				<p>You are not logged in.</p>
				<Link className="underline" to="/login">Go to login</Link>
			</div>
		);
	}

	return (
		<div className="max-w-xl mx-auto p-6 space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Me</h1>
				<Button variant="secondary" onClick={() => { setAuthToken(null); navigate("/login"); }}>Logout</Button>
			</div>
			{isLoading && <p>Loading...</p>}
			{error && <p className="text-red-600">{(error as any)?.message || "Failed to load"}</p>}
			{data && (
				<pre className="bg-muted p-4 rounded text-sm overflow-auto">{JSON.stringify(data, null, 2)}</pre>
			)}
			<Button onClick={() => refetch()}>Refresh</Button>
		</div>
	);
};

export default Me;


