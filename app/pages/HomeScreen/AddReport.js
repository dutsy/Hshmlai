import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
} from 'react-native';
import axios from 'axios';

import AsyncStorage from '@react-native-community/async-storage';

import {useTheme} from 'react-native-paper';
import BottomSheet from 'reanimated-bottom-sheet';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';

import Animated from 'react-native-reanimated';
import {NavigationActions} from 'react-navigation';

const EditProfileScreen = ({route, navigation}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [userData, setUserData] = useState('');
  const [currentdate, setcurrentdate] = React.useState('');
  const [currentHour, setcurrentHour] = React.useState('');
  const [text, setText] = React.useState('');

  React.useEffect(async () => {
    callData();
  }, []);

  const callData = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('email');
      const path = await AsyncStorage.getItem('title');
      let response = await fetch(
        'https://hassmalie.herokuapp.com/api/' +
          path +
          '/?format=json&email=' +
          userEmail,
      );
      let json = await response.json();
      if (json[0].title == null || json[0].title == undefined) {
        json[0].title = 'C';
      }
      setUserData(json);
      var date = new Date().getDate();
      var month = new Date().getMonth() + 1;
      var year = new Date().getFullYear();
      setcurrentdate((year + '-' + month + '-' + date).toString());
      var hours = new Date().getHours();
      if (hours.toString().length == 1) {
        hours = '0' + hours.toString();
      }
      var min = new Date().getMinutes();
      if (min.toString().length == 1) {
        min = '0' + min.toString();
      }
      var sec = new Date().getSeconds();
      if (sec.toString().length == 1) {
        sec = '0' + sec.toString();
      }
      setcurrentHour((hours + ':' + min + ':' + sec).toString());
    } catch (error) {
      console.log('payments call data function last catch' + error);
    }
  };

  const [image, setImage] = useState(
    'https://img.icons8.com/plasticine/2x/image.png',
  );
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
      setSelectedImage(image);
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
      setSelectedImage(image);
      setImage(image.path);
      this.bs.current.snapTo(1);
    });
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.projectName,
      headerBackTitle: 'Back',
    });
  }, [navigation]);

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  const submitUpdate = () => {

    if (!selectedImage) {
      alert("Please select an image")
      return;
    }
    if (!text) {
      alert("Please enter description")
      return;
    }

    axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.withCredentials = true;
    const formData = new FormData();
    formData.append('my_business', 1);
    formData.append('author_type', userData[0].title);
    formData.append('author_id', userData[0].id);
    formData.append('project_id', route.params.projectId);
    formData.append('date', currentdate);
    formData.append('time', currentHour);
    formData.append('description', text);
    formData.append('photo', {
      name: selectedImage.filename,
      type: selectedImage.mime,
      uri:
        Platform.OS === 'android'
          ? selectedImage.sourceURL
          : selectedImage.sourceURL.replace('file://', ''),
    });

    console.log(formData);
    axios({
      method: 'post',
      url: 'https://hassmalie.herokuapp.com/api/tasks/',
      data: formData,
    })
      .then(Res => {
        console.log('the fetch finished with syccess hahhahaa');
      })
      .catch(err => {
        console.log('err', err.response);
      });
    navigation.navigate('project');
  };

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
                  uri: image,
                }}
                style={{height: 120, width: 120}}
                imageStyle={{borderRadius: 15}}>
                <View
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
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
          <Text style={{marginTop: 10, fontSize: 18, fontWeight: 'bold'}}>
            Add Image
          </Text>
        </View>

        <View style={styles.action}>
          <FontAwesome name="file-text-o" color={colors.text} size={20} />
          <TextInput
            onChangeText={text => setText(text)}
            multiline
            placeholder="Description"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
          />
        </View>

        <TouchableOpacity style={styles.commandButton} onPress={submitUpdate}>
          <Text style={styles.panelButtonTitle}>Submit</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default EditProfileScreen;

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
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
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
