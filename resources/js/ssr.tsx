// @ts-nocheck

import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import ReactDOMServer from "react-dom/server";
import { resolveRoutes } from "./shared";

import { route as routeFn } from "ziggy-js";

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        resolve: resolveRoutes,
        setup: ({ App, props }) => {
            // Hacky way to get ziggy working with ssr
            const Ziggy = {
                // Pull the Ziggy config off of the props.
                ...props.initialPage.props.ziggy,
                // Build the location, since there is
                // no window.location in Node.
                location: new URL(props.initialPage.props.ziggy.url),
            };

            global.route = (name, params, absolute, config = Ziggy) =>
                routeFn(name, params, absolute, config);

            return <App {...props} />;
        },
    })
);
