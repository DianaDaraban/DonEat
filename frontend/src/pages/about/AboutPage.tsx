import styles from "./AboutPage.module.scss";


export default function AboutPage() {
    return (
        <div className={styles.about}>

            <section className={styles.hero}>
                <h1>Despre Proiect</h1>
                <h3>Tema – Reducerea risipei alimentare</h3>
                <p>Acest proiect constă în dezvoltarea unei aplicații web full-stack construită în jurul unei teme actuale: reducerea risipei alimentare (food waste).</p>
                <p>Aplicația propune un model digital care facilitează interacțiunea dintre vendori și utilizatori, oferind un sistem organizat pentru gestionarea produselor și comenzilor, cu accent pe eficiență și sustenabilitate.</p>
                <p>Dincolo de componenta conceptuală, proiectul a fost gândit ca o simulare a unei aplicații reale, cu arhitectură separată, autentificare securizată și fluxuri complete de utilizare.</p>

                <h3>Contextul și motivația tehnică</h3>
                <p>Tema „food waste” oferă un cadru potrivit pentru modelarea unui sistem cu:</p>
                <ul>
                    <li>roluri diferite de utilizatori</li>
                    <li>gestionare de date dinamice</li>
                    <li>interacțiuni între entități (user – vendor – produs)</li>
                    <li>procesarea comenzilor</li>
                    <li>notificări și actualizări de stare</li>
                </ul>
                <p>Din punct de vedere tehnic, proiectul a urmărit construirea unei aplicații scalabile, în care fiecare componentă are o responsabilitate clar definită.</p>
            </section>

            <section className={styles.section}>
                <div className={styles.content}>
                    <h2>Arhitectura aplicației</h2>
                    <p>Aplicația este construită pe o arhitectură client–server.</p>
                    <div>
                        <h3>Frontend</h3>
                        <p>Dezvoltat folosind:</p>
                        <ul>
                            <li>React</li>
                            <li>TypeScript</li>
                            <li>SCSS Modules</li>
                            <li>Context API</li>
                            <li>React Router</li>
                        </ul>
                        <p>Responsabilități principale:</p>
                        <ul>
                            <li>gestionarea interfeței și a experienței utilizatorului</li>
                            <li>protejarea rutelor private</li>
                            <li>administrarea stării globale (autentificare, notificări etc.)</li>
                            <li>comunicarea cu backend-ul prin Axios</li>
                        </ul>
                    </div>
                    <div>
                        <h3>Backend</h3>
                        <p>Dezvoltat folosind:</p>
                        <ul>
                            <li>Django</li>
                            <li>Django REST Framework</li>
                            <li>JWT pentru autentificare</li>
                        </ul>
                        <p>Backend-ul gestionează:</p>
                        <ul>
                            <li>logica de business</li>
                            <li>validarea și serializarea datelor</li>
                            <li>autorizarea accesului la resurse</li>
                            <li>expunerea endpoint-urilor REST</li>
                        </ul>
                        <p>Structura este organizată pe aplicații Django distincte (accounts, cart, notifications etc.), facilitând mentenanța și scalarea.</p>
                    </div>
                </div>
            </section>
            <section className={styles.section}>
                <div className={styles.content}>
                    <h2>Structura funcțională a aplicației</h2>
                    <p>Funcționalitățile aplicației sunt construite în jurul interacțiunii dintre utilizatori și vendori.</p>
                    <div>
                        <h3>Sistemul permite:</h3>
                        <ul>
                            <li>gestionarea conturilor și a rolurilor</li>
                            <li>administrarea profilului personal</li>
                            <li>gestionarea produselor și comenzilor</li>
                            <li>utilizarea unui coș de cumpărături</li>
                            <li>primirea notificărilor relevante</li>
                            <li>acces diferențiat în funcție de nivelul de autorizare</li>
                        </ul>
                        <p>În backend, entitățile sunt modelate astfel încât să reflecte relații reale între utilizatori, produse și comenzi, asigurând o structură coerentă și ușor de extins.</p>
                    </div>
                </div>
            </section>
            <section className={styles.section}>
                <div className={styles.content}>
                    <h2>Provocări tehnice întâmpinate</h2>
                    <div>
                        <h3>Pe parcursul dezvoltării au apărut situații relevante din punct de vedere arhitectural:</h3>
                        <ul>
                            <li>Buclă infinită generată de revalidarea token-ului în ProtectedRoute</li>
                            <li>Gestionarea concurentă a cererilor în momentul expirării token-ului</li>
                            <li>Sincronizarea stării după login/logout</li>
                            <li>Organizarea codului pe măsură ce aplicația a crescut în complexitate</li>
                        </ul>
                        <p>Rezolvarea acestor probleme a implicat restructurarea logicii de autentificare și o clarificare a responsabilităților între frontend și backend.</p>
                    </div>
                </div>
            </section>
            <section className={styles.section}>
                <div className={styles.content}>
                    <h2>Componenta socială integrată tehnic</h2>
                    <div>
                        <h3>Tema reducerii risipei alimentare nu este doar un fundal conceptual, ci influențează direct modelarea aplicației:</h3>
                        <ul>
                            <li>existența rolurilor distincte (vendor / utilizator)</li>
                            <li>gestionarea produselor cu disponibilitate limitată</li>
                            <li>notificări legate de actualizări sau status</li>
                            <li>interacțiune organizată între ofertă și cerere</li>
                        </ul>
                        <p>Aplicația demonstrează cum un concept social poate fi transpus într-o arhitectură software coerentă.</p>
                    </div>
                </div>
            </section>
            <section className={styles.section}>
                <div className={styles.content}>
                    <h2>Posibile extensii</h2>
                    <div>
                        <h3>Structura actuală permite extinderea către:</h3>
                        <ul>
                            <li>integrare plăți online</li>
                            <li>notificări în timp real (WebSockets)</li>
                            <li>dashboard analitic pentru vendori</li>
                            <li>sistem de rating</li>
                            <li>deploy în mediu production-ready</li>
                        </ul>
                        <p>Arhitectura modulară facilitează adăugarea de noi funcționalități fără a afecta stabilitatea sistemului.</p>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <h2>Tehnologii utilizate</h2>
                <div className={styles.techGrid}>
                    <div className={styles.card}>
                        <h3>Frontend</h3>
                        <ul>
                            <li>React</li>
                            <li>TypeScript</li>
                            <li>SCSS Modules</li>
                            <li>Axios</li>
                            <li>React Router</li>
                        </ul>
                    </div>
                    <div className={styles.card}>
                        <h3>Backend</h3>
                        <ul>
                            <li>Django</li>
                            <li>Django REST Framework</li>
                            <li>JWT Authentication</li>
                        </ul>
                    </div>
                    <div className={styles.card}>
                        <h3>Bază de date</h3>
                        <ul>
                            <li>MySQL / SQLite (în mediul de dezvoltare)</li>
                        </ul>
                    </div>
                    <div className={styles.card}>
                        <h3>Instrumente auxiliare</h3>
                        <ul>
                            <li>Git pentru version control</li>
                            <li>Structurare modulară pe aplicații</li>
                            <li>Gestionare token-uri (Access & Refresh)</li>
                        </ul>
                    </div>
                </div>
            </section>

        </div>
    );
}

