import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        
        // Lấy tên để hiển thị
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        // Xử lý sự kiện chuyển trang khi bấm vào tab
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // Lệnh này giúp chuyển trang
            navigation.navigate(route.name);
          }
        };

        // Chọn icon tương ứng với từng màn hình
        let iconName: keyof typeof Ionicons.glyphMap = 'home';
        if (route.name === 'Home') iconName = isFocused ? 'home' : 'home-outline';
        else if (route.name === 'Pets') iconName = isFocused ? 'paw' : 'paw-outline';
        else if (route.name === 'Calendar') iconName = isFocused ? 'calendar' : 'calendar-outline';
        else if (route.name === 'Profile') iconName = isFocused ? 'person' : 'person-outline';

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            style={[
              styles.tabItem,
              isFocused ? styles.tabItemFocused : styles.tabItemUnfocused,
            ]}
          >
            <Ionicons 
              name={iconName} 
              size={24} 
              color={isFocused ? '#FFFFFF' : '#526E58'} 
            />
            <Text style={[
              styles.tabLabel,
              { color: isFocused ? '#FFFFFF' : '#526E58' }
            ]}>
              {label as string}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFDF7', // Màu nền tổng thể
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 25, // Tạo khoảng cách với viền dưới màn hình
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // Đổ bóng cho Android & iOS
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    minWidth: 75,
  },
  tabItemFocused: {
    backgroundColor: '#DD9833', // Màu cam khi Active
  },
  tabItemUnfocused: {
    backgroundColor: '#FFEAEA', // Màu hồng nhạt khi Inactive
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
});