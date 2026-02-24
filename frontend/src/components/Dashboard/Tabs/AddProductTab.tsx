import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import api from '../../../api.ts';
import { Category } from '../../../types/Category.ts';
import LoadingIndicator from '../../LoadingIndicator.tsx';
import styles from '../../Dashboard/styles/AddProductTab.module.scss'

const EMPTY_FORM = {
    title: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    location: '',
    expires_at: '',
    is_donation: false,
    image: ''
} as const;

type ProductForm = {
    title: string;
    description: string;
    price: string | number;
    quantity: string | number;
    category: string | number;
    location: string;
    expires_at: string;
    is_donation?: boolean;
    image?: string | File;
};

function AddProductTab() {
    const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get<Category[]>('/api/categories/')
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value, is_donation: false }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('description', form.description);
            formData.append('price', String(form.price));
            formData.append('quantity', String(form.quantity));
            formData.append('category', String(form.category));
            formData.append('location', form.location);
            formData.append('expires_at', form.expires_at);
            formData.append('is_donation', String(form.is_donation));
            if (form.image instanceof File) {
                formData.append('image', form.image);
            }

            const res = await api.post("/api/admin/products/", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log("Produs adăugat:", res.data);
            alert('Product added successfully!');
            setForm(EMPTY_FORM);
        } catch (err) {
            console.error(err);
            alert(`Error creating product: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.addProductTab}>
            <h2>Adaugă un produs nou</h2>

            <input
                type="text"
                name="title"
                placeholder="Denumire"
                value={form.title}
                onChange={handleChange}
                required
                className={styles.addProductTab__input}
            />

            <textarea
                name="description"
                placeholder="Descriere"
                value={form.description}
                onChange={handleChange}
                required
                className={styles.addProductTab__input}
            />

            <div className={styles.addProductTab__price_container}>
                <input
                    type="number"
                    name="price"
                    placeholder="Preț"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className={styles.addProductTab__price_container__input}
                />
                <div className={`${styles.addProductTab__price_container__donation_container} flex`}>
                    <input
                        type="checkbox"
                        id="isDonation"
                        checked={form.is_donation || false}
                        onChange={(e) => {
                            const checked = e.target.checked;
                            setForm(prev => ({
                                ...prev,
                                is_donation: checked,
                                price: checked ? 0 : prev.price,
                            }));
                        }}
                        className={styles.hidden_checkbox}
                    />
                    <label htmlFor="isDonation" className={styles.addProductTab__price_container__check}>Gratuit / Donație</label>
                </div>

                <input
                    type="number"
                    name="quantity"
                    placeholder="Cantitate"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                    className={styles.addProductTab__price_container__input}
                />
            </div>

            <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
            >
                <option value="">Alege Categorie</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>

            <input
                type="text"
                name="location"
                placeholder="Locație / Adresă"
                value={form.location}
                onChange={handleChange}
                required
            />

            <input
                type="datetime-local"
                name="expires_at"
                value={form.expires_at}
                onChange={handleChange}
                required
            />
            <input
                type="file"
                accept="image/*"
                onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                        setForm(prev => ({ ...prev, image: e.target.files![0] }))
                    }
                }}
            />

            <button type="submit" disabled={loading}>
                {loading ? <LoadingIndicator /> : "Adaugă produs"}
            </button>
        </form>
    );
}

export default AddProductTab