import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import BottomSheet from 'reanimated-bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CheckBox, ListItem} from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Animated from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';
import {ScreenHeight, ScreenWidth} from 'react-native-elements/dist/helpers';

import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from 'react-native-paper';

const ITEM_HEIGHT = ScreenHeight * 0.18;
const SPACING = 12;

const Edit = ({route, navigation}) => {
  const [userData, setUserdata] = React.useState('');
  const [projects, setProjects] = React.useState('');
  const [checkedList, setcheckedList] = React.useState({});
  const [startdate, setStartDate] = React.useState(new Date());
  const [enddate, setEndDate] = React.useState(new Date());
  const [secondStartDate, setsecondStartDate] = React.useState('00:00:00');
  const [secondEndDate, setSecondEndDate] = React.useState('00:00:00');
  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(true);
  const [description, setdescription] = React.useState('');
  const [text, setText] = React.useState('');
  const [reportId, setReportId] = React.useState('');

  React.useEffect(async () => {
    callData();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: 'Back',
    });
  }, [navigation]);

  const submitUpdate = () => {
    axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.withCredentials = true;
    const formData = new FormData();
    formData.append('my_business', 1);
    formData.append('worker_id', userData.id);
    formData.append('project_id', text);
    formData.append('reporting_date', route.params.day.dateString);
    formData.append('start_time', secondStartDate);
    formData.append('end_time', secondEndDate);
    formData.append('description', description);

    console.log(formData);
    axios({
      method: 'put',
      url: 'https://hassmalie.herokuapp.com/api/reports/' + reportId.id + '/',
      data: formData,
    })
      .then(Res => {
        console.log('the fetch finished with syccess hahhahaa');
      })
      .catch(err => {
        console.log('err', err.response);
      });
    setTimeout(function () {
      navigation.navigate('Calendar');
    }, 5000);
  };

  const callData = async () => {
    try {
      response = await fetch(
        //here i have tomake the user in the link dynamic as he really is
        'https://hassmalie.herokuapp.com/api/workers/?format=json&id=' +
          (await AsyncStorage.getItem('id')),
      );
      if (response.status !== 200) {
        throw Error("Unable to get data Userdata", response.status);
      }
      json = await response.json();
      if (json[0].photo == null) {
        json[0].photo =
          'https://www.pngitem.com/pimgs/m/150-1503941_user-windows-10-user-icon-png-transparent-png.png';
      }
      setUserdata(json[0]);
      response = await fetch(
        //here i have tomake the user in the link dynamic as he really is
        'https://hassmalie.herokuapp.com/api/projects/?format=json',
      );
      if (response.status !== 200) {
        throw Error("Unable to get data Projects", response.status);
      }
      json = await response.json();
      setProjects(json);
      data = {};
      for (let i = 0; i < json.length; i++) {
        data[json[i].name] = false;
      }
      setcheckedList(data);
      response = await fetch(
        'https://hassmalie.herokuapp.com/api/reports/?format=json&reporting_date=' +
          route.params.day.dateString,
      );
      if (response.status !== 200) {
        throw Error("Unable to get data ReportId", response.status);
      }
      json = await response.json();
      console.log(json);
      setsecondStartDate(json[0].start_time);
      setSecondEndDate(json[0].end_time);
      setReportId(json[0]);
      console.log(json);
    } catch (error) {
      console.log('reports page error, ' + error);
    }
  };

  const onEndChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(Platform.OS === 'ios');
    setEndDate(currentDate);
    setSecondEndDate((currentDate + 'me').split(' ')[4]);
    console.log((currentDate + 'me').split(' ')[4]);
  };

  const onStartChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(Platform.OS === 'ios');
    const temp = (currentDate + 'me').split(' ')[4];
    console.log(temp);
    setsecondStartDate(temp);
    setStartDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfoSection}>
        {/* <View style={{flexDirection: 'row', marginTop: 15}}>
          <Avatar.Image
            source={{
              uri: userData.photo,
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
              {userData.first_name}
              {userData.last_name}
            </Title>
          </View>
        </View> */}

        <View>
          <View style={{left: 50, marginTop: 20}}>
            <Text>Start Time</Text>
            <DateTimePicker
              testID="dateTimePicker"
              value={startdate}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onStartChange}
            />
          </View>
        </View>

        <View>
          <View style={{left: 50, marginTop: 20}}>
            <Text>End Time</Text>
            <DateTimePicker
              testID="dateTimePicker"
              value={enddate}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onEndChange}
            />
          </View>
        </View>

        <View
          style={{
            height: 100,
            width: 200,
            left: 50,
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
            marginBottom: 30,
          }}>
          <View style={styles.action}>
            <FontAwesome name="file-text-o" size={20} />
            <TextInput
              defaultValue={reportId.description}
              onChangeText={text => setdescription(text)}
              multiline
              placeholder={'Description: ' + reportId.description}
              placeholderTextColor="#666666"
              autoCorrect={false}
              style={[styles.textInput]}
            />
          </View>

          <Text style={{marginTop: 30, fontSize: 17, fontWeight: 'bold'}}>
            Projects list
          </Text>

          <View style={{width: 300, left: 35, marginTop: 10}}>
            <FlatList
              data={projects}
              keyExtractor={(item, index) => {
                return item.id;
              }}
              renderItem={({item}) => {
                return (
                  <View style={{marginBottom: 5}}>
                    <View style={{flex: 1, padding: 10}}>
                      <View
                        style={[
                          StyleSheet.absoluteFillObject,
                          {backgroundColor: '#fff', borderRadius: 16},
                        ]}
                      />
                      <Text style={styles.name}>
                        Name: {item.name}, Project Number: {item.id}
                      </Text>
                      <Text style={styles.dateTitle}>
                        Address: {item.address}
                      </Text>

                      <Image
                        source={{
                          uri: item.buildingImage,
                        }}
                        style={styles.image}
                      />
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </View>

        <View
          style={{
            left: 50,
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 5,
          }}>
          <View style={styles.action}>
            <FontAwesome name="file-text-o" size={20} />
            <TextInput
              keyboardType="number-pad"
              onChangeText={text => setText(text)}
              placeholder="Project Number: "
              placeholderTextColor="#666666"
              autoCorrect={false}
              style={[styles.textInput]}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.commandButton} onPress={submitUpdate}>
          <Text style={styles.panelButtonTitle}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Edit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 30,
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
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
    marginTop: 30,
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

//<CheckBox title={item.name} checked={checkedList.name} />

// const Setchecked = () => {
//     const items = [
//       {
//         itemKey: 1,
//         itemDescription: 'Item 1',
//       },
//       {
//         itemKey: 2,
//         itemDescription: 'Item 2',
//       },
//       {
//         itemKey: 3,
//         itemDescription: 'Item 3',
//       },
//     ];

//     let data = {};
//     for (let i = 0; i < projects.length; i++) {
//       data[projects[i].name] = projects[i].name;
//     }
//     return (
//       <View>
//         <PickerCheckBox
//           data={items}
//           headerComponent={<Text style={{fontSize: 25}}>items</Text>}
//           OnConfirm={pItems => this.handleConfirm(pItems)}
//           ConfirmButtonTitle="OK"
//           DescriptionField="itemDescription"
//           KeyField="itemKey"
//           placeholder="select some items"
//           arrowColor="#FFD740"
//           arrowSize={10}
//           placeholderSelectedItems="$count selected item(s)"
//         />
//       </View>
//     );
//   };
