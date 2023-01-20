import { combineReducers, configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import PdfSlice from './Pdf.slice';


const reducers = combineReducers({
    pdf: PdfSlice,
})

const persistConfig = {
    key: 'root',
    storage,
}

export default configureStore({
	reducer: persistReducer(persistConfig, reducers),
	devTools: true,
    middleware: [thunk],
});
