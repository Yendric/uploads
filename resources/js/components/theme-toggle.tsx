import { type Theme, useTheme } from "@/components/theme-provider";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                    <SunIcon className="mr-2 h-4 w-4 dark:hidden" />
                    <MoonIcon className="mr-2 hidden h-4 w-4 dark:block" />
                    Thema
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={(value) => setTheme(value as Theme)}
                >
                    <DropdownMenuRadioItem value="light">
                        Licht
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                        Donker
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                        Systeem
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
