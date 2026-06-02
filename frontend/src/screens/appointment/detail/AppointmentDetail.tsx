import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from './AppointmentDetailStyle';
import {
  formatAppointmentDatetime,
  formatAppointmentId,
  formatAppointmentStatus,
  getAppointmentStatusBackground,
} from '../AppointmentUtils';
import { AppDispatch, RootState } from '../../../redux/store';
import {
  fetchAppointmentByIdThunk,
  setSelectedAppointment,
  updateAppointmentThunk,
} from '../../../redux/slices/appointment.slice';
import type { Appointment } from '../../../types/appointment.type';
import type { Pet } from '../../../types/pet.type';

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

export default function AppointmentDetail() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const routeAppointment = route.params?.appointment as Appointment | undefined;
  const routePet = route.params?.pet as Pet | undefined;
  const serviceName = route.params?.serviceName as string | undefined;
  const source = route.params?.source;
  const [modalContent, setModalContent] = useState<{ title: string; text: string } | null>(null);
  const { selectedAppointment, detailLoading, detailError, updating, updateError } = useSelector(
    (state: RootState) => state.appointment
  );
  const { pets } = useSelector((state: RootState) => state.pet);

  useFocusEffect(
    useCallback(() => {
      if (routeAppointment) {
        dispatch(setSelectedAppointment(routeAppointment));
        dispatch(fetchAppointmentByIdThunk(routeAppointment.appointment_id));
      }
    }, [dispatch, routeAppointment])
  );

  const appointment = useMemo<Appointment | undefined>(() => {
    if (selectedAppointment && selectedAppointment.appointment_id === routeAppointment?.appointment_id) {
      return selectedAppointment;
    }

    return routeAppointment ?? selectedAppointment ?? undefined;
  }, [routeAppointment, selectedAppointment]);

  const pet = useMemo(
    () => routePet ?? pets.find((candidate) => candidate.pet_id === appointment?.pet_id),
    [appointment?.pet_id, pets, routePet]
  );

  const handleCancel = () => {
    if (!appointment || updating) return;

    Alert.alert('Cancel appointment', 'Do you want to cancel this appointment?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Cancel appointment',
        style: 'destructive',
        onPress: async () => {
          try {
            await dispatch(
              updateAppointmentThunk({
                appointmentId: appointment.appointment_id,
                payload: {
                  status: 'cancelled',
                  cancellation_reason: 'Cancelled by customer',
                },
              })
            ).unwrap();
          } catch (err) {
            const message = typeof err === 'string' ? err : 'Cancel appointment failed';
            Alert.alert('Cancel failed', message);
          }
        },
      },
    ]);
  };

  if (!appointment && detailLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#465F4D" />
        </View>
      </SafeAreaView>
    );
  }

  if (!appointment) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.headerTitle}>Appointment</Text>
          <Text style={styles.empty}>No appointment data</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusLabel = formatAppointmentStatus(appointment.status);
  const canCancel = (appointment.status === 'pending' || appointment.status === 'confirmed') && source !== 'history';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#465F4D" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Appointment detail</Text>
        </View>

        {(detailError || updateError) && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{detailError || updateError}</Text>
          </View>
        )}

        <View style={styles.topCard}>
          <View style={styles.topHeaderRow}>
            <View style={styles.topIconCircle}>
              <MaterialCommunityIcons name="calendar" size={20} color="#835300" />
            </View>
            <View style={styles.topIdStatus}>
              <Text style={styles.smallLabel}>id: {formatAppointmentId(appointment.appointment_id)}</Text>
              <View style={styles.statusRow}>
                <Text style={styles.smallLabel}>status:</Text>
                <View style={[styles.statusBadge, { backgroundColor: getAppointmentStatusBackground(appointment.status), marginLeft: 8 }]}>
                  <Text style={styles.statusText}>{statusLabel}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.topDivider} />

          <View style={styles.topRow}>
            {pet?.avatar ? (
              <Image source={{ uri: pet.avatar }} style={styles.petAvatarPlaceholder} />
            ) : (
              <View style={styles.petAvatarPlaceholder}>
                <MaterialCommunityIcons name="paw" size={20} color="#835300" />
              </View>
            )}
            <View style={styles.topInfo}>
              <Text style={styles.petNameLarge}>{pet?.name ?? `Pet #${appointment.pet_id}`}</Text>
              <Text style={styles.petMeta}>
                {[pet?.species, pet?.breed].filter(Boolean).join(' / ') || 'Pet details'} / {formatWeight(pet?.weight)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.rowItem}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons name="calendar-clock" size={20} color="#835300" />
              </View>
              <Text style={styles.rowLabel}>Time</Text>
            </View>
            <Text style={styles.rowValue}>
              {formatAppointmentDatetime(
                appointment.appointment_date,
                appointment.start_time,
                appointment.end_time
              )}
            </Text>
          </View>

          <View style={styles.rowItem}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons name="clipboard-list" size={20} color="#835300" />
              </View>
              <Text style={styles.rowLabel}>Service</Text>
            </View>
            <Text style={styles.rowValue}>{serviceName ?? `Service #${appointment.service_id}`}</Text>
          </View>

          <View style={styles.rowItem}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons name="stethoscope" size={20} color="#835300" />
              </View>
              <Text style={styles.rowLabel}>Staff</Text>
            </View>
            <Text style={styles.rowValue}>{appointment.staff_id ? `#${appointment.staff_id}` : 'Unassigned'}</Text>
          </View>

          <TouchableOpacity
            style={styles.rowItem}
            activeOpacity={0.8}
            onPress={() => setModalContent({
              title: 'Note',
              text: appointment.note ?? 'No appointment note.',
            })}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons name="note-outline" size={20} color="#835300" />
              </View>
              <Text style={styles.rowLabel}>Note</Text>
            </View>
            <View style={styles.notePreviewWrapper}>
              <Text style={styles.rowValueNote} numberOfLines={2} ellipsizeMode="tail">
                {appointment.note ?? 'No appointment note.'}
              </Text>
            </View>
          </TouchableOpacity>

          {appointment.cancellation_reason && (
            <TouchableOpacity
              style={styles.rowItem}
              activeOpacity={0.8}
              onPress={() => setModalContent({
                title: 'Cancellation reason',
                text: appointment.cancellation_reason ?? 'No cancellation reason.',
              })}
            >
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons name="cancel" size={20} color="#835300" />
                </View>
                <Text style={styles.rowLabel}>Cancellation</Text>
              </View>
              <View style={styles.notePreviewWrapper}>
                <Text style={styles.rowValueNote} numberOfLines={2} ellipsizeMode="tail">
                  {appointment.cancellation_reason}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {canCancel && (
          <View style={styles.actionRow}>
            <View style={styles.cancelCard}>
              <View style={styles.cancelInfo}>
                <Text style={styles.cancelTitle}>Cancel Appointment</Text>
                <Text style={styles.cancelNote}>Appointments can be cancelled before the schedule.</Text>
              </View>
              <TouchableOpacity
                style={[styles.cancelPrimaryButton, updating && styles.disabledButton]}
                activeOpacity={0.8}
                disabled={updating}
                onPress={handleCancel}
              >
                {updating ? (
                  <ActivityIndicator color="#D34D3D" />
                ) : (
                  <Text style={styles.cancelPrimaryText}>Cancel</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ marginTop: 18 }}>
          <View style={styles.rescheduleCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rescheduleTitle}>Need to reschedule?</Text>
              <Text style={styles.rescheduleText}>Call our help center for immediate changes to appointments within 24 hours.</Text>
            </View>
            <TouchableOpacity style={styles.rescheduleButton} activeOpacity={0.8}>
              <Text style={styles.rescheduleButtonText}>Call Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal visible={!!modalContent} transparent animationType="fade" onRequestClose={() => setModalContent(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalContent?.title}</Text>
            <Text style={styles.modalText}>{modalContent?.text}</Text>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalContent(null)} activeOpacity={0.8}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

