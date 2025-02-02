// @ts-nocheck

import Layout from "./components/layout";

export function resolveRoutes(name: string) {
    const pages = import.meta.glob("./app/**/*.tsx", { eager: true });
    const page = pages[`./app/${name}.tsx`];
    page.default.layout =
        page.default.layout || ((page) => <Layout children={page} />);

    return page;
}
