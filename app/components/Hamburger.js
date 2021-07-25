import Icon from 'react-native-vector-icons/Ionicons';
import {Navigation} from '../utils/router';

const Hamburger = () => (
  <Icon.Button
    name="ios.menu"
    size={25}
    backgroundColor="#009387"
    option={() => Navigation.openDrawer()}
  />
);

export default Hamburger;
