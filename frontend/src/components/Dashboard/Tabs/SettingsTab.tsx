import { useEffect, useState } from "react";
import api from "../../../api.ts";
import styles from "../styles/SettingsTab.module.scss";
import styles_navbar from '../../../pages/navbar/Navbar.module.scss'
import { useAuth } from "../../../context/useAuth.ts";
import LoadingIndicator from "../../LoadingIndicator.tsx";

interface Settings {
    [key: string]: boolean;
}

export default function SettingsTab() {
    const { user } = useAuth();
    const [settings, setSettings] = useState<Settings | null>(null);

    useEffect(() => {
        api.get("/api/notifications/settings/")
            .then(res => setSettings(res.data))
            .catch(() => setSettings({}));
    }, []);

    const toggle = (key: string) => {
        setSettings(prev => ({
            ...prev!,
            [key]: !prev?.[key]
        }));
    };

    const save = async () => {
        await api.patch("/api/notifications/settings/", settings);
        alert("Setările au fost salvate.");
    };

    if (!settings) return <LoadingIndicator />;

    const buyerSections = [
        {
            title: "Comenzi",
            items: [
                { key: "order_confirmed", label: "Comandă confirmată" },
                { key: "order_shipped", label: "Comandă expediată" },
                { key: "order_delivered", label: "Comandă livrată" },
            ]
        },
        {
            title: "Wishlist",
            items: [
                { key: "wishlist_low_stock", label: "Stoc mic pentru produse din wishlist" },
                { key: "wishlist_expiring_soon", label: "Produse din wishlist ce urmează să expire" },
            ]
        }
    ];

    const vendorSections = [
        {
            title: "Comenzi",
            items: [
                { key: "new_order", label: "Comandă nouă primită" },
                { key: "order_cancelled", label: "Comandă anulată" },
            ]
        },
        {
            title: "Produse",
            items: [
                { key: "product_expiring_soon", label: "Produse ce urmează să expire" },
            ]
        }
    ];

    const sections = user?.role === "vendor" ? vendorSections : buyerSections;

    return (
        <div className={styles.container}>
            <h2>Setări notificări</h2>
            <div className={styles.content}>
                {sections.map(section => (
                    <div key={section.title} className={styles.section}>
                        <h3>{section.title}</h3>
                        <div>
                            {section.items.map(item => (
                                <div key={item.key}
                                    className={styles_navbar.checkbox_wrapper}>
                                    <input
                                        type="checkbox"
                                        checked={settings[item.key] ?? false}
                                        onChange={() => toggle(item.key)}
                                        className={styles_navbar.custom_checkbox}
                                        id={item.key}
                                    />
                                    <label
                                        className={styles.option}
                                        htmlFor={item.key}
                                        style={{ fontSize: '0.95rem' }}
                                    >{item.label}
                                    </label>
                                </div>
                            ))}
                        </div>

                    </div>
                ))}
            </div>

            {/* <div className={styles.section}>
                <h3>Canal notificare</h3>
                <label className={styles.option}>
                    <input
                        type="checkbox"
                        checked={settings.sms_enabled ?? false}
                        onChange={() => toggle("sms_enabled")}
                    />
                    Trimite notificări prin SMS
                </label>
            </div> */}

            <button onClick={save} className={styles.save}>
                Salvează
            </button>
        </div>
    );
}