import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './ConfirmAppointmentStyle';

export default function ConfirmAppointment() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const appointment = route.params ?? {};
  const pet = appointment.pet;

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
              <Text style={styles.petMeta}>{[pet?.species, pet?.breed].filter(Boolean).join(' • ') || 'Pet details'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={22} color="#835300" />
            <Text style={styles.infoText}>{appointment.service ?? 'Service'}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar-month-outline" size={22} color="#835300" />
            <Text style={styles.infoText}>{appointment.date ?? 'Choose appointment date'} {appointment.time ? `• ${appointment.time}` : ''}</Text>
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

          <TouchableOpacity style={styles.confirmActionButton} activeOpacity={0.9} onPress={() => navigation.navigate('Calendar')}>
            <Text style={styles.confirmActionText}>Make appointment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}