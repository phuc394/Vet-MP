import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from './ProfileStyle';
import { mockUserData, handleEditProfile, handleSettings } from './ProfileUtils';

const Profile = () => {
  const user = mockUserData;

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Ảnh đại diện */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: user.avatarUrl }}
          style={styles.avatar}
          resizeMode="cover"
        />
      </View>
      
      {/* Tên người dùng */}
      <Text style={styles.headerName}>{user.fullName}</Text>

      {/* Thẻ thông tin */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Profile Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>{user.fullName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Contact Phone Number</Text>
          <Text style={styles.value}>{user.contactPhone}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Login Email (non-editable)</Text>
          <Text style={styles.value}>{user.loginEmail}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Login Phone Number (non-editable)</Text>
          <Text style={styles.value}>{user.loginPhone}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.value}>{user.address}</Text>
        </View>
      </View>

      {/* Nút bấm (Không dùng icon thư viện, dùng Text Emoji) */}
      <TouchableOpacity style={styles.button} onPress={handleEditProfile} activeOpacity={0.7}>
        <Text style={{ fontSize: 16 }}>✏️</Text>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSettings} activeOpacity={0.7}>
        <Text style={{ fontSize: 18 }}>⚙️</Text>
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;