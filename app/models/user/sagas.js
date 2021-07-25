// to handle all the asyncrones actions
import {
  GET_ALL_USER_INFO_REQUEST,
  GET_ALL_USER_INFO_REQUEST_SUCCESS,
} from './actions';
import {takeEvery, put, call} from 'redux-saga/effects';
import {queryApi} from '../query-api';

function* handler() {
  // to catch all the actions and make the
  yield takeEvery(GET_ALL_USER_INFO_REQUEST, getAllUserInfo); //to change take every
}
function* getAllUserInfo(action) {
  //to dispatch another
  try {
    const posts = yield call(queryApi, {
      endpoint: '',
      method: 'GET',
    });
    //api call
    yield put({
      //here the store updated after calls the dispatch
      type: GET_ALL_USER_INFO_REQUEST_SUCCESS,
      payload: {
        id: 'id1',
        name: posts[0].last_name,
        email: 'qussay@test.com',
      },
    });
  } catch (err) {
    console.log(err);
    // Handle error
  }
}

export {handler};
