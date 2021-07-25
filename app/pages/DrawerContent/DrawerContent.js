import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {AuthContext} from '../../models/context';
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';

import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export function DrawerContent(props) {
  const paperTheme = useTheme();
  const {signOut, toggleTheme} = React.useContext(AuthContext);
  const [userData, setData] = React.useState('');

  React.useEffect(async () => {
    callData();
  }, []);

  const callData = async () => {
    try {
      const path = await AsyncStorage.getItem('title');
      const id = await AsyncStorage.getItem('id');
      let urlLink = '';
      if (path == 'customers') {
        urlLink =
          'https://hassmalie.herokuapp.com/api/customers/?format=json&id=' + id;
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
    } catch (error) {
      console.log('drawer last catch' + error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{flexDirection: 'row', marginTop: 15}}>
              <Avatar.Image
                source={{
                  uri: userData.photo,
                }}
                size={50}
              />
              <View style={{marginLeft: 15, flexDirection: 'column'}}>
                <Title style={styles.title}>
                  {userData.first_name} {userData.last_name}
                </Title>
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
                  {userData.title == 'C' && (
                    <Caption style={styles.caption}>Contractor</Caption>
                  )}
                  {userData.title == 'R' && (
                    <Caption style={styles.caption}>Worker</Caption>
                  )}
                  {userData.title == 'A' && (
                    <Caption style={styles.caption}>Architect</Caption>
                  )}
                  {userData.title == null && (
                    <Caption style={styles.caption}>Customer</Caption>
                  )}
                </Caption>
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="home-outline" color={color} size={size} />
              )}
              label="Home"
              onPress={() => {
                props.navigation.navigate('Home');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="account-outline" color={color} size={size} />
              )}
              label="Profile"
              onPress={() => {
                props.navigation.navigate('Profile');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="bookmark-outline" color={color} size={size} />
              )}
              label="Calendar"
              onPress={() => {
                props.navigation.navigate('Calendar');
              }}
            />
          </Drawer.Section>
          <Drawer.Section title="Preferences">
            <TouchableRipple
              onPress={() => {
                toggleTheme();
              }}>
              <View style={styles.preference}>
                <Text>Dark Theme</Text>
                <View pointerEvents="none">
                  <Switch value={paperTheme.dark} />
                </View>
              </View>
            </TouchableRipple>
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Sign Out"
          onPress={() => {
            signOut();
          }}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
