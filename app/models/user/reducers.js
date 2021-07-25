//handle the incoming actions
//i hage to make a reducer for every type of user top save his data to make the code more modolari
import {GET_ALL_USER_INFO_REQUEST_SUCCESS} from './actions';

const initialState = {
  id: 'id1',
  name: 'qussay',
  email: 'qussay@example.com',
  accessToken: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_USER_INFO_REQUEST_SUCCESS: {
      const {id, name, email} = action.payload;//to replace the init state with the returns values from the 
      //payload variable and replace the failer requests ......
      return {
        id,
        name,
        email,
      };
    }
    default:
      return state;
  }
};

export {reducer};
