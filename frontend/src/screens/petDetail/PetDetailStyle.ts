import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#Fdfaf3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backArrow: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3d4f46',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#465F4D',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#111',
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  activeTabButton: {
    backgroundColor: '#F4B35A',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  tabContent: {
    paddingHorizontal: 20,
  },
  basicInfoContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 120,
    height: 160,
    backgroundColor: '#D1D5DB',
    marginRight: 15,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 15,
    color: '#111',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 10,
  },
  medicalText: {
    fontSize: 15,
    color: '#111',
    marginBottom: 8,
  },
  notesBox: {
    borderWidth: 1,
    borderColor: '#111',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 30,
  },
  notesText: {
    fontSize: 14,
    color: '#111',
    lineHeight: 20,
  },
  vaccineCard: {
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F5FBFF',
  },
  vaccineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  vaccineLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  vaccineName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  vaccineDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateCol: {
    flex: 1,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
});