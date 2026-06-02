import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateMyProfileThunk, getMyProfileThunk } from "../../redux/slices/profile.slice";
import { AppDispatch, RootState } from "../../redux/store";

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  currentData: {
    full_name: string;
    address: string | null;
    phone_number?: string | null; // <-- THÊM DÒNG NÀY VÀO ĐÂY
  };
}

const EditProfileModal = ({ visible, onClose, currentData }: EditProfileModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { updateProfileLoading } = useSelector((state: RootState) => state.profile);
  const [phoneNumber, setPhoneNumber] = useState(currentData.phone_number || '');
  const [fullName, setFullName] = useState(currentData.full_name);
  const [address, setAddress] = useState(currentData.address || "");

  const handleSave = async () => {
    try {
      await dispatch(updateMyProfileThunk({ full_name: fullName, address: address })).unwrap();
      await dispatch(getMyProfileThunk()); // Tải lại thông tin mới nhất lên giao diện chính
      onClose();
    } catch (error) {
      console.log("Cập nhật thất bại:", error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={modalStyles.modalOverlay}>
        <TouchableOpacity style={modalStyles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={modalStyles.modalContent}>
          <View style={modalStyles.indicator} />
          <Text style={modalStyles.modalTitle}>Edit Profile</Text>

          <Text style={modalStyles.inputLabel}>Full Name</Text>
          <TextInput style={modalStyles.input} value={fullName} onChangeText={setFullName} placeholder="Enter your full name" />

          <Text style={modalStyles.inputLabel}>Address</Text>
          <TextInput style={modalStyles.input} value={address} onChangeText={setAddress} placeholder="Enter your address" />

          <View style={modalStyles.buttonGroup}>
            <TouchableOpacity style={[modalStyles.btn, modalStyles.btnCancel]} onPress={onClose}>
              <Text style={modalStyles.btnCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[modalStyles.btn, modalStyles.btnSave]} onPress={handleSave} disabled={updateProfileLoading}>
              {updateProfileLoading ? <ActivityIndicator color="#FFF" /> : <Text style={modalStyles.btnSaveText}>Save</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditProfileModal;

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