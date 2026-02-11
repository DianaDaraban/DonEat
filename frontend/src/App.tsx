import { Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Login from './pages/auth/Login.tsx'
import Register from "./pages/auth/Register.tsx"
import Home from "./pages/Home/Home.tsx"
import NotFound from "./pages/NotFound.tsx"
import ProtectedRoute from "./components/ProtectedRoute.tsx"
import Dashboard from "./pages/dashboard/Dashboard.tsx"
import Navbar from "./components/Navbar/Navbar.tsx"
import { ProductFilters } from "./types/productFilters.ts"
import { ProductPublic } from "./types/Product.ts"
import { ProductOrder } from "./constants/productOrder.ts"
import CartPage from "./pages/cart/CartPage.tsx"

const API_URL = import.meta.env.VITE_API_URL;

function Logout() {
  localStorage.clear()
  return <Navigate to='/login' />
}


// function RegisterAndLogout() {
//   localStorage.clear()
//   return <Register />
// }

function App() {
  const [filters, setFilters] = useState<ProductFilters>({
    category: undefined,
    priceMax: undefined,
    minQuantity: 1,
    availableUntil: undefined,
    location: undefined,
    maxDistanceKm: undefined
  });
  const [orderBy, setOrderBy] = useState<ProductOrder>('newest')
  const [products, setProducts] = useState<ProductPublic[]>([]);
  const [allProducts, setAllProducts] = useState<ProductPublic[]>([]);




  const buildProductsUrl = (filters: ProductFilters) => {
    const params = new URLSearchParams();

    for (const key in filters) {
      const value = filters[key as keyof ProductFilters];
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v.toString()));
      } else if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    }

    return `${API_URL}/api/products/?${params.toString()}`;
  };


  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/`);
        const data: ProductPublic[] = await res.json();
        setAllProducts(data);
        setProducts(data);
      } catch (err) {
        console.log(err)
      }
    }

    fetchAllProducts();
  }, [])

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        const url = buildProductsUrl(filters);
        const res = await fetch(url);
        if (!res.ok) return;

        const data: ProductPublic[] = await res.json();
        setProducts(data);
      } catch (error) {
        console.log(error)
      }
    }

    fetchFilteredProducts();
  }, [filters]);


  return (
    <>
      <Navbar
        filters={filters}
        setFilters={setFilters}
        setOrderBy={setOrderBy}
        allProducts={allProducts}
      />
      <Routes>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Home
          products={products}
          orderBy={orderBy}
        />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
