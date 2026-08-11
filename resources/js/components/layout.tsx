import Sidebar from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import useIsAuth from "@/hooks/use-is-auth";
import { Modal } from "@/hooks/use-modal";
import { toast } from "@/hooks/use-toast";
import { usePage } from "@inertiajs/react";
import { MenuIcon } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { Button } from "./ui/button";
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

    // close the mobile sidebar when navigating
    const { url } = usePage();
    useEffect(() => setMobileSidebarOpen(false), [url]);

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
        <ThemeProvider>
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
                    <main className="flex min-w-0 flex-1 flex-col">
                        {isAuth && (
                            <div className="sticky top-0 z-30 flex items-center gap-2 border-b bg-background px-2 py-2 lg:hidden">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Menu openen"
                                    onClick={() => setMobileSidebarOpen(true)}
                                >
                                    <MenuIcon className="h-5 w-5" />
                                </Button>
                                <span className="text-lg font-semibold tracking-tight">
                                    Uploads
                                </span>
                            </div>
                        )}
                        <div className="flex min-w-0 flex-1 flex-col px-4 py-6 lg:px-8">
                            {children}
                        </div>
                    </main>
                </div>
                <Toaster />
                <ShowFlash />
                <Modal />
            </div>
        </ThemeProvider>
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
