import React, {useState} from 'react';
import {
  View,
  Button,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
  ScrollView,
  Linking,
} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';

const AVATAR_SIZE = 70;
const SPACING = 20;

const Contacts = ({navigation}) => {
  const [usersInfo, setUserInfo] = React.useState('');
  const [usertitle, setUserTitle] = React.useState('');

  React.useEffect(async () => {
    callData();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: 'Back',
    });
  }, [navigation]);

  const callData = async () => {
    try {
      response = await fetch(
        'https://hassmalie.herokuapp.com/api/workers/?format=json&my-business=1',
      );
      if (response.status !== 200) {
        throw Error("Unable to get data userInfo", response.status);
      }
      json = await response.json();
      setUserInfo(json);
    } catch (error) {
      console.log('reports page error, ' + error);
    }
  };
  

  return (
    <View>
      <View style={styles.userInfoSection}>
        <FlatList
          data={usersInfo}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => {
            if (item.photo == null) {
              item.photo =
                'https://www.pngitem.com/pimgs/m/150-1503941_user-windows-10-user-icon-png-transparent-png.png';
            }
            return (
              <View>
                <View style={styles.listItem}>
                  <Image
                    source={{uri: item.photo}}
                    style={{width: 60, height: 60, borderRadius: 30}}
                  />
                  <View style={{alignItems: 'center', flex: 1}}>
                    <Text style={{fontWeight: 'bold'}}>
                      {item.first_name} {item.last_name}
                    </Text>
                    <Caption style={styles.caption}>
                      {item.title == 'M' && (
                        <Caption style={styles.caption}>Manager</Caption>
                      )}
                      {item.title == 'D' && (
                        <Caption style={styles.caption}>Manger</Caption>
                      )}
                      {item.title == 'W' && (
                        <Caption style={styles.caption}>Worker</Caption>
                      )}
                      {item.title == 'C' && (
                        <Caption style={styles.caption}>Contractor</Caption>
                      )}
                      {item.title == 'R' && (
                        <Caption style={styles.caption}>Worker</Caption>
                      )}
                      {item.title == 'A' && (
                        <Caption style={styles.caption}>Architect</Caption>
                      )}
                      {item.title == null && (
                        <Caption style={styles.caption}>Customer</Caption>
                      )}
                    </Caption>
                  </View>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`tel:${item.phone_number}`)}
                    style={{
                      height: 50,
                      width: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{color: 'green'}}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => Linking.openURL('mailto:' + item.email)}
                    style={{
                      height: 50,
                      width: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{color: 'green'}}>Mail</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

export default Contacts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    marginTop: 60,
  },
  listItem: {
    margin: 10,
    padding: 10,
    backgroundColor: '#FFF',
    width: '80%',
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 5,
  },
});
