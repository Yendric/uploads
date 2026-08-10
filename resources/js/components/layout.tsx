import Sidebar from "@/components/sidebar";
import useIsAuth from "@/hooks/use-is-auth";
import { Modal } from "@/hooks/use-modal";
import { toast } from "@/hooks/use-toast";
import { usePage } from "@inertiajs/react";
import type React from "react";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { Toaster } from "./ui/toaster";

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    // Runs after every render
    useEffect(() => {
        document.dispatchEvent(new Event("render-finish"));
    });

    useEffect(() => {
        // Prevent swipe to go back on iOS
        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches[0]?.pageX && e.touches[0]?.pageX > 20) return;
            e.preventDefault();
        };

        document.addEventListener("touchstart", handleTouchStart, {
            passive: false,
        });

        return () => {
            document.removeEventListener("touchstart", handleTouchStart);
        };
    }, []);

    const isAuth = useIsAuth();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const handlers = useSwipeable({
        onSwipedRight: (eventData) => {
            if (eventData.initial[0] < 50) {
                setMobileSidebarOpen(true);
            }
        },
        onSwipedLeft: () => {
            setMobileSidebarOpen(false);
        },
        trackTouch: true,
    });

    return (
        <div {...handlers}>
            <div className="flex min-h-screen bg-background">
                {isAuth && (
                    <>
                        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r lg:block">
                            <Sidebar />
                        </aside>

                        <div className="lg:hidden">
                            <div
                                className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
                                    mobileSidebarOpen
                                        ? "opacity-100"
                                        : "opacity-0 pointer-events-none"
                                }`}
                                onClick={() => setMobileSidebarOpen(false)}
                            />

                            <div
                                className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-background shadow-lg transition-transform duration-300 ${
                                    mobileSidebarOpen
                                        ? "translate-x-0"
                                        : "-translate-x-full"
                                }`}
                            >
                                <Sidebar />
                            </div>
                        </div>
                    </>
                )}
                <main className="min-w-0 flex-1 px-4 py-6 lg:px-8">
                    {children}
                </main>
            </div>
            <Toaster />
            <ShowFlash />
            <Modal />
        </div>
    );
}

function ShowFlash() {
    const flash = usePage().props.flash as { success?: string; error?: string };

    useEffect(() => {
        if (flash?.success != null) {
            toast({ title: "Success", description: flash?.success });
        }

        if (flash?.error != null) {
            toast({
                title: "Error",
                description: flash?.error, // fixed: use flash.error here
                variant: "destructive",
            });
        }
    }, [flash]);

    return null;
}
