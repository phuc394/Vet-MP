import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import catalogService from '../../../services/catalog.service';
import type { CatalogService } from '../../../types/catalog.type';
import { formatServicePrice, getServiceIconName, getServiceLabel } from '../HomeUtils';
import { styles } from './ServiceDetailStyle';

export default function ServiceDetail() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const serviceId = route.params?.serviceId ?? route.params?.service?.service_id;
  const fallbackService = route.params?.service as CatalogService | undefined;
  const [service, setService] = useState<CatalogService | null>(fallbackService ?? null);
  const [loading, setLoading] = useState(Boolean(serviceId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadService = async () => {
      if (!serviceId) {
        setLoading(false);
        setError('No service data available.');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await catalogService.getServiceById(Number(serviceId));

        if (!mounted) {
          return;
        }

        if (!result) {
          setService(null);
          setError('Service not found.');
          return;
        }

        setService(result);
      } catch (err: any) {
        if (!mounted) {
          return;
        }

        setError(err.response?.data?.message || 'Get service detail failed');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadService();

    return () => {
      mounted = false;
    };
  }, [serviceId]);

  if (loading && !service) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#465F4D" />
          <Text style={styles.emptyText}>Loading service detail...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!service) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.headerTitle}>Service detail</Text>
          <Text style={styles.emptyText}>{error || 'No service data available.'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={10}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#465F4D" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service detail</Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroIconWrap}>
            <MaterialCommunityIcons name={getServiceIconName(service) as any} size={30} color="#835300" />
          </View>
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroName}>{service.name}</Text>
            <Text style={styles.heroDescription}>{getServiceLabel(service)}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Service ID</Text>
            <Text style={styles.infoValue}>{service.service_id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Price</Text>
            <Text style={styles.infoValue}>{formatServicePrice(service.price)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>{service.is_active ? 'Active' : 'Inactive'}</Text>
          </View>
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>What you get</Text>
          <Text style={styles.noteText}>
            {service.description || 'Service details will be expanded here with booking options, staff info, and notes.'}
          </Text>
        </View>

        <TouchableOpacity style={styles.bookButton} activeOpacity={0.9} onPress={() => navigation.navigate('AddAppointment')}>
          <Text style={styles.bookButtonText}>Book now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
