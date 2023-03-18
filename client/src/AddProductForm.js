import React, { useState } from 'react';
import axios from 'axios';

const AddProductForm = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stocked, setStocked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = { name, category, price, stocked };
    
    try {
      await axios.post('/api/products', newProduct);
      // Si la requête a réussi, vous pouvez réinitialiser le formulaire ici.
      setName('');
      setCategory('');
      setPrice('');
      setStocked(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
    }
  };

  const isValidForm = () => {
    return name !== '' && category !== '' && price !== '';
  };

  return (
    <div className="container col-6">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="text"
            id="price"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            id="stocked"
            className="form-check-input"
            checked={stocked}
            onChange={(e) => setStocked(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="stocked">
            In stock
          </label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={!isValidForm()}>
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
