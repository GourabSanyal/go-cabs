export type ModalType = "error" | "success" | "warn" | "timer" | "payment";

export interface BaseModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export interface TimerModalProps extends BaseModalProps {
  duration?: number;
  onComplete?: () => void;
  pollStatus?: () => Promise<boolean>;
}

export interface PaymentModalProps extends BaseModalProps {
  onPaymentComplete?: () => void;
}

export type AppModalProps =
  | ({type: "timer"} & TimerModalProps)
  | ({type: "payment"} & PaymentModalProps);
