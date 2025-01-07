import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { initialData } from '../constants';
import { User, UserState } from '../interfaces/common.interface';

const currentUser: User = {
  id: '',
  email: '',
  username: '',
  firstName: '',
  lastName: '',
  avatar: undefined
}

const initialState: UserState = {
  users: initialData,
  currentUser,
  loading: false,
  error: null
};

const apiUrl = process.env.REACT_APP_API_URL;

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (options: any) => {
  const { search, pagination } = options;
  const vSearch = search ? search.trim() : null;
  const conditionList = [];
  let queryString = '';
  if (vSearch) {
    conditionList.push(`search=${vSearch}`);
  }
  if (pagination) {
    conditionList.push(`limit=${pagination.limit}`);
    conditionList.push(`page=${pagination.currentPage}`);

  }
  if (conditionList.length > 0) {
    queryString = `?${conditionList.join('&')}`;
  }
  const apiGetUsers = `${apiUrl}${queryString}`;
  const response = await axios.get(apiGetUsers).catch(err => console.log(err));
  return response && response.data ? response.data : initialData;
});

export const fetchUser = createAsyncThunk('users/fetchUser', async (userId: string) => {
  const response = await axios.get(`${apiUrl}/${userId}`);
  return response.data;
});

export const clearUser = createAsyncThunk('clearUser', () => {
  return initialState.currentUser;
});

export const createUser = createAsyncThunk('users/createUser', async (user: User) => {
  const apiGetUsers = apiUrl || ''
  const response = await axios.post(apiGetUsers, user);
  return response.data;
});

export const editUser = createAsyncThunk('users/editUser', async (user: User) => {
  const response = await axios.put(`${apiUrl}/${user.id}`, user);
  return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (userId: string) => {
  await axios.delete(`${apiUrl}/${userId}`);
  return userId;
});

const sliceOptions: any = {
  name: 'user',
  initialState,
  extraReducers: (builder: any) => {
    builder
      .addMatcher(
        (action: any) => action.type.endsWith('/pending'),
        (state: any) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action: any) => action.type.endsWith('/fulfilled'),
        (state: UserState, action: any) => {
          state.loading = false;
          if (action.type.includes('fetchUsers')) {
            const { data = [], total = 5 } = action.payload;
            const { pagination } = action.payload;
            state.users.data = data;
            state.users.total = total;
            state.users.pagination = pagination;
          } else if (action.type.includes('fetchUser')) {
            state.currentUser = action.payload;
          } else if (action.type.includes('clearUser')) {
            state.currentUser = action.payload;
          } else if (action.type.includes('createUser')) {
            state.users.data.push(action.payload);
          } else if (action.type.includes('editUser')) {
            const index = state.users.data.findIndex((user: any) => user.id === action.payload.id);
            if (index !== -1) {
              state.users.data[index] = action.payload;
            }
          } else if (action.type.includes('deleteUser')) {
            state.users.data = state.users.data.filter((user: any) => user.id !== action.payload);
          }
        },
      )
      .addMatcher(
        (action: any) => action.type.endsWith('/rejected'),
        (state: any, action: any) => {
          state.loading = false;
          state.error = action.error.message;
        },
      );
  },
};

const userSlice = createSlice(sliceOptions);

export default userSlice.reducer;
