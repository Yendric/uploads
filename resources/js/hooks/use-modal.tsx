import { type ComponentType, useEffect, useRef, useState } from "react";

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
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        ModalState.subscribe((p) => {
            // a new modal cancels a pending close
            if (p && closeTimer.current) {
                clearTimeout(closeTimer.current);
                closeTimer.current = null;
            }

            setPacket(p);
            if (p) setOpen(true);
        });
    }, []);

    function onClose() {
        setOpen(false);

        // Allow for animation to play
        closeTimer.current = setTimeout(() => {
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
    props: WithoutModalProps<P>,
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
