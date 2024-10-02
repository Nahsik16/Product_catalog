import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from './store/actions/CategoryActions';
import { fetchProducts } from './store/actions/ProductActions';
import { useLocation, useNavigate } from 'react-router-dom';
import './index.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const App = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const categories = useSelector((state) => state.categories.categories);
  const [page, setPage] = useState(1);  

  const query = useQuery();
  const navigate = useNavigate();
  const selectedCategory = query.get('category');
  const searchQuery = query.get('search');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({ category: selectedCategory, page, searchQuery }));
  }, [dispatch, selectedCategory, page, searchQuery]);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    const params = new URLSearchParams(query);

    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    navigate({ search: params.toString() });
    setPage(1);  
  };


  const handleSearchChange = (event) => {
    const search = event.target.value;
    const params = new URLSearchParams(query);

    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }

    navigate({ search: params.toString() });
    setPage(1);  
  };
// only searches from the limited products loaded if ,the searched product is not shown try clicking "Load more" button 

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="container">
      <h1>Product Catalog</h1>

      <select onChange={handleCategoryChange} value={selectedCategory || ''}>
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search products..."
        onChange={handleSearchChange}
        defaultValue={searchQuery || ''}
      />

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