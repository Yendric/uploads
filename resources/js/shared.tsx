import type { ResolvedComponent } from "@inertiajs/react";
import Layout from "./components/layout";

export function resolveRoutes(name: string) {
    const pages = import.meta.glob<{ default: ResolvedComponent }>(
        "./app/**/*.tsx",
        { eager: true },
    );
    const page = pages[`./app/${name}.tsx`];
    if (!page) throw new Error(`Pagina niet gevonden: ${name}`);

    page.default.layout = page.default.layout || [Layout];

    return page;
}
