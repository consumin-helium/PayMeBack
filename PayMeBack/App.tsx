import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { BottomNavigation } from 'react-native-paper';
import HomeScreen from './HomeScreen';
import PersonsScreen from './PersonsScreen';
import AboutScreen from './AboutScreen';
import colors from './colors';

import FontAwesome from 'react-native-vector-icons/FontAwesome';


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator(); // Create the Tab object here

const HomeRoute = () => <HomeScreen />;
const PersonsRoute = () => <PersonsScreen />;

const renderScene = BottomNavigation.SceneMap({
  home: HomeRoute,
  person: PersonsRoute,
  about: AboutScreen,
});

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Contacts" 
          component={PersonsScreen} 
          options={{ 
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="users" size={size} color={color} />
            ),
          }}
        />
         <Tab.Screen 
          name="About" 
          component={AboutScreen} 
          options={{ 
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="info" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;