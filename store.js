// to connect and create our store and all the sagas together.
import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {reducer} from './app/models/root-reducer';
import {handler as userSaga} from './app/models/user/sagas';
//this file is managed the store that used in the main app.js
const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(userSaga);

export {store};
