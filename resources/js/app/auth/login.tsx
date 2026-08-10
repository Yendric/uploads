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
import { Form, Head } from "@inertiajs/react";
import { Label } from "@radix-ui/react-label";
import { type ComponentType } from "react";

function Login() {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <Head title="Inloggen" />
            <Form action="/login" method="post">
                {({ errors, processing }) => (
                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl">Login</CardTitle>
                            <CardDescription>
                                Vul je e-mail en wachtwoord in om toegang te
                                krijgen tot het dashboard.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    error={errors.email}
                                    placeholder="voorbeeld@domein.be"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Wachtwoord</Label>
                                <Input
                                    error={errors.password}
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
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
                )}
            </Form>
        </div>
    );
}

Login.layout = [] as ComponentType[];

export default Login;
