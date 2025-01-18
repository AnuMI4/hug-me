import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RequestScreen from './request';
import HistoryScreen from './history';
import ProfileScreen from './profile';
import AllRequestsScreen from './requests';
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  return (
    <Tab.Navigator
      initialRouteName="Request"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#7912b0',
        tabBarInactiveTintColor: '#aaa',
        tabBarLabelStyle: {
          fontSize: 14,
        },
      }}
    >
      <Tab.Screen 
        name="Request" 
        component={RequestScreen} 
        options={{ 
          tabBarLabel: 'Request', 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ), 
        }} 
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{ 
          tabBarLabel: 'History', 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ), 
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          tabBarLabel: 'Profile', 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ), 
        }} 
      />
      <Tab.Screen 
        name="Requests" 
        component={AllRequestsScreen} 
        options={{ 
          tabBarLabel: 'Requests', 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ), 
        }} 
      />
    </Tab.Navigator>
  );
}
