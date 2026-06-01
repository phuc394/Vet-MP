import React from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './ServiceDetailStyle';

export default function ServiceDetail() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const service = route.params?.service;

  if (!service) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.headerTitle}>Service detail</Text>
          <Text style={styles.emptyText}>No service data available.</Text>
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
            <MaterialCommunityIcons name={service.icon as any} size={30} color="#835300" />
          </View>
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroCategory}>{service.category}</Text>
            <Text style={styles.heroName}>{service.name}</Text>
            <Text style={styles.heroDescription}>{service.description}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Price</Text>
            <Text style={styles.infoValue}>{service.price}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Duration</Text>
            <Text style={styles.infoValue}>{service.duration}</Text>
          </View>
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>What you get</Text>
          <Text style={styles.noteText}>
            This service screen is a dedicated folder so you can expand it later with doctor info,
            booking options, photos, or review sections.
          </Text>
        </View>

        <TouchableOpacity style={styles.bookButton} activeOpacity={0.9} onPress={() => navigation.navigate('AddAppointment')}>
          <Text style={styles.bookButtonText}>Book now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}