import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from './AddAppointmentStyle';
import { AppDispatch, RootState } from '../../../redux/store';
import { fetchPetsThunk } from '../../../redux/slices/pet.slice';
import catalogService from '../../../services/catalog.service';
import type { CatalogService } from '../../../types/catalog.type';
import type { Pet } from '../../../types/pet.type';
import { toAppointmentDateTime } from '../AppointmentUtils';

const timeSlots = ['08:30', '09:30', '10:30', '13:30', '15:00'];

function getDefaultDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

function addMinutes(dateTime: string, minutes: number) {
  const date = new Date(dateTime);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

export default function AddAppointment() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const { pets, loading: petsLoading, error: petsError } = useSelector((state: RootState) => state.pet);
  const [selectedPetId, setSelectedPetId] = useState<number>(0);
  const [petModalVisible, setPetModalVisible] = useState(false);
  const [services, setServices] = useState<CatalogService[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number>(0);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(getDefaultDate());
  const [selectedTime, setSelectedTime] = useState(timeSlots[1]);
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
    if (!selectedPetId && pets.length > 0) {
      setSelectedPetId(pets[0].pet_id);
    }
  }, [pets, selectedPetId]);

  useEffect(() => {
    if (!selectedServiceId && services.length > 0) {
      setSelectedServiceId(services[0].service_id);
    }
  }, [selectedServiceId, services]);

  const selectedPet = useMemo<Pet | undefined>(
    () => pets.find((pet) => pet.pet_id === selectedPetId) ?? pets[0],
    [pets, selectedPetId]
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

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(appointmentDate.trim())) {
      setLocalError('Appointment date must be YYYY-MM-DD');
      return;
    }

    const startTime = toAppointmentDateTime(appointmentDate.trim(), selectedTime);
    const startDate = new Date(startTime);
    if (Number.isNaN(startDate.getTime())) {
      setLocalError('Appointment date or time is invalid');
      return;
    }

    if (startDate <= new Date()) {
      setLocalError('Appointment must be in the future');
      return;
    }

    navigation.navigate('ConfirmAppointment', {
      pet: selectedPet,
      service: selectedService,
      appointmentDate: appointmentDate.trim(),
      startTime,
      endTime: addMinutes(startTime, 60),
      time: selectedTime,
      note,
    });
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
              <View style={styles.dateInput}>
                <MaterialCommunityIcons name="calendar-month" size={20} color="#835300" />
                <TextInput
                  style={styles.dateTextInput}
                  value={appointmentDate}
                  onChangeText={setAppointmentDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9A8C73"
                />
              </View>
              <View style={styles.timeGrid}>
                {timeSlots.map((time) => {
                  const isActive = selectedTime === time;
                  return (
                    <TouchableOpacity
                      key={time}
                      style={[styles.timeChip, isActive && styles.timeChipActive]}
                      onPress={() => setSelectedTime(time)}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.timeText, isActive && styles.timeTextActive]}>{time}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
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
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

