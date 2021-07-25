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
} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';

import {useTheme} from 'react-native-paper';
import BottomSheet from 'reanimated-bottom-sheet';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';

import Animated from 'react-native-reanimated';
import {template} from '@babel/core';

const AVATAR_SIZE = 70;
const SPACING = 20;

const Project = ({route, navigation}) => {
  const [userData, setData] = React.useState('');
  const [managerData, setmanagerData] = React.useState('');
  const [consreactorData, setconstractorData] = React.useState('');
  const [customerData, setcustomerData] = React.useState('');
  const [userTitle, setUserTitle] = React.useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.projectName,
    });
  }, [navigation]);

  React.useEffect(async () => {
    callData();
  }, []);

  const callData = async () => {
    setUserTitle(await AsyncStorage.getItem('title'));
    let contreatorauth = 0;
    let customerauth = 0;
    try {
      let data = '';
      let response = await fetch(
        'https://hassmalie.herokuapp.com/api/projects/?format=json&id=' +
          route.params.projectId,
      );
      if (response.status !== 200) {
        throw Error("Unable to get data Projects", response.status);
      }
      let json = await response.json();
      if (json.length > 0) {
        for (var i = 0; i < json.length; i++) {
          data = {
            managerID: json[i].manager,
            projectName: json[i].name,
            type: json[i].type_of_building,
            address: json[i].address,
            contractor: json[i].contractor_id,
            architect: json[i].architect_id,
            customer: json[i].customer_id,
            buildingImage: json[i].buildingImage,
            progress: json[i].progress,
            is_closed: json[i].is_closed,
            description: json[i].description,
          };
          if (json[i].buildingImage == null) {
            data.buildingImage =
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3Ww_wvuuXcwzYlmGCZEaebdWiBe6RCJHtIQ&usqp=CAU';
          }
          setData(data);
          contreatorauth = json[i].contractor_id;
          customerauth = json[i].customer_id;
          break;
        }
      } else {
        console.log('hehehehee');
      }
      response = await fetch(
        'https://hassmalie.herokuapp.com/api/users/?format=json&id=' +
          data.managerID,
      );
      if (response.status !== 200) {
        throw Error("Unable to get data users", response.status);
      }
      json = await response.json();
      if (json.length > 0) {
        for (var i = 0; i < json.length; i++) {
          data = {
            firstname: json[i].first_name,
            lastname: json[i].last_name,
            number: json[i].phone_number,
          };
          setmanagerData(data);
          break;
        }
      }

      response = await fetch(
        'https://hassmalie.herokuapp.com/api/workers/?format=json&id=' +
          contreatorauth,
      );
      if (response.status !== 200) {
        throw Error("Unable to get data userData", response.status);
      }
      json = await response.json();
      if (json.length > 0) {
        for (var i = 0; i < json.length; i++) {
          data = {
            firstname: json[i].first_name,
            lastname: json[i].last_name,
            number: json[i].phone_number,
          };

          setconstractorData(data);
          break;
        }
      } else {
        console.log('error in the project page');
      }
      response = await fetch(
        //here i have tomake the user in the link dynamic as he really is
        'https://hassmalie.herokuapp.com/api/customers/?format=json&id=' +
          customerauth,
      );
      if (response.status !== 200) {
        throw Error("Unable to get data userData", response.status);
      }
      json = await response.json();
      if (json.length > 0) {
        for (var i = 0; i < json.length; i++) {
          data = {
            firstname: json[i].first_name,
            lastname: json[i].last_name,
            number: json[i].phone_number,
          };
          setcustomerData(data);
          break;
        }
      } else {
        console.log('helaaaaao');
      }
    } catch (error) {
      console.log('drawer last catch' + error);
    }
  };

  bs = React.createRef();
  fall = new Animated.Value(1);

  //here the image data is locally i have to upload it to the server and change image variable
  //to be from the api call for both camera library
  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
      console.log(image);
      setImage(image.path);
      this.bs.current.snapTo(1);
    });
  };
  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
      console.log(image);
      setImage(image.path);
      this.bs.current.snapTo(1);
    });
  };

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  renderInner = () => (
    <View style={styles.panel}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
      </View>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={takePhotoFromCamera}>
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={choosePhotoFromLibrary}>
        <Text style={styles.panelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => this.bs.current.snapTo(1)}>
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={this.bs}
        snapPoints={[330, 0]}
        renderContent={this.renderInner}
        renderHeader={this.renderHeader}
        initialSnap={1}
        callbackNode={this.fall}
        enabledGestureInteraction={true}
      />
      <Animated.View
        style={{
          margin: 20,
          opacity: Animated.add(0.1, Animated.multiply(this.fall, 1.0)),
        }}>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={() => this.bs.current.snapTo(0)}>
            <View
              style={{
                height: 100,
                width: 100,
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ImageBackground
                source={{
                  uri: userData.buildingImage,
                }}
                style={{height: 200, width: 250}}
                imageStyle={{borderRadius: 15}}>
                {/* <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon
                      name="camera"
                      size={35}
                      color="#fff"
                      style={{
                        opacity: 0.7,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: '#fff',
                        borderRadius: 10,
                      }}
                    />
                  </View> */}
              </ImageBackground>
            </View>
          </TouchableOpacity>
          <Text style={{marginTop: 60, fontSize: 22, fontWeight: 'bold'}}>
            {userData.projectName}
          </Text>
          <View style={{marginTop: 0, fontSize: 22}}>
            <Caption style={styles.caption}>{userData.type}</Caption>
          </View>
        </View>

        <View style={styles.userInfoSection}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: '#777777', fontWeight: 'bold'}}>Manager:</Text>
            <Text style={{color: '#777777', fontSize: 12}}>
              {managerData.firstname} {managerData.lastname},
              {managerData.number}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: '#777777', fontWeight: 'bold'}}>
              Contractor:
            </Text>
            <Text style={{color: '#777777', fontSize: 12}}>
              {consreactorData.firstname} {consreactorData.lastname},
              {consreactorData.number}
            </Text>
          </View>
          {userTitle == 'workers' ? (
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: '#777777', fontWeight: 'bold'}}>
                Customer:
              </Text>
              <Text style={{color: '#777777', fontSize: 12}}>
                {customerData.firstname} {customerData.lastname},
                {customerData.number}
              </Text>
            </View>
          ) : (
            <View></View>
          )}

          <View style={{flexDirection: 'row'}}>
            <Text style={{color: '#777777', fontWeight: 'bold'}}>Address:</Text>
            <Text style={{color: '#777777', fontSize: 12}}>
              {userData.address}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: '#777777', fontWeight: 'bold'}}>
              Progress:
            </Text>
            <Text style={{color: '#777777', fontSize: 12}}>
              {userData.progress}%
            </Text>
          </View>
          {userData.description == null ? (
            <View></View>
          ) : (
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: '#777777', fontWeight: 'bold'}}>About:</Text>
              <Text style={{color: '#777777', fontSize: 12}}>
                {userData.description}
              </Text>
            </View>
          )}
        </View>

        <View>
          <TouchableOpacity
            style={styles.commandButton}
            onPress={() =>
              navigation.navigate('reports', {
                projectId: route.params.projectId,
                projectName: route.params.projectName,
              })
            }>
            <Text style={styles.panelButtonTitle}>Reports</Text>
          </TouchableOpacity>
        </View>
        {userTitle == 'workers' ? (
          <View>
            <TouchableOpacity
              style={styles.commandButton}
              onPress={() =>
                navigation.navigate('projectFiles', {
                  projectId: route.params.projectId,
                  projectName: route.params.projectName,
                })
              }>
              <Text style={styles.panelButtonTitle}>Files</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View></View>
        )}
        <View>
          <View>
            <TouchableOpacity
              style={styles.commandButton}
              onPress={() =>
                navigation.navigate('Payment', {
                  projectId: route.params.projectId,
                  projectName: route.params.projectName,
                })
              }>
              <Text style={styles.panelButtonTitle}>Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default Project;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fcba03',
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
});

// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   Button,
//   TouchableOpacity,
//   ImageBackground,
//   TextInput,
//   StyleSheet,
// } from 'react-native';

// import {useTheme} from 'react-native-paper';
// import BottomSheet from 'reanimated-bottom-sheet';

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Feather from 'react-native-vector-icons/Feather';
// import ImagePicker from 'react-native-image-crop-picker';

// import Animated from 'react-native-reanimated';

// const Project = ({route, navigation}) => {
//   const [image, setImage] = useState(
//     'https://geekculture.co/wp-content/uploads/2020/08/free-anime-on-animelog-youtube-channel-black-jack.jpg',
//   );

//   console.log(route);
//   console.log(route.params);
//   console.log(route.params.projectId);
//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       title: ' dddddde',
//       headerRight: () => (
//         <Button onPress={() => setCount(c => c + 1)} title="Update count" />
//       ),
//     });a
//   }, [navigation]);
//   return (
//     <View style={styles.container}>
//       <View
//         style={{
//           height: 100,
//           width: 100,
//           borderRadius: 15,
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//         <ImageBackground
//           source={{
//             uri: image,
//           }}
//           style={{height: 100, width: 100}}
//           style={{height: 100, width: 100}}
//           imageStyle={{borderRadius: 15}}
//         />
//       </View>
//     </View>
//   );
// };

// export default Project;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
