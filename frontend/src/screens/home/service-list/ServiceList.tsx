import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import catalogService from '../../../services/catalog.service';
import type { CatalogService } from '../../../types/catalog.type';
import { formatServicePrice, getServiceIconName, getServiceLabel } from '../HomeUtils';
import { styles } from './ServiceListStyle';

export default function ServiceList() {
  const navigation = useNavigation<any>();
  const [services, setServices] = useState<CatalogService[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await catalogService.getServices();
      setServices(result.filter((service) => service.is_active));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Get services failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const renderServiceCard = (service: CatalogService) => (
    <TouchableOpacity
      key={service.service_id}
      style={styles.serviceCard}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('ServiceDetail', { serviceId: service.service_id, service })}
    >
      <View style={styles.serviceIconWrap}>
        <MaterialCommunityIcons name={getServiceIconName(service) as any} size={22} color="#835300" />
      </View>
      <View style={styles.serviceCardBody}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.serviceDescription} numberOfLines={2}>{getServiceLabel(service)}</Text>
        <View style={styles.serviceMetaRow}>
          <Text style={styles.servicePrice}>{formatServicePrice(service.price)}</Text>
          <Text style={styles.serviceDuration}>Available</Text>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#7D4600" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={10}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#465F4D" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Services</Text>
        </View>

        {error && (
          <View style={styles.stateCard}>
            <Text style={styles.stateText}>{error}</Text>
          </View>
        )}

        {loading && services.length === 0 ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#465F4D" />
            <Text style={styles.stateText}>Loading services...</Text>
          </View>
        ) : services.length > 0 ? (
          <View style={styles.servicesList}>{services.map(renderServiceCard)}</View>
        ) : (
          <View style={styles.stateCard}>
            <Text style={styles.stateText}>No active services available right now.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
