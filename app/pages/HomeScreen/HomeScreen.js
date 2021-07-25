import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Animated,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Genres from './Genres';
import Rating from './Rating';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';

import {useTheme} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const AVATAR_SIZE = 70;
const SPACING = 10;
const ITEM_SIZE = width * 0.72;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;

const HomeScreen = ({navigation}) => {
  const {colors} = useTheme();
  const theme = useTheme();
  const [managedProjects, setmanagedProjects] = React.useState('');

  const Loading = () => (
    <View style={styles.loadingContainer}>
      <Text style={styles.paragraph}>Loading...</Text>
    </View>
  );

  const scrollX = React.useRef(new Animated.Value(0)).current;

  const callData = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('email');
      const path = await AsyncStorage.getItem('title');
      const id = await AsyncStorage.getItem('id');
      const role = await AsyncStorage.getItem('role');
      let urlLink = '';
      if (path == 'customers') {
        urlLink =
          'https://hassmalie.herokuapp.com/api/projects/?format=json&customer_id=' +
          id;
      } else if (role == 'C') {
        urlLink =
          'https://hassmalie.herokuapp.com/api/projects/?format=json&contractor_id=' +
          id;
      } else {
        urlLink = 'https://hassmalie.herokuapp.com/api/projects/?format=json';
      }
      try {
        let response = await fetch(urlLink);
        if (response.status !== 200) {
          throw Error("Unable to get data managedProjects", response.status);
        }
        let json = await response.json();
        setmanagedProjects([
          {id: 'left-spacer'},
          ...json,
          {id: 'right-spacer'},
        ]);
      } catch (error) {
        console.log('drawer catch' + error);
      }
    } catch (error) {
      console.log('drawer last catch' + error);
    }
  };

  React.useEffect(async () => {
    callData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Image
          source={{
            uri: 'https://wallpapercave.com/wp/wp3613266.jpg',
          }}
          style={StyleSheet.absoluteFillObject}></Image>

        <Animated.FlatList
          showsVerticalScrollIndicator={false}
          data={managedProjects}
          keyExtractor={(item, index) => {
            return item.id;
          }}
          horizontal
          contentContainerStyle={{alignItems: 'center'}}
          snapToInterval={ITEM_SIZE}
          decelerationRate={0}
          bounces={false}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: false},
          )}
          scrollEventThrottle={16}
          renderItem={({item, index}) => {
            // if i make !item.buildingImage it will delete al the projects without image
            if (item.id == 'right-spacer' || item.id == 'left-spacer') {
              return <View style={{width: EMPTY_ITEM_SIZE}} />;
            }

            const inputRange = [
              (index - 2) * ITEM_SIZE,
              (index - 1) * ITEM_SIZE,
              index * ITEM_SIZE,
            ];

            const translateY = scrollX.interpolate({
              inputRange,
              outputRange: [0, -50, 0],
            });
            if (item.buildingImage == null) {
              item.buildingImage =
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3Ww_wvuuXcwzYlmGCZEaebdWiBe6RCJHtIQ&usqp=CAU';
            }
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('project', {
                    projectId: item.id,
                    projectName: item.name,
                  })
                }>
                <View style={{width: ITEM_SIZE}}>
                  <Animated.View
                    style={{
                      marginHorizontal: SPACING,
                      padding: SPACING * 2,
                      alignItems: 'center',
                      backgroundColor: 'white',
                      borderRadius: 34,
                      transform: [{translateY}],
                    }}>
                    <Image
                      source={{uri: item.buildingImage}}
                      style={styles.posterImage}
                    />
                    <Text style={{fontSize: 24}} numberOfLines={1}>
                      {item.type_of_building}
                    </Text>

                    <Text style={{fontSize: 12}} numberOfLines={3}>
                      {item.address}
                    </Text>
                  </Animated.View>
                </View>
              </TouchableOpacity>
            );
          }}></Animated.FlatList>
      </View>
    </View>
  );
};

export default HomeScreen;

{
  /* <StatusBar barStyle= { theme.dark ? "light-content" : "dark-content" }/> */
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  posterImage: {
    width: '100%',
    height: ITEM_SIZE * 1.2,
    resizeMode: 'cover',
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
});

// <FlatList showsVerticalScrollIndicator={false}
//       data={managedProjects}
//       keyExtractor={(item) => item.key}
//       horizontal
//       contentContainerStyle={{alignItems:'center',}}
//       renderItem={({item}) => {
//         return(
//           <View style={{width:ITEM_SIZE }} >
//             <View style={{marginHorizontal : SPACING,
//             padding: SPACING * 2,
//             alignItems: 'center',
//             backgroundColor: 'white',
//             borderRadius: 34,}}>

//             <Image source={{uri: item.buildingImage}}
//               style={styles.posterImage} />
//               <Text style={{ fontSize: 24 }} numberOfLines={1}>
//                   {item.type_of_building}
//                 </Text>
//                 <Rating rating={item.id} />
//                 <Genres genres={item.id} />
//                 <Text style={{ fontSize: 12 }} numberOfLines={3}>
//                   {item.type_of_building}
//                 </Text>
//                 </View>
//             </View>
//         )

//       }} >
//       </FlatList>
