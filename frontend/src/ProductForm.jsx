import './styles/ProductForm.css'

function ProductForm({ fetchProducts }) {
    function handleSubmit(event) {
        event.preventDefault()
        const form = event.target
        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())

        fetch('http://localhost:5000/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) })
                }
                return response.json()
            })
            .then(() => {
                form.reset()
                fetchProducts()  // Re-fetch lista actualizată
            })
            .catch(error => console.error('Error:', error))
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className='flex flex-wrap form_inputs_container'>
                <div className="input_container">
                    <label htmlFor="productName">Product Name:</label>
                    <input type="text" id="productName" name="productName" required />
                </div>
                <div className="input_container">
                    <label htmlFor="price">Price:</label>
                    <input type="number" id="price" name="price" required />
                </div>

                <div className="input_container">
                    <label htmlFor="vendorName">Vendor Name:</label>
                    <input type="text" id="vendorName" name="vendorName" required />
                </div>
                <div className="input_container">
                    <label htmlFor="productDescription">Product Description:</label>
                    <input type="text" id="productDescription" name="productDescription" />
                </div>
                <div className="input_container">
                    <label htmlFor="warrantyDate">Warranty Date:</label>
                    <input type="date" id="warrantyDate" name="warrantyDate" />
                </div>

            </div>
            <button type="submit" className='form_submit_btn'>Add Product</button>
        </form>
    )
}

export default ProductForm