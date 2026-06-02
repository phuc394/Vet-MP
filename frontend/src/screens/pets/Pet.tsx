import React, { useCallback, useMemo, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './PetStyle';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import { AppDispatch, RootState } from '../../redux/store';
import { fetchPetsThunk } from '../../redux/slices/pet.slice';
import { Pet } from '../../types/pet.type';

const PetScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigation = useNavigation<any>();

  const { pets, loading, error } = useSelector((state: RootState) => state.pet);
  const { accessToken } = useSelector((state: RootState) => state.login);

  useFocusEffect(
    useCallback(() => {
      if (accessToken) {
        dispatch(fetchPetsThunk());
      }
    }, [accessToken, dispatch])
  );

  const filteredPets = useMemo(
    () =>
      pets.filter((pet) =>
        pet.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [pets, searchQuery]
  );

  const formatWeight = (weight: Pet['weight']) => {
    if (weight === null || weight === undefined || weight === '') {
      return 'N/A';
    }

    const numericWeight = Number(weight);
    if (Number.isNaN(numericWeight)) {
      return 'N/A';
    }

    return `${numericWeight.toFixed(2)} kg`;
  };

  // Render từng card thú cưng
  const renderPetCard = ({ item }: { item: Pet }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('PetDetail', { pet: item })}
    >
      <Image
        source={{ uri: item.avatar || 'https://via.placeholder.com/65' }}
        style={styles.petImage}
        resizeMode="cover"
      />
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petDetail}>
          {[item.species, item.breed].filter(Boolean).join(' • ') || 'Unknown'}
        </Text>
        <Text style={styles.petDetail}>
          Weight: {formatWeight(item.weight)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && pets.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#465F4D" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header Title */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>My Pets</Text>
        </View>

        {error && (
          <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
            <Text style={{ color: 'red', textAlign: 'center', marginBottom: 8 }}>{error}</Text>
            <TouchableOpacity
              style={{ alignSelf: 'center', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 16, backgroundColor: '#F4B35A' }}
              onPress={() => dispatch(fetchPetsThunk())}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#333" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search By Name"
            placeholderTextColor="#777"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Pet List */}
        <FlatList
          data={filteredPets}
          keyExtractor={(item) => item.pet_id.toString()}
          renderItem={renderPetCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <Text style={{ color: '#7A6B56', fontWeight: '600' }}>
                {searchQuery ? 'No pets match your search.' : 'No pets found.'}
              </Text>
            </View>
          }
        />
        
      </View>

      {/* Floating Action Button (+) */}
      <TouchableOpacity 
        style={styles.fab} 
        activeOpacity={0.8}
        onPress={() => navigation.navigate('AddPet')}
      >
        <Ionicons name="add" size={36} color="#FFFFFF" />
      </TouchableOpacity>
      
    </SafeAreaView>
  );
};

export default PetScreen;