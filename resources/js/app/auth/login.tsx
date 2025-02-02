import { Input } from "@/components/form";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useForm } from "@inertiajs/react";
import { Label } from "@radix-ui/react-label";
import { type FormEvent, type ReactElement } from "react";

function Login() {
    const { data, setData, post, errors, processing } = useForm({
        email: "",
        password: "",
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post("/login");
    }

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <form onSubmit={handleSubmit}>
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>
                            Vul je e-mail en wachtwoord in om toegang te krijgen
                            tot het dashboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                error={errors.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                placeholder="voorbeeld@domein.be"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Wachtwoord</Label>
                            <Input
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                error={errors.password}
                                id="password"
                                type="password"
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            type="submit"
                            disabled={processing}
                        >
                            Inloggen
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}

Login.layout = (page: ReactElement) => page;

export default Login;
