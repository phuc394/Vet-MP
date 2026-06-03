import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfileThunk, updateMyProfileThunk } from "../../redux/slices/profile.slice";
import { AppDispatch, RootState } from "../../redux/store";

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  currentData: {
    full_name: string;
    address: string | null;
    avatar?: string | null;
  };
}

const EditProfileModal = ({ visible, onClose, currentData }: EditProfileModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { updateProfileLoading } = useSelector((state: RootState) => state.profile);

  const [fullName, setFullName] = useState(currentData.full_name);
  const [address, setAddress] = useState(currentData.address || "");
  const [avatar, setAvatar] = useState(currentData.avatar || "");

  useEffect(() => {
    if (visible) {
      setFullName(currentData.full_name);
      setAddress(currentData.address || "");
      setAvatar(currentData.avatar || "");
    }
  }, [currentData.address, currentData.avatar, currentData.full_name, visible]);

  const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow photo library access to choose your avatar.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.35,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const pickedAvatar = asset.base64
        ? `data:${asset.mimeType || "image/jpeg"};base64,${asset.base64}`
        : asset.uri;

      setAvatar(pickedAvatar);
    }
  };

  const handleSave = async () => {
    try {
      await dispatch(
        updateMyProfileThunk({
          full_name: fullName.trim(),
          address: address.trim(),
          avatar,
        })
      ).unwrap();
      await dispatch(getMyProfileThunk());
      onClose();
    } catch (error) {
      console.log("Update profile failed:", error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={modalStyles.modalOverlay}>
        <TouchableOpacity style={modalStyles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={modalStyles.modalContent}>
          <View style={modalStyles.indicator} />
          <Text style={modalStyles.modalTitle}>Edit Profile</Text>

          <TouchableOpacity style={modalStyles.avatarPicker} onPress={pickAvatar} activeOpacity={0.85}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={modalStyles.avatarPreview} resizeMode="cover" />
            ) : (
              <View style={modalStyles.avatarPlaceholder}>
                <Ionicons name="person-outline" size={44} color="#7F4900" />
              </View>
            )}
            <View style={modalStyles.avatarEditBadge}>
              <Ionicons name="camera-outline" size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <Text style={modalStyles.inputLabel}>Full Name</Text>
          <TextInput
            style={modalStyles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
          />

          <Text style={modalStyles.inputLabel}>Address</Text>
          <TextInput
            style={modalStyles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your address"
          />

          <View style={modalStyles.buttonGroup}>
            <TouchableOpacity style={[modalStyles.btn, modalStyles.btnCancel]} onPress={onClose}>
              <Text style={modalStyles.btnCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.btn, modalStyles.btnSave]}
              onPress={handleSave}
              disabled={updateProfileLoading}
            >
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
  modalContent: {
    backgroundColor: "#FFF9EC",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "85%",
    minHeight: 430,
  },
  indicator: { width: 40, height: 5, backgroundColor: "#CCC", borderRadius: 3, alignSelf: "center", marginBottom: 15 },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: "#465F4D", marginBottom: 18, textAlign: "center" },
  avatarPicker: {
    alignSelf: "center",
    marginBottom: 20,
  },
  avatarPreview: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "#F7EDD7",
  },
  avatarPlaceholder: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7EDD7",
    borderWidth: 1,
    borderColor: "#E0CDA7",
  },
  avatarEditBadge: {
    position: "absolute",
    right: -2,
    bottom: 2,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#465F4D",
    borderWidth: 2,
    borderColor: "#FFF9EC",
  },
  inputLabel: { fontSize: 14, fontWeight: "bold", color: "#7F4900", marginBottom: 6 },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 15,
  },
  buttonGroup: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  btnCancel: { backgroundColor: "#D9D9D9", marginRight: 10 },
  btnCancelText: { color: "#333", fontWeight: "bold" },
  btnSave: { backgroundColor: "#8CA694" },
  btnSaveText: { color: "#FFF", fontWeight: "bold" },
});
