import {atom} from "recoil";
import {
  PaymentState,
  PaymentSession,
} from "../../../types/payment/paymentTypes";

// Main payment state atom
export const paymentAtom = atom<PaymentState>({
  key: "paymentState",
  default: {
    currentSession: undefined,
    isProcessing: false,
    showModal: false,
    error: undefined,
    method: undefined,
  },
});

// Current active payment session
export const currentPaymentSessionAtom = atom<PaymentSession | undefined>({
  key: "currentPaymentSession",
  default: undefined,
});

// Payment modal visibility
export const paymentModalVisibleAtom = atom<boolean>({
  key: "paymentModalVisible",
  default: false,
});

// Payment processing status
export const paymentProcessingAtom = atom<boolean>({
  key: "paymentProcessing",
  default: false,
});

// Payment error message
export const paymentErrorAtom = atom<string | undefined>({
  key: "paymentError",
  default: undefined,
});
