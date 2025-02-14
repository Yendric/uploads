import Sidebar from "@/components/sidebar";
import useIsAuth from "@/hooks/use-is-auth";
import { Modal } from "@/hooks/use-modal";
import { toast } from "@/hooks/use-toast";
import { usePage } from "@inertiajs/react";
import type React from "react";
import { useEffect } from "react";
import { Toaster } from "./ui/toaster";

interface LayoutProps {
    children: React.ReactElement;
}

export default function Layout({ children }: LayoutProps) {
    // runs after every render
    useEffect(() => {
        document.dispatchEvent(new Event("render-finish"));
    });

    const isAuth = useIsAuth();

    return (
        <>
            <div className="h-full border-t bg-background">
                <div className={`grid ${isAuth && "lg:grid-cols-5"}`}>
                    {isAuth && (
                        <Sidebar className="hidden lg:block sticky top-0 left-0" />
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
        </>
    );
}

function ShowFlash() {
    const flash = usePage().props.flash as { success?: string; error?: string };

    useEffect(() => {
        if (flash?.success != null) {
            toast({ title: "Succes", description: flash?.success });
        }

        if (flash?.error != null) {
            toast({
                title: "Error",
                description: flash?.success,
                variant: "destructive",
            });
        }
    });

    return null;
}
