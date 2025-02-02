import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { resolveRoutes } from "./shared";

createInertiaApp({
    resolve: resolveRoutes,
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});

// function handleInertiaStart() {
//     if (!document.startViewTransition) return;

//     document.startViewTransition(async () => {
//         isTransitioning = true;
//         return new Promise((resolve) => {
//             document.addEventListener(
//                 "render-finish",
//                 () => {
//                     resolve();
//                 },
//                 { once: true }
//             );
//         });
//     });
// }
// document.addEventListener("inertia:before", handleInertiaStart);
