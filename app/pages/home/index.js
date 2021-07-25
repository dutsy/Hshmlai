import React, {useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import {connect} from 'react-redux';
import {GET_ALL_USER_INFO_REQUEST} from '../../models/user/actions';

const mapStateToProps = (state, props) => {//here we can just read the data from the 
  //store without make all the dispatch methods directly
  //instead of ubscribe the same
  const {id, name, email} = state.user; //here we take the data from our store directly from the user reducer
  return {id, name, email};
};
//i have to make an event in this page by it have to call a function in the dispach
//to rebuild the store and reload the data of the components
const mapDispatchToProps = (dispatch, props) => ({//here if we want to make a dispatch after some event we will use this method
  //to map the props to store and actions
  //we have to add the dispatch for each time we need it here and add it in the reducer ......
  getAllUserInfo: () => {
    dispatch({
      type: GET_ALL_USER_INFO_REQUEST,
      payload: {},
    });
  },
});

const HomeView = ({id, name, email, getAllUserInfo, navigation}) => {
  useEffect(() => {
    getAllUserInfo();
  }, [getAllUserInfo]);

  return (
    <View>
      <Text>{id}</Text>
      <Text>{name}</Text>
      <Text>{email}</Text>
    </View>
  );
};

const Home = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeView);

export default Home;