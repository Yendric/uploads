import { type ComponentType, useState } from "react";

type ModalProps = {
    open: boolean;
    onClose: () => void;
};
type WithoutModalProps<P> = Omit<P, "open" | "onClose">;

interface ModalPacket<P extends ModalProps> {
    component: ComponentType<P>;
    props: WithoutModalProps<P>;
}

class EventEmitter {
    listeners: Array<(p: ModalPacket<any> | null) => void>;

    constructor() {
        this.listeners = [];
    }

    subscribe(callback: (p: ModalPacket<any> | null) => void) {
        this.listeners.push(callback);
    }

    emit(p: ModalPacket<any> | null) {
        this.listeners.forEach((cb) => cb(p));
    }
}

const ModalState = new EventEmitter();

export function Modal() {
    const [packet, setPacket] = useState<ModalPacket<any> | null>(null);
    const [open, setOpen] = useState(true);

    ModalState.subscribe((p) => setPacket(p));

    function onClose() {
        setOpen(false);

        // Allow for animation to play
        setTimeout(() => {
            ModalState.emit(null);
            setOpen(true);
        }, 500);
    }

    return packet?.component ? (
        <packet.component {...packet.props} onClose={onClose} open={open} />
    ) : (
        <></>
    );
}

export function useModal<P extends ModalProps>(
    component: ComponentType<P>,
    props: WithoutModalProps<P>
) {
    const open = () =>
        ModalState.emit({
            component,
            props,
        });
    const close = () => ModalState.emit(null);

    return {
        open,
        close,
    };
}
