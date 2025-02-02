import type { FolderResourceType } from "@/types/types";
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
import { Label } from "../ui/label";
interface Props {
    open: boolean;
    folder: FolderResourceType;
    onClose: () => void;
}
export default function EditFolderModal({ open, folder, onClose }: Props) {
    const { data, setData, put, errors } = useForm({ name: folder.name });

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(route("folder.update", folder.uuid), {
            onSuccess: onClose,
        });
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="min-w-fit">
                <form onSubmit={submit} className="grid gap-4">
                    <DialogHeader>
                        <DialogTitle>Map bewerken</DialogTitle>
                    </DialogHeader>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="name">Naam</Label>
                        <Input
                            type="text"
                            id="name"
                            error={errors.name}
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Mijn map"
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={onClose} variant="outline">
                            Annuleer
                        </Button>
                        <Button type="submit">Bewaar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
