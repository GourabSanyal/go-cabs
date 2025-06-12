import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Clipboard,
  Modal,
  Alert,
  Dimensions,
  ScrollView,
} from "react-native";
import {Icon} from "@ui-kitten/components";
import QRCode from "react-native-qrcode-svg";
import {usePayment} from "../../hooks/usePayment";
import {primaryColor, backgroundPrimary} from "../../theme/colors";
import {SOLANA_PAYMENT_CONFIG} from "../../config/payment.config";

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onPaymentComplete?: () => void;
}

const {width: screenWidth} = Dimensions.get("window");

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  onPaymentComplete,
}) => {
  const {currentSession, getRemainingTime, cancelPaymentSession} = usePayment();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  // Update timer
  useEffect(() => {
    if (!visible || !currentSession) return;

    const updateTimer = () => {
      const remaining = getRemainingTime();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        Alert.alert(
          "Payment Expired",
          "The payment session has expired. Please try again.",
          [{text: "OK", onPress: onClose}],
        );
      }
    };

    // Update immediately
    updateTimer();

    // Set up interval
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [visible, currentSession, getRemainingTime, onClose]);

  // Handle payment completion
  useEffect(() => {
    if (currentSession?.status === "completed") {
      onPaymentComplete?.();
    }
  }, [currentSession?.status, onPaymentComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleCopyAddress = async () => {
    if (!currentSession) return;

    try {
      await Clipboard.setString(currentSession.walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      Alert.alert("Error", "Failed to copy address to clipboard");
    }
  };

  const handleClose = () => {
    Alert.alert(
      "Cancel Payment",
      "Are you sure you want to cancel the payment? You will need to start a new payment session.",
      [
        {text: "Continue Payment", style: "cancel"},
        {
          text: "Cancel",
          style: "destructive",
          onPress: () => {
            cancelPaymentSession();
            onClose();
          },
        },
      ],
    );
  };

  const generateSolanaPayURL = (): string => {
    if (!currentSession) return "";

    // Generate Solana Pay URL for QR code
    const baseUrl = "solana:";
    const recipient = currentSession.walletAddress;
    const amount = currentSession.solAmount;
    const label = encodeURIComponent(SOLANA_PAYMENT_CONFIG.BRANDING.LABEL);
    const message = encodeURIComponent(
      `${SOLANA_PAYMENT_CONFIG.BRANDING.MESSAGE_PREFIX}: ${currentSession.rideId}`,
    );

    return `${baseUrl}${recipient}?amount=${amount}&label=${label}&message=${message}`;
  };

  if (!currentSession) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}>
        <ScrollView>

        
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Complete Payment</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Icon name="close-outline" width={24} height={24} fill="#fff" />
            </TouchableOpacity>
          </View>

          {/* Timer */}
          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>Time Remaining</Text>
            <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
            {timeLeft < 60 && (
              <Text style={styles.warningText}>
                ⚠️ Payment session expiring soon!
              </Text>
            )}
          </View>

          {/* Payment Details */}
          <View style={styles.paymentDetails}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount (INR):</Text>
              <Text style={styles.detailValue}>₹{currentSession.amount}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount (SOL):</Text>
              <Text style={styles.detailValue}>
                {currentSession.solAmount.toFixed(4)} SOL
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Ride ID:</Text>
              <Text style={styles.detailValue}>{currentSession.rideId}</Text>
            </View>
          </View>

          {/* QR Code */}
          <View style={styles.qrContainer}>
            <Text style={styles.sectionTitle}>Scan QR Code</Text>
            <View style={styles.qrWrapper}>
              <QRCode
                value={generateSolanaPayURL()}
                size={SOLANA_PAYMENT_CONFIG.QR_CODE.SIZE}
                backgroundColor={SOLANA_PAYMENT_CONFIG.QR_CODE.BACKGROUND_COLOR}
                color={SOLANA_PAYMENT_CONFIG.QR_CODE.FOREGROUND_COLOR}
              />
            </View>
            <Text style={styles.qrInstruction}>
              Scan with your Solana wallet to pay
            </Text>
          </View>

          {/* Wallet Address */}
          <View style={styles.addressContainer}>
            <Text style={styles.sectionTitle}>Or send manually to:</Text>
            <View style={styles.addressBox}>
              <Text
                style={styles.addressText}
                numberOfLines={1}
                ellipsizeMode="middle">
                {currentSession.walletAddress}
              </Text>
              <TouchableOpacity
                onPress={handleCopyAddress}
                style={styles.copyButton}>
                <Text style={styles.copyButtonText}>
                  {copied ? "Copied!" : "Copy"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionTitle}>Payment Instructions:</Text>
            <Text style={styles.instruction}>
              1. Send exactly {currentSession.solAmount.toFixed(4)} SOL to the
              address above
            </Text>
            <Text style={styles.instruction}>
              2. Use your Phantom, Solflare, or any Solana wallet
            </Text>
            <Text style={styles.instruction}>
              3. Payment will be automatically verified
            </Text>
            <Text style={styles.instruction}>
              4. Do not close this screen until payment is confirmed
            </Text>
          </View>

          {/* Status */}
          <View style={styles.statusContainer}>
            <View style={styles.statusIndicator}>
              <Icon
                name="clock-outline"
                width={20}
                height={20}
                fill={primaryColor}
              />
              <Text style={styles.statusText}>Waiting for payment...</Text>
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: backgroundPrimary,
    borderRadius: 16,
    padding: 20,
    width: screenWidth * 0.9,
    maxHeight: "90%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "Montserrat-Bold",
    color: "#fff",
  },
  closeButton: {
    padding: 5,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 15,
    backgroundColor: "rgba(1, 205, 93, 0.1)",
    borderRadius: 12,
  },
  timerLabel: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#fff",
    marginBottom: 5,
  },
  timer: {
    fontSize: 36,
    fontFamily: "Montserrat-Bold",
    color: primaryColor,
  },
  warningText: {
    fontSize: 12,
    fontFamily: "Montserrat-SemiBold",
    color: "#ff6b35",
    marginTop: 5,
  },
  paymentDetails: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
    color: "#fff",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#ccc",
  },
  detailValue: {
    fontSize: 14,
    fontFamily: "Montserrat-SemiBold",
    color: "#fff",
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  qrWrapper: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
  },
  qrInstruction: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    color: "#ccc",
    textAlign: "center",
    marginTop: 5,
  },
  addressContainer: {
    marginBottom: 20,
  },
  addressBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  addressText: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    color: "#fff",
    flex: 1,
    marginRight: 10,
  },
  copyButton: {
    backgroundColor: primaryColor,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  copyButtonText: {
    color: "#fff",
    fontFamily: "Montserrat-SemiBold",
    fontSize: 12,
  },
  instructionsContainer: {
    marginBottom: 20,
  },
  instructionTitle: {
    fontSize: 14,
    fontFamily: "Montserrat-SemiBold",
    color: "#fff",
    marginBottom: 10,
  },
  instruction: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    color: "#ccc",
    marginBottom: 5,
    lineHeight: 18,
  },
  statusContainer: {
    alignItems: "center",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(1, 205, 93, 0.1)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontFamily: "Montserrat-SemiBold",
    color: primaryColor,
    marginLeft: 8,
  },
});

export default PaymentModal;
