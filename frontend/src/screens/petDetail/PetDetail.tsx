import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from './PetDetailStyle';
import {
  TabState,
  Vaccination,
  calculateAge,
  checkVaccineStatus,
  emptyPet,
  formatDisplayDate,
} from './PetDetailUtils';
import { AppDispatch, RootState } from '../../redux/store';
import { deletePetThunk, fetchPetByIdThunk, setSelectedPet } from '../../redux/slices/pet.slice';
import type { Pet } from '../../types/pet.type';

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

function formatValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }

  return String(value);
}

export default function PetDetail() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const routePet = route.params?.pet as Pet | undefined;
  const routeVaccinations = (route.params?.vaccinations ?? []) as Vaccination[];
  const [activeTab, setActiveTab] = useState<TabState>('Information');

  const { selectedPet, detailLoading, detailError, deleting, deleteError } = useSelector(
    (state: RootState) => state.pet
  );

  useFocusEffect(
    useCallback(() => {
      if (routePet) {
        dispatch(setSelectedPet(routePet));
        dispatch(fetchPetByIdThunk(routePet.pet_id));
      }
    }, [dispatch, routePet])
  );

  const pet = useMemo<Pet>(() => {
    if (selectedPet && selectedPet.pet_id === routePet?.pet_id) {
      return selectedPet;
    }

    return routePet ?? selectedPet ?? emptyPet;
  }, [routePet, selectedPet]);

  const handleDelete = () => {
    if (!pet.pet_id || deleting) return;

    Alert.alert('Delete pet', `Delete ${pet.name}? This pet will be removed from your list.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await dispatch(deletePetThunk(pet.pet_id)).unwrap();
            navigation.goBack();
          } catch (error) {
            const message = typeof error === 'string' ? error : 'Delete pet failed';
            Alert.alert('Delete pet failed', message);
          }
        },
      },
    ]);
  };

  if (!routePet && !selectedPet && detailLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#465F4D" />
        </View>
      </SafeAreaView>
    );
  }

  if (!pet.pet_id) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10} style={styles.backButton}>
              <Ionicons name="chevron-back" size={22} color="#465F4D" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Pet detail</Text>
          </View>
          <View style={styles.centerState}>
            <Text style={styles.emptyTitle}>No pet data</Text>
            <Text style={styles.emptyText}>Please open pet detail from your pet list.</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#465F4D" />
          </TouchableOpacity>
          <View style={styles.headerCopy}>
            <Text style={styles.headerTitle}>Pet detail</Text>
            <Text style={styles.headerSubtitle}>{pet.name}</Text>
          </View>
          <TouchableOpacity onPress={handleDelete} hitSlop={10} style={styles.deleteButton} disabled={deleting}>
            {deleting ? (
              <ActivityIndicator color="#B8472B" />
            ) : (
              <Ionicons name="trash-outline" size={20} color="#B8472B" />
            )}
          </TouchableOpacity>
        </View>

        {(detailError || deleteError) && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{detailError || deleteError}</Text>
          </View>
        )}

        <View style={styles.profileCard}>
          {pet.avatar ? (
            <Image source={{ uri: pet.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="paw-outline" size={34} color="#8CA694" />
            </View>
          )}
          <View style={styles.profileCopy}>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petMeta}>
              {[pet.species, pet.breed].filter(Boolean).join(' / ') || 'Species not set'}
            </Text>
            <Text style={styles.petMeta}>{formatWeight(pet.weight)}</Text>
          </View>
        </View>

        <View style={styles.tabContainer}>
          {(['Information', 'Vaccinations'] as TabState[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, isActive && styles.activeTabButton]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.85}
              >
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {activeTab === 'Information' && (
          <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>ID</Text>
                <Text style={styles.infoValue}>{pet.pet_id}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Sex</Text>
                <Text style={styles.infoValue}>{formatValue(pet.sex)}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{calculateAge(pet.birth_date)}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Birth date</Text>
                <Text style={styles.infoValue}>{formatDisplayDate(pet.birth_date)}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Medical notes</Text>
            <View style={styles.notesBox}>
              <Text style={styles.notesText}>{pet.notes?.trim() || 'No notes recorded yet.'}</Text>
            </View>
          </ScrollView>
        )}

        {activeTab === 'Vaccinations' && (
          <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            {routeVaccinations.length === 0 ? (
              <View style={styles.emptyPanel}>
                <Ionicons name="medkit-outline" size={30} color="#8CA694" />
                <Text style={styles.emptyTitle}>No vaccination records</Text>
                <Text style={styles.emptyText}>Vaccination data is not connected for this pet yet.</Text>
              </View>
            ) : (
              routeVaccinations.map((vaccine) => {
                const status = checkVaccineStatus(vaccine.expiration_date);
                const statusColor = status === 'Expired' ? '#B8472B' : '#2F7D4F';

                return (
                  <View key={vaccine.id} style={styles.vaccineCard}>
                    <View style={styles.vaccineHeader}>
                      <View style={styles.vaccineNameWrap}>
                        <Text style={styles.vaccineLabel}>Vaccine name</Text>
                        <Text style={styles.vaccineName}>{vaccine.name}</Text>
                      </View>
                      <View style={[styles.statusBadge, { borderColor: statusColor }]}>
                        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                        <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
                      </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.vaccineDates}>
                      <View style={styles.dateCol}>
                        <Text style={styles.vaccineLabel}>Date given</Text>
                        <Text style={styles.dateValue}>{formatDisplayDate(vaccine.date_given)}</Text>
                      </View>
                      <View style={styles.dateCol}>
                        <Text style={styles.vaccineLabel}>Expiration</Text>
                        <Text style={styles.dateValue}>{formatDisplayDate(vaccine.expiration_date)}</Text>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
