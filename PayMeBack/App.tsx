/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { BottomNavigation } from 'react-native-paper';

import HomeScreen from './HomeScreen.tsx';
import SettingsScreen from './SettingsScreen.tsx';
import PersonsScreen from './PersonsScreen.tsx';
import colors from './colors.js';
import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  Settings,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { SafeAreaProvider } from 'react-native-safe-area-context';

type SectionProps = PropsWithChildren<{
  title: string;
}>;


const HomeRoute = () => <HomeScreen />;

const PersonsRoute = () => <PersonsScreen />;


function App(): React.JSX.Element {

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Home', icon: () => null },
    { key: 'person', title: 'Contacts', icon: () => null },
  ]);
  

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    person: PersonsRoute,
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        
        <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      style={{ backgroundColor: colors.dark_shade }}
    />
      </SafeAreaView>
    </SafeAreaProvider>
    
  );
  
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
