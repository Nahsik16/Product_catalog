import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from './store/actions/CategoryActions';
import { fetchProducts } from './store/actions/ProductActions';
import { useLocation, useNavigate } from 'react-router-dom';
import './index.css';

// Hook to get query parameters from URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const App = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const categories = useSelector((state) => state.categories.categories);
  const [page, setPage] = useState(1);  // Track the current page for pagination

  const query = useQuery();
  const navigate = useNavigate();
  const selectedCategory = query.get('category');
  const searchQuery = query.get('search');

  // Fetch categories when component mounts
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Automatically fetch products when category, page, or search query changes
  useEffect(() => {
    dispatch(fetchProducts({ category: selectedCategory, page, searchQuery }));
  }, [dispatch, selectedCategory, page, searchQuery]);

  // Handle category change
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    const params = new URLSearchParams(query);

    // Set or remove 'category' in the URL based on user selection
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    // Update URL and reset to page 1 (since it's a new category)
    navigate({ search: params.toString() });
    setPage(1);  // Reset to first page
  };

  // Handle search query change
  const handleSearchChange = (event) => {
    const search = event.target.value;
    const params = new URLSearchParams(query);

    // Set or remove 'search' in the URL
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }

    // Update URL and reset to page 1 (since it's a new search)
    navigate({ search: params.toString() });
    setPage(1);  // Reset to first page
  };

  // Load more products for pagination
  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="container">
      <h1>Product Catalog</h1>

      {/* Category Filter */}
      <select onChange={handleCategoryChange} value={selectedCategory || ''}>
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search products..."
        onChange={handleSearchChange}
        defaultValue={searchQuery || ''}
      />

      {/* Products List */}
      <div className="products-container">
        {products
          .filter((product) => !selectedCategory || product.category === selectedCategory)
          .filter((product) => !searchQuery || product.title.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.thumbnail} alt={product.title} />
              <h3>{product.title}</h3>
              <p>{product.description}</p>
             {product.brand ?<p><strong>Brand:</strong> {product.brand}</p> :""}
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Rating:</strong> {product.rating}</p>
              <p><strong>Stock:</strong> {product.stock}</p>
            </div>
          ))}
      </div>

      {/* Load More Button */}
      <button onClick={loadMore}>Load More</button>
    </div>
  );
};

export default App;