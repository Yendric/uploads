import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";

interface Props {
    action: () => void;
    open: boolean;
    onClose: () => void;
}

export default function AreYouSure({ action, open, onClose }: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ben je zeker?</DialogTitle>
                    <DialogDescription>
                        Weet u zeker dat u wil doorgaan? Deze actie kan niet
                        ongedaan gemaakt worden.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={onClose}>Annuleer</Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            action();
                            onClose();
                        }}
                    >
                        Ja, ik ben zeker
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
