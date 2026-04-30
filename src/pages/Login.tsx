import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/providers/trpc";
import { useNavigate } from "react-router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => navigate("/admin"),
    onError: (e) => setError(e.message),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="w-full max-w-sm bg-neutral-900 border-neutral-800">
        <CardHeader className="text-center">
          <CardTitle className="text-white">Admin Login</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-neutral-800 border-neutral-700 text-white"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-neutral-800 border-neutral-700 text-white"
            onKeyDown={(e) => e.key === "Enter" && loginMutation.mutate({ username, password })}
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button
            className="w-full"
            size="lg"
            onClick={() => loginMutation.mutate({ username, password })}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
