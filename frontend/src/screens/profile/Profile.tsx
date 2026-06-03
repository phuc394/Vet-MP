import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { clearLoginData } from "../../redux/slices/login.slice";
import { clearProfileData } from "../../redux/slices/profile.slice";

import { styles } from './ProfileStyle';
import { AppDispatch, RootState } from '../../redux/store';
import { getMyProfileThunk } from '../../redux/slices/profile.slice';
import { logoutThunk } from '../../redux/slices/logout.slice';

import EditProfileModal from './EditProfileModal';
import ChangePasswordModal from './ChangePasswordModal';

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();

  // 1. Lấy dữ liệu từ Redux Store một cách ngắn gọn, không trùng lặp
  const { refreshToken, accessToken } = useSelector((state: RootState) => state.login);
  const { profile, getProfileLoading, error } = useSelector((state: RootState) => state.profile);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [changePassModalVisible, setChangePassModalVisible] = useState(false);

  // 2. Tự động gọi API lấy Profile khi cấu trúc Token thay đổi
  useEffect(() => {
    if (accessToken) {
      dispatch(getMyProfileThunk());
    }
  }, [dispatch, accessToken]);

  // 3. Hàm xử lý logic Đăng xuất (Đã đồng bộ chuẩn xác tên hàm xử lý sự kiện)
  const handleLogoutAction =
  async () => {
    try {
      if (refreshToken) {
        await dispatch(
          logoutThunk(refreshToken)
        ).unwrap();
      }
    } catch (error) {
      console.log(error);
    }

    dispatch(clearLoginData());
    dispatch(clearProfileData());

    navigation.navigate("Login");
  };

  // Trạng thái chờ dữ liệu từ mạng hiển thị xoay tròn
  if (getProfileLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#465F4D" />
      </View>
    );
  }

  // Khung giao diện cứu hộ (Báo lỗi & Cho phép bấm tải lại nếu token lệch pha hoặc mất mạng)
  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Ionicons name="alert-circle-outline" size={50} color="red" />
        <Text style={{ textAlign: 'center', marginTop: 10, color: '#333', fontWeight: '500' }}>{error}</Text>
        <TouchableOpacity 
          style={[styles.button, { marginTop: 20, paddingHorizontal: 30 }]} 
          onPress={() => dispatch(getMyProfileThunk())}
        >
          <Text style={styles.buttonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Cấu trúc đối tượng fallback phòng ngừa lỗi thiếu trường từ cơ sở dữ liệu
  const user = profile || { 
    full_name: "Chưa cập nhật", 
    email: "Chưa cập nhật", 
    phone_number: "", 
    address: "Chưa cập nhật", 
    avatar: null 
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.profileHeaderSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ 
                  uri: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random` 
                }}
                style={styles.avatar}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.headerName}>{user.full_name}</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.value}>{user.full_name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Contact Phone Number</Text>
              <Text style={styles.value}>{user.phone_number || 'Not set'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Login Email (non-editable)</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Login Phone Number (non-editable)</Text>
              <Text style={styles.value}>{user.phone_number || 'Not set'}</Text>
            </View>

            <View style={[styles.infoRow, styles.lastInfoRow]}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>{user.address || 'Not set'}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.buttonEdit} onPress={() => setEditModalVisible(true)} activeOpacity={0.7}>
          <Ionicons name="pencil-outline" size={18} color="#FFFFFF" />
          <Text style={styles.buttonEditText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.buttonEdit, { backgroundColor: '#7F4900', marginBottom: 12 }]} 
          onPress={() => setChangePassModalVisible(true)} 
          activeOpacity={0.7}
        >
          <Ionicons name="key-outline" size={18} color="#FFFFFF" />
          <Text style={styles.buttonEditText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogoutAction} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={18} color="#333" />
          <Text style={styles.buttonText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Truyền đầy đủ dữ liệu hiện tại bao gồm cả số điện thoại vào Modal cập nhật */}
      <EditProfileModal 
        visible={editModalVisible} 
        onClose={() => setEditModalVisible(false)} 
        currentData={{ 
          full_name: user.full_name, 
          address: user.address,
          avatar: user.avatar,
        }}
      />

      <ChangePasswordModal 
        visible={changePassModalVisible} 
        onClose={() => setChangePassModalVisible(false)} 
      />
    </View>
  );
};

export default Profile;
