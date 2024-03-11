
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




function HomeScreen() {

  type Transaction = {
    person: string;
    id: string;
    amount: string;
    type: string;
    date: string;
    contactID: string;
    notes: string;
  };

  type Contact = {
    name: string;
    amount: string;
    id: string;
  }

  const navigation = useNavigation();

  
const [filter, setFilter] = useState('All');

  const [contacts, setContacts] = useState<Contact[]>([]);

  const [paidModal, setPaidModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState('');
  const [person, setPerson] = useState('');
  const [isCredit, setIsCredit] = useState(true);
  var totalBal = 0;
  const [transactionID, setID] = useState('');

  const [description, setDescription] = useState('');

  const isFocused = useIsFocused();


  useEffect(() => {
    return () => {
      setModalVisible(false);
      setPaidModalVisible(false);
      setPerson('');
      setAmount('');
    };
  }, []);

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



  const getContactID = (name: string) => {
    const contact = contacts.find(contact => contact.name === name);
    console.log("CONTACT ID " + contact?.id);
    return contact ? contact.id : null;
  }


  const addTransaction = async (person: string | null, amount: string, isCredit: string | boolean) => {
    try {


      const timeStamp = new Date().getTime();

      // Generate a unique transaction UUID
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

      if (contacts.length > 0 && (person === null || !/^[a-zA-Z]+$/.test(person))) {
        person = contacts[0].name;
      }
      console.log("PERSON |", person + "|")
      // get contact Id
      var ContactID = getContactID(person);

      var dummy_transaction = { "amount": numericalAmount, "date": timeStamp, "contactID": ContactID, "id": transactionID, "person": person, "type": isCredit, "currency": "R", "notes": description }
      // Here we want to fetch this contact and update their contact amount to match the new transaction
      //const selectedContact = contacts.find(contact => contact.name === person);
      //const contactAmount = selectedContact ? selectedContact.amount : '';

      const value = await AsyncStorage.getItem('@PayMeBackStorage')
      if (value !== null) {
        var all_data = JSON.parse(value);
        all_data.transactions.push(dummy_transaction);
        setTransactions(all_data.transactions);
        await AsyncStorage.setItem('@PayMeBackStorage', JSON.stringify(all_data));
        console.debug('Transaction added');
        setPerson('');
        setAmount('');
        setDescription('');
      }

    } catch (e) {
      console.error(e);
    }

  }



  const removeTransaction = async () => {
    try {
      const ID = transactionID;
      const value = await AsyncStorage.getItem('@PayMeBackStorage')
      if (value !== null) {
        var all_data = JSON.parse(value);
        console.debug('id: ' + ID);


        // Remove the transaction with the specified id from the all_data object
        all_data.transactions = all_data.transactions.filter((transaction: { id: string; }) => transaction.id !== ID);

        // Update the transactions state variable
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

  const storeData = async (value: string) => {
    try {
      await AsyncStorage.setItem('@PayMeBackStorage', value)
    } catch (e) {
      // saving error
      console.log(e);
    }
  }

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@PayMeBackStorage')
      if (value !== null) {
        var all_data = JSON.parse(value);
        console.log(all_data)
        setTransactions(all_data.transactions);
        setContacts(all_data.contacts);

      } else {
        // value not found in storage, store sample_transactions
        var sample_data = { "transactions": [{ "amount": "200", "currency": "R", "notes": "test", "date": "123", "id": "#123", "person": "Derick", "type": "credit" }], "contacts": [{ "name": "Derick", "amount": "0", "id": "#8923912" }] }



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




  useEffect(() => {
    if (isFocused) {
      // Do something when the screen is focused
      console.log('Focused Home');
      getData();
    } else {
      // Do something when the screen is unfocused
      console.log('Unfocused Home');
    }
  }, [isFocused]);


  if (loading) {
    return <ActivityIndicator />; // or some other loading indicator
  }

  if (!Array.isArray(transactions)) {
    return <ActivityIndicator />;
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
          <Card style={{ margin: 10 }}>

            <Card.Content>
              <Title style={{ fontWeight: '200' }}>Welcome Back!</Title>
              <Title style={{ fontWeight: 'bold' }}>Here is your total balance:</Title>

              <View style={[styles.block, styles.greenBackground]}>
                <Paragraph style={{ color: colors.text, fontWeight: 'bold', fontSize: 20 }}>{totalBal < 0 ? `-R${Math.abs(totalBal)}` : `R${totalBal}`}</Paragraph>
              </View>
            </Card.Content>
          </Card>
          
          <View style={styles.block}>
            <Title style={{ fontWeight: 'bold' }}>Recent Transactions</Title>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
          <ToggleButton.Row onValueChange={value => setFilter(value)} value={filter}>
  <ToggleButton icon="cash" value="All" />
  <ToggleButton icon="cash-plus" value="credit" />
  <ToggleButton icon="cash-minus" value="debit" />
</ToggleButton.Row>
</View>
<View style={{ height: 10 }}></View>

          {transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter(transaction => filter === 'All' || transaction.type.toLowerCase() === filter.toLowerCase()).map((transaction) => (
            <List.Item
              key={transaction.id}
              title={transaction.person + ' - ' + transaction.type}
              description={"R" + transaction.amount + ' - ' + new Date(transaction.date).toLocaleDateString() + '\n' + transaction.notes}
              style={{ backgroundColor: colors.dark_shade, margin: 5 }}
              titleStyle={{ color: colors.text }}
              descriptionStyle={{ color: colors.text }}
              right={props => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                 
                  <IconButton icon="check" size={20} onPress={() => { setPaidModalVisible(true); setID(transaction.id); console.log(transactionID) }} />
                </View>
              )}
              left={props => (<View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>

                {transaction.type === 'credit' && <FontAwesome name="arrow-up" size={20} color="green" />}
                {transaction.type === 'debit' && <FontAwesome name="arrow-down" size={20} color="red" />}
              </View>)

              }
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
        onPress={() => {
          if (contacts.length === 0) {
            Alert.alert('No contacts', 'Please add some contacts first.');
          } else {
            setModalVisible(true);
          }
        }}
      />
      {/* Modal for adding transactions */}
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
            <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold' }}>Add Transaction</Text>
            <Text style={{ color: colors.text, fontSize: 20 }}>Fill in the details below to add a new transaction</Text>
            <View style={{ height: 20 }}></View>

            <Text style={{ color: colors.text }}>Old Name</Text>
            <View style={{ height: 10 }}></View>
            <Picker
              id='person'
              selectedValue={person}
              onValueChange={(itemValue, itemIndex) => { { setPerson(itemValue); console.log(itemValue) } }}
              style={{ color: colors.text, fontStyle: 'italic', backgroundColor: colors.dark_accent, borderRadius: 5 }}
            >
              {contacts.map((contact) => (
                <Picker.Item key={contact.name} label={contact.name} value={contact.name} />
              ))}
            </Picker>
            <View style={{ height: 20 }} />
            <Text style={{ color: colors.text }}>Amount owed</Text>
            <View style={{ height: 10 }} />
            <TextInput
              placeholder="MONEY HERE"
              id='amount'
              value={amount}
              keyboardType='numeric'
              onChangeText={(text) => setAmount('R' + text.replace(/[^0-9]/g, ''))}
              placeholderTextColor={colors.text}
              style={{ color: colors.text, fontStyle: 'italic', backgroundColor: colors.dark_accent, borderRadius: 5 }}

            />
            {/* here is descriptio text area */}
            <View style={{ height: 20 }} />
            <Text style={{ color: colors.text }}>Additional Info</Text>
            <View style={{ height: 10 }} />
            <TextInput
              placeholder="Extra Note Here..."
              id='description'
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={colors.text}
              style={{ color: colors.text, fontStyle: 'italic', backgroundColor: colors.dark_accent, borderRadius: 5 }}

            />
            <View style={{ height: 20 }} />
            <View>
              
              <RadioButton.Group onValueChange={newValue => setIsCredit(newValue)} value={isCredit}>
  <RadioButton.Item label="Credit - They Owe me" value={true} color={colors.main_color} labelStyle={{color: colors.text}}/>
  <RadioButton.Item label="Debit - I Owe them" value={false} color={colors.main_color} labelStyle={{color: colors.text}}/>
</RadioButton.Group>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button textColor={colors.main_color} onPress={() => { setModalVisible(false); setPerson(''); setAmount(''); }}>
                CANCEL
              </Button>
              <Button textColor={colors.main_color} onPress={() => {
                if (amount !== '') {
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: "10" }}>
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