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
                <Button variant="ghost" size="icon" aria-label="Thema wisselen">
                    <SunIcon className="h-4 w-4 dark:hidden" />
                    <MoonIcon className="hidden h-4 w-4 dark:block" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
