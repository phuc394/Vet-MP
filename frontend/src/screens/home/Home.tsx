
import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './HomeStyle';
import { MOCK_PETS } from './HomeUtils';
import SupportCard from '../../components/SupportCard';

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
        <SupportCard />

      </ScrollView>
    </SafeAreaView>
  );
}