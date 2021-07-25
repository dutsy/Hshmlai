//main function component of the application, it route the main pages, or to the login page depending on the token
import React, {useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-community/async-storage';
import MainTapScreen from '../pages/MainTapScreen/MainTapScreen';
import RootStackScreen from '../pages/RootStackScreen/RootStackScreen';
import {
  Provider as PaperProvider,
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from 'react-native-paper';

const Drawer = createDrawerNavigator();
import {AuthContext} from '../models/context';

import {DrawerContent} from '../pages/DrawerContent/DrawerContent';
import SupportScreen from '../pages/SupportScreen/SupportScreen';

const Navigation = () => {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333',
    },
  };

  //the dark theme is saved globally in the application
  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff',
    },
  };

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  //check the current page status
  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState,
  );
  //authinticatin the login of the user then route it as needed. as also set the asyncstorgae token if seccess.
  const authContext = React.useMemo(
    () => ({
      signIn: async (userName, password) => {
        let userToken;
        userToken = null;
        try {
          let path = 'workers';
          for (var j = 0; j < 2; j++) {
            let response = await fetch(
              'https://hassmalie.herokuapp.com/api/' +
                path +
                '/?format=json&email=' +
                userName,
            );
            if (response.status !== 200) {
              throw Error("Unable to get data userData", response.status);
            }
            let json = await response.json();
            for (var i = 0; i < json.length; i++) {
              if (
                (json[i].email === userName) &
                (password == json[i].password)
              ) {
                try {
                  userToken = 'email';
                  await AsyncStorage.setItem('userToken', userToken);
                  await AsyncStorage.setItem('id', json[i].id.toString());
                  await AsyncStorage.setItem('email', userName);
                  await AsyncStorage.setItem('title', path);
                  await AsyncStorage.setItem('role', json[i].title);
                } catch (e) {
                  console.log(e + 'inner catch in the router file row 125');
                }
                break;
              }
            }

            path = 'customers';
          }
        } catch (error) {
          console.log('drawer last catch' + error);
        }
        dispatch({type: 'LOGIN', id: userName, token: userToken});
      },
      signOut: async () => {
        try {
          await AsyncStorage.clear();
        } catch (e) {
          console.log(e + 'logout error');
        }
        dispatch({type: 'LOGOUT'});
      },
      signUp: () => {
        setUserToken('email');
        setIsLoading(false);
      },
      toggleTheme: () => {
        setIsDarkTheme(isDarkTheme => !isDarkTheme);
      },
    }),
    [],
  );

  useEffect(() => {
    setTimeout(async () => {
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken', userToken);
      } catch (e) {
        console.log(e);
      }
      dispatch({type: 'REGISTER', token: userToken});
    }, 1000);
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer theme={theme}>
          {loginState.userToken !== null ? (
            <Drawer.Navigator
              drawerContent={props => <DrawerContent {...props} />}>
              <Drawer.Screen name="HomeDrawer" component={MainTapScreen} />
              {/* here can import the pages not included to the tap stack screen */}
            </Drawer.Navigator>
          ) : (
            <RootStackScreen />
          )}
        </NavigationContainer>
      </AuthContext.Provider>
    </PaperProvider>
  );
};

export {Navigation};
