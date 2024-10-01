import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './actions/ProductActions';
import categoriesReducer from './actions/CategoryActions';

const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
  },
});

export default store;