import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import api from '../../../api.ts';
import { Category } from '../../../types/Category.ts';
import LoadingIndicator from '../../LoadingIndicator.tsx';
import styles from '../../Dashboard/styles/AddProductTab.module.scss'
import { useRef } from "react";

const EMPTY_FORM = {
    title: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    location: '',
    expires_at: '',
    is_donation: false,
    image: '',
    original_price: '',
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
    original_price?: string | number;
};

function AddProductTab() {
    const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">("");

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

        setMessage("");
        setMessageType("");

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

            if (form.original_price) {
                formData.append('original_price', String(form.original_price));
            }

            const res = await api.post("/api/admin/products/", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log("Produs adăugat:", res.data);
            setMessage("Produsul a fost adăugat cu succes!");
            setMessageType("success");
            setForm(EMPTY_FORM);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
            console.error(err);
            setMessage("Eroare la adăugarea produsului. Verifică datele introduse.");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    return (
        <form onSubmit={handleSubmit} className={styles.addProductTab}>
            <div className={styles.addProductTab_title}>Adaugă un produs nou</div>

            {message && (
                <div
                    className={`${styles.form_message} ${messageType === "success" ? styles.success : styles.error
                        }`}
                >
                    {message}
                </div>
            )}

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
                <div className={styles.addProductTab__price_container__input_container}>
                    <input
                        type="number"
                        name="price"
                        placeholder="Preț"
                        value={form.price}
                        onChange={handleChange}
                        required
                        className={styles.addProductTab__price_container__input}
                    />
                    <span className={styles.priceSuffix}>Lei</span>
                </div>
                <div className={styles.addProductTab__price_container__input_container}>
                    <input
                        type="number"
                        name="original_price"
                        placeholder="Preț inițial"
                        value={form.original_price}
                        onChange={handleChange}
                        className={styles.addProductTab__price_container__input}
                    />
                    <span className={styles.priceSuffix}>Lei</span>
                </div>

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
                <div className={styles.addProductTab__price_container__input_container}>
                    <input
                        type="number"
                        name="quantity"
                        placeholder="Cantitate"
                        value={form.quantity}
                        onChange={handleChange}
                        required
                        className={styles.addProductTab__price_container__input}
                    />
                    <span className={styles.priceSuffix}>Bucăți</span>
                </div>
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
                className={styles.addProductTab__input}
            />

            <input
                type="datetime-local"
                name="expires_at"
                value={form.expires_at}
                onChange={handleChange}
                required
                className={styles.addProductTab__input}
            />
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                        setForm(prev => ({ ...prev, image: e.target.files![0] }))
                    }
                }}
                className={styles.addProductTab__input}
            />

            <button type="submit" disabled={loading}>
                {loading ? <LoadingIndicator /> : "Adaugă produs"}
            </button>
        </form>
    );
}

export default AddProductTab