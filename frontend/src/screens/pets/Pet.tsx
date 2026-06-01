import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './PetStyle';
import { MOCK_PETS, PetType } from './PetUtils';

const PetScreen = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigation = useNavigation<any>();

  // Xử lý logic tìm kiếm thú cưng theo tên
  const filteredPets = MOCK_PETS.filter((pet) =>
    pet.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render từng card thú cưng
  const renderPetCard = ({ item }: { item: PetType }) => (
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
          Weight: {item.weight != null ? `${item.weight.toFixed(2)} kg` : 'N/A'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header Title */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>My Pets</Text>
        </View>

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