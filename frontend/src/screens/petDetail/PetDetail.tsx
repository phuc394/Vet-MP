import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from './PetDetailStyle';
import {
  TabState,
  calculateAge,
  emptyPet,
  formatDisplayDate,
} from './PetDetailUtils';
import { AppDispatch, RootState } from '../../redux/store';
import {
  deletePetThunk,
  fetchPetByIdThunk,
  fetchPetsThunk,
  setSelectedPet,
  updatePetThunk,
} from '../../redux/slices/pet.slice';
import { fetchAppointmentsThunk } from '../../redux/slices/appointment.slice';
import catalogService from '../../services/catalog.service';
import type { CatalogService } from '../../types/catalog.type';
import type { Appointment } from '../../types/appointment.type';
import type { Pet, UpdatePetPayload } from '../../types/pet.type';
import {
  formatAppointmentRange,
  getStatusColor,
  normalizeAppointmentStatus,
} from '../calendar/CalenderUtils';

type EditForm = {
  name: string;
  sex: 'male' | 'female';
  species: string;
  breed: string;
  birth_date: string;
  weight: string;
  notes: string;
  avatar: string;
};

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

function createEditForm(pet: Pet): EditForm {
  return {
    name: pet.name ?? '',
    sex: pet.sex ?? 'male',
    species: pet.species ?? '',
    breed: pet.breed ?? '',
    birth_date: pet.birth_date ? pet.birth_date.split('T')[0] : '',
    weight: pet.weight === null || pet.weight === undefined ? '' : String(pet.weight),
    notes: pet.notes ?? '',
    avatar: pet.avatar ?? '',
  };
}

function getServiceName(services: CatalogService[], serviceId: number) {
  return services.find((service) => service.service_id === serviceId)?.name ?? `Service #${serviceId}`;
}

function getAppointmentSortTime(appointment: Appointment) {
  const date = new Date(`${appointment.appointment_date?.split('T')[0] ?? ''}T${appointment.start_time ?? ''}`);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

export default function PetDetail() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const routePet = route.params?.pet as Pet | undefined;
  const [activeTab, setActiveTab] = useState<TabState>('Information');
  const [services, setServices] = useState<CatalogService[]>([]);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>(() => createEditForm(routePet ?? emptyPet));

  const {
    selectedPet,
    detailLoading,
    detailError,
    deleting,
    updating,
    updateError,
    deleteError,
  } = useSelector((state: RootState) => state.pet);
  const {
    appointments,
    loading: appointmentsLoading,
    error: appointmentsError,
  } = useSelector((state: RootState) => state.appointment);

  const pet = useMemo<Pet>(() => {
    if (selectedPet && selectedPet.pet_id === routePet?.pet_id) {
      return selectedPet;
    }

    return routePet ?? selectedPet ?? emptyPet;
  }, [routePet, selectedPet]);

  const loadServices = useCallback(async () => {
    try {
      setServiceError(null);
      const result = await catalogService.getServices();
      setServices(result);
    } catch (err: any) {
      setServiceError(err.response?.data?.message || 'Get services failed');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (routePet) {
        dispatch(setSelectedPet(routePet));
        dispatch(fetchPetByIdThunk(routePet.pet_id));
      }

      dispatch(fetchAppointmentsThunk());
      loadServices();
    }, [dispatch, loadServices, routePet])
  );

  useEffect(() => {
    if (!editVisible) {
      setEditForm(createEditForm(pet));
    }
  }, [editVisible, pet]);

  const petAppointments = useMemo(
    () =>
      appointments
        .filter((appointment) => appointment.pet_id === pet.pet_id)
        .sort((left, right) => getAppointmentSortTime(right) - getAppointmentSortTime(left)),
    [appointments, pet.pet_id]
  );

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

  const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo library access to choose a pet avatar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.35,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const avatar = asset.base64
        ? `data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}`
        : asset.uri;

      setEditForm((current) => ({ ...current, avatar }));
    }
  };

  const applyEdit = async () => {
    const trimmedName = editForm.name.trim();
    if (!trimmedName) {
      Alert.alert('Missing name', 'Please enter a pet name.');
      return;
    }

    const parsedWeight = editForm.weight.trim() ? Number(editForm.weight) : undefined;
    if (parsedWeight !== undefined && Number.isNaN(parsedWeight)) {
      Alert.alert('Invalid weight', 'Weight must be a number.');
      return;
    }

    const payload: UpdatePetPayload = {
      name: trimmedName,
      sex: editForm.sex,
      notes: editForm.notes.trim(),
    };

    const species = editForm.species.trim();
    const breed = editForm.breed.trim();
    const birthDate = editForm.birth_date.trim();

    if (species) payload.species = species;
    if (breed) payload.breed = breed;
    if (birthDate) payload.birth_date = birthDate;
    if (editForm.avatar) payload.avatar = editForm.avatar;
    if (parsedWeight !== undefined) {
      payload.weight = parsedWeight;
    }

    try {
      await dispatch(updatePetThunk({ petId: pet.pet_id, payload })).unwrap();
      await dispatch(fetchPetsThunk()).unwrap();
      setEditVisible(false);
    } catch (error) {
      const message = typeof error === 'string' ? error : 'Update pet failed';
      Alert.alert('Update pet failed', message);
    }
  };

  const cancelEdit = () => {
    setEditForm(createEditForm(pet));
    setEditVisible(false);
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

        {(detailError || updateError || deleteError || appointmentsError || serviceError) && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              {detailError || updateError || deleteError || appointmentsError || serviceError}
            </Text>
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
          {(['Information', 'Appointment'] as TabState[]).map((tab) => {
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

        {activeTab === 'Appointment' && (
          <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            {appointmentsLoading && petAppointments.length === 0 ? (
              <View style={styles.emptyPanel}>
                <ActivityIndicator size="small" color="#465F4D" />
                <Text style={styles.emptyTitle}>Loading appointments</Text>
              </View>
            ) : petAppointments.length === 0 ? (
              <View style={styles.emptyPanel}>
                <Ionicons name="calendar-outline" size={30} color="#8CA694" />
                <Text style={styles.emptyTitle}>No appointment history</Text>
                <Text style={styles.emptyText}>Appointments for this pet will appear here.</Text>
              </View>
            ) : (
              petAppointments.map((appointment) => {
                const serviceName = getServiceName(services, appointment.service_id);
                return (
                  <TouchableOpacity
                    key={appointment.appointment_id}
                    style={styles.appointmentCard}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('AppointmentDetail', {
                      appointment,
                      pet,
                      serviceName,
                      source: 'pet-detail',
                    })}
                  >
                    <View style={styles.appointmentHeader}>
                      <View style={styles.appointmentIcon}>
                        <Ionicons name="calendar-outline" size={20} color="#835300" />
                      </View>
                      <View style={styles.appointmentCopy}>
                        <Text style={styles.appointmentTitle}>{serviceName}</Text>
                        <Text style={styles.appointmentTime}>
                          {formatAppointmentRange(
                            appointment.appointment_date,
                            appointment.start_time,
                            appointment.end_time
                          )}
                        </Text>
                      </View>
                      <View style={[styles.appointmentStatus, { backgroundColor: getStatusColor(appointment.status) }]}>
                        <Text style={styles.appointmentStatusText}>{normalizeAppointmentStatus(appointment.status)}</Text>
                      </View>
                    </View>
                    {!!appointment.note && <Text style={styles.appointmentNote}>{appointment.note}</Text>}
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        )}

        <View style={styles.footerActions}>
          <TouchableOpacity style={styles.editButton} activeOpacity={0.85} onPress={() => setEditVisible(true)}>
            <Ionicons name="create-outline" size={19} color="#465F4D" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bookButton}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('AddAppointment', { pet })}
          >
            <Ionicons name="calendar-outline" size={19} color="#FFFFFF" />
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal transparent visible={editVisible} animationType="fade" onRequestClose={cancelEdit}>
        <View style={styles.modalOverlay}>
          <View style={styles.editModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit pet</Text>
              <TouchableOpacity onPress={cancelEdit} hitSlop={10}>
                <Ionicons name="close" size={22} color="#465F4D" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity style={styles.avatarPicker} activeOpacity={0.85} onPress={pickAvatar}>
                {editForm.avatar ? (
                  <Image source={{ uri: editForm.avatar }} style={styles.editAvatarPreview} />
                ) : (
                  <View style={styles.editAvatarPlaceholder}>
                    <Ionicons name="paw-outline" size={34} color="#8CA694" />
                  </View>
                )}
                <View style={styles.avatarEditBadge}>
                  <Ionicons name="camera-outline" size={18} color="#FFFFFF" />
                </View>
              </TouchableOpacity>

              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={editForm.name}
                onChangeText={(name) => setEditForm((current) => ({ ...current, name }))}
                placeholder="Pet name"
                placeholderTextColor="#9A8C73"
              />

              <Text style={styles.inputLabel}>Sex</Text>
              <View style={styles.sexToggle}>
                {(['male', 'female'] as const).map((sex) => {
                  const isActive = editForm.sex === sex;
                  return (
                    <TouchableOpacity
                      key={sex}
                      style={[styles.sexToggleButton, isActive && styles.sexToggleButtonActive]}
                      onPress={() => setEditForm((current) => ({ ...current, sex }))}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.sexToggleText, isActive && styles.sexToggleTextActive]}>{sex}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.inputLabel}>Species</Text>
              <TextInput
                style={styles.input}
                value={editForm.species}
                onChangeText={(species) => setEditForm((current) => ({ ...current, species }))}
                placeholder="Dog, cat..."
                placeholderTextColor="#9A8C73"
              />

              <Text style={styles.inputLabel}>Breed</Text>
              <TextInput
                style={styles.input}
                value={editForm.breed}
                onChangeText={(breed) => setEditForm((current) => ({ ...current, breed }))}
                placeholder="Breed"
                placeholderTextColor="#9A8C73"
              />

              <Text style={styles.inputLabel}>Birth date</Text>
              <TextInput
                style={styles.input}
                value={editForm.birth_date}
                onChangeText={(birth_date) => setEditForm((current) => ({ ...current, birth_date }))}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9A8C73"
              />

              <Text style={styles.inputLabel}>Weight</Text>
              <TextInput
                style={styles.input}
                value={editForm.weight}
                onChangeText={(weight) => setEditForm((current) => ({ ...current, weight }))}
                keyboardType="decimal-pad"
                placeholder="Weight in kg"
                placeholderTextColor="#9A8C73"
              />

              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput
                style={[styles.input, styles.notesInput]}
                value={editForm.notes}
                onChangeText={(notes) => setEditForm((current) => ({ ...current, notes }))}
                placeholder="Medical notes"
                placeholderTextColor="#9A8C73"
                multiline
                textAlignVertical="top"
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} activeOpacity={0.85} onPress={cancelEdit} disabled={updating}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} activeOpacity={0.9} onPress={applyEdit} disabled={updating}>
                {updating ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.applyButtonText}>Apply</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
