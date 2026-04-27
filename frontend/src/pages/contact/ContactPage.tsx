import { useState, useEffect } from "react";
import styles from "./ContactPage.module.scss";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import logo from '../../assets/images/logo_DONEAT_FIN-01.svg'
import publicApi from "../../apiPublic.ts";

function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">("");

    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            setMessage("");
            setMessageType("");
        }, 3500);

        return () => clearTimeout(timer);
    }, [message]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setMessage("");
        setMessageType("");

        try {
            const res = await publicApi.post('/api/contact/', form);

            setMessage(`Mesaj trimis cu succes! Număr înregistrare: ${res.data.ticket_id}`);
            setMessageType("success");

            setForm({
                name: "",
                email: "",
                subject: "",
                message: "",
            });
        } catch {
            setMessage("Eroare la trimiterea formularului. Încearcă din nou.");
            setMessageType("error");
        } finally {
            setLoading(false)
        }




    };

    return (
        <main className={styles.contact}>
            <section className={styles.hero}>
                <div className={`flex ${styles.logo_container}`}>
                    <img
                        src={logo}
                        alt="Doneat logo"
                    />
                </div>
                <h1>Hai să vorbim</h1>
                <p>
                    Ai o întrebare, o sugestie sau vrei să afli mai multe despre DonEat?
                    Trimite-ne un mesaj și revenim cât mai curând.
                </p>
            </section>

            <section className={styles.content}>
                <div className={styles.info}>
                    <h2>Informații de contact</h2>

                    <div className={styles.info_item}>
                        <Mail />
                        <div>
                            <span className={styles.info_item__title}>Email</span>
                            <span>contact@doneat.ro</span>
                        </div>
                    </div>

                    <div className={styles.info_item}>
                        <Phone />
                        <div>
                            <span className={styles.info_item__title}>Telefon</span>
                            <span>+40 712 345 678</span>
                        </div>
                    </div>

                    <div className={styles.info_item}>
                        <MapPin />
                        <div>
                            <span className={styles.info_item__title}>Locație</span>
                            <span>București, România</span>
                        </div>
                    </div>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {message && (
                        <div
                            className={`${styles.form_message} ${messageType === "success" ? styles.success : styles.error
                                }`}
                        >
                            {message}
                        </div>
                    )}
                    <div className={styles.form_group}>
                        <label>Nume</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Numele tău"
                            required
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                            required
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label>Subiect</label>
                        <input
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            placeholder="Despre ce vrei să ne scrii?"
                            required
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label>Mesaj</label>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Scrie mesajul tău aici..."
                            rows={6}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        <Send size={18} />
                        {loading ? "Se trimite..." : "Trimite mesajul"}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default ContactPage;