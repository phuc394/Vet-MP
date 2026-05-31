
import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { styles } from './HomeStyle';
import { MOCK_PETS, MOCK_SERVICES, ServiceItem } from './HomeUtils';
import SupportCard from '../../components/SupportCard';

export default function Home() {
  const navigation = useNavigation<any>();

  const renderServiceCard = ({ item }: { item: ServiceItem }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('ServiceDetail', { service: item })}
    >
      <View style={styles.serviceIconWrap}>
        <MaterialCommunityIcons name={item.icon as any} size={22} color="#835300" />
      </View>
      <View style={styles.serviceCardBody}>
        <Text style={styles.serviceCategory}>{item.category}</Text>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceDescription} numberOfLines={2}>{item.description}</Text>
        <View style={styles.serviceMetaRow}>
          <Text style={styles.servicePrice}>{item.price}</Text>
          <Text style={styles.serviceDuration}>{item.duration}</Text>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#7D4600" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.pageLabelRow}>
          <Text style={styles.pageLabelText}>Home</Text>
        </View>

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

        {/* Khu vực Services */}
        <View style={styles.servicesHeader}>
          <Text style={styles.servicesTitle}>Services</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAllText}>see all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.servicesFrame}>
          <FlatList
            data={MOCK_SERVICES}
            keyExtractor={(item) => item.service_id.toString()}
            renderItem={renderServiceCard}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.servicesList}
          />
        </View>

        {/* Bảng Hỗ trợ / Reschedule */}
        <SupportCard />

      </ScrollView>
    </SafeAreaView>
  );
}