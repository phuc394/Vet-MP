import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { changePasswordThunk, resetChangePasswordState } from "../../redux/slices/changePassword.slice";
import { AppDispatch, RootState } from "../../redux/store";
import { showPlatformAlert } from "../../utils/platformAlert";

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

const ChangePasswordModal = ({ visible, onClose }: ChangePasswordModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.changePassword);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      showPlatformAlert("Error", "Please fill in all fields");
      return;
    }

    try {
      await dispatch(changePasswordThunk({ currentPassword, newPassword })).unwrap();
      showPlatformAlert("Success", "Password changed successfully!");
      dispatch(resetChangePasswordState());
      setCurrentPassword("");
      setNewPassword("");
      onClose();
    } catch (err: any) {
      showPlatformAlert("Failed", err || "Change password failed");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={modalStyles.modalOverlay}>
        <TouchableOpacity style={modalStyles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={modalStyles.modalContent}>
          <View style={modalStyles.indicator} />
          <Text style={modalStyles.modalTitle}>Change Password</Text>

          <Text style={modalStyles.inputLabel}>Current Password</Text>
          <TextInput style={modalStyles.input} secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} placeholder="Enter current password" />

          <Text style={modalStyles.inputLabel}>New Password</Text>
          <TextInput style={modalStyles.input} secureTextEntry value={newPassword} onChangeText={setNewPassword} placeholder="Enter new password" />

          {error && <Text style={{ color: "red", marginBottom: 10, textAlign: "center" }}>{error}</Text>}

          <View style={modalStyles.buttonGroup}>
            <TouchableOpacity style={[modalStyles.btn, modalStyles.btnCancel]} onPress={onClose}>
              <Text style={modalStyles.btnCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[modalStyles.btn, modalStyles.btnSave]} onPress={handleUpdatePassword} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={modalStyles.btnSaveText}>Update</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ChangePasswordModal;

const modalStyles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" },
  backdrop: { ...StyleSheet.absoluteFillObject },
  modalContent: { backgroundColor: "#FFF9EC", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, minHeight: 320 },
  indicator: { width: 40, height: 5, backgroundColor: "#CCC", borderRadius: 3, alignSelf: "center", marginBottom: 15 },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: "#465F4D", marginBottom: 20, textAlign: "center" },
  inputLabel: { fontSize: 14, fontWeight: "bold", color: "#7F4900", marginBottom: 6 },
  input: { backgroundColor: "#FFF", borderWidth: 1, borderColor: "#D9D9D9", borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 15 },
  buttonGroup: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  btnCancel: { backgroundColor: "#D9D9D9", marginRight: 10 },
  btnCancelText: { color: "#333", fontWeight: "bold" },
  btnSave: { backgroundColor: "#8CA694" },
  btnSaveText: { color: "#FFF", fontWeight: "bold" },
});
