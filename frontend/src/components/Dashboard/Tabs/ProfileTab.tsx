import { useState, useEffect } from "react";
import { useAuth } from "../../../context/useAuth.ts";
import { useDashboardStats } from "../../../context/DashboardStatsContext.tsx";
import styles from "../styles/ProfileTab.module.scss";
import { SquarePen, X, Camera, Save } from "lucide-react";
import api from "../../../api.ts";
import placeholderImage from "../../../assets/default_image_icon.jpg";

const API_URL = import.meta.env.VITE_API_URL;

function ProfileTab() {
    const { user, setUser } = useAuth();
    const { stats, setStats, refreshDashboardStats } = useDashboardStats();
    const [editing, setEditing] = useState({
        firstName: false,
        email: false,
        password: false,
        store: false,
    });

    const [form, setForm] = useState(() => ({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        storeName: "",
        storeDescription: "",
        storeLogo: null as File | null,
        avatarFile: null as File | null,
        avatarPreview: "",
        latitude: 0,
        longitude: 0
    }));


    useEffect(() => {
        if (!user) return;
        const timer = setTimeout(() => {
            setForm(prev => ({
                ...prev,
                firstName: user.first_name || "",
                lastName: user.last_name || "",
                email: user.email || "", storeName: stats.store?.name || "",
                storeDescription: stats.store?.description || "",
                avatarPreview: user?.avatar || "",
                latitude: stats.store?.latitude || 0,
                longitude: stats.store?.longitude || 0
            }));
        }, 0);

        return () => clearTimeout(timer);
    }, [user, stats.store]);



    const toggleEditing = (field: keyof typeof editing) => {
        setEditing(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChange = (field: string, value: string | File | null) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const handleAvatarChange = (file: File | null) => {
        if (!file) return
        setForm(prev => ({
            ...prev,
            avatarFile: file,
            avatarPreview: URL.createObjectURL(file)
        }))
    }


    const handleSaveChanges = async () => {
        try {
            const formData = new FormData();
            formData.append('first_name', form.firstName);
            formData.append('last_name', form.lastName);
            formData.append('email', form.email);
            if (form.password) formData.append('password', form.password);
            if (form.avatarFile) formData.append('avatar', form.avatarFile);
            await api.patch('/api/accounts/me/update/', formData);

            const me = await api.get('/api/accounts/me/');
            setUser(me.data);

            if (user?.role === 'vendor' && editing.store) {
                const formData = new FormData()
                formData.append('name', form.storeName)
                formData.append('description', form.storeDescription)
                if (form.storeLogo) formData.append('logo', form.storeLogo)

                if (form.latitude !== null && form.latitude !== undefined) {
                    formData.append('latitude', String(form.latitude))
                }

                if (form.longitude !== null && form.longitude !== undefined) {
                    formData.append('longitude', String(form.longitude))
                }

                if (stats.store && typeof stats.store === 'object') {
                    await api.put('/api/accounts/store/me/update/', formData)
                } else {
                    await api.post('/api/accounts/store/create/', formData)
                }
            }

            await refreshDashboardStats()

            setEditing({ firstName: false, email: false, password: false, store: false });
            setForm(prev => ({ ...prev, password: '' }))
        } catch (error) {
            console.error("Eroare la salvare:", error);
        }
    };

    useEffect(() => {
        if (user?.role !== "vendor") return;

        const fetchMyStore = async () => {
            try {
                const res = await api.get("/api/accounts/store/me/");
                setStats(prev => ({ ...prev, store: res.data ?? null }));
            } catch (error) {
                console.error("Failed to fetch store:", error);
            }
        };

        fetchMyStore();

    }, [user, setStats]);

    if (!user) return null;
    console.log(user.avatar, form.avatarPreview, placeholderImage)
    return (
        <div className={styles.profile}>
            <div className={`${styles.card} flex flex-col justify-center items-center`}>
                <h3 className={styles.card__title}>Informații personale</h3>
                <div className={styles.profile__info}>
                    <div className={styles.profile__avatar_container}>
                        <div className={styles.profile__avatar}>
                            <img
                                src={
                                    user.role === 'vendor'
                                        ? stats.store?.logo
                                            ? stats.store.logo.includes(API_URL)
                                                ? stats.store.logo
                                                : API_URL + stats.store.logo
                                            : placeholderImage
                                        : (user.avatar
                                            ? API_URL + user.avatar
                                            : (form.avatarPreview || placeholderImage)
                                        )
                                }
                                loading="lazy"
                                decoding="async"
                                alt="avatar"
                            />
                            {user.role === 'buyer' && (
                                <label className={styles.avatarUploadLabel}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => handleAvatarChange(e.target.files?.[0] || null)}
                                        className={styles.avatarInput}
                                    />
                                    <Camera color='white' size={22} />
                                </label>
                            )}


                        </div>
                        {user.role === "buyer" && form.avatarFile && (
                            <button
                                className={styles.save_btn}
                                onClick={handleSaveChanges}
                            >
                                Salvează poza
                            </button>
                        )}
                    </div>
                    <div className={styles.profile__details}>
                        {/* First Name */}
                        <div className={styles.profile_field}>
                            <label className={styles.profile_field__section_label}>Prenume și Nume</label>
                            {editing.firstName ? (
                                <div className={`${styles.profile_field__name_input_wrapper} flex`}>
                                    <div className={`${styles.profile_field__name_input_wrapper__name_inputs} flex flex-col`}>
                                        <div>
                                            <label htmlFor="firstName">Prenume</label>
                                            <input
                                                value={form.firstName}
                                                onChange={e => handleChange("firstName", e.target.value)}
                                                className={styles.input_edit}
                                                id="firstName"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="lastName">Nume</label>
                                            <input
                                                value={form.lastName}
                                                onChange={e => handleChange("lastName", e.target.value)}
                                                className={styles.input_edit}
                                                id="lastName"
                                            />
                                        </div>
                                    </div>

                                    <X className={styles.profile_field__edit_icon} onClick={() => toggleEditing("firstName")} />
                                </div>
                            ) : (
                                <div className={styles.field_display}>
                                    {form.firstName || form.lastName
                                        ? `${form.firstName ?? ""} ${form.lastName ?? ""}`.trim()
                                        : "—"}
                                    <SquarePen className={styles.field_display__edit_icon} onClick={() => toggleEditing("firstName")} />
                                </div>
                            )}
                        </div>

                        {/* Email */}
                        <div className={styles.profile_field}>
                            <label className={styles.profile_field__section_label}>Email</label>
                            {editing.email ? (
                                <div className={`${styles.profile_field__name_input_wrapper} flex justify-center`}>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={e => handleChange("email", e.target.value)}
                                        className={styles.input_edit}
                                    />
                                    <X className={styles.profile_field__edit_icon} onClick={() => toggleEditing("email")} />
                                </div>
                            ) : (
                                <div className={styles.field_display}>
                                    {form.email || "—"}
                                    <SquarePen className={styles.field_display__edit_icon} onClick={() => toggleEditing("email")} />
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <div className={styles.profile_field}>
                            <label className={styles.profile_field__section_label}>Parolă</label>
                            {editing.password ? (
                                <div className={`${styles.profile_field__name_input_wrapper} flex`}>
                                    <input
                                        type="password"
                                        value={form.password}
                                        onChange={e => handleChange("password", e.target.value)}
                                        className={styles.input_edit}
                                    />
                                    <X className={styles.profile_field__edit_icon} onClick={() => toggleEditing("password")} />
                                </div>
                            ) : (
                                <div className={styles.field_display}>
                                    ••••••••
                                    <SquarePen className={styles.field_display__edit_icon} onClick={() => toggleEditing("password")} />
                                </div>
                            )}
                        </div>

                        <div className={`${styles.profile_field__role_container} flex`}>
                            <span className={styles.profile_field__section_label}
                            >
                                Rol
                            </span>
                            <span className={`${styles.profile_field__role_type} flex`}>
                                {user?.role[0]?.toUpperCase() + user.role.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>

                {(editing.firstName || editing.email || editing.password) && (
                    <button className={styles.save_btn} onClick={handleSaveChanges}>
                        Salvează modificările
                    </button>
                )}
            </div>

            {/* Store Section */}
            {user.role === "vendor" && (
                <div className={styles.card}>
                    <h3 className={styles.card__title}>Magazin</h3>
                    <div className={styles.profile_store_details}>
                        {stats.store ? (
                            <>
                                {/* Magazin existent */}

                                <div className={styles.profile_field}>
                                    <label className={styles.profile_field__section_label}>Denumire magazin</label>
                                    {editing.store ? (
                                        <div className={`${styles.profile_field__name_input_wrapper} flex`}>
                                            <input
                                                value={form.storeName}
                                                onChange={e => handleChange("storeName", e.target.value)}
                                                className={styles.input_edit}
                                            />
                                            <X className={styles.profile_field__edit_icon} onClick={() => toggleEditing("store")} />
                                        </div>
                                    ) : (
                                        <div className={styles.field_display}>
                                            {form.storeName}
                                            <SquarePen className={styles.field_display__edit_icon} onClick={() => toggleEditing("store")} />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.profile_field}>
                                    <label className={styles.profile_field__section_label}>Descriere</label>
                                    {editing.store ? (
                                        <div className={`${styles.profile_field__name_input_wrapper} flex`}>
                                            <textarea
                                                value={form.storeDescription}
                                                onChange={e => handleChange("storeDescription", e.target.value)}
                                                className={styles.input_edit}
                                            />
                                        </div>

                                    ) : (
                                        <div className={styles.field_display}>{form.storeDescription || "—"}</div>
                                    )}
                                </div>
                                <div className={styles.profile_field}>
                                    <label className={styles.profile_field__section_label}>Coordonate adresă</label>
                                    {editing.store ? (
                                        <div className={`${styles.profile_field__name_input_wrapper} flex`}>
                                            <span>Latitudine</span>
                                            <input
                                                value={form.latitude === 0 ? '' : form.latitude}
                                                onChange={e => handleChange("latitude", e.target.value)}
                                                className={styles.input_edit}
                                            />
                                            <span>Longitudine</span>
                                            <input
                                                value={form.longitude === 0 ? '' : form.longitude}
                                                onChange={e => handleChange("longitude", e.target.value)}
                                                className={styles.input_edit}
                                            />
                                        </div>

                                    ) : (
                                        <div className={styles.field_display_location}>
                                            <div>
                                                <span className={styles.location_title}>Latitudine:</span>
                                                <span>{form.latitude === 0 ? "—" : form.latitude},</span>
                                            </div>
                                            <div>
                                                <span className={styles.location_title}>Longitudine:</span>
                                                <span>{form.longitude === 0 ? "—" : form.longitude}</span>

                                            </div>

                                        </div>
                                    )}
                                </div>
                                {editing.store && (
                                    <div className={styles.profile_field}>
                                        <label className={styles.profile_field__section_label}>Logo</label>
                                        <div className={`${styles.profile_field__name_input_wrapper} flex`}>
                                            <input type="file" onChange={e => handleChange("storeLogo", e.target.files?.[0] || null)}
                                                className={styles.input_edit}
                                            />
                                        </div>
                                    </div>
                                )}
                                {editing.store && (
                                    <div className={styles.save_cancel_btn_container}>
                                        <button className={styles.cancel_btn} onClick={() => toggleEditing("store")}>
                                            <X size={20} />
                                            <span>Renunță</span>
                                        </button>
                                        <button className={styles.save_btn} onClick={handleSaveChanges}>
                                            <Save size={20} />
                                            <span>Salvează modificările</span>
                                        </button>
                                    </div>

                                )}
                            </>
                        ) : (
                            <>
                                {/* Vendor fără magazin */}
                                <p>Nu ai setat încă magazinul.</p>
                                {!editing.store && (
                                    <button className={styles.save_btn} onClick={() => toggleEditing("store")}>
                                        Setează magazinul
                                    </button>
                                )}

                                {editing.store && (
                                    <>
                                        <div className={styles.profile_field}>
                                            <label className={styles.profile_field__section_label}>Denumire magazin</label>
                                            <input
                                                value={form.storeName}
                                                onChange={e => handleChange("storeName", e.target.value)}
                                                className={styles.input_edit}
                                            />
                                        </div>
                                        <div className={styles.profile_field}>
                                            <label className={styles.profile_field__section_label}>Descriere</label>
                                            <textarea
                                                value={form.storeDescription}
                                                onChange={e => handleChange("storeDescription", e.target.value)}
                                                className={styles.input_edit}
                                            />
                                        </div>
                                        <div className={styles.profile_field}>
                                            <label className={styles.profile_field__section_label}>Logo</label>
                                            <input
                                                type="file"
                                                onChange={e => handleChange("storeLogo", e.target.files?.[0] || null)}
                                                className={styles.input_edit}
                                            />
                                        </div>
                                        <button className={styles.save_btn} onClick={handleSaveChanges}>
                                            Salvează magazin
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfileTab;