import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { RideRequest } from '../types/ride/types/ride.types';

interface SocketControlsProps {
  isConnected: boolean;
  roomStatus: { status: string; message: string } | null;
  roomMembers: {
    roomId: string;
    members: Array<{ id: string; isCurrentUser: boolean }>;
    totalMembers: number;
  } | null;
  onJoinRoom: () => void;
  onSendRideRequest: (data: RideRequest) => void;
  onKeepOneClient: () => void;
  onDisconnect: () => void;
  onGetRoomMembers: () => void;
}

export const SocketControls: React.FC<SocketControlsProps> = ({
  isConnected,
  roomStatus,
  roomMembers,
  onJoinRoom,
  onSendRideRequest,
  onKeepOneClient,
  onDisconnect,
  onGetRoomMembers,
}) => {
  return (
    <View style={styles.socketControls}>
      <Text style={styles.statusText}>
        Socket Status: {isConnected ? "Connected" : "Disconnected"}
      </Text>

      {roomStatus && (
        <View
          style={[
            styles.statusMessage,
            roomStatus.status === "error" && styles.errorMessage,
            roomStatus.status === "single_user" && styles.infoMessage,
          ]}>
          <Text style={styles.statusMessageText}>{roomStatus.message}</Text>
        </View>
      )}

      {roomMembers && (
        <View style={styles.membersContainer}>
          <Text style={styles.membersTitle}>
            Room Members ({roomMembers.totalMembers})
          </Text>
          {roomMembers.members.length > 0 ? (
            roomMembers.members.map(member => (
              <Text key={member.id} style={styles.memberText}>
                {member.id} {member.isCurrentUser ? "(You)" : ""}
              </Text>
            ))
          ) : (
            <Text style={styles.memberText}>No members in room</Text>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={onJoinRoom}>
        <Text style={styles.buttonText}>Join Room</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onSendRideRequest}>
        <Text style={styles.buttonText}>Send Ride Request</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onKeepOneClient}>
        <Text style={styles.buttonText}>Keep One Client</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onGetRoomMembers}>
        <Text style={styles.buttonText}>Check Room Members</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.disconnectButton]}
        onPress={onDisconnect}>
        <Text style={styles.buttonText}>Disconnect</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  socketControls: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
  },
  disconnectButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  statusMessage: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  errorMessage: {
    backgroundColor: "#ffebee",
    borderColor: "#ffcdd2",
    borderWidth: 1,
  },
  infoMessage: {
    backgroundColor: "#e3f2fd",
    borderColor: "#bbdefb",
    borderWidth: 1,
  },
  statusMessageText: {
    textAlign: "center",
    fontSize: 14,
  },
  membersContainer: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  membersTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    textAlign: "center",
  },
  memberText: {
    fontSize: 14,
    marginVertical: 2,
    color: "#333",
  },
}); 