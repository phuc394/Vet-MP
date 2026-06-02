import React, { useState } from 'react';
import {
  Alert,
  ActivityIndicator,
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
import { useDispatch, useSelector } from 'react-redux';
import { styles } from './AddPetStyle';
import { AppDispatch, RootState } from '../../redux/store';
import { createPetThunk } from '../../redux/slices/pet.slice';

const sexOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

export default function AddPet() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const { creating, createError } = useSelector((state: RootState) => state.pet);
  const accessToken = useSelector((state: RootState) => state.login.accessToken);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [sex, setSex] = useState('male');
  const [birthDate, setBirthDate] = useState('');
  const [weight, setWeight] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSave = async () => {
    setLocalError(null);

    // Debugging: print current token
    // eslint-disable-next-line no-console
    console.log('AddPet: accessToken=', accessToken);
    // Ensure user is logged in
    if (!accessToken) {
      setLocalError('Please login before creating a pet');
      Alert.alert('Not logged in', 'Please login to create a pet.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
      return;
    }

    if (!name.trim()) {
      setLocalError('Pet name is required');
      return;
    }

    // sex is controlled via UI, but validate defensively
    if (sex !== 'male' && sex !== 'female') {
      setLocalError('Select pet sex');
      return;
    }

    // birth date optional, if provided must match YYYY-MM-DD
    if (birthDate.trim()) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(birthDate.trim())) {
        setLocalError('Birth date must be YYYY-MM-DD');
        return;
      }
      const d = new Date(birthDate.trim());
      if (Number.isNaN(d.getTime())) {
        setLocalError('Birth date is invalid');
        return;
      }
    }

    const parsedWeight = weight.trim() ? Number(weight) : undefined;

    if (parsedWeight !== undefined) {
      if (Number.isNaN(parsedWeight)) {
        setLocalError('Weight must be a number');
        return;
      }
      if (parsedWeight <= 0) {
        setLocalError('Weight must be greater than zero');
        return;
      }
    }

    // basic avatar URL sanity check
    if (avatarUrl.trim()) {
      try {
        // eslint-disable-next-line no-new
        new URL(avatarUrl.trim());
      } catch (_e) {
        setLocalError('Avatar must be a valid URL or left empty');
        return;
      }
    }

    try {
      const createdPet = await dispatch(
        createPetThunk({
          name: name.trim(),
          sex: sex as 'male' | 'female',
          species: species.trim() || undefined,
          breed: breed.trim() || undefined,
          birth_date: birthDate.trim() || undefined,
          weight: parsedWeight,
          avatar: avatarUrl.trim() || undefined,
          notes: notes.trim() || undefined,
        })
      ).unwrap();
      Alert.alert('Pet saved', `${createdPet.name} has been created successfully.`, [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      // Log full error/response for debugging
      // eslint-disable-next-line no-console
      console.error('Create pet failed (error):', error);
      // Axios errors often have `response` with details
      // eslint-disable-next-line no-console
      console.error('Create pet failed (response):', (error as any)?.response);

      const msg = (error as any)?.response?.data?.message ?? (error as any)?.message ?? 'Create pet failed';
      setLocalError(String(msg));
      // Also show a short alert so user notices
      Alert.alert('Create pet failed', String(msg));
    }
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

          {createError && (
            <Text style={{ color: 'red', textAlign: 'center', marginTop: 12 }}>{createError}</Text>
          )}

          {localError && (
            <Text style={{ color: 'red', textAlign: 'center', marginTop: 12 }}>{localError}</Text>
          )}

          <TouchableOpacity
            style={[styles.saveButton, creating && { opacity: 0.7 }]}
            onPress={handleSave}
            activeOpacity={0.9}
            disabled={creating}
          >
            {creating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save Pet</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}