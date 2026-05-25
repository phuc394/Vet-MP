import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9EC',
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingTop: 14,
    paddingBottom: 20,
  },
  screenTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#465F4D',
    marginBottom: 12,
  },
  profileCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7F4900',
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#FFEAC9',
  },
  profileHeaderSection: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 12,
    color: '#000',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#7F4900',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  infoRow: {
    marginBottom: 4,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  lastInfoRow: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    color: '#222',
  },
  buttonEdit: {
    flexDirection: 'row',
    backgroundColor: '#8CA694',
    paddingVertical: 12,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonEditText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#FFFFFF',
    fontWeight: '400',

  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    paddingVertical: 12,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
    fontWeight: '400',
  },
});