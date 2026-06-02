import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF9EC', // Màu nền kem nhạt từ thiết kế
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#465F4D', // Màu text xanh đen
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E2D6C7',
    paddingHorizontal: 15,
    height: 45,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333333',
    paddingVertical: 0,
  },
  listContainer: {
    paddingBottom: 90, // Để tránh card cuối bị FAB che lấp
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#8CA694', // Viền xanh lá mạ nhạt
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  petImage: {
    width: 65,
    height: 65,
    borderRadius: 16, // Bo góc cho hình ảnh thú cưng
  },
  petInfo: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  petName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5A4D3B',
    marginBottom: 4,
  },
  petDetail: {
    fontSize: 15,
    color: '#5A4D3B',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F4B35A',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6, // Shadow cho Android
    shadowColor: '#000', // Shadow cho iOS
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  }
});