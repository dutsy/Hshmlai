import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {ScreenHeight, ScreenWidth} from 'react-native-elements/dist/helpers';

const ITEM_HEIGHT = ScreenHeight * 0.18;
const SPACING = 12;
const TOP_HEADER_HEIGHT = ScreenHeight * 0.3;
const AVATAR_SIZE = 70;

const PaymentsListDetails = ({navigation, route}) => {
  const [bidList, setBidList] = React.useState('');
  const [bidItems, setBidItems] = React.useState('');
  const {item} = route.params;

  React.useEffect(async () => {
    callData();
  }, []);

  const callData = async () => {
    try {
      let response = await fetch(
        //here i have tomake the user in the link dynamic as he really is
        'https://hassmalie.herokuapp.com/api/bids/?format=json&id=' +
          item.bid_id,
      );
      if (response.status !== 200) {
        throw Error("Unable to get data bidList", response.status);
      }
      let json = await response.json();
      setBidList(json[0]);
      response = await fetch(
        //here i have tomake the user in the link dynamic as he really is
        'https://hassmalie.herokuapp.com/api/bid-table/?format=json&bid_id=' +
          item.bid_id,
      );
      if (response.status !== 200) {
        throw Error("Unable to get data bidItems", response.status);
      }
      json = await response.json();
      setBidItems(json);
    } catch (error) {
      console.log('payments call data function last catch' + error);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerStyle: {
        backgroundColor: item.color,
        shadowRadius: 0,
        shadowOffset: {
          height: 0,
        },
      },
    });
  }, [navigation]);

  return (
    <View style={{felx: 1}}>
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: item.color,
            borderRadius: 0,
            height: TOP_HEADER_HEIGHT + 32,
          },
        ]}
      />
      <Text style={styles.name}>{item.pay_type}</Text>
      <TouchableOpacity onPress={() => Linking.openURL(bidList.photo)}>
        <Image
          source={{
            uri: bidList.photo,
          }}
          style={styles.image}
        />
      </TouchableOpacity>

      <View style={styles.bg}>
        <FlatList
          data={bidItems}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => {
            return (
              <View style={{marginVertical: SPACING}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {/* <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 3,
                      backgroundColor: 'gold',
                      marginRight: SPACING,
                    }}></View> */}
                  <Image
                    source={{
                      uri: 'https://i.pinimg.com/originals/a5/11/70/a511707377b4332b85a8d90fbcfb20fe.jpg',
                    }}
                    style={{
                      width: AVATAR_SIZE / 2,
                      height: AVATAR_SIZE / 2,
                      borderRadius: AVATAR_SIZE,
                      marginRight: SPACING / 2,
                    }}
                  />
                  <View>
                    <Text style={styles.subName}>
                      Type: {item.type}, Quantity: {item.count}
                    </Text>
                    <Text style={styles.jobtitle}>
                      Total Price: {item.total_item_price}, Piece Price:{' '}
                      {item.price}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};
export default PaymentsListDetails;

const styles = StyleSheet.create({
  name: {
    fontWeight: '700',
    fontSize: 20,
    position: 'absolute',
    top: TOP_HEADER_HEIGHT - SPACING * 3,
    left: SPACING * 1,
  },
  subName: {
    fontWeight: '700',
    fontSize: 13,
  },
  jobtitle: {fontSize: 11, opacity: 0.7},
  image: {
    width: ITEM_HEIGHT * 0.8,
    height: ITEM_HEIGHT * 0.8,
    resizeMode: 'contain',
    position: 'absolute',
    top: TOP_HEADER_HEIGHT - ITEM_HEIGHT * 0.8 + 20,
    right: SPACING + 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  bg: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 32,
    height: ScreenHeight,
    width: ScreenWidth,
    transform: [{translateY: TOP_HEADER_HEIGHT}],
    padding: SPACING,
    paddingTop: 32 + SPACING,
  },
});

// {category.map((single, index) => {
//     return (
//       <View key={single.id} style={{flexDirection: 'row'}}>
//         <View
//           style={{
//             height: 10,
//             width: 10,
//             borderRadius: 3,
//             backgroundColor: 'gold',
//             marginRight: SPACING,
//           }}>
//           <Text style={styles.title}>{single.type}</Text>
//         </View>
//       </View>
//     );
//   })}
