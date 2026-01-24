// import { useState, useEffect } from "react"
// import api from '../api.ts'
// import publicApi from "../apiPublic.ts"
// import { NoteType } from '../types/Note.ts'
// import Note from "../components/Notes.tsx"
import { ProductPublic } from "../../types/Product.ts"
import styles from './Home.module.scss'
import { ProductOrder } from "../../constants/productOrder.ts";
import chicken from '../../assets/images/chicken.jpg'
import { Package, HandCoins, MapPinCheckInside, Info } from 'lucide-react'

type HomeProps = {
    products: ProductPublic[];
    orderBy: ProductOrder;
};

function Home({ products, orderBy }: HomeProps) {
    // const [notes, setNotes] = useState<NoteType[]>([])
    // const [content, setContent] = useState<string>('')
    // const [title, setTitle] = useState<string>('')
    // const [products, setProducts] = useState<ProductPublic[]>([])



    // const getNotes = (): void => {
    //     api.get<NoteType[]>('api/notes/')
    //         .then((res) => res.data)
    //         .then((data: NoteType[]): void => { setNotes(data); console.log(data) })
    //         .catch((err) => alert(err))
    // }


    // const deleteNote = (id: number): void => {
    //     api.delete(`/api/note/delete/${id}/`).then((res) => {
    //         if (res.status === 204) alert('Note deleted!')
    //         else alert('Failed to delete note.')
    //         getNotes();
    //     }).catch((error) => alert(error))

    // }

    // const createNote = (e: FormEvent<HTMLFormElement>): void => {
    //     e.preventDefault()
    //     api.post<NoteType>('/api/notes/', { content, title }).then((res) => {
    //         if (res.status === 201) alert('Note Created!')
    //         else alert('Failed to make note.')
    //         getNotes();
    //     }).catch((err) => alert(err))

    // }

    // const getProducts = (): void => {
    //     publicApi.get<ProductPublic[]>('api/products/')
    //         .then((res) => res.data)
    //         .then((data): void => { setProducts(data); console.log(data) })
    //         .catch((err) => alert(err))
    // }


    // useEffect(() => {
    //     // getNotes()
    //     getProducts()
    // }, [])

    // const filteredProducts = products.filter(product =>
    //     selectedCategoryIds.includes(product.category_id)
    // );

    const sortedProducts = [...products].sort((a, b) => {
        switch (orderBy) {
            case 'newest':
                return (
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                );

            case 'price_asc':
                return (Number(a.price) || 0) - (Number(b.price) || 0)

            case 'price_desc':
                return (Number(b.price) || 0) - (Number(a.price) || 0)

            case 'expires_soon':
                return (
                    new Date(a.expires_at).getTime() -
                    new Date(b.expires_at).getTime()
                );

            case 'quantity_desc':
                return b.quantity - a.quantity

            default:
                return 0
        }

    })


    return (
        <div className={styles.cards_container}>
            {sortedProducts.map((product) => (
                <div key={product.slug} className={styles.product_card_container}>
                    <a href="#" className={styles.product_card}>
                        <div className={styles.product_card__img_container}>
                            <img src={chicken} alt="food" className={styles.product_card__img} />
                        </div>

                    </a>
                    <div className={`${styles.product_card_container__text_wrapper}`}>
                        <h3 className={`${styles.product_card_container__title} `}>{product.title}</h3>
                        <div className={`${styles.product_card_container__info_default} flex flex-col`}>
                            <div className={`${styles.product_card_container__quantity} flex`}>
                                <Package className={`${styles.product_card_container__icon} `} />
                                <span>{product.quantity} {product.unit}</span>
                            </div>
                            <div className={`${styles.product_card_container__price} flex`}>
                                <HandCoins className={`${styles.product_card_container__icon} `} />
                                <span>{product.price ?? 'Gratuit'} {product.price ? 'lei' : ''}</span>
                            </div>
                            <div className={`${styles.product_card_container__location} flex`}>
                                <MapPinCheckInside className={`${styles.product_card_container__icon} `} />
                                <span>{product.location}</span>
                            </div>
                        </div>



                        <div className={`${styles.product_card_container__info_hover} flex`}>
                            <Info className={`${styles.product_card_container__icon} `} />
                            <span>{product.description}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

}
export default Home


//     < div >
//     <h2>Note</h2>
// { notes.map((note: NoteType) => <Note note={note} onDelete={deleteNote} key={note.id} />) }
//         </ >
//         <h2>Create a Note</h2>
//         <form onSubmit={createNote}>
//             <label htmlFor="title">Title:</label>
//             <br />
//             <input
//                 type="text"
//                 id="title"
//                 name="title"
//                 required
//                 onChange={(e) => setTitle(e.target.value)}
//                 value={title}
//             />
//             <label htmlFor="content">Content:</label>
//             <br />
//             <textarea
//                 name="content"
//                 id="content"
//                 required
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}

//             ></textarea>
//             <br />
//             <input type="submit" value='Submit' />
//         </form>