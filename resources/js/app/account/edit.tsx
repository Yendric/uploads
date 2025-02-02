import { Input } from "@/components/form";
import { Button } from "@/components/ui/button";
import { useForm, usePage } from "@inertiajs/react";
import { Separator } from "@radix-ui/react-separator";
import type { FormEvent } from "react";

export default function AccountEdit() {
    const { data, setData, errors, put, processing } = useForm<{
        name: string;
        email: string;
        password: string | null;
    }>({
        name: usePage().props.auth.user.name,
        email: usePage().props.auth.user.email,
        password: null,
    });

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(route("account.update"));
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight cursor-pointer inline">
                        Account beheren
                    </h2>
                </div>
            </div>

            <Separator className="my-4" />
            <div className="space-y-3 mx-auto h-full">
                <form onSubmit={submit} className="grid gap-4">
                    <Input
                        type="text"
                        id="name"
                        label="Naam"
                        value={data.name}
                        error={errors.name}
                        onChange={(e) => setData("name", e.target.value)}
                        placeholder="Jan Janssens"
                    />
                    <Input
                        type="email"
                        id="email"
                        label="E-mail"
                        value={data.email}
                        error={errors.email}
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="mail@provider.be"
                    />
                    <Input
                        type="password"
                        id="password"
                        label="Wachtwoord"
                        value={data.password || ""}
                        error={errors.password}
                        required={false}
                        onChange={(e) => setData("password", e.target.value)}
                        placeholder="Laat leeg om niet te veranderen"
                    />

                    <div>
                        <Button type="submit" disabled={processing}>
                            Bijwerken
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
