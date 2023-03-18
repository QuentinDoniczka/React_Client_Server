// import React, { useState } from 'react';
// import logo from './logo.svg';
// import './App.css';

// const App = () => {
//   const [msg, setMsg] = useState('');
//   const handleClick = async () => {
//     const data = await window.fetch('/api/v1');
//     const json = await data.json();
//     const msg = json.message;

//     setMsg(msg);
//   }
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <button onClick={(handleClick)}>Click Me!</button>
//         <p>{msg}</p>
//       </header>
//     </div>
//   );
// }

// export default App;



import React from 'react';


class FilterableProductTable extends React.Component {
  state = {
    filterText: '',
    inStockOnly: false,
    isLoading: true,
    products: []
  };

  componentDidMount() {
    fetch('http://localhost:3000/api/products')
      .then(response => response.json())
      .then(data => {
        const products = data.map(row => ({
          category: row.category,
          price: row.price,
          stocked: row.stocked,
          name: row.name
        }));
        this.setState({ products, isLoading: false });
      });
  }

  handleFilterTextChange = filterText => {
    this.setState({ filterText });
  };

  handleInStockOnlyChange = inStockOnly => {
    this.setState({ inStockOnly });
  };

  render() {
    const { filterText, inStockOnly, isLoading, products } = this.state;

    if (isLoading) {
      return(
      <div className="container col-6 my-4">
        <SearchBar
          filterText={filterText}
          inStockOnly={inStockOnly}
          onFilterTextChange={this.handleFilterTextChange}
          onInStockOnlyChange={this.handleInStockOnlyChange}
        />
        <p>Loading...</p>
      </div>
      );
    }

    return (
      <div className="container col-6 my-4">
        <SearchBar
          filterText={filterText}
          inStockOnly={inStockOnly}
          onFilterTextChange={this.handleFilterTextChange}
          onInStockOnlyChange={this.handleInStockOnlyChange}
        />
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ProductTable
            products={products}
            filterText={filterText}
            inStockOnly={inStockOnly}
          />
        )}
      </div>
    );
  }
}
class SearchBar extends React.Component {
  handleFilterText = (e) => {
      this.props.onFilterTextChange(e.target.value)
  }
  handleInStockChange = (e) => {
      this.props.onInStockOnlyChange(e.target.checked)
  }
  render() {
      const { filterText } = this.props
      return (<form className="form">
          <div className="form-group">
              <input
                  value={filterText}
                  onChange={this.handleFilterText}
                  type="text" className="form-control" />
          </div>
          <div className="form-check">
              <input onChange={this.handleInStockChange} className="form-check-input" type="checkbox" id="stock" />
              <label className="form-check-label" htmlFor="stock">Only show products in stock</label>
          </div>
      </form>)
  }
}
class ProductTable extends React.Component {

  render() {
      const { products, filterText, inStockOnly } = this.props
      const rows = []
      let lastCategory = null

      const filteredProducts = products.filter((product) => {
          return (
              //(!inStockOnly || (inStockOnly && product.stocked))
              //!(inStockOnly && !product.stocked)
              (!inStockOnly || product.stocked) &&
              product.name.toLowerCase().includes(filterText.toLowerCase())
          );
      });






      filteredProducts.forEach((filteredProducts) => {

          if (filteredProducts.category !== lastCategory) {
              lastCategory = filteredProducts.category
              rows.push(<ProductCategoryRow key={filteredProducts.category} category={filteredProducts.category} />)
          }
          rows.push(<ProductRow key={filteredProducts.name} product={filteredProducts} />)
      })
      return (<table className="table">
          <thead>
              <tr>
                  <th>Name</th>
                  <th>Price</th>
              </tr>
          </thead>
          <tbody>
              {rows}
          </tbody>
      </table>)
  }
}
class ProductCategoryRow extends React.Component {
  render() {
      const { category } = this.props
      return (
          <tr>
              <th colSpan="2">{category}</th>
          </tr>
      );
  }
}
class ProductRow extends React.Component {
  render() {
      const { product } = this.props
      const name = product.stocked ?
          product.name :
          <span className="text-danger">{product.name}</span>
      return (
          <tr>
              <td>{name}</td>
              <td>{product.price}</td>
          </tr>
      );
  }
}
const App = () => {
  return (
    <div>
      <FilterableProductTable />
    </div>
  );
};

export default App;
