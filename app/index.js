import React from 'react';
import {View} from 'react-native';
import {Navigation} from './utils/router';
//the enterncy component of the application that rediredt us to the router
const App = ({}) => (
  <View style={{flex: 1, flexDirection: 'column'}}>
    <Navigation />
  </View>
);

export {App};