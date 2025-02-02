import { Input as ShadCnInput } from "@/components/ui/input";
import {
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Select as ShadCnSelect,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import type React from "react";
import { Label } from "./ui/label";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    error?: string;
    label?: string;
    value: string;
};

export function Input({ error, label, className, ...props }: InputProps) {
    return (
        <div className={className}>
            {label && (
                <Label
                    className={cn(error && "text-destructive")}
                    htmlFor={props.id}
                >
                    {label}
                </Label>
            )}
            <ShadCnInput id={props.id} required {...props} />
            {error && (
                <p className={cn("text-[0.8rem] font-medium text-destructive")}>
                    {error}
                </p>
            )}
        </div>
    );
}

type SelectProps = React.InputHTMLAttributes<HTMLSelectElement> & {
    error?: string;
    label?: string;
    defaultValue: string;
    onValueChange: (value: string) => void;
    options: string[];
};

export function Select({
    error,
    label,
    options,
    className,
    ...props
}: SelectProps) {
    return (
        <div className={className}>
            {label && (
                <Label
                    className={cn(error && "text-destructive")}
                    htmlFor={props.id}
                >
                    {label}
                </Label>
            )}
            <ShadCnSelect
                onValueChange={props.onValueChange}
                defaultValue={props.defaultValue}
            >
                <SelectTrigger>
                    <SelectValue placeholder={label} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </ShadCnSelect>
        </div>
    );
}
