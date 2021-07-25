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

const ProjectFiles = ({route, navigation}) => {
  const [filesList, setFilesList] = React.useState('');
  const [usertitle, setUserTitle] = React.useState('');

  React.useEffect(async () => {
    callData();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.projectName,
      headerBackTitle: 'Back',
    });
  }, [navigation]);

  const callData = async () => {
    try {
      response = await fetch(
        //here i have tomake the user in the link dynamic as he really is
        'https://hassmalie.herokuapp.com/api/projects-files/?format=json&project_id=' +
          route.params.projectId,
      );
      if (response.status !== 200) {
        throw Error("Unable to get data FilesList", response.status);
      }
      json = await response.json();
      setFilesList(json);
    } catch (error) {
      console.log('reports page error, ' + error);
    }
  };

  return (
    <View>
      <View style={styles.userInfoSection}>
        <FlatList
          data={filesList}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => {
            if (item.file != null) {
              if (item.file.includes('pdf')) {
                item.photo =
                  'data:image/png;base64,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';
              }
              if (item.file.includes('png')) {
                item.photo = item.file;
              }
              if (item.file.includes('mp4')) {
                item.photo =
                  'https://st3.depositphotos.com/16781356/36424/v/450/depositphotos_364241816-stock-illustration-video-icon-logo-vector-illustration.jpg';
              }
              if (item.file.includes('JPG')) {
                item.photo = item.file;
              }
              if (item.file.includes('jpg')) {
                item.photo = item.file;
              }
            }
            return (
              <View>
                <TouchableOpacity onPress={() => Linking.openURL(item.file)}>
                  <View
                    style={{
                      flexDirection: 'row',
                      padding: SPACING,
                      marginBottom: SPACING,
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      borderRadius: 12,
                    }}>
                    <Image
                      source={{uri: item.photo}}
                      style={{
                        width: AVATAR_SIZE,
                        height: AVATAR_SIZE,
                        borderRadius: AVATAR_SIZE,
                        marginRight: SPACING / 2,
                      }}
                    />
                    <View>
                      <Text style={{color: '#777777', fontWeight: 'bold'}}>
                        {item.name}
                      </Text>
                      <Text style={{fontSize: 12, fontWeight: '300'}}>
                        {item.description}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

export default ProjectFiles;

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
