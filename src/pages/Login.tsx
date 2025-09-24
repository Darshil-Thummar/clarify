import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loginUser, setAuthToken } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const [usernameOrEmail, setUsernameOrEmail] = useState("");
	const [password, setPassword] = useState("");

	const mutation = useMutation({
		mutationFn: async () => {
			const payload = usernameOrEmail.includes("@")
				? { email: usernameOrEmail, password }
				: { username: usernameOrEmail, password };
			return await loginUser(payload);
		},
		onSuccess: ({ data }) => {
			setAuthToken(data.token);
			toast({ title: "Logged in" });
			navigate("/");
		},
		onError: (err: any) => {
			toast({ title: "Login failed", description: err?.message || "Unexpected error" });
		},
	});

return (
    <div className="h-screen flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md border shadow-soft">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>Welcome back. Enter your credentials to continue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="ue">Username or Email</Label>
                    <Input id="ue" value={usernameOrEmail} onChange={(e) => setUsernameOrEmail(e.target.value)} placeholder="sujal_dev or sujal@example.com" autoComplete="username" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="pw">Password</Label>
                    <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
                </div>
                <Button className="w-full" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
                    {mutation.isPending ? "Logging in..." : "Login"}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                    Don't have an account? <Link className="underline" to="/register">Register</Link>
                </p>
            </CardContent>
        </Card>
    </div>
);
};

export default Login;


