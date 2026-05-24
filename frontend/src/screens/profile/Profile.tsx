import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './ProfileStyle';
import { mockUserData, handleEditProfile, handleLogout } from './ProfileUtils';

const Profile = () => {
  const user = mockUserData;

  return (
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
              source={{ uri: user.avatar || 'https://via.placeholder.com/120' }}
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
            <Text style={styles.value}>{user.phone_number}</Text>
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

      <TouchableOpacity style={styles.buttonEdit} onPress={handleEditProfile} activeOpacity={0.7}>
        <Ionicons name="pencil-outline" size={18} color="#FFFFFF" />
        <Text style={styles.buttonEditText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogout} activeOpacity={0.7}>
        <Ionicons name="log-out-outline" size={18} color="#333" />
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;