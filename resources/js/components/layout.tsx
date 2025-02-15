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
    children: React.ReactElement;
}

export default function Layout({ children }: LayoutProps) {
    // Runs after every render
    useEffect(() => {
        document.dispatchEvent(new Event("render-finish"));
    });

    useEffect(() => {
        // Prevent swipe to go back on iOS
        const handleTouchStart = (e: TouchEvent) => {
            if (
                e.touches[0]?.pageX &&
                e.touches[0]?.pageX > 20 &&
                e.touches[0]?.pageX < window.innerWidth - 20
            )
                return;
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
            <div className="h-full border-t bg-background">
                <div className={`grid ${isAuth && "lg:grid-cols-5"}`}>
                    {isAuth && (
                        <>
                            <Sidebar className="hidden lg:block sticky top-0 left-0" />

                            <div className="lg:hidden">
                                <div
                                    className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${
                                        mobileSidebarOpen
                                            ? "opacity-100"
                                            : "opacity-0 pointer-events-none"
                                    }`}
                                    onClick={() => setMobileSidebarOpen(false)}
                                />

                                <div
                                    className={`fixed inset-y-0 left-0 z-50 w-64 bg-black shadow-lg transform transition-transform duration-300 ${
                                        mobileSidebarOpen
                                            ? "translate-x-0"
                                            : "-translate-x-full"
                                    }`}
                                >
                                    <div className="p-4">
                                        <Sidebar />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    <div className="col-span-3 lg:col-span-4 lg:border-l">
                        <div className="h-full px-4 py-6 lg:px-8">
                            {children}
                        </div>
                    </div>
                </div>
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
