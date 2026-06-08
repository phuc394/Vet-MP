import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from './CalendarStyle';
import {
  formatAppointmentRange,
  getStatusColor,
  normalizeAppointmentStatus,
} from './CalenderUtils';
import { AppDispatch, RootState } from '../../redux/store';
import {
  fetchAppointmentsThunk,
  updateAppointmentThunk,
} from '../../redux/slices/appointment.slice';
import { fetchPetsThunk } from '../../redux/slices/pet.slice';
import catalogService from '../../services/catalog.service';
import type { CatalogService } from '../../types/catalog.type';
import type { Appointment } from '../../types/appointment.type';
import { showPlatformAlert } from '../../utils/platformAlert';

function getServiceName(services: CatalogService[], serviceId: number) {
  return services.find((service) => service.service_id === serviceId)?.name ?? `Service #${serviceId}`;
}

export default function Calendar() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation: any = useNavigation();
  const [tab, setTab] = useState<'upcoming' | 'history'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<CatalogService[]>([]);
  const [serviceError, setServiceError] = useState<string | null>(null);

  const { appointments, loading, error, updating } = useSelector(
    (state: RootState) => state.appointment
  );
  const { pets } = useSelector((state: RootState) => state.pet);

  const loadServices = useCallback(async () => {
    try {
      setServiceError(null);
      const result = await catalogService.getServices();
      setServices(result.filter((service) => service.is_active));
    } catch (err: any) {
      setServiceError(err.response?.data?.message || 'Get services failed');
    }
  }, []);

  const refreshData = useCallback(() => {
    dispatch(fetchAppointmentsThunk());
    dispatch(fetchPetsThunk());
    loadServices();
  }, [dispatch, loadServices]);

  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [refreshData])
  );

  useEffect(() => {
    if (pets.length === 0) {
      dispatch(fetchPetsThunk());
    }
  }, [dispatch, pets.length]);

  const filteredAppointments = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const isUpcoming = appointment.status === 'pending' || appointment.status === 'confirmed';
      const tabMatch = tab === 'upcoming' ? isUpcoming : !isUpcoming;

      if (!tabMatch) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const pet = pets.find((candidate) => candidate.pet_id === appointment.pet_id);
      const serviceName = getServiceName(services, appointment.service_id).toLowerCase();
      const petName = pet?.name?.toLowerCase() ?? '';
      const staff = appointment.staff_id ? `staff #${appointment.staff_id}` : '';
      const status = normalizeAppointmentStatus(appointment.status).toLowerCase();

      return (
        petName.includes(normalizedQuery) ||
        serviceName.includes(normalizedQuery) ||
        staff.includes(normalizedQuery) ||
        status.includes(normalizedQuery) ||
        (appointment.note?.toLowerCase() ?? '').includes(normalizedQuery) ||
        appointment.appointment_date.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [appointments, pets, searchQuery, services, tab]);

  const handleCancel = (appointment: Appointment) => {
    if (updating) return;

    showPlatformAlert('Cancel appointment', 'Do you want to cancel this appointment?', [
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
            showPlatformAlert('Cancel failed', message);
          }
        },
      },
    ]);
  };

  const renderAppointment = (appointment: Appointment) => {
    const pet = pets.find((candidate) => candidate.pet_id === appointment.pet_id);
    const serviceName = getServiceName(services, appointment.service_id);
    const statusLabel = normalizeAppointmentStatus(appointment.status);
    const cardContent = (
      <>
        <View style={styles.cardHeader}>
          <View style={styles.petRow}>
            {pet?.avatar ? (
              <Image source={{ uri: pet.avatar }} style={styles.petAvatar} />
            ) : (
              <View style={styles.petAvatarPlaceholder}>
                <MaterialCommunityIcons name="paw" size={20} color="#835300" />
              </View>
            )}
            <View style={styles.petCopy}>
              <Text style={styles.petName}>{pet?.name ?? `Pet #${appointment.pet_id}`}</Text>
              <Text style={styles.petService}>{serviceName}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
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
              <Text style={styles.infoLabel}>DATE & TIME</Text>
              <Text style={styles.infoValue}>
                {formatAppointmentRange(
                  appointment.appointment_date,
                  appointment.start_time,
                  appointment.end_time
                )}
              </Text>
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
              <Text style={styles.infoLabel}>STAFF</Text>
              <Text style={styles.infoValue}>{appointment.staff_id ? `#${appointment.staff_id}` : 'Unassigned'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.divider} />

        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={styles.viewButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AppointmentDetail', { appointment, pet, serviceName, source: tab })}
          >
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>

          {tab === 'upcoming' && (
            <TouchableOpacity
              style={[styles.cancelButton, updating && styles.disabledButton]}
              activeOpacity={0.8}
              disabled={updating}
              onPress={() => handleCancel(appointment)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </>
    );

    return (
      <View key={appointment.appointment_id} style={styles.appointmentCard}>
        {cardContent}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading && appointments.length > 0}
            onRefresh={refreshData}
            tintColor="#465F4D"
            colors={['#465F4D']}
          />
        }
      >
        <Text style={styles.headerTitle}>My Appointments</Text>
        <Text style={styles.headerSubtitle}>Keep track of your pets' wellness journey.</Text>

        <View style={styles.tabWrapper}>
          <View style={styles.tabInner}>
            <TouchableOpacity
              onPress={() => setTab('upcoming')}
              style={[styles.tabPill, tab === 'upcoming' ? styles.tabPillActive : styles.tabPillInactive]}
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

        {(error || serviceError) && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error || serviceError}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refreshData} activeOpacity={0.85}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.appointmentListFrame}>
          {loading && appointments.length === 0 ? (
            <View style={styles.centerState}>
              <ActivityIndicator size="large" color="#465F4D" />
            </View>
          ) : filteredAppointments.length === 0 ? (
            <View style={styles.centerState}>
              <Text style={styles.emptyTitle}>No appointments found</Text>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Try another search keyword.' : 'Your appointments will appear here.'}
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.appointmentListScroll}
              contentContainerStyle={styles.appointmentListContent}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {filteredAppointments.map(renderAppointment)}
            </ScrollView>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => navigation.navigate('AddAppointment')}>
        <MaterialCommunityIcons name="calendar-plus" size={26} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
