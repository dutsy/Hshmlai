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
import {Avatar, Title} from 'react-native-paper';
import {ScreenHeight, ScreenWidth} from 'react-native-elements/dist/helpers';

const ITEM_HEIGHT = ScreenHeight * 0.18;
const SPACING = 12;

const Payment = ({navigation, route}) => {
  const [paymentsList, setPaymentsList] = React.useState('');
  const [totalPays, setTotalPrice] = React.useState(0);
  const [numPayments, setnumPayments] = React.useState(0);
  React.useEffect(async () => {
    callData();
  }, []);

  const callData = async () => {
    try {
      let response = await fetch(
        'https://hassmalie.herokuapp.com/api/payments/?format=json',
      );
      if (response.status !== 200) {
        throw Error("Unable to get data payments", response.status);
      }
      let json = await response.json();
      let total = 0;
      for (let i = 0; i < json.length; i++) {
        json[i].id = i + 1;
        json[i].color = '#' + Math.floor(Math.random() * 1675).toString(16);
        json[i].projectId = route.params.projectId;
        total += json[i].total;
      }
      setnumPayments(json.length);
      setTotalPrice(total);
      setPaymentsList(json);
    } catch (error) {
      console.log('payments call data function last catch' + error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.userInfoSection}>
        <View style={{}}>
          <Title
            style={[
              styles.title,
              {
                marginTop: 5,
                marginBottom: 1,
              },
            ]}>
            Total Pays = {totalPays}
          </Title>
          <Title
            style={[
              styles.title,
              {
                marginTop: 5,
                marginBottom: 1,
              },
            ]}>
            Number of Payments = {numPayments}
          </Title>
        </View>
      </View>
      <FlatList
        data={paymentsList}
        keyExtractor={(item, index) => {
          return item.id;
        }}
        contentContainerStyle={{padding: SPACING}}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('PaymentsListDetails', {item});
              }}
              style={{marginBottom: SPACING, height: ITEM_HEIGHT}}>
              <View style={{flex: 1, padding: SPACING}}>
                <View
                  style={[
                    StyleSheet.absoluteFillObject,
                    {backgroundColor: '#F8F0E3', borderRadius: 16},
                  ]}
                />
                <Text style={styles.name}>Total {item.total}</Text>
                <Text style={styles.dateTitle}>{item.payment_date}</Text>
                <Text style={styles.jobtitle}>{item.pay_condition}</Text>
                <Text style={styles.jobtitle}>To: {item.payer_name}</Text>
                <Text style={styles.jobtitle}>{item.pay_type}</Text>
                <Image
                  source={{
                    uri: 'data:image/png;base64,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',
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

export default Payment;

const styles = StyleSheet.create({
  name: {fontWeight: '700', fontSize: 18},
  jobtitle: {fontSize: 13, opacity: 0.7, marginTop: 10},
  dateTitle: {fontSize: 10, opacity: 0.7, marginTop: 0},
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
    transform: [{translateY: ScreenHeight}],
  },
  userInfoSection: {
    paddingHorizontal: 30,
  },
});

// width,
// height,
// backgroundColor: 'red',
// transform: [{translateY: height}],
