import { usePage } from "@inertiajs/react";

export default function useIsAuth() {
    /** @ts-ignore */
    return usePage().props.auth.user != null;
}
