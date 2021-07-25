import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Avatar, Title } from 'react-native-paper';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';

const ITEM_HEIGHT = ScreenHeight * 0.18;
const SPACING = 12;

const Cars = ({ navigation, route }) => {
  const [paymentsList, setPaymentsList] = React.useState('');
  const [totalPays, setTotalPrice] = React.useState(0);
  const [numPayments, setnumPayments] = React.useState(0);
  React.useEffect(async () => {
    callData();
  }, []);

  const callData = async () => {
    try {
      let response = await fetch(
        //here i have tomake the user in the link dynamic as he really is
        'https://hassmalie.herokuapp.com/api/cars/?format=json',
      );
      if (response.status !== 200) {
        throw Error("Unable to get data cars", response.status);
      }
      let json = await response.json();
      let total = 0;
      let temp = '';
      let result = '';
      for (let i = 0; i < json.length; i++) {
        json[i].color = '#' + Math.floor(Math.random() * 1675).toString(16);
        temp = await fetch(
          //here i have tomake the user in the link dynamic as he really is
          'https://hassmalie.herokuapp.com/api/workers/?format=json&email=' +
          json[i].driver_email,
        );
        if (temp.status !== 200) {
          throw Error("Unable to get data userdata", temp.status);
        }
        result = await temp.json();
        if (result.length != 0) {
          json[i].name = result[0].first_name + ' ' + result[0].last_name;
          json[i].title = result[0].title;
          json[i].phone_number = result[0].phone_number;
          json[i].photo = result[0].photo;
        }
        if (json[i].image == null) {
          json[i].image =
            'https://i.pinimg.com/originals/95/69/69/956969895c373bd435ccaf2c2e1de4f2.jpg';
        }
      }
      setTotalPrice(total);
      setPaymentsList(json);
    } catch (error) {
      console.log('payments call data function last catch' + error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={paymentsList}
        keyExtractor={(item, index) => {
          return item.id;
        }}
        contentContainerStyle={{ padding: SPACING }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => { }}
              style={{ marginBottom: SPACING, height: ITEM_HEIGHT }}>
              <View style={{ flex: 1, padding: 5 }}>
                <View
                  style={[
                    StyleSheet.absoluteFillObject,
                    { backgroundColor: '#F8F0E3', borderRadius: 16 },
                  ]}
                />
                <Text style={styles.name}>
                  Driver: {item.name}, Car: {item.company_name}
                </Text>
                <Text style={styles.jobtitle}>
                  License to: {item.license_validity}
                </Text>
                <Text style={styles.jobtitle}>
                  Car Number: {item.license_number}
                </Text>
                <Text style={styles.jobtitle}>{item.description}</Text>
                <Image
                  source={{
                    uri: item.image,
                  }}
                  style={styles.image}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <View style={styles.bg}></View>
    </SafeAreaView>
  );
};

export default Cars;

const styles = StyleSheet.create({
  name: { fontWeight: '700', fontSize: 18 },
  jobtitle: { fontSize: 13, opacity: 0.7, marginTop: 10 },
  dateTitle: { fontSize: 10, opacity: 0.7, marginTop: 0 },
  image: {
    width: ITEM_HEIGHT * 0.8,
    height: ITEM_HEIGHT * 0.8,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 0,
    right: SPACING,
  },
  bg: {
    position: 'absolute',
    backgroundColor: 'red',
    borderRadius: 32,
    height: ScreenHeight,
    width: ScreenWidth,
    transform: [{ translateY: ScreenHeight }],
  },
  userInfoSection: {
    paddingHorizontal: 30,
  },
});

// width,
// height,
// backgroundColor: 'red',
// transform: [{translateY: height}],
