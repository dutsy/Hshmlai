import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import HomeScreen from '../HomeScreen/HomeScreen';
import CalendarScreen from '../Calendar/Calendar';
import Home from '../home/index';
import ProfileScreen from '../ProfileScreen/ProfileScreen';
import NewsScreen from '../NewsScreen/NewsScreen';
import EditProfileScreen from '../ProfileScreen/EditProfileScreen';
import Cars from '../ProfileScreen/Cars';
import Project from '../HomeScreen/Project';
import WorkDay from '../Calendar/WorkDay';
import Reports from '../HomeScreen/Reports';
import AddReport from '../HomeScreen/AddReport';
import ProjectFiles from '../HomeScreen/ProjectFiles';
import Contacts from '../ProfileScreen/Contacts';
import SettingsScreen from '../SettingsScreen/SettingScreen';
import {useTheme} from 'react-native-paper';
import ReportsScreen from '../ReportsScreen/ReportsScreen';
import Payment from '../HomeScreen/Payment';
import PaymentsListDetails from '../HomeScreen/PaymentsListDetails';
import Edit from '../Calendar/Edit';
import UserFiles from '../ProfileScreen/UserFiles';
import MonthDays from '../Calendar/MonthDays';
const Tab = createMaterialBottomTabNavigator();

const HomeStack = createStackNavigator();
const CalendarStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const MainTabScreen = () => (
  <Tab.Navigator initialRouteName="Home" activeColor="#fff">
    <Tab.Screen
      name="Home"
      component={HomeStackScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarColor: '#009387',
        tabBarIcon: ({color}) => (
          <Icon name="ios-home" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Calendar"
      component={CalendarStackScreen}
      options={{
        tabBarLabel: 'Calendar',
        tabBarColor: '#1f65ff',
        tabBarIcon: ({color}) => (
          <Icon name="calendar" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileStackScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarColor: '#694fad',
        tabBarIcon: ({color}) => (
          <Icon name="ios-person" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        tabBarLabel: 'Contacts',
        tabBarColor: '#d02860',
        tabBarIcon: ({color}) => (
          <Icon name="person-circle" color={color} size={26} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default MainTabScreen;

const ProfileStackScreen = ({navigation}) => {
  const {colors} = useTheme();

  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: colors.background, //ios
          // elevation: '#fff', //android
        },
        headerTintColor: colors.text,
        headerTintStyle: {
          fontWeight: 'bold',
        },
      }}>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerLeft: () => (
            <Icon.Button
              name="ios-menu"
              size={25}
              color={colors.text}
              backgroundColor={colors.background}
              onPress={() => navigation.openDrawer()}
            />
          ),

          headerRight: () => (
            <MaterialCommunityIcons.Button
              name="account-edit"
              size={25}
              color={colors.text}
              backgroundColor={colors.background}
              onPress={() => navigation.navigate('EditProfile')}
            />
          ),
        }}
      />
      <ProfileStack.Screen
        name="Contacts"
        options={{
          title: 'Contacts',
        }}
        component={Contacts}
      />
      <ProfileStack.Screen
        name="EditProfile"
        options={{
          title: 'Edit Profile',
        }}
        component={EditProfileScreen}
      />
      <ProfileStack.Screen
        name="Cars"
        options={{
          title: 'Company Cars',
        }}
        component={Cars}
      />
      <ProfileStack.Screen
        name="UserFiles"
        options={{
          title: 'My Files',
        }}
        component={UserFiles}
      />
    </ProfileStack.Navigator>
  );
};

const HomeStackScreen = ({navigation}) => (
  <HomeStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#009387',
      },
      headerTintColor: '#fff',
      headerTintStyle: {
        fontWeight: 'bold',
      },
    }}>
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        title: 'Home',
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#009387"
            onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
    <HomeStack.Screen
      name="project"
      options={{
        title: 'Edit',
      }}
      component={Project}
    />
    <HomeStack.Screen
      name="reports"
      options={{
        title: 'reports',
      }}
      component={Reports}
    />
    <HomeStack.Screen
      name="addReport"
      options={{
        title: 'reports',
      }}
      component={AddReport}
    />
    <HomeStack.Screen
      name="projectFiles"
      options={{
        title: 'projectFiles',
      }}
      component={ProjectFiles}
    />
    <HomeStack.Screen
      name="Payment"
      options={{
        title: 'Payments',
      }}
      component={Payment}
    />
    <HomeStack.Screen
      name="PaymentsListDetails"
      options={{
        title: 'Payment List',
      }}
      component={PaymentsListDetails}
    />
  </HomeStack.Navigator>
);

const CalendarStackScreen = ({navigation}) => (
  <CalendarStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1f65ff',
      },
      headerTintColor: '#fff',
      headerTintStyle: {
        fontWeight: 'bold',
      },
    }}>
    <CalendarStack.Screen
      name="Calendar"
      component={CalendarScreen}
      options={{
        title: 'Calendar',
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#1f65ff"
            onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
    <CalendarStack.Screen
      name="workDay"
      options={{
        title: 'Report Day',
      }}
      component={WorkDay}
    />
    <CalendarStack.Screen
      name="Edit"
      options={{
        title: 'Edit',
      }}
      component={Edit}
    />
    <CalendarStack.Screen
      name="MonthDays"
      options={{
        title: 'Monthly Reports',
      }}
      component={MonthDays}
    />
  </CalendarStack.Navigator>
);
