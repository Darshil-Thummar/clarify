import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { registerUser, setAuthToken } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const [form, setForm] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		firstName: "",
		lastName: "",
	});

	const mutation = useMutation({
		mutationFn: async () => await registerUser({
			username: form.username,
			email: form.email,
			password: form.password,
			firstName: form.firstName,
			lastName: form.lastName,
		}),
		onSuccess: ({ token }) => {
			setAuthToken(token);
			toast({ title: "Registered" });
			navigate("/me");
		},
		onError: (err: any) => {
			toast({ title: "Registration failed", description: err?.message || "Unexpected error" });
		},
	});

	function update<K extends keyof typeof form>(key: K, value: string) {
		setForm((f) => ({ ...f, [key]: value }));
	}

return (
    <div className="h-screen flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md border shadow-soft">
            <CardHeader>
                <CardTitle className="text-2xl">Create account</CardTitle>
                <CardDescription>Join Clarify to save your progress and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" value={form.username} onChange={(e) => update("username", e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input id="firstName" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm password</Label>
                        <Input id="confirmPassword" type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} />
                    </div>
                </div>
                <Button
                    className="w-full"
                    onClick={() => {
                        if (!form.password || form.password !== form.confirmPassword) {
                            toast({ title: "Passwords do not match", description: "Please confirm your password." });
                            return;
                        }
                        mutation.mutate();
                    }}
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "Creating account..." : "Create account"}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                    Already have an account? <Link className="underline" to="/login">Login</Link>
                </p>
            </CardContent>
        </Card>
    </div>
);
};

export default Register;


