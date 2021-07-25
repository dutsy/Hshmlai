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

const AVATAR_SIZE = 70;
const SPACING = 20;

const Reports = ({route, navigation}) => {
  const [tasksList, setTasksList] = React.useState('');
  const [userTitle, setUserTitle] = React.useState('');

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
      setUserTitle(await AsyncStorage.getItem('title'));
      response = await fetch(
        //here i have tomake the user in the link dynamic as he really is
        'https://hassmalie.herokuapp.com/api/tasks/?format=json&project_id=' +
          route.params.projectId,
      );
      if (response.status !== 200) {
        throw Error("Unable to get data tasksList", response.status);
      }
      json = await response.json();
      setTasksList(json);
    } catch (error) {
      console.log('reports page error, ' + error);
    }
  };

  return (
    <View>
      <View style={styles.userInfoSection}>
        <FlatList
          data={tasksList}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => {
            if (item.photo == null) {
              item.photo =
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE8KbunHcRQpi-IvHq2kK2U0SG7ZHXaYslKQ&usqp=CAU';
            }
            if (item.author_type != 'C' && userTitle == 'customers') {
              return <View></View>;
            } else {
              return (
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
                    {
                      <Caption>
                        {item.author_type == 'M' && (
                          <Caption style={{fontSize: 18, fontWeight: '900'}}>
                            Manager
                          </Caption>
                        )}
                        {item.author_type == 'C' && (
                          <Caption style={{fontSize: 18, fontWeight: '900'}}>
                            Customer
                          </Caption>
                        )}
                        {item.author_type == 'D' && (
                          <Caption style={{fontSize: 18, fontWeight: '900'}}>
                            Manager
                          </Caption>
                        )}
                        {item.author_type == 'W' && (
                          <Caption style={{fontSize: 18, fontWeight: '900'}}>
                            Worker
                          </Caption>
                        )}
                        {item.author_type == 'U' && (
                          <Caption style={{fontSize: 18, fontWeight: '900'}}>
                            Manager
                          </Caption>
                        )}
                        <Text style={{fontSize: 12, fontWeight: '400'}}>
                          , {item.date}
                        </Text>
                      </Caption>
                    }
                    <Text style={{fontSize: 12, fontWeight: '300'}}>
                      {item.description}
                    </Text>
                  </View>
                </View>
              );
            }
          }}
        />
      </View>
      <View>
        <TouchableOpacity
          style={styles.scrollView}
          onPress={() =>
            navigation.navigate('addReport', {
              projectId: route.params.projectId,
              projectName: route.params.projectName,
            })
          }>
          <Text style={styles.panelButtonTitle}>Add Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Reports;

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
    alignSelf: 'flex-end',
    right: 20,
    position: 'absolute',
    left:10,
  },
});
