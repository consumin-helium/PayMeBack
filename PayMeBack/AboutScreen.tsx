
import { View, Text } from 'react-native';
import colors from './colors.js';
import { Card, Title, Paragraph, Appbar, BottomNavigation, Button, List, IconButton, FAB, ActivityIndicator, RadioButton, ToggleButton, Switch, SegmentedButtons } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { NavigationContainer, useFocusEffect, useNavigation } from '@react-navigation/native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';


import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  useColorScheme,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';

import { useIsFocused } from '@react-navigation/native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import uuid from 'react-native-uuid';




function AboutScreen() {





  const isFocused = useIsFocused();

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: colors.light_shade,
  };

  const styles = StyleSheet.create({
    block: {
      backgroundColor: '#f0f0f0', // Change this to your desired color
      padding: 10, // Change this to your desired padding
      margin: 10, // Change this to your desired margin
      borderRadius: 5, // Optional: if you want rounded corners
    },
    greenBackground: {
      backgroundColor: colors.main_color,
    },
  });



  useEffect(() => {
    if (isFocused) {
      // Do something when the screen is focused
      console.debug('Focused About');

    } else {
      // Do something when the screen is unfocused
      console.debug('Unfocused Home');
    }
  }, [isFocused]);



  return (

    <SafeAreaProvider>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <Appbar.Header >
            <Appbar.Content title="PayMeBack" titleStyle={{ color: colors.main_color }} />

          </Appbar.Header>
          <Card style={{ margin: 10 }}>
 
            <Card.Content>
              <Title style={{ fontWeight: '200' }}>About PayMeBack:</Title>
              
              <Text>PayMeBack was created by the amazing team at ElasticElkStudios. We are a small team of developers who are passionate about creating useful and fun apps. We hope you enjoy using PayMeBack as much as we enjoyed creating it. </Text>
              <View style={{height:10}}></View>
<Text>If you ever have any suggestions, feel free to let me know on Discord at @carbonfaceprint</Text>
      
            </Card.Content>
          </Card>
          
        </ScrollView>
      </SafeAreaView>



    </SafeAreaProvider>
  );
}

export default AboutScreen;