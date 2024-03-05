
import { View, Text } from 'react-native';
import colors from './colors.js';
import { Card, Title, Paragraph, Appbar, BottomNavigation, Button, List, IconButton, FAB, ActivityIndicator, RadioButton, ToggleButton, Switch } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';


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

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import BottomNavigationBar from 'react-native-paper/lib/typescript/components/BottomNavigation/BottomNavigationBar.js';

import uuid from 'react-native-uuid';

function HomeScreen() {

    type Transaction = {
        person: string;
        id: string;
        amount: string;
        type: string;
    };

    const [paidModal, setPaidModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [amount, setAmount] = useState('');
    const [person, setPerson] = useState('');
    const [isCredit, setIsCredit] = useState(true);
    var totalBal = 0;
    const [transactionID, setID] = useState('');
    const [currency, setCurrency] = useState(false);
    const [isOption3Enabled, setOption3Enabled] = useState(false);
    const [isOption2Enabled, setOption2Enabled] = useState(false);
    const [isOption1Enabled, setOption1Enabled] = useState(false);




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



    const calculateBalance = () => {
        let balance = 0;
        transactions.forEach(transaction => {
            const numericalAmount = parseFloat(transaction.amount.replace(/[^\d.-]/g, ''));
            if (!isNaN(numericalAmount)) {
                if (transaction.type === 'credit') {
                    balance += numericalAmount;
                } else if (transaction.type === 'debit') {
                    balance -= numericalAmount;
                }
            }
        });
        return balance;
    }

    totalBal = calculateBalance();


    const addTransaction = async (person, amount, isCredit) => {
        try {
            // Get the current date
            const date = new Date();
            const day = date.getDate();
            const month = date.getMonth() + 1; // Months are zero-based
            const year = date.getFullYear();

            // Format the date as day/month/year
            const formattedDate = `${day}/${month}/${year}`;

            // Generate a unique UUID
            const id = uuid.v4();

            let transactionID = '';
            if (typeof id === 'string') {
                transactionID = id.replace(/-/g, '');
            } else if (Array.isArray(id)) {
                transactionID = id.join('').replace(/-/g, '');
            }
            const numericalAmount = amount.replace(/\D/g, '');
            switch (isCredit) {
                case true:
                    isCredit = 'credit';
                    break;
                case false:
                    isCredit = 'debit';
                    break;
                default:
                    isCredit = 'credit';
                    break;
            }
            var dummy_transaction = { "amount": "R" + numericalAmount, "date": formattedDate, "id": transactionID, "person": person, "type": isCredit }
            const value = await AsyncStorage.getItem('@storage_Key')
            if (value !== null) {
                var all_data = JSON.parse(value);
                all_data.transactions.push(dummy_transaction);
                setTransactions(all_data.transactions);
                await AsyncStorage.setItem('@storage_Key', JSON.stringify(all_data));
                console.debug('Transaction added');
                setPerson('');
                setAmount('');
            }

        } catch (e) {
            console.error(e);
        }

    }



    const removeTransaction = async () => {
        try {
            const ID = transactionID;
            const value = await AsyncStorage.getItem('@storage_Key')
            if (value !== null) {
                var all_data = JSON.parse(value);
                console.debug('id: ' + ID);


                // Remove the transaction with the specified id from the all_data object
                all_data.transactions = all_data.transactions.filter(transaction => transaction.id !== ID);

                // Update the transactions state variable
                setTransactions(all_data.transactions);

                // Save the updated all_data object back to AsyncStorage
                await AsyncStorage.setItem('@storage_Key', JSON.stringify(all_data));
                console.debug('Transaction removed');

            }
        } catch (e) {
            // handle error
            console.error(e);
        }
    }

    const storeData = async (value) => {
        try {
            await AsyncStorage.setItem('@storage_Key', value)
        } catch (e) {
            // saving error
            console.log(e);
        }
    }

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('@storage_Key')
            if (value !== null) {
                var all_data = JSON.parse(value);
                console.log(all_data)
                setTransactions(all_data.transactions);

            } else {
                // value not found in storage, store sample_transactions
                const sample_data = { "transactions": [{ "amount": "R200", "date": "123", "id": "#123", "person": "Derick", "type": "credit" }] }



                await storeData(JSON.stringify(sample_data));
                setTransactions(sample_data['transactions']);


            }
            setLoading(false); // set loading to false after data has been loaded
        } catch (e) {
            // error reading value
            setLoading(false); // set loading to false even if there was an error
            console.log(e);
        }
    }

    // fetch data, on load and if nothing add dummy data
    useEffect(() => {
        getData();
    }, []);


    if (loading) {
        return <ActivityIndicator />; // or some other loading indicator
    }

    if (!Array.isArray(transactions)) {
        return <ActivityIndicator />;
    }



    function resetData(e: GestureResponderEvent): void {
        throw new Error('Function not implemented.');
    }

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
                        <Appbar.Content title="Settings" titleStyle={{ color: colors.dark_accent }} />
                    </Appbar.Header>


                    <View  style={styles.block}>
                        <Text style={{ color: colors.dark_accent }}>Currency Symbol:</Text>
                        <TextInput
                            placeholder="Enter currency"
                            value={currency.toString()} // Convert currency to string
                            onChangeText={(text: string) => setCurrency(text)} // Specify text parameter type as string
                            style={{ color: colors.dark_accent, fontStyle: 'italic' }}
                        />
                    </View>








                </ScrollView>
            </SafeAreaView>

            <FAB
                style={{
                    position: 'absolute',
                    margin: 16,
                    right: 0,
                    bottom: 0,
                    backgroundColor: colors.main_color,
                }}
                icon="plus"
                onPress={() => setModalVisible(true)}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: colors.dark_shade, padding: 20, borderRadius: 10 }}>
                        <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold' }}>Add Transaction</Text>
                        <Text style={{ color: colors.text, fontSize: 20 }}>Fill in the details below to add a new transaction</Text>
                        <TextInput
                            placeholder="NAME HERE"
                            id='person'
                            value={person}
                            onChangeText={setPerson}
                            placeholderTextColor={colors.text}
                            style={{ color: colors.text, fontStyle: 'italic' }}

                        />
                        <TextInput
                            placeholder="AMOUNT HERE"
                            id='amount'
                            value={amount}
                            keyboardType='numeric'
                            onChangeText={(text) => setAmount('R' + text.replace(/[^0-9]/g, ''))}
                            placeholderTextColor={colors.text}
                            style={{ color: colors.text, fontStyle: 'italic' }}

                        />
                        <View>
                            <Text style={{ color: colors.text }}>{isCredit ? 'Credit (owes me)' : 'Debit (I owe them)'}</Text>
                            <Switch
                                trackColor={{ false: colors.dark_shade, true: colors.main_color }}
                                thumbColor={isCredit ? colors.main_color : colors.main_color}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={(newValue) => setIsCredit(newValue)}
                                value={isCredit}

                            />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button textColor={colors.main_color} onPress={() => { setModalVisible(false); setPerson(''); setAmount(''); }}>
                                CANCEL
                            </Button>
                            <Button textColor={colors.main_color} onPress={() => {
                                if (person !== '' || amount !== 'R') {
                                    setModalVisible(false);
                                    addTransaction(person, amount, isCredit);
                                } else {
                                    Alert.alert(
                                        "Fields Required",
                                        "Please fill in all fields",
                                        [
                                            { text: "OK", onPress: () => console.log("OK Pressed") }
                                        ],
                                        { cancelable: false }
                                    );
                                }
                            }}>
                                OK
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>


            <Modal
                animationType="slide"
                transparent={true}
                visible={paidModal}
                onRequestClose={() => {
                    setPaidModalVisible(!paidModal);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: colors.dark_shade, padding: 20, borderRadius: 10 }}>
                        <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold' }}>Mark transaction as paid off?</Text>
                        <Text style={{ color: colors.text, fontSize: 20 }}>This will remove the transaction. Are you sure you'd like to mark this as paid off?</Text>


                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button textColor={colors.main_color} onPress={() => { setPaidModalVisible(false); setPerson(''); setAmount(''); }}>
                                CANCEL
                            </Button>
                            <Button textColor={colors.main_color} onPress={() => {
                                setPaidModalVisible(false);
                                removeTransaction()
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

export default HomeScreen;
