import { usePage } from "@inertiajs/react";

export default function useIsAuth() {
    return usePage().props.auth.user != null;
}
