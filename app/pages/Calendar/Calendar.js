//tyhe main page in the application
import React from 'react';
import {
  View,
  StyleSheet,
  Button,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import Modal from 'react-native-modal';
import axios from 'axios';
import {Calendar, Agenda} from 'react-native-calendars';

const AVATAR_SIZE = 70;
const SPACING = 20;

const CalendarScreen = ({navigation}) => {
  const [userReport, setReport] = React.useState('');
  const [userData, setUserdata] = React.useState('');
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [currentDay, setCurrentDay] = React.useState('');
  const [userProjects, setUserProject] = React.useState('');
  const [pressedDay, setpressedDay] = React.useState('');
  const [allCustomerProjects, setAllCustomerProjects] = React.useState('');
  const [allCostomerReports, setAllcustomerReports] = React.useState('');
  const [userType, setUserType] = React.useState('');
  const [customerdaysworks, setcustomerdaysworks] = React.useState('');

  React.useEffect(async () => {
    const unsubscribe = navigation.addListener('focus', () => {
      callData();
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: 'Back',
    });
  }, [navigation]);

  const callData = async () => {
    try {
      response = await fetch(
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
        'https://hassmalie.herokuapp.com/api/reports/?format=json&worker_id=' +
          (await AsyncStorage.getItem('id')),
      );
      if (response.status !== 200) {
        throw Error("Unable to get data Report", response.status);
      }

      json = await response.json();
      setReport(json);
      response = await fetch(
        'https://hassmalie.herokuapp.com/api/projects/?format=json',
      );
      if (response.status !== 200) {
        throw Error("Unable to get data UserProject", response.status);
      }

      json = await response.json();
      setUserProject(json);

      response = await fetch(
        'https://hassmalie.herokuapp.com/api/projects/?format=json&customer_id=' +
          (await AsyncStorage.getItem('id')),
      );
      if (response.status !== 200) {
        throw Error("Unable to get data AllCustomerProjects", response.status);
      }

      json = await response.json();
      setAllCustomerProjects(json);
      response = await fetch(
        'https://hassmalie.herokuapp.com/api/reports/?format=json',
      );
      if (response.status !== 200) {
        throw Error("Unable to get data AllcustomerReports", response.status);
      }

      let tempdata = await response.json();
      setAllcustomerReports(tempdata);
      let data = [];
      for (let i = 0; i < tempdata.length; i++) {
        for (let j = 0; j < json.length; j++) {
          if (tempdata[i].project_id == json[j].id) {
            data.push({
              project_name: json[j].name,
              workedDay: tempdata[i].reporting_date,
              id: i,
            });
          }
        }
      }
      setcustomerdaysworks(data);
      setUserType(await AsyncStorage.getItem('title'));
    } catch (error) {
      console.log('reports page error, ' + error);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const ModalView = () => {
    let projectName = '';
    let currentReport = {};
    let currentProject = 0;
    for (let i = 0; i < userReport.length; i++) {
      if (userReport[i].reporting_date == currentDay) {
        currentProject = userReport[i].project_id;
        currentReport = userReport[i];
        break;
      }
    }

    for (let j = 0; j < userProjects.length; j++) {
      if (userProjects[j].id == currentProject) {
        projectName = userProjects[j].name;
        break;
      }
    }
    if (currentReport.photo == null) {
      currentReport.photo =
        'https://www.pngitem.com/pimgs/m/150-1503941_user-windows-10-user-icon-png-transparent-png.png';
    }
    if (currentReport.id == null) {
      return (
        <View
          style={{
            backgroundColor: '#b8cbf2',
            borderRadius: 10,
            borderWidth: 1,
            padding: SPACING,
          }}>
          <Caption style={{fontSize: 18, color: 'black'}}>
            Did Not Worked in {currentDay}
          </Caption>
        </View>
      );
    } else {
      return (
        <View
          style={{
            backgroundColor: '#b8cbf2',
            borderRadius: 10,
            borderWidth: 1,
          }}>
          <View
            style={{
              flexDirection: 'row',
              padding: SPACING,
              marginBottom: 0,
              borderRadius: 12,
            }}>
            <Image
              source={{uri: currentReport.photo}}
              style={{
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
                borderRadius: 10,
                marginRight: SPACING / 2,
              }}
            />
            <View>
              <Caption
                style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>
                {projectName}
              </Caption>
              <Caption style={{fontSize: 15, fontWeight: '900'}}>
                {currentReport.reporting_date}
              </Caption>
            </View>
          </View>
          <View
            style={{
              padding: 5,
              borderRadius: 10,
              alignItems: 'center',
              marginTop: 10,
              marginBottom: 0,
              borderWidth: 1,
              position: 'absolute',
              bottom: 25,
              alignSelf: 'flex-end',
              right: 50,
            }}>
            <Caption style={{fontSize: 18, fontWeight: '900'}}>
              From: {currentReport.start_time}
            </Caption>
            <Caption style={{fontSize: 18, fontWeight: '900'}}>
              To: {currentReport.end_time}
            </Caption>
          </View>
          <Text style={{margin: 10}}>{currentReport.description} </Text>
        </View>
      );
    }
  };

  const setMarkedDates = () => {
    let data = {};
    for (let i = 0; i < userReport.length; i++) {
      let tempDate = userReport[i].reporting_date;
      data[tempDate] = {marked: true, selectedColor: 'blue'};
    }
    return data;
  };

  const setMarkedDatescustomer = () => {
    let data = {};
    for (let i = 0; i < allCostomerReports.length; i++) {
      for (let j = 0; j < allCustomerProjects.length; j++) {
        if (allCostomerReports[i].project_id == allCustomerProjects[j].id) {
          let tempDate = allCostomerReports[i].reporting_date;
          data[tempDate] = {marked: true, selectedColor: 'blue'};
        }
      }
    }
    return data;
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfoSection}>
        <View style={{flexDirection: 'row', marginTop: 15}}>
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
              {userData.first_name} {userData.last_name}
            </Title>
          </View>
        </View>
      </View>

      {userType == 'workers' ? (
        <View>
          <Calendar
            markedDates={setMarkedDates()}
            maxDate={Date()}
            hideExtraDays={true}
            onDayLongPress={day => {
              navigation.navigate('workDay', {
                day: day,
              });
            }}
            onDayPress={day => {
              setCurrentDay(day.dateString);
              toggleModal();
              setpressedDay(day);
            }}
          />
        </View>
      ) : (
        <View>
          <Calendar
            markedDates={setMarkedDatescustomer()}
            maxDate={Date()}
            hideExtraDays={true}
          />
        </View>
      )}

      <Modal isVisible={isModalVisible}>
        <View>
          <TouchableOpacity onPress={toggleModal}>
            <ModalView />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              toggleModal();
              navigation.navigate('Edit', {
                day: pressedDay,
              });
            }}>
            <Text style={styles.panelButtonTitle}>Edit Report</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {userType == 'workers' ? (
        <View>
          <TouchableOpacity
            style={styles.commandButton}
            onPress={() => {
              navigation.navigate('MonthDays');
            }}>
            <Text style={styles.panelButtonTitle}>Show Month Report</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <FlatList
            style={{paddingHorizontal: 30, marginBottom: 25}}
            data={customerdaysworks}
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
                    <View>
                      <Text style={{color: '#777777', fontWeight: 'bold'}}>
                        {item.project_name}
                      </Text>
                      <Text style={{fontSize: 12, fontWeight: '300'}}>
                        {item.workedDay}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

export default CalendarScreen;

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
