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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from 'react-native-paper';

const AVATAR_SIZE = 70;

import {ScreenHeight, ScreenWidth} from 'react-native-elements/dist/helpers';

const ITEM_HEIGHT = ScreenHeight * 0.18;
const SPACING = 12;
import AsyncStorage from '@react-native-community/async-storage';

const MonthDays = ({navigation}) => {
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
        'https://hassmalie.herokuapp.com/api/reports/?format=json&worker_id=' +
          id,
      );
      if (response.status !== 200) {
        throw Error("Unable to get data reports", response.status);
      }
      json = await response.json();
      response = await fetch(
        'https://hassmalie.herokuapp.com/api/projects/?format=json&worker_id=' +
          id,
      );
      if (response.status !== 200) {
        throw Error("Unable to get data projectdata", response.status);
      }
      projectdata = await response.json();
      for (let i = 0; i < json.length; i++) {
        for (let j = 0; j < projectdata.length; j++) {
          if (json[i].project_id == projectdata[j].id) {
            json[i].projectName = projectdata[j].name;
            json[i].ptojectplace = projectdata[j].address;
            if (json[i].projectimage !=  null) {
              json[i].projectimage = projectdata[j].buildingImage;
            } else {
              json[i].projectimage =
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3Ww_wvuuXcwzYlmGCZEaebdWiBe6RCJHtIQ&usqp=CAU';
            }
            break;
          }
        }
      }
      setFilesList(json);
    } catch (error) {
      console.log('reports page error, ' + error);
    }
  };

  return (
    <View>
      <View style={styles.userInfoSection}>
        <View style={styles.userInfoSection}></View>
        <View>
          <FlatList
            data={filesList}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => {
              return (
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      padding: SPACING,
                      marginBottom: SPACING,
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      borderRadius: 12,
                    }}>
                    <Image
                      source={{uri: item.projectimage}}
                      style={{
                        width: AVATAR_SIZE,
                        height: AVATAR_SIZE,
                        borderRadius: AVATAR_SIZE,
                        marginRight: SPACING / 2,
                      }}
                    />
                    <View>
                      <Text style={{color: '#777777', fontWeight: 'bold'}}>
                        {item.projectName}, {item.ptojectplace}
                      </Text>
                      <Text style={{fontSize: 12, fontWeight: '300'}}>
                        {item.reporting_date}
                      </Text>
                      <Text style={{fontSize: 12, fontWeight: '300'}}>
                        {item.start_time} - {item.end_time}
                      </Text>
                      <Text style={{fontSize: 12, fontWeight: '300'}}>
                        <FontAwesome name="file-text-o" size={20} />{'  '}
                        {item.description}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default MonthDays;

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
