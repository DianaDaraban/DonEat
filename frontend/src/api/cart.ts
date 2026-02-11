import api from '../api.ts'

export const fetchCart = () => api.get('/api/cart/')

export const addToCart = (productId: number, quantity = 1) =>
    api.post('/api/cart/add/', {
        product_id: productId,
        quantity
    })

export const updateCartItem = (itemId: number, quantity: number) =>
    api.patch(`/api/cart/item/${itemId}/`, { quantity })

export const removeCartItem = (itemId: number) =>
    api.delete(`/api/cart/item/${itemId}/delete/`)