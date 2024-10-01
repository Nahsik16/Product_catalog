import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ category, page, searchQuery }, { rejectWithValue }) => {
    const limit = 10;
    let url = `https://dummyjson.com/products?limit=${limit}&skip=${(page - 1) * limit}`;

    if (category) {
      url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${(page - 1) * limit}`;
    }

    if (searchQuery) {
      url += `&q=${searchQuery}`;
    }

    try {
      const { data } = await axios.get(url);
      return data.products; // Return the products array
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create the slice
const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = [...state.products, ...action.payload]; // Append the new batch
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;