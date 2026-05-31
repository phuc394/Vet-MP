import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { styles } from './CalendarStyle';
import { formatDateTime, getStatusColor } from './CalenderUtils';
import { MOCK_PETS } from '../home/HomeUtils';

type Appointment = {
  id: number;
  petIndex: number;
  service: string;
  datetime: string;
  doctor: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
};

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 1, petIndex: 0, service: 'Vaccination', datetime: '2026-06-01T09:30:00Z', doctor: 'Dr. Linh', status: 'Pending' },
  { id: 2, petIndex: 1, service: 'Check-up', datetime: '2026-05-20T14:00:00Z', doctor: 'Dr. Nam', status: 'Completed' },
  { id: 3, petIndex: 0, service: 'Dental Cleaning', datetime: '2026-06-05T10:00:00Z', doctor: 'Dr. Huy', status: 'Pending' },
  { id: 4, petIndex: 1, service: 'Skin Treatment', datetime: '2026-05-12T15:30:00Z', doctor: 'Dr. Thao', status: 'Completed' },
  { id: 5, petIndex: 0, service: 'General Check-up', datetime: '2026-05-08T08:45:00Z', doctor: 'Dr. Minh', status: 'Cancelled' },
  { id: 6, petIndex: 1, service: 'Vaccination Booster', datetime: '2026-06-12T11:15:00Z', doctor: 'Dr. Linh', status: 'Pending' },
  { id: 7, petIndex: 0, service: 'Ultrasound', datetime: '2026-05-02T13:00:00Z', doctor: 'Dr. Nam', status: 'Completed' },
  { id: 8, petIndex: 1, service: 'Ear Cleaning', datetime: '2026-06-18T09:00:00Z', doctor: 'Dr. Huy', status: 'Pending' },
];

export default function Calendar() {
  const navigation: any = useNavigation();
  const [tab, setTab] = useState<'upcoming' | 'history'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const appointments = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return MOCK_APPOINTMENTS.filter((a) => {
      const tabMatch = tab === 'upcoming' ? a.status === 'Pending' : a.status !== 'Pending';

      if (!tabMatch) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const petName = MOCK_PETS[a.petIndex]?.name?.toLowerCase() ?? '';
      const service = a.service.toLowerCase();
      const doctor = a.doctor.toLowerCase();
      const datetime = a.datetime.toLowerCase();

      return (
        petName.includes(normalizedQuery) ||
        service.includes(normalizedQuery) ||
        doctor.includes(normalizedQuery) ||
        datetime.includes(normalizedQuery)
      );
    });
  }, [searchQuery, tab]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>My Appointments</Text>
        <Text style={styles.headerSubtitle}>keep track on your pets wellness journey.</Text>

        <View style={styles.tabWrapper}>
          <View style={styles.tabInner}>
            <TouchableOpacity
              onPress={() => setTab('upcoming')}
              style={[styles.tabPill, styles.tabPillWide, styles.tabPillSpacing, tab === 'upcoming' ? styles.tabPillActive : styles.tabPillInactive]}
            >
              <Text style={[styles.tabPillText, tab === 'upcoming' ? styles.tabPillActiveText : styles.tabPillInactiveText]}>UPCOMING</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setTab('history')}
              style={[styles.tabPill, tab === 'history' ? styles.tabPillActive : styles.tabPillInactive]}
            >
              <Text style={[styles.tabPillText, tab === 'history' ? styles.tabPillActiveText : styles.tabPillInactiveText]}>History</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchBarWrap}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#9A8C7A" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search appointment"
              placeholderTextColor="#9A8C7A"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {!!searchQuery && (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={10}>
                <Ionicons name="close-circle" size={20} color="#9A8C7A" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.appointmentListFrame}>
          <ScrollView
            style={styles.appointmentListScroll}
            contentContainerStyle={styles.appointmentListContent}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {appointments.map((a) => {
              const pet = MOCK_PETS[a.petIndex];
              const cardContent = (
                <>
                  <View style={styles.cardHeader}>
                    <View style={styles.petRow}>
                      <Image source={{ uri: pet.avatar }} style={styles.petAvatar} />
                      <View>
                        <Text style={styles.petName}>{pet.name}</Text>
                        <Text style={styles.petService}>{a.service}</Text>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(a.status) }]}> 
                      <Text style={styles.statusText}>{a.status}</Text>
                    </View>
                  </View>

                  <View style={styles.cardBodyRow}>
                    <View style={styles.infoCell}>
                      <View style={styles.iconArea}>
                        <View style={styles.iconCircle}>
                          <MaterialCommunityIcons name="calendar-clock" size={22} color="#835300" />
                        </View>
                      </View>
                      <View style={styles.innerDivider} />
                      <View style={styles.infoCellContent}>
                        <Text style={styles.infoLabel}>DATE&TIME</Text>
                        <Text style={styles.infoValue}>{formatDateTime(a.datetime)}</Text>
                      </View>
                    </View>

                    <View style={[styles.infoCell, styles.infoCellRight]}>
                      <View style={styles.iconArea}>
                        <View style={styles.iconCircle}>
                          <Ionicons name="person-circle" size={22} color="#835300" />
                        </View>
                      </View>
                      <View style={styles.innerDivider} />
                      <View style={styles.infoCellContent}>
                        <Text style={styles.infoLabel}>DOCTOR</Text>
                        <Text style={styles.infoValue}>{a.doctor}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.divider} />

                  {tab === 'upcoming' && (
                    <View style={styles.cardFooter}>
                      <TouchableOpacity style={styles.viewButton} activeOpacity={0.8} onPress={() => navigation.navigate('AppointmentDetail', { appointment: a, source: 'upcoming' })}>
                        <Text style={styles.viewButtonText}>View Details</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.cancelButton} activeOpacity={0.8}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              );

              if (tab === 'history') {
                return (
                  <TouchableOpacity key={a.id} style={styles.appointmentCard} activeOpacity={0.9} onPress={() => navigation.navigate('AppointmentDetail', { appointment: a, source: 'history' })}>
                    {cardContent}
                  </TouchableOpacity>
                );
              }

              return (
                <View key={a.id} style={styles.appointmentCard}>
                  {cardContent}
                </View>
              );
            })}
          </ScrollView>
        </View>

      </ScrollView>

      <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => navigation.navigate('AddAppointment')}>
        <MaterialCommunityIcons name="calendar-plus" size={26} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
