import React from 'react';
import {store} from './store';
import {Provider} from 'react-redux';
import {App} from './app/index';
//make the provider store of the appliaction that i used to save some global data. that all pages have access to it 
//then redirect it to the app component
const Root = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default Root;
