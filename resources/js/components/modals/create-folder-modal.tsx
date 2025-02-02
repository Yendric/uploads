import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import { Input } from "../form";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
interface Props {
    open: boolean;
    onClose: () => void;
}
export default function CreateFolderModal({ open, onClose }: Props) {
    const { data, setData, post, errors } = useForm({ name: "" });

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route("folder.store"), {
            onSuccess: onClose,
        });
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="min-w-fit">
                <form onSubmit={submit} className="grid gap-4">
                    <DialogHeader>
                        <DialogTitle>Map aanmaken</DialogTitle>
                    </DialogHeader>

                    <div className="grid w-full items-center gap-1.5">
                        <Input
                            type="text"
                            id="name"
                            label="Naam"
                            value={data.name}
                            error={errors.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Mijn map"
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={onClose} variant="outline">
                            Annuleer
                        </Button>
                        <Button type="submit">Maken</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
