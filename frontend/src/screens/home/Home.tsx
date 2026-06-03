
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchPetsThunk } from '../../redux/slices/pet.slice';
import catalogService from '../../services/catalog.service';
import api from '../../config/api';
import type { CatalogService } from '../../types/catalog.type';
import type { Pet } from '../../types/pet.type';
import { styles } from './HomeStyle';
import {
  formatServicePrice,
  getPetImageSource,
  getServiceIconName,
  getServiceLabel,
} from './HomeUtils';
import SupportCard from '../../components/SupportCard';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const pets = useSelector((state: RootState) => state.pet.pets);
  const petLoading = useSelector((state: RootState) => state.pet.loading);
  const petError = useSelector((state: RootState) => state.pet.error);
  const [services, setServices] = useState<CatalogService[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);

  const loadServices = useCallback(async () => {
    try {
      setServicesLoading(true);
      setServicesError(null);
      // Call via api directly to capture raw response for debugging
      const resp = await api.get('/catalog/services');
      setRawResponse(JSON.stringify(resp.data, null, 2));
      const result = resp.data?.data ?? [];
      setServices(result.filter((service: any) => service.is_active));
    } catch (error: any) {
      setRawResponse(
        error.response ? JSON.stringify(error.response.data, null, 2) : String(error)
      );
      setServicesError(error.response?.data?.message || 'Get services failed');
    } finally {
      setServicesLoading(false);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchPetsThunk());
    loadServices();
  }, [dispatch, loadServices]);

  const renderServiceCard = (item: CatalogService) => (
    <TouchableOpacity
      key={item.service_id}
      style={styles.serviceCard}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.service_id, service: item })}
    >
      <View style={styles.serviceIconWrap}>
        <MaterialCommunityIcons name={getServiceIconName(item) as any} size={22} color="#835300" />
      </View>
      <View style={styles.serviceCardBody}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceDescription} numberOfLines={2}>{getServiceLabel(item)}</Text>
        <View style={styles.serviceMetaRow}>
          <Text style={styles.servicePrice}>{formatServicePrice(item.price)}</Text>
          <Text style={styles.serviceDuration}>{item.is_active ? 'Available' : 'Inactive'}</Text>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#7D4600" />
    </TouchableOpacity>
  );

  const showPetsLoading = petLoading && pets.length === 0;
  const showServicesLoading = servicesLoading && services.length === 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.pageLabelRow}>
          <Text style={styles.pageLabelText}>Home</Text>
        </View>

        {(petError || servicesError) && (
          <View style={styles.stateCard}>
            <Text style={styles.stateText}>{petError || servicesError}</Text>
          </View>
        )}

        {(showPetsLoading || showServicesLoading) && (
          <View style={styles.stateCard}>
            <ActivityIndicator size="small" color="#465F4D" />
            <Text style={[styles.stateText, { marginTop: 10 }]}>Loading home data...</Text>
          </View>
        )}

        {/* Khu vực My Pets */}
        <View style={styles.petsHeader}>
          <Text style={styles.petsTitle}>My Pets</Text>
          
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.petsList}
        >
          {pets.length > 0 ? pets.map((pet: Pet) => {
            const petImageSource = getPetImageSource(pet);

            return (
            <TouchableOpacity
              key={pet.pet_id}
              style={styles.petCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('PetDetail', { pet })}
            >
              {petImageSource ? (
                <Image source={petImageSource} style={styles.petImage} />
              ) : (
                <View style={styles.petAvatarFallback}>
                  <MaterialCommunityIcons name="paw" size={32} color="#835300" />
                </View>
              )}
              <Text style={styles.petName}>{pet.name}</Text>
            </TouchableOpacity>
            );
          }) : !showPetsLoading && (
            <View style={styles.stateCard}>
              <Text style={styles.stateText}>No pets available right now.</Text>
            </View>
          )}
        </ScrollView>

        {/* Khu vực Services */}
        <View style={styles.servicesHeader}>
          <Text style={styles.servicesTitle}>Services</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => setServiceModalVisible(true)}>
            <Text style={styles.seeAllText}>see all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.servicesFrame}>
          {services.length > 0 ? (
            <View style={styles.servicesList}>
              {services.map(renderServiceCard)}
            </View>
          ) : (
            !showServicesLoading && (
              <View style={styles.stateCard}>
                <Text style={styles.stateText}>No active services available right now.</Text>
              </View>
            )
          )}
        </View>

        <Modal visible={serviceModalVisible} animationType="fade" transparent>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center' }}>
            <View style={{ margin: 20, backgroundColor: '#fff', borderRadius: 12, maxHeight: '80%' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
                <Text style={{ fontSize: 18, fontWeight: '800' }}>All services</Text>
                <TouchableOpacity onPress={() => setServiceModalVisible(false)} hitSlop={10}>
                  <Text style={{ color: '#7D4600', fontWeight: '700' }}>Close</Text>
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={{ padding: 12 }}>
                {services.length === 0 ? (
                  <View style={styles.stateCard}>
                    <Text style={styles.stateText}>No services available</Text>
                  </View>
                ) : (
                  services.map((s) => (
                    <TouchableOpacity key={s.service_id} style={[styles.serviceCard, { marginBottom: 10 }]} onPress={() => { setServiceModalVisible(false); navigation.navigate('ServiceDetail', { serviceId: s.service_id, service: s }); }}>
                      <View style={styles.serviceIconWrap}>
                        <MaterialCommunityIcons name={getServiceIconName(s) as any} size={22} color="#835300" />
                      </View>
                      <View style={styles.serviceCardBody}>
                        <Text style={styles.serviceName}>{s.name}</Text>
                        <Text style={styles.serviceDescription} numberOfLines={2}>{getServiceLabel(s)}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Bảng Hỗ trợ / Reschedule */}
        <SupportCard />

      </ScrollView>
    </SafeAreaView>
  );
}