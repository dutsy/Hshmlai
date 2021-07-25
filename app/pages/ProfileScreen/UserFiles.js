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

import {ScreenHeight, ScreenWidth} from 'react-native-elements/dist/helpers';

const ITEM_HEIGHT = ScreenHeight * 0.18;
const SPACING = 12;
import AsyncStorage from '@react-native-community/async-storage';

const UserFiles = ({route, navigation}) => {
  const [filesList, setFilesList] = React.useState('');

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
      const id = await AsyncStorage.getItem('id');

      response = await fetch(
        'https://hassmalie.herokuapp.com/api/workers/?format=json&id=' + id,
      );
      if (response.status !== 200) {
        throw Error("Unable to get data userFileList", response.status);
      }
      json = await response.json();
      setFilesList(json[0]);
    } catch (error) {
      console.log('reports page error, ' + error);
    }
  };

  return (
    <View>
      <View style={styles.userInfoSection}>
        <View style={styles.userInfoSection}>
          <View style={{flexDirection: 'row', marginTop: 15}}>
            <Avatar.Image
              source={{
                uri: filesList.photo,
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
                {filesList.first_name} {filesList.last_name}
              </Title>
            </View>
          </View>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => Linking.openURL(filesList.id_photo)}
            style={{marginBottom: 12, height: ITEM_HEIGHT}}>
            <View style={{flex: 1, padding: SPACING}}>
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  {backgroundColor: '#2cd', borderRadius: 16},
                ]}
              />
              <Text style={styles.name}>My Id</Text>
              <ImageBackground
                source={{
                  uri: 'https://image.flaticon.com/icons/png/512/201/201567.png',
                }}
                style={{
                  flex: 1,
                  resizeMode: 'cover',
                  justifyContent: 'center',
                }}></ImageBackground>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL(filesList.license)}
            style={{marginBottom: 12, height: ITEM_HEIGHT}}>
            <View style={{flex: 1, padding: SPACING}}>
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  {backgroundColor: '#2cd', borderRadius: 16},
                ]}
              />
              <Text style={styles.name}>My License</Text>
              <ImageBackground
                source={{
                  uri: 'data:image/jpeg;base64,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',
                }}
                style={{
                  flex: 1,
                  resizeMode: 'cover',
                  justifyContent: 'center',
                }}></ImageBackground>
            </View>
          </TouchableOpacity>
          {filesList.permit_validity == null ? (
            <View></View>
          ) : (
            <TouchableOpacity
              onPress={() => Linking.openURL(filesList.permit)}
              style={{marginBottom: 12, height: ITEM_HEIGHT}}>
              <View style={{flex: 1, padding: SPACING}}>
                <View
                  style={[
                    StyleSheet.absoluteFillObject,
                    {backgroundColor: '#2cd', borderRadius: 16},
                  ]}
                />
                <Text style={styles.name}>Enterance</Text>
                <ImageBackground
                  source={{
                    uri: 'data:image/jpeg;base64,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',
                  }}
                  style={{
                    flex: 1,
                    resizeMode: 'cover',
                    justifyContent: 'center',
                  }}></ImageBackground>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default UserFiles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 10,
  },

  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  scrollView: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    position: 'absolute',
    bottom: 20,
    alignSelf: 'flex-end',
    right: 20,
  },
});

// import React from 'react';
// import {View, Text, StyleSheet, Button, Linking} from 'react-native';

// const ProjectFiles = ({route, navigation}) => {
//   React.useEffect(() => {}, []);

//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       title: route.params.projectName,
//       headerBackTitle: 'Back',
//     });
//   }, [navigation]);

//   return (
//     <View>
//       <Button title="mypress" onPress={() => Linking.tel()} />
//     </View>
//   );
// };

// export default ProjectFiles;

{
  /* Linking.openURL(`tel:${phoneNumber}`) */
}
