import React, { useState } from 'react';
import {
  Modal,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MOCK_PETS } from '../../home/HomeUtils';
import { styles } from './AddAppointmentStyle';

const services = ['Vaccination', 'Check-up', 'Dental Cleaning'];
const timeSlots = ['08:30', '09:30', '10:30', '13:30', '15:00'];

export default function AddAppointment() {
  const navigation = useNavigation<any>();
  const [selectedPetId, setSelectedPetId] = useState<number>(MOCK_PETS[0]?.pet_id ?? 0);
  const [petModalVisible, setPetModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(services[0]);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(timeSlots[1]);
  const [note, setNote] = useState('');

  const selectedPet = MOCK_PETS.find((pet) => pet.pet_id === selectedPetId) ?? MOCK_PETS[0];

  const handleNext = () => {
    navigation.navigate('ConfirmAppointment', {
      pet: selectedPet,
      service: selectedService,
      date: 'Choose appointment date',
      time: selectedTime,
      note,
    });
  };

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
            <Text style={styles.heroDescription}>Choose a pet, service and time. The page title is shown here so you always know where you are.</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>1. Select your pet</Text>
          <TouchableOpacity style={styles.servicePicker} onPress={() => setPetModalVisible(true)} activeOpacity={0.85}>
            <View style={styles.servicePickerLeft}>
              <Text style={styles.servicePickerLabel}>Select your pet</Text>
              <Text style={styles.servicePickerValue}>{selectedPet?.name ?? 'Choose a pet'}</Text>
            </View>
            <Image source={{ uri: selectedPet?.avatar ?? 'https://via.placeholder.com/80' }} style={styles.petPickerAvatar} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. Service</Text>
          <TouchableOpacity style={styles.servicePicker} onPress={() => setServiceModalVisible(true)} activeOpacity={0.85}>
            <View style={styles.servicePickerLeft}>
              <Text style={styles.servicePickerLabel}>Other services</Text>
              <Text style={styles.servicePickerValue}>{selectedService}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-down" size={24} color="#835300" />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>3. Picking date and time</Text>
          <View style={styles.dateInput}>
            <MaterialCommunityIcons name="calendar-month" size={20} color="#835300" />
            <Text style={styles.dateText}>Choose appointment date</Text>
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
              const isActive = selectedService === service;
              return (
                <TouchableOpacity
                  key={service}
                  style={[styles.modalServiceItem, isActive && styles.modalServiceItemActive]}
                  onPress={() => {
                    setSelectedService(service);
                    setServiceModalVisible(false);
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.modalServiceText, isActive && styles.modalServiceTextActive]}>{service}</Text>
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

            {MOCK_PETS.map((pet) => {
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
                  <Image source={{ uri: pet.avatar ?? 'https://via.placeholder.com/80' }} style={styles.modalPetAvatar} />
                  <View style={styles.modalPetTextWrap}>
                    <Text style={styles.modalPetName}>{pet.name}</Text>
                    <Text style={styles.modalPetMeta}>{[pet.species, pet.breed].filter(Boolean).join(' • ') || 'Unknown'}</Text>
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