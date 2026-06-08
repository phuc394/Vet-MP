import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from './ConfirmAppointmentStyle';
import { AppDispatch, RootState } from '../../../redux/store';
import { createAppointmentThunk, fetchAppointmentsThunk } from '../../../redux/slices/appointment.slice';
import type { CatalogService } from '../../../types/catalog.type';
import type { Pet } from '../../../types/pet.type';
import { formatAppointmentDatetime } from '../AppointmentUtils';
import { showPlatformAlert } from '../../../utils/platformAlert';

type ConfirmParams = {
  pet?: Pet;
  service?: CatalogService;
  appointmentDate?: string;
  startTime?: string;
  endTime?: string;
  time?: string;
  note?: string;
};

export default function ConfirmAppointment() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const appointment = (route.params ?? {}) as ConfirmParams;
  const pet = appointment.pet;
  const service = appointment.service;
  const { creating, createError } = useSelector((state: RootState) => state.appointment);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleCreate = async () => {
    setLocalError(null);

    if (!pet || !service || !appointment.appointmentDate || !appointment.startTime || !appointment.endTime) {
      setLocalError('Appointment information is incomplete');
      return;
    }

    try {
      await dispatch(
        createAppointmentThunk({
          pet_id: pet.pet_id,
          service_id: service.service_id,
          appointment_date: appointment.appointmentDate,
          start_time: appointment.startTime,
          end_time: appointment.endTime,
          service_price: Number(service.price),
          note: appointment.note?.trim() || undefined,
        })
      ).unwrap();
      dispatch(fetchAppointmentsThunk());

      showPlatformAlert('Appointment created', 'Your appointment has been booked successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('MainTabs', { screen: 'Calendar' }),
        },
      ]);
    } catch (err) {
      const message = typeof err === 'string' ? err : 'Create appointment failed';
      setLocalError(message);
      showPlatformAlert('Create appointment failed', message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={10}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#465F4D" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirm Appointment</Text>
        </View>

        <Text style={styles.pageSubtitle}>Confirm the appointment information before booking.</Text>

        {(localError || createError) && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{localError || createError}</Text>
          </View>
        )}

        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Appointment</Text>

          <View style={styles.petInfoRow}>
            {pet?.avatar ? (
              <Image source={{ uri: pet.avatar }} style={styles.petAvatar} />
            ) : (
              <View style={styles.petAvatarPlaceholder}>
                <MaterialCommunityIcons name="paw" size={22} color="#835300" />
              </View>
            )}

            <View style={styles.petTextBlock}>
              <Text style={styles.petName}>{pet?.name ?? 'Pet name'}</Text>
              <Text style={styles.petMeta}>{[pet?.species, pet?.breed].filter(Boolean).join(' / ') || 'Pet details'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={22} color="#835300" />
            <Text style={styles.infoText}>{service?.name ?? 'Service'}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="cash" size={22} color="#835300" />
            <Text style={styles.infoText}>{service ? `${Number(service.price).toFixed(0)}` : 'Price'}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar-month-outline" size={22} color="#835300" />
            <Text style={styles.infoText}>
              {formatAppointmentDatetime(
                appointment.appointmentDate,
                appointment.startTime,
                appointment.endTime
              ) || 'Appointment time'}
            </Text>
          </View>

          <View style={styles.noteBox}>
            <Text style={styles.noteLabel}>Note</Text>
            <Text style={styles.noteText}>{appointment.note?.trim() ? appointment.note : 'No note provided'}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.backActionButton} activeOpacity={0.9} onPress={() => navigation.goBack()}>
            <Text style={styles.backActionText}>Go back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.confirmActionButton, creating && styles.disabledButton]}
            activeOpacity={0.9}
            onPress={handleCreate}
            disabled={creating}
          >
            {creating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.confirmActionText}>Make appointment</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

