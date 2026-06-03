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
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from './AddAppointmentStyle';
import { AppDispatch, RootState } from '../../../redux/store';
import { fetchPetsThunk } from '../../../redux/slices/pet.slice';
import catalogService from '../../../services/catalog.service';
import type { CatalogService } from '../../../types/catalog.type';
import type { Pet } from '../../../types/pet.type';

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function getDefaultAppointmentDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 30, 0, 0);
  return tomorrow;
}

function addMinutes(date: Date, minutes: number) {
  const nextDate = new Date(date);
  nextDate.setMinutes(nextDate.getMinutes() + minutes);
  return nextDate;
}

function toApiDate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toApiTime(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}

function toDisplayDateTime(date: Date) {
  return date.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function parseDateTime(dateValue: string, timeValue: string): Date | null {
  const dateMatch = dateValue.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const timeMatch = timeValue.trim().match(/^(\d{1,2}):(\d{2})$/);

  if (!dateMatch || !timeMatch) {
    return null;
  }

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);

  const parsed = new Date(year, month - 1, day, hour, minute, 0, 0);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day ||
    parsed.getHours() !== hour ||
    parsed.getMinutes() !== minute
  ) {
    return null;
  }

  return parsed;
}

export default function AddAppointment() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const routePet = route.params?.pet as Pet | undefined;
  const { pets, loading: petsLoading, error: petsError } = useSelector((state: RootState) => state.pet);
  const [selectedPetId, setSelectedPetId] = useState<number>(0);
  const [petModalVisible, setPetModalVisible] = useState(false);
  const [services, setServices] = useState<CatalogService[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number>(0);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [appointmentDateTime, setAppointmentDateTime] = useState(getDefaultAppointmentDate());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [draftDate, setDraftDate] = useState(toApiDate(appointmentDateTime));
  const [draftTime, setDraftTime] = useState(toApiTime(appointmentDateTime).slice(0, 5));
  const [note, setNote] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const loadServices = useCallback(async () => {
    try {
      setServicesLoading(true);
      setServiceError(null);
      const result = await catalogService.getServices();
      setServices(result.filter((service) => service.is_active));
    } catch (err: any) {
      setServiceError(err.response?.data?.message || 'Get services failed');
    } finally {
      setServicesLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchPetsThunk());
      loadServices();
    }, [dispatch, loadServices])
  );

  useEffect(() => {
    if (routePet?.pet_id && selectedPetId !== routePet.pet_id) {
      setSelectedPetId(routePet.pet_id);
      return;
    }

    if (!selectedPetId && pets.length > 0) {
      setSelectedPetId(pets[0].pet_id);
    }
  }, [pets, routePet, selectedPetId]);

  useEffect(() => {
    if (!selectedServiceId && services.length > 0) {
      setSelectedServiceId(services[0].service_id);
    }
  }, [selectedServiceId, services]);

  const selectedPet = useMemo<Pet | undefined>(
    () => pets.find((pet) => pet.pet_id === selectedPetId) ?? routePet ?? pets[0],
    [pets, routePet, selectedPetId]
  );

  const selectedService = useMemo<CatalogService | undefined>(
    () => services.find((service) => service.service_id === selectedServiceId) ?? services[0],
    [selectedServiceId, services]
  );

  const handleNext = () => {
    setLocalError(null);

    if (!selectedPet) {
      setLocalError('Please select a pet');
      return;
    }

    if (!selectedService) {
      setLocalError('Please select a service');
      return;
    }

    if (Number.isNaN(appointmentDateTime.getTime())) {
      setLocalError('Appointment date or time is invalid');
      return;
    }

    if (appointmentDateTime <= new Date()) {
      setLocalError('Appointment must be in the future');
      return;
    }

    const endDateTime = addMinutes(appointmentDateTime, 60);

    navigation.navigate('ConfirmAppointment', {
      pet: selectedPet,
      service: selectedService,
      appointmentDate: toApiDate(appointmentDateTime),
      startTime: toApiTime(appointmentDateTime),
      endTime: toApiTime(endDateTime),
      time: toApiTime(appointmentDateTime).slice(0, 5),
      note,
    });
  };

  const openDateTimePicker = () => {
    setDraftDate(toApiDate(appointmentDateTime));
    setDraftTime(toApiTime(appointmentDateTime).slice(0, 5));
    setDatePickerVisible(true);
  };

  const confirmDateTimePicker = () => {
    const parsedDate = parseDateTime(draftDate, draftTime);

    if (!parsedDate) {
      setLocalError('Appointment date and time must be valid');
      return;
    }

    setLocalError(null);
    setAppointmentDateTime(parsedDate);
    setDatePickerVisible(false);
  };

  const isLoading = petsLoading || servicesLoading;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={10}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#465F4D" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Add Appointment</Text>
            <Text style={styles.headerSubtitle}>Book a new visit for your pet</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <MaterialCommunityIcons name="calendar-plus" size={26} color="#835300" />
          </View>
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroTitle}>Make Appointment</Text>
            <Text style={styles.heroDescription}>Choose a pet, service, date and time for the visit.</Text>
          </View>
        </View>

        {(petsError || serviceError || localError) && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{localError || petsError || serviceError}</Text>
          </View>
        )}

        {isLoading && pets.length === 0 && services.length === 0 ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#465F4D" />
          </View>
        ) : (
          <>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>1. Select your pet</Text>
              <TouchableOpacity style={styles.servicePicker} onPress={() => setPetModalVisible(true)} activeOpacity={0.85}>
                <View style={styles.servicePickerLeft}>
                  <Text style={styles.servicePickerLabel}>Select your pet</Text>
                  <Text style={styles.servicePickerValue}>{selectedPet?.name ?? 'Choose a pet'}</Text>
                </View>
                {selectedPet?.avatar ? (
                  <Image source={{ uri: selectedPet.avatar }} style={styles.petPickerAvatar} />
                ) : (
                  <View style={styles.petPickerAvatarPlaceholder}>
                    <MaterialCommunityIcons name="paw" size={18} color="#835300" />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>2. Service</Text>
              <TouchableOpacity style={styles.servicePicker} onPress={() => setServiceModalVisible(true)} activeOpacity={0.85}>
                <View style={styles.servicePickerLeft}>
                  <Text style={styles.servicePickerLabel}>Clinic service</Text>
                  <Text style={styles.servicePickerValue}>{selectedService?.name ?? 'Choose a service'}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-down" size={24} color="#835300" />
              </TouchableOpacity>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>3. Picking date and time</Text>
              <TouchableOpacity style={styles.dateInput} activeOpacity={0.85} onPress={openDateTimePicker}>
                <MaterialCommunityIcons name="calendar-month" size={20} color="#835300" />
                <View style={styles.datePickerTextWrap}>
                  <Text style={styles.datePickerLabel}>Appointment date and time</Text>
                  <Text style={styles.datePickerValue}>{toDisplayDateTime(appointmentDateTime)}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-down" size={22} color="#835300" />
              </TouchableOpacity>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Note</Text>
              <TextInput
                style={styles.noteInput}
                value={note}
                onChangeText={setNote}
                placeholder="Write appointment note here"
                placeholderTextColor="#9A8C73"
                multiline
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity style={styles.nextButton} activeOpacity={0.9} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <Modal transparent visible={serviceModalVisible} animationType="fade" onRequestClose={() => setServiceModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select service</Text>
              <TouchableOpacity onPress={() => setServiceModalVisible(false)} hitSlop={10}>
                <MaterialCommunityIcons name="close" size={22} color="#465F4D" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
              {services.map((service) => {
                const isActive = selectedServiceId === service.service_id;
                return (
                  <TouchableOpacity
                    key={service.service_id}
                    style={[styles.modalServiceItem, isActive && styles.modalServiceItemActive]}
                    onPress={() => {
                      setSelectedServiceId(service.service_id);
                      setServiceModalVisible(false);
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.modalServiceText, isActive && styles.modalServiceTextActive]}>
                      {service.name} - {Number(service.price).toFixed(0)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={petModalVisible} animationType="fade" onRequestClose={() => setPetModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select your pet</Text>
              <TouchableOpacity onPress={() => setPetModalVisible(false)} hitSlop={10}>
                <MaterialCommunityIcons name="close" size={22} color="#465F4D" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
              {pets.map((pet) => {
                const isActive = pet.pet_id === selectedPetId;
                return (
                  <TouchableOpacity
                    key={pet.pet_id}
                    style={[styles.modalPetItem, isActive && styles.modalPetItemActive]}
                    onPress={() => {
                      setSelectedPetId(pet.pet_id);
                      setPetModalVisible(false);
                    }}
                    activeOpacity={0.85}
                  >
                    {pet.avatar ? (
                      <Image source={{ uri: pet.avatar }} style={styles.modalPetAvatar} />
                    ) : (
                      <View style={styles.modalPetAvatarPlaceholder}>
                        <MaterialCommunityIcons name="paw" size={18} color="#835300" />
                      </View>
                    )}
                    <View style={styles.modalPetTextWrap}>
                      <Text style={styles.modalPetName}>{pet.name}</Text>
                      <Text style={styles.modalPetMeta}>{[pet.species, pet.breed].filter(Boolean).join(' / ') || 'Unknown'}</Text>
                    </View>
                    <View style={[styles.selectionDot, isActive && styles.selectionDotActive]} />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={datePickerVisible} animationType="fade" onRequestClose={() => setDatePickerVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pick date and time</Text>
              <TouchableOpacity onPress={() => setDatePickerVisible(false)} hitSlop={10}>
                <MaterialCommunityIcons name="close" size={22} color="#465F4D" />
              </TouchableOpacity>
            </View>

            <Text style={styles.pickerInputLabel}>Date</Text>
            <TextInput
              style={styles.pickerInput}
              value={draftDate}
              onChangeText={setDraftDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9A8C73"
            />

            <Text style={styles.pickerInputLabel}>Time</Text>
            <TextInput
              style={styles.pickerInput}
              value={draftTime}
              onChangeText={setDraftTime}
              placeholder="HH:mm"
              placeholderTextColor="#9A8C73"
              keyboardType="numbers-and-punctuation"
            />

            <View style={styles.pickerActions}>
              <TouchableOpacity style={styles.pickerCancelButton} activeOpacity={0.85} onPress={() => setDatePickerVisible(false)}>
                <Text style={styles.pickerCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.pickerApplyButton} activeOpacity={0.9} onPress={confirmDateTimePicker}>
                <Text style={styles.pickerApplyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

