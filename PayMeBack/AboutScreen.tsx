
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

import { Linking, TouchableOpacity } from 'react-native';


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


    const [modalVisible, setModalVisible] = useState(false);
    const [Currency, setCurrency] = useState('R');


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


    const clearAll = async () => {
        try {
            await AsyncStorage.clear()
        } catch (e) {
            // clear error
            console.log(e);
        }

        console.log('Done.')
    }



    const newCurrency = async () => {
    try {
        await AsyncStorage.setItem('currency', Currency)
        setModalVisible(false);
    } catch (e) {
        // saving error
        console.log(e);
    }
    }

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

                    <View style={{ margin: 10, }}>
                    
                        <Title style={{ fontWeight: '600' }}>About PayMeBack:</Title>

                        <Text style={{color: colors.dark_accent}}>PayMeBack was created by the amazing team at ElasticElkStudios as a portfolio product. We are a small team of developers who are passionate about creating useful and fun apps. We hope you enjoy using PayMeBack as much as we enjoyed creating it. </Text>
                        <View style={{ height: 10 }}></View>
                        <Text style={{color: colors.dark_accent}}>If you ever have any suggestions, feel free to let me know on Discord at <Text style={{ fontWeight: 800 }}>@carbonfaceprint</Text></Text>
                        <View style={{ height: 10 }}></View>
                        <Text style={{color: colors.dark_accent}}>This app will remain completely free and open source forever. Feel free to check out the code at {'\n'}

                            <Text style={{ color: 'blue' }} onPress={() => Linking.openURL('https://github.com/consumin-helium/PayMeBack')}>
                                https://github.com/consumin-helium/PayMeBack
                            </Text>
                        </Text>

                        <View style={{ height: 10 }}></View>
                        <Text style={{color: colors.dark_accent}}>Our website is also available at {'\n'}
                            <Text style={{ color: 'blue' }} onPress={() => Linking.openURL('https://elasticelkstudios.co.za')}>
                                https://elasticelkstudios.co.za
                            </Text>
                        </Text>
                        <View style={{ height: 10 }}></View>

                        <Title style={{ fontWeight: '600' }}>Privacy Policy:</Title>
                        <Text style={{color: colors.dark_accent}}>PayMeBack does not collect any personal information. All data is stored locally on your device. We do not have access to any of your data. </Text>
                        <View style={{ height: 50 }}></View>
                        <Button style={{ backgroundColor: colors.main_color }} onPress={() => {
                            Alert.alert(
                                "Reset Local Data",
                                "Are you sure you want to reset local data?",
                                [
                                    {
                                        text: "Cancel",
                                        style: "cancel"
                                    },
                                    { text: "OK", onPress: () => clearAll() }
                                ]
                            );
                        }}>
                            <Text style={{ color: colors.text }}>
                                Reset Local Data
                            </Text>
                        </Button>

                        <View style={{ height: 10 }}></View>

                        <Button style={{ backgroundColor: colors.main_color }} onPress={() => {
                            setModalVisible(true);
                        }}>
                            <Text style={{ color: colors.text }}>
                                Set New Currency Symbol
                            </Text>
                        </Button>
                    </View>


                </ScrollView>
            </SafeAreaView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                    <View style={{ backgroundColor: colors.dark_shade, padding: 20, borderRadius: 10 }}>
                        <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold' }}>Set Currency Symbol</Text>

                        <View style={{ height: 20 }}></View>


                        {/* here is descriptio text area */}
                        <View style={{ height: 20 }} />
                        <Text style={{ color: colors.text }}>Set below your currency Symbol. The icon receding currency, for example: $ for $20</Text>
                        <View style={{ height: 10 }} />
                        <TextInput
                            placeholder="Extra Note Here..."
                            id='description'
                            value={Currency}
                            onChangeText={setCurrency}
                            placeholderTextColor={colors.text}
                            style={{ color: colors.text, fontStyle: 'italic', backgroundColor: colors.dark_accent, borderRadius: 5 }}

                        />
                        <View style={{ height: 20 }} />


                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button textColor={colors.main_color} onPress={() => { setModalVisible(false); }}>
                                CANCEL
                            </Button>
                            <Button textColor={colors.main_color} onPress={() => {
                                if (!Currency || /[^a-zA-Z0-9$€£¥₹₽₿₺₸₴₵₶₷₸₹₺₻₼₽₾₿]/.test(Currency)) {
                                    Alert.alert('Invalid currency symbol');
                                } else {
                                    console.debug("Setting Currency");
                                    newCurrency();
                                }
                            }}>
                                OK
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>



        </SafeAreaProvider>
    );
}

export default AboutScreen;