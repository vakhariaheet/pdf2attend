import { createSlice } from '@reduxjs/toolkit';
import { IReduxPDF } from '../types';


const defaultState:IReduxPDF = {
    url: '',
    ocr: [],
    fileName: ''
}

const pdfSlice = createSlice({
    name: 'pdf',
    initialState: defaultState,
    reducers: {
        setPDF(state, action) { 
            const { url, name } = action.payload;
            state.url = url;
            state.fileName = name;
        },
       
        setOCR(state, action) { 
            state.ocr = action.payload;
        },
        updateOCR(state, action) { 
            const { page, row, column, text } = action.payload;
            state.ocr[page][row][column].Text = text
        },
        clearPDF(state) { 
            state.url = '';
            state.ocr = [];
            state.fileName = '';
        }
    }
})
export const { setPDF, setOCR, updateOCR,clearPDF} = pdfSlice.actions;
export default pdfSlice.reducer;