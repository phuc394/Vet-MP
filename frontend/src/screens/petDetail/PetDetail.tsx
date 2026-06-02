import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './PetDetailStyle';
import { usePetDetail } from './PetDetailUtils';

function formatWeight(weight: number | string | null | undefined) {
  if (weight === null || weight === undefined || weight === '') {
    return 'N/A';
  }

  const numericWeight = Number(weight);
  if (Number.isNaN(numericWeight)) {
    return 'N/A';
  }

  return `${numericWeight.toFixed(2)} kg`;
}

export default function PetDetail() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { pet, vaccinations, activeTab, setActiveTab, calculateAge, checkVaccineStatus } = usePetDetail(route.params?.pet);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Pets</Text>
      </View>

      {/* Tabs Menu */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Information' && styles.activeTabButton]}
          onPress={() => setActiveTab('Information')}
        >
          <Text style={styles.tabText}>Information</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Vaccinations' && styles.activeTabButton]}
          onPress={() => setActiveTab('Vaccinations')}
        >
          <Text style={styles.tabText}>Vaccinations</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content: Information */}
      {activeTab === 'Information' && (
        <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
          <View style={styles.basicInfoContainer}>
            {pet.avatar ? (
              <Image source={{ uri: pet.avatar }} style={styles.avatarPlaceholder} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}
            <View style={styles.detailsContainer}>
              <Text style={styles.detailText}>ID: {pet.pet_id}</Text>
              <Text style={styles.detailText}>Name: {pet.name}</Text>
              <Text style={styles.detailText}>Gender: {pet.sex}</Text>
              <Text style={styles.detailText}>Species: {pet.species}</Text>
              <Text style={styles.detailText}>Breed: {pet.breed}</Text>
              <Text style={styles.detailText}>Age: {calculateAge(pet.birth_date)}</Text>
              <Text style={styles.detailText}>Weight: {formatWeight(pet.weight)}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Key Medical Info</Text>
          <Text style={styles.medicalText}>
            Spayed / Neutered: {pet.spayed_neutered ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.medicalText}>Blood Type: {pet.blood_type || ''}</Text>

          {pet.notes && (
            <View style={styles.notesBox}>
              <Text style={styles.notesText}>{pet.notes}</Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Tab Content: Vaccinations */}
      {activeTab === 'Vaccinations' && (
        <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
          {vaccinations.map((vaccine, index) => {
            const status = checkVaccineStatus(vaccine.expiration_date);
            const isExpired = status === 'Expired';
            const statusColor = isExpired ? '#ff3b30' : '#34c759';

            return (
              <View key={index} style={styles.vaccineCard}>
                <View style={styles.vaccineHeader}>
                  <View>
                    <Text style={styles.vaccineLabel}>Vaccine Name:</Text>
                    <Text style={styles.vaccineName}>{vaccine.name}</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                    <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
                  </View>
                </View>
                
                <View style={styles.divider} />

                <View style={styles.vaccineDates}>
                  <View style={styles.dateCol}>
                    <Text style={styles.vaccineLabel}>Date Given:</Text>
                    <Text style={styles.dateValue}>{vaccine.date_given}</Text>
                  </View>
                  <View style={styles.dateCol}>
                    <Text style={styles.vaccineLabel}>Expiration Date:</Text>
                    <Text style={styles.dateValue}>{vaccine.expiration_date}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}