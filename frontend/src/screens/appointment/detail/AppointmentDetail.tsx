import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './AppointmentDetailStyle';
import { MOCK_PETS } from '../../home/HomeUtils';
import { formatDateTime } from '../../calendar/CalenderUtils';
import { formatAppointmentId, getAppointmentStatusBackground, formatAppointmentDatetime } from '../AppointmentUtils';

export default function AppointmentDetail() {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const appointment = route.params?.appointment;
  const [noteVisible, setNoteVisible] = useState(false);
  const source = route.params?.source;
  const pet = MOCK_PETS[appointment.petIndex];

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#465F4D" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Appointment detail</Text>
        </View>

        <View style={styles.topCard}>
          <View style={styles.topHeaderRow}>
            <View style={styles.topIconCircle}>
              <MaterialCommunityIcons name="calendar" size={20} color="#835300" />
            </View>
            <View style={styles.topIdStatus}>
              <Text style={styles.smallLabel}>id: {formatAppointmentId(appointment.id)}</Text>
              <View style={styles.statusRow}>
                <Text style={styles.smallLabel}>status:</Text>
                <View style={[styles.statusBadge, { backgroundColor: getAppointmentStatusBackground(appointment.status), marginLeft: 8 }]}> 
                  <Text style={styles.statusText}>{appointment.status}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.topDivider} />

          <View style={styles.topRow}>
            <Image source={{ uri: pet.avatar }} style={styles.petAvatarPlaceholder} />
            <View style={styles.topInfo}>
              <Text style={styles.petNameLarge}>{pet.name}</Text>
              <Text style={styles.petMeta}>{pet.species ?? 'species'}   breed   {pet.weight ? pet.weight + 'kg' : 'weight'}</Text>
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
            <Text style={styles.rowValue}>{formatAppointmentDatetime(appointment.datetime)}</Text>
          </View>

          <View style={styles.rowItem}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons name="clipboard-list" size={20} color="#835300" />
              </View>
              <Text style={styles.rowLabel}>Service</Text>
            </View>
            <Text style={styles.rowValue}>{appointment.service}</Text>
          </View>

          <View style={styles.rowItem}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons name="stethoscope" size={20} color="#835300" />
              </View>
              <Text style={styles.rowLabel}>Doctor</Text>
            </View>
            <Text style={styles.rowValue}>{appointment.doctor}</Text>
          </View>

          <TouchableOpacity style={styles.rowItem} activeOpacity={0.8} onPress={() => setNoteVisible(true)}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons name="note-outline" size={20} color="#835300" />
              </View>
              <Text style={styles.rowLabel}>Note</Text>
            </View>
            <View style={styles.notePreviewWrapper}>
              <Text style={styles.rowValueNote} numberOfLines={2} ellipsizeMode="tail">{appointment.note ?? 'No additional notes available for this appointment. Customer Note max show 2 lines.'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {appointment.status === 'Pending' && source !== 'history' && (
          <View style={styles.actionRow}>
            <View style={styles.cancelCard}>
              <View style={styles.cancelInfo}>
                <Text style={styles.cancelTitle}>Cancel Appointment</Text>
                <Text style={styles.cancelNote}>appointment can only be cancelled before the schedule 24h</Text>
              </View>
              <TouchableOpacity style={styles.cancelPrimaryButton} activeOpacity={0.8}>
                <Text style={styles.cancelPrimaryText}>Cancel</Text>
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

      <Modal visible={noteVisible} transparent animationType="fade" onRequestClose={() => setNoteVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Note</Text>
            <Text style={styles.modalText}>{appointment.note ?? 'No additional notes available for this appointment.'}</Text>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setNoteVisible(false)} activeOpacity={0.8}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}