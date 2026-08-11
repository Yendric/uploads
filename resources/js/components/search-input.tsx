import { Input } from "@/components/ui/input";
import { router, usePage } from "@inertiajs/react";
import { useRef } from "react";

export default function SearchInput() {
    const { search } = usePage().props;
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    function onChange(value: string) {
        if (timer.current) clearTimeout(timer.current);

        timer.current = setTimeout(() => {
            router.get(
                window.location.pathname,
                value ? { search: value } : {},
                { preserveState: true, replace: true }
            );
        }, 300);
    }

    return (
        <Input
            type="search"
            defaultValue={search ?? ""}
            placeholder="Zoeken..."
            className="w-full sm:w-64"
            onChange={(e) => onChange(e.target.value)}
        />
    );
}
