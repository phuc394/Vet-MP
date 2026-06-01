import React, { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { styles } from './AddPetStyle';

const sexOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Unknown', value: 'unknown' },
];

export default function AddPet() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [sex, setSex] = useState('male');
  const [birthDate, setBirthDate] = useState('');
  const [weight, setWeight] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    Alert.alert(
      'Pet saved',
      'This screen is now ready to be connected to your API or store.'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#465F4D" />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Add Pet</Text>
            <Text style={styles.subtitle}>Create a new profile for your companion</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.previewCard}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.previewImage} />
            ) : (
              <View style={styles.previewPlaceholder}>
                <Ionicons name="paw-outline" size={34} color="#8CA694" />
              </View>
            )}
            <Text style={styles.previewName}>{name.trim() || 'Pet name preview'}</Text>
            <Text style={styles.previewDetail}>
              {[species, breed].filter(Boolean).join(' • ') || 'Species • Breed'}
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <Text style={styles.label}>Pet Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter pet name"
              placeholderTextColor="#8A8A8A"
            />

            <Text style={styles.label}>Species</Text>
            <TextInput
              style={styles.input}
              value={species}
              onChangeText={setSpecies}
              placeholder="Dog, Cat..."
              placeholderTextColor="#8A8A8A"
            />

            <Text style={styles.label}>Breed</Text>
            <TextInput
              style={styles.input}
              value={breed}
              onChangeText={setBreed}
              placeholder="Enter breed"
              placeholderTextColor="#8A8A8A"
            />

            <Text style={styles.label}>Sex</Text>
            <View style={styles.segmentRow}>
              {sexOptions.map((option) => {
                const isActive = sex === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[styles.segmentButton, isActive && styles.segmentButtonActive]}
                    onPress={() => setSex(option.value)}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>{option.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Birth Date</Text>
                <TextInput
                  style={styles.input}
                  value={birthDate}
                  onChangeText={setBirthDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#8A8A8A"
                />
              </View>

              <View style={styles.halfField}>
                <Text style={styles.label}>Weight</Text>
                <TextInput
                  style={styles.input}
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="kg"
                  placeholderTextColor="#8A8A8A"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <Text style={styles.label}>Avatar URL</Text>
            <TextInput
              style={styles.input}
              value={avatarUrl}
              onChangeText={setAvatarUrl}
              placeholder="Paste image link"
              placeholderTextColor="#8A8A8A"
            />

            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Health notes, habits, diet..."
              placeholderTextColor="#8A8A8A"
              multiline
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.9}>
            <Text style={styles.saveButtonText}>Save Pet</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}