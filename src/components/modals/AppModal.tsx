import React from "react";
import {Modal, View, Text, StyleSheet, ActivityIndicator} from "react-native";
import {primaryColor} from "../../theme/colors";
import {AppModalProps} from "./modalConfig";
import TimerModal from "./TimerModal";
import PaymentModal from "./PaymentModal";

const AppModal: React.FC<AppModalProps> = props => {
  const {type, isOpen, onClose} = props;

  const renderModalContent = () => {
    switch (type) {
      case "timer":
        return <TimerModal {...props} />;
      case "payment":
        return (
          <PaymentModal
            visible={isOpen || false}
            onClose={onClose || (() => {})}
            onPaymentComplete={
              "onPaymentComplete" in props ? props.onPaymentComplete : undefined
            }
          />
        );
      default:
        return (
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color={primaryColor} />
            <Text style={styles.title}>Processing</Text>
            <Text style={styles.message}>Please wait...</Text>
          </View>
        );
    }
  };

  // For payment modal, don't wrap in additional Modal since PaymentModal handles its own
  if (type === "payment") {
    return renderModalContent();
  }

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>{renderModalContent()}</View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#353f3b",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontFamily: "Montserrat-Bold",
    color: "#fff",
    marginTop: 15,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
    color: "#fff",
    textAlign: "center",
  },
});

export default AppModal;
