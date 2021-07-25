import React from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from 'react-native-paper';

const ProfileScreen = ({navigation}) => {
  const [userData, setData] = React.useState('');
  const [userCar, setuserCar] = React.useState('');
  const [userType, setUserType] = React.useState('');

  const callData = async () => {
    try {
      const path = await AsyncStorage.getItem('title');
      const id = await AsyncStorage.getItem('id');
      let urlLink = '';
      if (path == 'customers') {
        urlLink =
          'https://hassmalie.herokuapp.com/api/customers/?format=json&id=' + id;
        setUserType('customers');
      } else {
        urlLink =
          'https://hassmalie.herokuapp.com/api/workers/?format=json&id=' + id;
      }
      let response = await fetch(urlLink);
      if (response.status !== 200) {
        throw Error("Unable to get data userData", response.status);
      }
      let json = await response.json();
      if (json[0].photo == null) {
        json[0].photo =
          'https://www.pngitem.com/pimgs/m/150-1503941_user-windows-10-user-icon-png-transparent-png.png';
      }
      setData(json[0]);

      response = await fetch(
        'https://hassmalie.herokuapp.com/api/cars/?format=json&driver_email=' +
          json[0].email,
      );
      if (response.status !== 200) {
        throw Error("Unable to get data userCar", response.status);
      }
      json = await response.json();
      if (json[0].photo == null) {
        json[0].photo =
          'https://findicons.com/files/icons/2711/free_icons_for_windows8_metro/512/car.png';
      }
      setuserCar(json[0]);
    } catch (error) {
      console.log('drawer last catch' + error);
    }
  };

  React.useEffect(async () => {
    callData();
  }, []);

  const WorkerRole = () => {
    return (
      <Caption style={styles.caption}>
        {userData.title == 'M' && (
          <Caption style={styles.caption}>Manager</Caption>
        )}
        {userData.title == 'D' && (
          <Caption style={styles.caption}>Manager</Caption>
        )}
        {userData.title == 'W' && (
          <Caption style={styles.caption}>Worker</Caption>
        )}
        {userData.title == 'U' && (
          <Caption style={styles.caption}>Customer</Caption>
        )}
      </Caption>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoSection}>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <Avatar.Image
            source={{
              uri: userData.photo,
            }}
            size={80}
          />
          <View style={{marginLeft: 20}}>
            <Title
              style={[
                styles.title,
                {
                  marginTop: 15,
                  marginBottom: 5,
                },
              ]}>
              {userData.first_name} {userData.last_name}
            </Title>
            <WorkerRole />
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <Icon name="map-marker-radius" color="#777777" size={20} />
          <Text style={{color: '#777777', marginLeft: 20}}>
            Address: {userData.address}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="phone" color="#777777" size={20} />
          <Text style={{color: '#777777', marginLeft: 20}}>
            Phone: {userData.phone_number}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="email" color="#777777" size={20} />
          <Text style={{color: '#777777', marginLeft: 20}}>
            Email: {userData.email}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="drama-masks" color="#777777" size={20} />
          <Text style={{color: '#777777', marginLeft: 20}}>
            Age: {userData.age}
          </Text>
        </View>
        {userData.permit_validity != null ? (
          <View></View>
        ) : (
          <View style={styles.row}>
            <Icon name="drama-masks" color="#777777" size={20} />
            <Text style={{color: '#777777', marginLeft: 20}}>
              Enterance Type: {userData.permit_type}, Validate
            </Text>
          </View>
        )}

        {userCar.id > 0 ? (
          <View>
            <View style={styles.row}>
              <Icon name="drama-masks" color="#777777" size={20} />
              <Text style={{color: '#777777', marginLeft: 20}}>
                Car: {userData.age}
              </Text>
            </View>
          </View>
        ) : (
          <View></View>
        )}
      </View>

      <View style={styles.menuWrapper}>
        <TouchableRipple
          onPress={() => {
            navigation.navigate('Home');
          }}>
          <View style={styles.menuItem}>
            <Icon name="office-building" color="#FF6347" size={25} />
            <Text style={styles.menuItemText}>Projects</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple
          onPress={() => {
            navigation.navigate('Contacts');
          }}>
          <View style={styles.menuItem}>
            <Icon name="contacts" color="#FF6347" size={25} />
            <Text style={styles.menuItemText}>Contacts</Text>
          </View>
        </TouchableRipple>
        {userType == 'customers' ? (
          <View></View>
        ) : (
          <View>
            <TouchableRipple
              onPress={() => {
                navigation.navigate('Cars');
              }}>
              <View style={styles.menuItem}>
                <Icon name="car" color="#FF6347" size={25} />
                <Text style={styles.menuItemText}>vehicles</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              onPress={() => {
                navigation.navigate('UserFiles');
              }}>
              <View style={styles.menuItem}>
                <Icon name="account-check-outline" color="#FF6347" size={25} />
                <Text style={styles.menuItemText}>My Files</Text>
              </View>
            </TouchableRipple>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
});
