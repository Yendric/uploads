import { route as routeFn } from "ziggy-js";
import type { FolderResourceType } from "./types/types";

declare global {
    var route: typeof routeFn;
}

declare module "@inertiajs/core" {
    interface PageProps {
        auth: {
            user: { id: number; name: string; email: string } | null;
        };
        folders: FolderResourceType[];
        flash: {
            success?: string;
            error?: string;
        };
        appVersion: string;
        search?: string;
    }
}
