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
import { Head } from "@inertiajs/react";
import { type ComponentType, useState } from "react";

interface LoginProps {
    csrfToken: string;
    errors: Record<string, string>;
}

function Login({ csrfToken, errors }: LoginProps) {
    const [processing, setProcessing] = useState(false);

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <Head title="Inloggen" />
            <form
                action="/login"
                method="post"
                onSubmit={() => setProcessing(true)}
            >
                <input type="hidden" name="_token" value={csrfToken} />
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>
                            Vul je e-mail en wachtwoord in om toegang te krijgen
                            tot het dashboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            label="E-mail"
                            autoComplete="email"
                            error={errors.email}
                            placeholder="voorbeeld@domein.be"
                            className="grid gap-2"
                            required
                        />
                        <Input
                            error={errors.password}
                            id="password"
                            name="password"
                            type="password"
                            label="Wachtwoord"
                            autoComplete="current-password"
                            className="grid gap-2"
                            required
                        />
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

Login.layout = [] as ComponentType[];

export default Login;
