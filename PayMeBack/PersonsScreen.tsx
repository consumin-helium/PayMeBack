
import { View, Text } from 'react-native';
import colors from './colors.js';
import { Card, Title, Paragraph, Appbar, BottomNavigation, Button, List, IconButton, FAB, ActivityIndicator, RadioButton, ToggleButton, Switch, Searchbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { Picker } from '@react-native-picker/picker';
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
import { useIsFocused } from '@react-navigation/native';

function PersonScreen() {

    type Transaction = {
        person: string;
        id: string;
        amount: string;
        type: string;
        date: string;
        contactID: string;
      };

      type Contact = {
        name: string;
        amount: string;
        id: string;
      }

    const [contacts, setContacts] = useState<Contact[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [searchQuery, setSearchQuery] = React.useState('');

    const onChangeSearch = query => setSearchQuery(query);


    const [paidModal, setPaidModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [amount, setAmount] = useState('');
    const [person, setPerson] = useState('');
    const [newName, setNewName] = useState('');
    const [isCredit, setIsCredit] = useState(true);
    const [transactionID, setID] = useState('');
    const [selectedContactID, setSelectedContactID] = useState('');

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
        console.log("New contacts: ", contacts);
        updateTransactionsName(newName);
    }, [contacts]);

    const editPerson = async () => {

        const updatedContacts = contacts.map((contact) => {
            if (contact.name === person) {
                setSelectedContactID(contact.id);
                return { ...contact, name: newName };
            }
            return contact;
        });
        setContacts(updatedContacts);


    }


   

// Here we will use ediperson above to then also change name in all transactions
const updateTransactionsName = async (newName) => {
    const updatedTransactions = transactions.map((transaction) => {
        if (transaction.contactID === selectedContactID) {
            return { ...transaction, person: newName };
        }
        return transaction;
    });
    setTransactions(updatedTransactions);
    
}

    const addPerson = async (name) => {
        try {

            // Generate a unique UUID
            const id = uuid.v4();

            let transactionID = '';
            if (typeof id === 'string') {
                transactionID = id.replace(/-/g, '');
            } else if (Array.isArray(id)) {
                transactionID = id.join('').replace(/-/g, '');
            }

            var dummy_transaction = { "name": name, "id": id, "amount": "R0" }
            console.log("ADDING")
            console.log(dummy_transaction);
            const value = await AsyncStorage.getItem('@PayMeBackStorage')
            if (value !== null) {
                var all_data = JSON.parse(value);
                all_data.contacts.push(dummy_transaction);
                setContacts(all_data.contacts);
                await AsyncStorage.setItem('@PayMeBackStorage', JSON.stringify(all_data));
                console.debug('Contact added');


            }
            setPerson('');

            
        } catch (e) {
            console.error(e);
        }

    }



    const removePerson = async () => {
        try {
            const name = person;
            const value = await AsyncStorage.getItem('@PayMeBackStorage')
            if (value !== null) {
                var all_data = JSON.parse(value);



                // Remove the transaction with the specified id from the all_data object
                all_data.contacts = all_data.contacts.filter(contact => contact.name !== name);
                all_data.transactions = all_data.transactions.filter(transaction => transaction.person !== name);

                // Update the contacts state variable
                setContacts(all_data.contacts);
                setTransactions(all_data.transactions);

                // Save the updated all_data object back to AsyncStorage
                await AsyncStorage.setItem('@PayMeBackStorage', JSON.stringify(all_data));
                console.debug('Transaction removed');

            }
        } catch (e) {
            // handle error
            console.error(e);
        }
    }

    const storeData = async () => {
        try {
            var value = JSON.stringify({ "transactions": transactions, "contacts": contacts });
            await AsyncStorage.setItem('@PayMeBackStorage', value)
            console.debug("saved Data")
        } catch (e) {
            // saving error
            console.log(e);
        }
    }

    



    const getContactBalance = (name) => {
        let totalAmount = 0;
        console.log("Here are the transactions::", transactions)
        transactions.forEach((transaction) => {

            if (transaction.person === name) {
                console.log("Matched transaction: ", transaction);
                switch (transaction.type) {
                    case 'credit':
                        totalAmount += Number(transaction.amount.replace(/[^0-9]/g, ''));
                        break;
                    case 'debit':
                        totalAmount -= Number(transaction.amount.replace(/[^0-9]/g, ''));
                        break;
                }

            }
        });
        console.debug("final amount: ", totalAmount)
        return totalAmount;
    }


    const updateContactsBalances = async (data) => {
        try {
            data.forEach((contact) => {
                contact.amount = getContactBalance(contact.name);
                console.debug("name: " + contact.name + " | amount: " + getContactBalance(contact.name));
            });

            return data;
        } catch (e) {
            console.error(e);
        }
    }





    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('@PayMeBackStorage')
            if (value !== null) {
                var all_data = JSON.parse(value);
                console.log("here is all data ", all_data)
                setTransactions(all_data.transactions);
                var new_data = await updateContactsBalances(all_data.contacts);
                console.log("here is new data ", new_data)
                setContacts(new_data);


            } else {
                // value not found in storage, store sample_transactions
                const sample_data = { "transactions": [{ "amount": "R200", "date": "123", "id": "#123", "person": "Derick", "type": "credit" }], "contacts": [{ "name": "Derick", "amount": "R200", "id": "#8923912" }] }


                setTransactions(sample_data['transactions']);
                await storeData();
                


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
        if(isFocused){
            console.debug("Focused Persons");
        setLoading(true);
        (async () => {
            await getData();
            setLoading(false); // set loading to false after data has been loaded
        })();
    } else{
        console.debug("Unfocused Persons");
    }
    }, [isFocused]);


    



    if (loading) {
        return <ActivityIndicator />; // or some other loading indicator
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
                        <Appbar.Content title="PayMeBack" titleStyle={{ color: colors.main_color }} />
                       
                    </Appbar.Header>
                    <Searchbar
                        placeholder="Search"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                    />

                    <View style={styles.block}>
                        <Title style={{ fontWeight: 'bold' }}>All Contacts</Title>
                    </View>


                    {contacts.filter(contact => contact.name.toLowerCase().includes(searchQuery.toLowerCase())).map((contact) => (
                        <List.Item
                            key={contact.id}
                            title={contact.name}
                            description={Number(contact.amount) < 0 ? `-R${Math.abs(Number(contact.amount))}` : `R${contact.amount}`}
                            style={{ backgroundColor: colors.dark_shade, margin:5 }}
                            titleStyle={{ color: colors.text }}
                            descriptionStyle={{ color: colors.text }}
                            right={props => (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <IconButton icon="pencil" size={20} onPress={() => { setEditModalVisible(true); setPerson(contact.name); console.log(person) }} />
                                    <IconButton icon="check" size={20} onPress={() => { setPaidModalVisible(true); setPerson(contact.name); console.log(person) }} />
                                </View>
                            )}
                        />
                    ))}







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

{/* below is modal to add new persosn */}
<Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' , margin:"10"}}>
                    <View style={{ backgroundColor: colors.dark_shade, padding: 20, borderRadius: 10 }}>
                        <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold' }}>Add Transaction</Text>
                        <Text style={{ color: colors.text, fontSize: 20 }}>Fill in the details below to add a new transaction</Text>
                        <View style={{height:10}}></View>
                        <Text style={{color:colors.text}}>Set Name</Text>
                        <View style={{height:10}}></View>
                        <TextInput
                            placeholder="name...."
                            id='person'
                            value={person}
                            onChangeText={setPerson}
                            placeholderTextColor={colors.text}
                            style={{ color: colors.text, fontStyle: 'italic', backgroundColor:colors.dark_accent, borderRadius: 5 }}

                        />
                        <View style={{height:10}}></View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button textColor={colors.main_color} onPress={() => { setModalVisible(false); setPerson(''); setAmount(''); }}>
                                CANCEL
                            </Button>
                            <Button textColor={colors.main_color} onPress={() => {
                                if (person !== '' && person !== null) {
                                    setModalVisible(false);
                                    addPerson(person);
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

            {/* Below is the modal for the edit contacts popup */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => {
                    setModalVisible(!editModalVisible);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: colors.dark_shade, padding: 20, borderRadius: 10 }}>
                        <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold' }}>Edit Person</Text>
                        <Text style={{ color: colors.text, fontSize: 20 }}>Type below the new name you'd like for this contact. All transactions will update</Text>
                        
                        <View style={{height:20}}></View>

<Text style={{color:colors.text}}>Old Name</Text>
<View style={{height:10}}></View>
                        <Picker
                id='person'
                selectedValue={person}
                onValueChange={(itemValue, itemIndex) => setPerson(itemValue)}
                style={{ color: colors.text, fontStyle: 'italic',backgroundColor: colors.dark_accent, borderRadius: 5 }}
              >
                {contacts.map((contact) => (
                  <Picker.Item key={contact.name} label={contact.name} value={contact.name} />
                ))}
              </Picker>
              <View style={{height:20}}></View>

<Text style={{color:colors.text}}>New Name</Text>
<View style={{height:10}}></View>
                        <TextInput
                            placeholder="NEW NAME"
                            id='person'
                            value={newName}
                            onChangeText={setNewName}
                            placeholderTextColor={colors.text}
                            style={{ color: colors.text, fontStyle: 'italic', backgroundColor: colors.dark_accent, borderRadius: 5}}

                        />
                        <View style={{height:10}}></View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button textColor={colors.main_color} onPress={() => { setEditModalVisible(false); setPerson(''); setAmount(''); }}>
                                CANCEL
                            </Button>
                            <Button textColor={colors.main_color} onPress={() => {
                                if (person !== '' || amount !== 'R') {
                                    setEditModalVisible(false);
                                    editPerson();
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


{/* Below is for the mark as paid modal */}
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
                        <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold' }}>Mark contact as paid off?</Text>
                        <Text style={{ color: colors.text, fontSize: 20 }}>This will remove the person and all their transactions. Are you sure you'd like to mark this as paid off?</Text>


                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button textColor={colors.main_color} onPress={() => { setPaidModalVisible(false); setPerson(''); setAmount(''); }}>
                                CANCEL
                            </Button>
                            <Button textColor={colors.main_color} onPress={() => {
                                setPaidModalVisible(false);
                                removePerson()
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

export default PersonScreen;