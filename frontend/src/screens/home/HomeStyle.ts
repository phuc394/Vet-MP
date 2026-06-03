// src/home/HomeStyle.ts

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF9EC', // Màu nền kem nhạt
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  pageLabelRow: {
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  pageLabelText: {
    fontSize: 33,
    fontWeight: '900',
    color: '#4D6453',
    letterSpacing: 0.2,
  },

  // --- UPCOMING VISIT CARD ---
  upcomingCard: {
    backgroundColor: '#F7AD42',
    borderRadius: 28,
    padding: 24,
    height: 200,
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  upcomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upcomingTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  calendarIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#835300',
    fontWeight: '700',
    fontSize: 14,
  },

  // --- MY PETS SECTION ---
  petsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  petsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4D6453', // Màu xanh lá đậm
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#7D4600',
  },
  petsList: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  petCard: {
    backgroundColor: '#F7EDD7',
    borderRadius: 24,
    padding: 15,
    marginRight: 15,
    width: 140,
  },
  petAvatarFallback: {
    width: 110,
    height: 110,
    borderRadius: 40,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2E5CF',
  },
  petImage: {
    width: 110,
    height: 110,
    borderRadius: 40,
    marginBottom: 12,
  },
  petName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginLeft: 4,
  },

  // --- SERVICES SECTION ---
  servicesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  servicesTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4D6453',
  },
  servicesFrame: {
    backgroundColor: '#FFF6E8',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#E8DDCF',
    padding: 12,
    marginBottom: 30,
    maxHeight: 320,
  },
  servicesList: {
    paddingBottom: 8,
  },
  stateCard: {
    backgroundColor: '#FFF6E8',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E8DDCF',
    padding: 16,
    marginBottom: 20,
  },
  stateText: {
    color: '#5A4D3B',
    lineHeight: 20,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E8DDCF',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  serviceIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#FFF3E6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0D7B0',
    marginRight: 12,
  },
  serviceCardBody: {
    flex: 1,
    paddingRight: 10,
  },
  serviceCategory: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7D4600',
    marginBottom: 2,
  },
  serviceName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2F3B2E',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 13,
    color: '#6E6E6E',
    lineHeight: 18,
    marginBottom: 10,
  },
  serviceMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#465F4D',
  },
  serviceDuration: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A8A8A',
  },

  
});