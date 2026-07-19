import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getContacts, deleteContact } from '../../Services/adminService';

export const fetchContacts = createAsyncThunk('contacts/fetch', getContacts);
export const removeContact = createAsyncThunk('contacts/delete', (id) => deleteContact(id));

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: { list: [], isLoading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.fulfilled, (state, action) => { state.list = action.payload; })
      .addCase(removeContact.fulfilled, (state, action) => {
        state.list = state.list.filter(c => c._id !== action.meta.arg);
      });
  },
});

export default contactsSlice.reducer;