import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from './AddPetStyle';
import { AppDispatch, RootState } from '../../redux/store';
import { createPetThunk } from '../../redux/slices/pet.slice';
import { showPlatformAlert } from '../../utils/platformAlert';

const sexOptions = ['male', 'female'] as const;

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
  const [avatar, setAvatar] = useState('');
  const [notes, setNotes] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      showPlatformAlert('Permission needed', 'Please allow photo library access to choose a pet avatar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.35,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const selectedAvatar = asset.base64
        ? `data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}`
        : asset.uri;

      setAvatar(selectedAvatar);
    }
  };

  const handleSave = async () => {
    setLocalError(null);

    if (!accessToken) {
      setLocalError('Please login before creating a pet');
      showPlatformAlert('Not logged in', 'Please login to create a pet.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
      return;
    }

    if (!name.trim()) {
      setLocalError('Pet name is required');
      return;
    }

    if (sex !== 'male' && sex !== 'female') {
      setLocalError('Select pet sex');
      return;
    }

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

    try {
      const createdPet = await dispatch(
        createPetThunk({
          name: name.trim(),
          sex: sex as 'male' | 'female',
          species: species.trim() || undefined,
          breed: breed.trim() || undefined,
          birth_date: birthDate.trim() || undefined,
          weight: parsedWeight,
          avatar: avatar || undefined,
          notes: notes.trim() || undefined,
        })
      ).unwrap();
      showPlatformAlert('Pet saved', `${createdPet.name} has been created successfully.`, [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      const msg = (error as any)?.response?.data?.message ?? (error as any)?.message ?? 'Create pet failed';
      setLocalError(String(msg));
      showPlatformAlert('Create pet failed', String(msg));
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
            <TouchableOpacity style={styles.avatarPicker} activeOpacity={0.85} onPress={pickAvatar}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.previewImage} />
              ) : (
                <View style={styles.previewPlaceholder}>
                  <Ionicons name="paw-outline" size={34} color="#8CA694" />
                </View>
              )}
              <View style={styles.avatarEditBadge}>
                <Ionicons name="camera-outline" size={18} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.previewName}>{name.trim() || 'Pet name preview'}</Text>
            <Text style={styles.previewDetail}>
              {[species, breed].filter(Boolean).join(' / ') || 'Species / Breed'}
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Pet name"
              placeholderTextColor="#9A8C73"
            />

            <Text style={styles.inputLabel}>Sex</Text>
            <View style={styles.sexToggle}>
              {sexOptions.map((option) => {
                const isActive = sex === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[styles.sexToggleButton, isActive && styles.sexToggleButtonActive]}
                    onPress={() => setSex(option)}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.sexToggleText, isActive && styles.sexToggleTextActive]}>{option}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.inputLabel}>Species</Text>
            <TextInput
              style={styles.input}
              value={species}
              onChangeText={setSpecies}
              placeholder="Dog, cat..."
              placeholderTextColor="#9A8C73"
            />

            <Text style={styles.inputLabel}>Breed</Text>
            <TextInput
              style={styles.input}
              value={breed}
              onChangeText={setBreed}
              placeholder="Breed"
              placeholderTextColor="#9A8C73"
            />

            <Text style={styles.inputLabel}>Birth date</Text>
            <TextInput
              style={styles.input}
              value={birthDate}
              onChangeText={setBirthDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9A8C73"
            />

            <Text style={styles.inputLabel}>Weight</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="Weight in kg"
              placeholderTextColor="#9A8C73"
              keyboardType="decimal-pad"
            />

            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Medical notes"
              placeholderTextColor="#9A8C73"
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
