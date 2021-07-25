//combine all the reducers we have for each individual model one for the user, one for the comments
//, one forn the posts, ....... .
import {combineReducers} from 'redux';
import {reducer as userReducer} from './user/reducers';

const reducer = combineReducers({
  user: userReducer,
});

export {reducer};
