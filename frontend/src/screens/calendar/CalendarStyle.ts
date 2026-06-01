import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF7' },
  container: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#465F4D' },
  headerSubtitle: { color: '#726E66', marginTop: 6, marginBottom: 18 },

  tabRow: { flexDirection: 'row', marginBottom: 18 },
  tabWrapper: {
    marginBottom: 18,
    padding: 6,
    backgroundColor: '#FFF6E8',
    borderRadius: 30,
  },

  searchBarWrap: {
    marginBottom: 18,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF6E8',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2D6C7',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    color: '#2F3B2E',
    fontSize: 14,
    paddingVertical: 0,
    outlineStyle: 'none',
    outlineWidth: 0,
    outlineColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
  },

  appointmentListFrame: {
    maxHeight: 540,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E2D6C7',
    backgroundColor: '#FFF6E8',
    padding: 10,
    marginBottom: 18,
    overflow: 'hidden',
  },

  appointmentListScroll: {
    flexGrow: 0,
  },

  appointmentListContent: {
    paddingBottom: 4,
  },

  tabInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    flexWrap: 'nowrap',
  },
  tabPill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 0,
    flexShrink: 1,
    margin: 4,
    flexBasis: '35%',
    minWidth: 0,
  },
  tabPillWide: {
    paddingHorizontal: 24,
    flexGrow: 0,
    flexShrink: 1,
    margin: 4,
    flexBasis: '65%',
    minWidth: 0,
  },
  tabPillSpacing: {
    marginRight: 8,
  },
  tabPillActive: {
    backgroundColor: '#F0B15A',
  },
  tabPillInactive: {
    backgroundColor: '#FFF6F3',
  },
  tabPillText: {
    fontWeight: '700',
    fontSize: 14,
  },
  tabPillActiveText: { color: '#FFFFFF' },
  tabPillInactiveText: { color: '#6B4B2B' },

  appointmentCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 10, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, elevation: 3, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  petRow: { flexDirection: 'row', alignItems: 'center' },
  petAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: 10, backgroundColor: '#EEE' },
  petName: { fontWeight: '700', color: '#2F3B2E', fontSize: 14 },
  petService: { color: '#8A8A8A', fontSize: 11 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  statusText: { color: '#6B6B6B', fontWeight: '700', fontSize: 11 },

  cardBody: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  cardBodyRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'nowrap' },
  infoCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D8CDBF',
    paddingVertical: 9,
    paddingHorizontal: 10,
    marginRight: 8,
    minWidth: 0,
    marginBottom: 0,
  },
  iconArea: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 10,
  },
  innerDivider: {
    width: 3,
    backgroundColor: '#D8CDBF',
    marginHorizontal: 0,
    alignSelf: 'stretch',
    height: '100%',
  },
  infoCellRight: { marginRight: 0, marginLeft: 8 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3E6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0D7B0',
    marginRight: 0,
  },
  infoCellContent: { flex: 8, paddingVertical: 8, paddingLeft: 12 },
  infoLabel: { fontSize: 9, color: '#7A6B4A' },
  infoValue: { fontSize: 10, color: '#2F3B2E', marginTop: 2, fontWeight: '700' },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewButton: { backgroundColor: '#F0B15A', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 24, minWidth: 132, alignItems: 'center' },
  viewButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  cancelButton: { backgroundColor: '#FFFFFF', borderColor: '#D34D3D', borderWidth: 1, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, alignItems: 'center' },
  cancelButtonText: { color: '#D34D3D', fontWeight: '700' },

  divider: { height: 1, backgroundColor: '#F3EEE9', marginVertical: 12 },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    backgroundColor: '#F0B15A',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6E8A76',
  },
});
