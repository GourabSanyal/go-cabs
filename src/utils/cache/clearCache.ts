import {storage} from "../../store/mmkv/storage";

export const clearPaymentCache = () => {
  try {
    // Clear timer-related cache
    storage.delete("timerStartTime");
    storage.delete("timerDuration");
    storage.delete("modalOpen");

    // Clear payment session cache if any
    storage.delete("currentPaymentSession");
    storage.delete("paymentState");

    console.log("Payment cache cleared successfully");
  } catch (error) {
    console.error("Error clearing payment cache:", error);
  }
};

export const clearAllCache = () => {
  try {
    storage.clearAll();
    console.log("All cache cleared successfully");
  } catch (error) {
    console.error("Error clearing all cache:", error);
  }
};
