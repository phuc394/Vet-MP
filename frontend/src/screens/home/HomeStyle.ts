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
    paddingTop: 40,
    paddingBottom: 40,
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

  // --- SUPPORT CARD ---
  supportCard: {
    backgroundColor: '#6E8A76',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    overflow: 'hidden',
    minHeight: 160,
  },
  supportContent: {
    flex: 1,
    zIndex: 1,
    justifyContent: 'center',
  },
  supportTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  supportText: {
    color: '#D1DDD5',
    fontSize: 13,
    marginBottom: 18,
    lineHeight: 18,
    maxWidth: '85%',
  },
  supportButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  supportButtonText: {
    color: '#8CA694',
    fontWeight: '700',
    fontSize: 13,
  },
  supportImageContainer: {
    position: 'absolute',
    right: -20,
    bottom: -15,
    width: 150,
    height: 150,
    opacity: 0.3, // Làm mờ ảnh nhân viên hỗ trợ để giống thiết kế
    zIndex: 0,
  },
  supportImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  }
});