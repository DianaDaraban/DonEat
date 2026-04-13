import './styles/App.css'
import React from 'react'
import { useState, useEffect } from 'react'
import ProductForm from './ProductForm'
import ProductCard from './components/ProductCard'

function App() {
  const [products, setProducts] = useState([])

  const fetchProducts = () => {
    fetch('http://localhost:5000/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err))
  }

  useEffect(() => {
    fetchProducts()
  }, [])


  return (
    <>
      <div className='product-form-container flex'>
        <ProductForm fetchProducts={fetchProducts} />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 grid-flow-row auto-rows-max product_cards_container">
        {products.length > 0 && products.map(product => <ProductCard product={product} />)}
      </div>
    </>
  )
}

export default App
