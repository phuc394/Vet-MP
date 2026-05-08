
import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './HomeStyle';
import { MOCK_PETS } from './HomeUtils';

export default function Home() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >

        {/* Bảng Upcoming Visit */}
        <View style={styles.upcomingCard}>
          <View style={styles.upcomingHeader}>
            <Text style={styles.upcomingTitle}>UPCOMING VISIT</Text>
            <View style={styles.calendarIconContainer}>
              {/* Sử dụng icon từ Expo */}
              <MaterialCommunityIcons name="calendar-blank" size={20} color="#FFFFFF" />
            </View>
          </View>
          
          <TouchableOpacity style={styles.detailsButton} activeOpacity={0.8}>
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>

        {/* Khu vực My Pets */}
        <View style={styles.petsHeader}>
          <Text style={styles.petsTitle}>My Pets</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAllText}>see all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.petsList}
        >
          {MOCK_PETS.map((pet) => (
            <View key={pet.pet_id} style={styles.petCard}>
              <Image source={{ uri: pet.avatar }} style={styles.petImage} />
              <Text style={styles.petName}>{pet.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Bảng Hỗ trợ / Reschedule */}
        <View style={styles.supportCard}>
          <View style={styles.supportContent}>
            <Text style={styles.supportTitle}>Need to reschedule?</Text>
            <Text style={styles.supportText}>
              Call our help center for immediate changes to appointments within 24 hours.
            </Text>
            <TouchableOpacity style={styles.supportButton} activeOpacity={0.8}>
              <Text style={styles.supportButtonText}>Call Support</Text>
            </TouchableOpacity>
          </View>

          {/* Hình ảnh mặt người bên góc phải */}
          <View style={styles.supportImageContainer}>
            <Image
              // Bạn có thể thay link này bằng link ảnh mờ vector mặt người thật trong assets dự án (VD: require('../../assets/headset-icon.png'))
              source={require('../../../assets/anh-cskh.png')} 
              style={styles.supportImage}
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}