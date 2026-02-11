import { useState, useEffect } from "react"
import api from "../../../api.ts"
import { ProductAdmin } from "../../../types/ProductAdmin.ts"
import LoadingIndicator from "../../LoadingIndicator.tsx";
import styles from '../../Dashboard/styles/MyProductsTab.module.scss'
import { Trash, RotateCcw, SquarePen, Save, X, ChevronDown, ChevronUp } from 'lucide-react'

function MyProductsTab() {
    const [products, setProducts] = useState<ProductAdmin[]>([])
    const [loading, setLoading] = useState(true)
    const [openReactivateOptions, setOpenReactivateOptions] = useState(false)
    const [openDetailsId, setOpenDetailsId] = useState<number | null>(null)
    const [editingProduct, setEditingProduct] = useState<ProductAdmin | null>(null)
    const [newExpireDate, setNewExpireDate] = useState('')
    const [editForm, setEditForm] = useState<Partial<ProductAdmin> & { image?: File | string }>({})

    useEffect(() => {
        let mounted = true

        api.get<ProductAdmin[]>('/api/admin/products')
            .then(res => {
                if (mounted) setProducts(res.data)
            })
            .finally(() => {
                if (mounted) setLoading(false)
            })

        return () => {
            mounted = false
        }
    }, [])

    const startEditing = (product: ProductAdmin) => {
        setEditingProduct(product)
        setEditForm({
            title: product.title,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            location: product.location,
            expires_at: new Date(product.expires_at).toISOString().slice(0, 16)
        })
    }

    const handleSaveEdit = async (product: ProductAdmin) => {
        try {
            const payload = { ...editForm }
            if (product.is_donation && payload.price && Number(payload.price) !== 0) {
                payload.is_donation = false
            }

            const formData = new FormData()

            for (const key in payload) {
                if (payload[key as keyof typeof payload] !== undefined) {
                    formData.append(
                        key,
                        payload[key as keyof typeof payload] as string | Blob
                    )
                }
            }

            const res = await api.patch(`/api/admin/products/${product.id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            setProducts(prev => prev.map(p => p.id === product.id ? res.data : p))
            console.log(editForm, products)
            setEditingProduct(null)
        } catch (err) {
            alert(`Error updating product: ${err}`)
        }
    }


    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want th delete this product?')) return

        await api.delete(`/api/admin/products/${id}/`)
        setProducts(prev => prev.filter(p => p.id !== id))
    }


    const handleReactivate = async (product: ProductAdmin) => {
        console.log(newExpireDate, new Date(newExpireDate).toISOString(), product)
        if (!newExpireDate) {
            alert('Please select a new expiration date')
            return
        }

        await api.patch(`/api/admin/products/${product.id}/`, {
            expires_at: new Date(newExpireDate).toISOString(),
            is_available: true
        })

        setEditingProduct(null)
        setNewExpireDate('')
        setProducts(prev => prev.map(p => p.id === product.id ?
            { ...p, expires_at: new Date(newExpireDate).toISOString(), is_available: true }
            : p))
    }





    if (loading) return <LoadingIndicator />

    if (products.length === 0) {
        return <p>You don’t have any products yet.</p>
    }

    return (
        <div className={`${styles.my_products_tab} flex flex-col `}>
            {products.map(p => {
                const isExpired = new Date(p.expires_at) < new Date();
                const isEditing = editingProduct?.id === p.id;
                const isDetailsOpen = openDetailsId === p.id;



                return (
                    <div key={p.id} className={`${styles.my_products_tab__card} flex flex-col gap-2`}>
                        <div className="flex justify-between items-start">
                            <div className={`${styles.data_container} flex flex-col`}>
                                {isEditing ? (
                                    <div className={`${styles.data_container__editing_form} flex flex-col`}>
                                        <div className='flex flex-col'>
                                            <span>Denumire</span>
                                            <input
                                                type="text"
                                                value={editForm.title}
                                                onChange={e =>
                                                    setEditForm(prev => ({ ...prev, title: e.target.value }))
                                                }
                                                className="border p-1 rounded"
                                            />
                                        </div>
                                        <div className='flex flex-col'>
                                            <span>Descriere</span>
                                            <textarea
                                                value={editForm.description}
                                                onChange={e =>
                                                    setEditForm(prev => ({ ...prev, description: e.target.value }))
                                                }
                                                className="border p-1 rounded"
                                            />
                                        </div>

                                        <div className={`${styles.data_container__editing_form__price_quantity_container} flex justify-between items-center`}>
                                            <div>
                                                <span>Preț</span>
                                                <input
                                                    type="number"
                                                    value={editForm.price}
                                                    onChange={e =>
                                                        setEditForm(prev => ({ ...prev, price: e.target.value }))
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <span>Cantitate</span>
                                                <input
                                                    type="number"
                                                    value={editForm.quantity}
                                                    onChange={e =>
                                                        setEditForm(prev => ({ ...prev, quantity: Number(e.target.value) }))
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <span>Valabil până la</span>
                                                <input
                                                    type="datetime-local"
                                                    value={editForm.expires_at}
                                                    onChange={e =>
                                                        setEditForm(prev => ({ ...prev, expires_at: new Date(e.target.value).toISOString().slice(0, 16) }))
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span>Imagine</span>
                                            {editForm.image && typeof editForm.image === 'string' && (
                                                <img src={editForm.image} alt="Current" className="w-24 h-24 object-cover mb-2" />
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={e => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        setEditForm(prev => ({ ...prev, image: e.target.files![0] }));
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className={`${styles.my_products_tab__card__title} flex justify-between items-center`}>
                                            <span>{p.title}</span>
                                            <div
                                                className="flex items-center"
                                                onClick={() => setOpenDetailsId(prev => (prev === p.id ? null : p.id))}
                                            >
                                                <span>Detalii</span>
                                                {isDetailsOpen ? <ChevronUp /> : <ChevronDown />}
                                            </div>
                                        </div>
                                        {isDetailsOpen && <div
                                            className={`${styles.my_products_tab__card__description} flex justify-between items-center`}
                                        >
                                            {p.description}
                                        </div>}
                                        <div className={`${styles.data_price_quantity_container} flex items-center`}>
                                            <div className={`${styles.data_price_quantity_container__quantity_price} flex items-center`}>
                                                <span>Cantitate</span>
                                                <span>{p.quantity}</span>
                                            </div>
                                            <div className={`${styles.data_price_quantity_container__quantity_price} flex items-center`}>
                                                <span>Preț</span>
                                                <span>{p.price} lei</span>
                                            </div>
                                        </div>
                                        <div className={`${styles.data_price_quantity_container__expiration_date} flex ${isExpired ? styles.expired : styles.active}`}>
                                            <span>{isExpired ? 'A expirat în data de' : 'Expiră în data de '}</span>
                                            <span>{new Date(p.expires_at).toLocaleDateString('ro-RO')}</span>

                                        </div>
                                    </>
                                )}
                            </div>

                            <div className={`${styles.btn_container} flex items-center justify-center`}>
                                {!isEditing && <Trash
                                    onClick={() => handleDelete(p.id)}
                                    color='var(--color-light-red)'
                                    className="cursor-pointer"
                                    size={23}
                                    strokeWidth={2.2}
                                />}

                                {!isEditing && (isExpired ?
                                    <RotateCcw
                                        className="cursor-pointer"
                                        color='var(--color-primary)'
                                        size={23}
                                        strokeWidth={2.2}
                                        onClick={() => setOpenReactivateOptions(prev => !prev)}
                                    /> :
                                    <SquarePen
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setEditingProduct(p)
                                            startEditing(p)
                                        }}
                                        color='var(--color-orange)'
                                        size={23}
                                        strokeWidth={2.2}
                                    />)}
                                {isEditing && (
                                    <>
                                        <button
                                            className={`${styles.btn_container__save_btn} flex items-center justify-center cursor-pointer`}
                                            onClick={() => handleSaveEdit(p)}
                                        >
                                            <Save size={20} />
                                            Salvează
                                        </button>

                                        <button
                                            className={`${styles.btn_container__cancel_btn} flex items-center justify-center cursor-pointer`}
                                            onClick={() => {
                                                setEditingProduct(null);
                                                setEditForm({});
                                            }}
                                        >
                                            <X size={20} />
                                            Renunță
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {openReactivateOptions && isExpired && (
                            <div className={`${styles.reactivateBox} flex items-center justify-center`}>
                                <input
                                    type="datetime-local"
                                    value={newExpireDate}
                                    onChange={e => setNewExpireDate(e.target.value)}
                                />
                                <button onClick={() => handleReactivate(p)}>
                                    <RotateCcw size={18} />
                                    <span>Reactivează</span>
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );

}

export default MyProductsTab