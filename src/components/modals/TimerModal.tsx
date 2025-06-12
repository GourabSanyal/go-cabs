import React, {useEffect, useState, useRef, useCallback} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Clipboard,
} from "react-native";
import {Icon} from "@ui-kitten/components";
import {TimerModalProps} from "./modalConfig";
import {rideAtom} from "../../store/atoms/ride/rideAtom";
import {useRecoilState} from "recoil";
import {
  timerStartTimeAtom,
  timerDurationAtom,
} from "../../store/atoms/navigation/navigationAtoms";
import {getPaymentWalletAddress} from "../../config/payment.config";

const TimerModal: React.FC<TimerModalProps> = ({
  isOpen,
  onClose,
  duration = 300,
  onComplete = () => {},
  pollStatus = async () => false,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [copied, setCopied] = useState(false);
  const [rideState] = useRecoilState(rideAtom);
  const fare = rideState.fare?.finalFare;

  // Timer persistence atoms
  const [timerStartTime, setTimerStartTime] =
    useRecoilState(timerStartTimeAtom);
  const [timerDuration, setTimerDuration] = useRecoilState(timerDurationAtom);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate remaining time based on timestamp
  const calculateRemainingTime = useCallback(() => {
    if (!timerStartTime) return duration;

    const now = Date.now();
    const elapsed = Math.floor((now - timerStartTime) / 1000);
    const remaining = Math.max(0, timerDuration - elapsed);

    console.log(`Timer: ${elapsed}s elapsed, ${remaining}s remaining`);
    return remaining;
  }, [timerStartTime, timerDuration, duration]);

  // Initialize timer when modal opens
  useEffect(() => {
    if (!isOpen) {
      // Clear timer state when modal closes
      if (timerRef.current) clearInterval(timerRef.current);
      if (pollRef.current) clearInterval(pollRef.current);
      setTimerStartTime(null);
      setTimerDuration(300);
      return;
    }

    // Modal is opening - set up timer
    setTimerDuration(duration);

    if (!timerStartTime) {
      // First time opening - start new timer
      const startTime = Date.now();
      setTimerStartTime(startTime);
      console.log("Timer started at:", new Date(startTime).toISOString());
    }

    // Calculate initial remaining time
    const remaining = calculateRemainingTime();
    setTimeLeft(remaining);

    if (remaining <= 0) {
      onComplete?.();
      return;
    }
  }, [
    isOpen,
    duration,
    timerStartTime,
    timerDuration,
    calculateRemainingTime,
    onComplete,
    setTimerStartTime,
    setTimerDuration,
  ]);

  // Timer countdown effect
  useEffect(() => {
    if (!isOpen || !timerStartTime) return;

    const updateTimer = () => {
      const remaining = calculateRemainingTime();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        if (pollRef.current) clearInterval(pollRef.current);
        onComplete?.();
      }
    };

    // Update immediately
    updateTimer();

    // Set up interval for updates
    timerRef.current = setInterval(updateTimer, 1000);

    // Set up polling
    pollRef.current = setInterval(async () => {
      const isComplete = await pollStatus();
      if (isComplete) {
        if (timerRef.current) clearInterval(timerRef.current);
        if (pollRef.current) clearInterval(pollRef.current);
        onComplete?.();
      }
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isOpen, timerStartTime, onComplete, pollStatus, calculateRemainingTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleCopyAddress = async () => {
    const walletAddress = getPaymentWalletAddress();
    await Clipboard.setString(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    // Clear timer state when closing
    setTimerStartTime(null);
    setTimerDuration(300);
    onClose?.();
  };

  const walletAddress = getPaymentWalletAddress();
  const displayAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(
    -4,
  )}`;

  return (
    <View style={styles.modalContent}>
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Icon name="close-outline" width={24} height={24} fill="#fff" />
      </TouchableOpacity>

      <Text style={styles.timer}>{formatTime(timeLeft)}</Text>

      <View style={styles.addressContainer}>
        <Text style={styles.addressLabel}>Wallet Address:</Text>
        <View style={styles.addressBox}>
          <Text style={styles.addressText}>{displayAddress}</Text>
          <TouchableOpacity
            onPress={handleCopyAddress}
            style={styles.copyButton}>
            <Text style={styles.copyButtonText}>
              {copied ? "Copied!" : "Copy"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.instruction}>
        Copy this address and send {fare || "the required amount"} to this
        wallet address, and come back after the transaction is complete
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "#353f3b",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
    padding: 5,
  },
  timer: {
    fontSize: 48,
    fontFamily: "Montserrat-Bold",
    color: "#fff",
    marginVertical: 20,
  },
  addressContainer: {
    width: "100%",
    marginVertical: 20,
  },
  addressLabel: {
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
    color: "#fff",
    marginBottom: 10,
  },
  addressBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2f2d",
    padding: 15,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  addressText: {
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
    color: "#fff",
    flex: 1,
  },
  copyButton: {
    backgroundColor: "#01CD5D",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  copyButtonText: {
    color: "#fff",
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
  },
  instruction: {
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 24,
  },
});

export default TimerModal;
