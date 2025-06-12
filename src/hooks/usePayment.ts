import {useCallback, useEffect, useRef} from "react";
import {useRecoilState} from "recoil";
import {Alert} from "react-native";
import {
  paymentAtom,
  currentPaymentSessionAtom,
  paymentModalVisibleAtom,
  paymentProcessingAtom,
  paymentErrorAtom,
} from "../store/atoms/payment/paymentAtom";
import {solanaPaymentService} from "../services/payment/solana/solanaPaymentService";
import {
  PaymentSessionRequest,
  PaymentSession,
} from "../types/payment/paymentTypes";

export const usePayment = () => {
  const [paymentState, setPaymentState] = useRecoilState(paymentAtom);
  const [currentSession, setCurrentSession] = useRecoilState(
    currentPaymentSessionAtom,
  );
  const [modalVisible, setModalVisible] = useRecoilState(
    paymentModalVisibleAtom,
  );
  const [isProcessing, setIsProcessing] = useRecoilState(paymentProcessingAtom);
  const [error, setError] = useRecoilState(paymentErrorAtom);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const onPaymentCompleteCallbackRef = useRef<(() => void) | null>(null);

  // Create a new payment session
  const createPaymentSession = useCallback(
    async (
      request: PaymentSessionRequest,
      onPaymentComplete?: () => void,
    ): Promise<PaymentSession | null> => {
      try {
        setIsProcessing(true);
        setError(undefined);
        onPaymentCompleteCallbackRef.current = onPaymentComplete || null;

        console.log("[usePayment] Creating payment session:", request);

        const response = await solanaPaymentService.createPaymentSession(
          request,
        );
        const session = response.session;

        setCurrentSession(session);
        setPaymentState(prev => ({
          ...prev,
          currentSession: session,
          isProcessing: false,
          showModal: true,
        }));

        // Start frontend polling
        startPaymentPolling(session.transactionId);

        console.log(
          "[usePayment] Payment session created successfully:",
          session.transactionId,
        );
        return session;
      } catch (error) {
        console.error("[usePayment] Error creating payment session:", error);
        setError("Failed to create payment session");
        setIsProcessing(false);
        Alert.alert(
          "Payment Error",
          "Failed to create payment session. Please try again.",
        );
        return null;
      }
    },
    [setCurrentSession, setPaymentState, setIsProcessing, setError],
  );

  // Start polling for payment verification
  const startPaymentPolling = useCallback(
    (transactionId: string) => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      pollingIntervalRef.current = setInterval(async () => {
        try {
          console.log(
            `[usePayment] Polling payment status for: ${transactionId}`,
          );
          const status = await solanaPaymentService.getSessionStatus(
            transactionId,
          );
          console.log(`[usePayment] Received status: ${status.status}`, status);

          if (status.status === "completed") {
            console.log(
              "[usePayment] Payment completed!",
              status.transactionHash,
            );

            // Update session
            setCurrentSession(prev =>
              prev
                ? {
                    ...prev,
                    status: "completed",
                    transactionHash: status.transactionHash,
                  }
                : undefined,
            );

            setPaymentState(prev => ({
              ...prev,
              isProcessing: false,
              showModal: false,
            }));

            stopPaymentPolling();

            Alert.alert(
              "Payment Successful!",
              "Your payment has been confirmed. You can now track your ride.",
              [{text: "OK"}],
            );
            if (onPaymentCompleteCallbackRef.current) {
              onPaymentCompleteCallbackRef.current();
            }
          } else if (status.status === "expired") {
            console.log("[usePayment] Payment session expired");

            setCurrentSession(prev =>
              prev
                ? {
                    ...prev,
                    status: "expired",
                  }
                : undefined,
            );

            setError("Payment session has expired");
            setPaymentState(prev => ({
              ...prev,
              isProcessing: false,
              showModal: false,
            }));

            stopPaymentPolling();

            Alert.alert(
              "Payment Expired",
              "The payment session has expired. Please try again.",
              [{text: "OK"}],
            );
          } else if (status.status === "failed") {
            console.log("[usePayment] Payment failed");

            setError(status.message || "Payment failed");
            setPaymentState(prev => ({
              ...prev,
              isProcessing: false,
              showModal: false,
            }));

            stopPaymentPolling();

            Alert.alert(
              "Payment Failed",
              status.message || "Payment failed. Please try again.",
              [{text: "OK"}],
            );
          }
        } catch (error) {
          console.error("[usePayment] Error polling payment status:", error);
        }
      }, 5000); // Poll every 5 seconds

      console.log("[usePayment] Started payment polling for:", transactionId);
    },
    [setCurrentSession, setPaymentState, setError],
  );

  // Stop polling
  const stopPaymentPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      console.log("[usePayment] Stopped payment polling");
    }
  }, []);

  // Cancel current payment session
  const cancelPaymentSession = useCallback(() => {
    if (currentSession) {
      solanaPaymentService.cancelSession(currentSession.transactionId);

      setCurrentSession(undefined);
      setPaymentState(prev => ({
        ...prev,
        currentSession: undefined,
        isProcessing: false,
        showModal: false,
      }));

      stopPaymentPolling();
      console.log("[usePayment] Payment session cancelled");
    }
  }, [currentSession, setCurrentSession, setPaymentState, stopPaymentPolling]);

  // Show payment modal
  const showPaymentModal = useCallback(() => {
    setModalVisible(true);
    setPaymentState(prev => ({...prev, showModal: true}));
  }, [setModalVisible, setPaymentState]);

  // Hide payment modal
  const hidePaymentModal = useCallback(() => {
    setModalVisible(false);
    setPaymentState(prev => ({...prev, showModal: false}));
  }, [setModalVisible, setPaymentState]);

  // Clear payment error
  const clearError = useCallback(() => {
    setError(undefined);
    setPaymentState(prev => ({...prev, error: undefined}));
  }, [setError, setPaymentState]);

  // Check if payment is required for a ride
  const isPaymentRequired = useCallback(
    (rideId: string, bidId: string): boolean => {
      // Check if there's already an active session for this ride/bid
      const existingSession = solanaPaymentService.getActiveSessionByRide(
        rideId,
        bidId,
      );
      return !existingSession || existingSession.status !== "completed";
    },
    [],
  );

  // Get remaining time for current session
  const getRemainingTime = useCallback((): number => {
    if (!currentSession) return 0;

    const now = Date.now();
    const remaining = Math.max(0, currentSession.endTime - now);
    return Math.floor(remaining / 1000); // Return seconds
  }, [currentSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPaymentPolling();
      onPaymentCompleteCallbackRef.current = null; // Clean up callback on unmount
    };
  }, [stopPaymentPolling]);

  return {
    // State
    paymentState,
    currentSession,
    modalVisible,
    isProcessing,
    error,

    // Actions
    createPaymentSession,
    cancelPaymentSession,
    showPaymentModal,
    hidePaymentModal,
    clearError,
    isPaymentRequired,
    getRemainingTime,

    // Internal methods (exposed for debugging)
    startPaymentPolling,
    stopPaymentPolling,
  };
};
