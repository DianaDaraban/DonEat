import styles from "./AboutPage.module.scss";
import {
    ShoppingBag,
    Store,
    MapPin,
    Leaf,
    HeartHandshake,
    BadgePercent,
    MapPinHouse,
    HandCoins,
    Sprout
} from "lucide-react";
import logo from '../../assets/images/logo_DONEAT_FIN-01.svg'

function AboutPage() {
    return (
        <main className={styles.about}>
            <section className={styles.hero}>
                <div className={`flex ${styles.logo_container}`}>
                    <img
                        src={logo}
                        alt="Doneat logo"
                        loading="lazy"
                        decoding="async"
                    />
                </div>

                <h1>
                    Produse și mese delicioase, la prețuri reduse, aproape de tine.
                </h1>

                <p>
                    DonEat este o platformă care conectează cumpărătorii cu vendorii locali,
                    oferind acces rapid la produse alimentare, mese și oferte speciale,
                    într-un mod simplu, responsabil și accesibil.
                </p>
            </section>

            <section className={styles.stats}>
                <div className={styles.card_container}>
                    <MapPinHouse color="var(--color-primary)" size={40} />
                    <span className={styles.card_container__line}></span>
                    <div className={styles.card_container__content}>
                        <span className={styles.content_header}>
                            Local
                        </span>
                        <span className={styles.content_description}>
                            oferte din apropiere
                        </span>
                    </div>

                </div>

                <div className={styles.card_container}>
                    <HandCoins color="var(--color-primary)" size={40} />
                    <span className={styles.card_container__line}></span>
                    <div className={styles.card_container__content}>
                        <span className={styles.content_header}>
                            Accesibil
                        </span>
                        <span className={styles.content_description}>
                            prețuri reduse
                        </span>
                    </div>
                </div>

                <div className={styles.card_container}>
                    <Sprout color="var(--color-primary)" size={40} />
                    <span className={styles.card_container__line}></span>
                    <div className={styles.card_container__content}>
                        <span className={styles.content_header}>
                            Responsabil
                        </span>
                        <span className={styles.content_description}>
                            mai puțină risipă
                        </span>
                    </div>
                </div>
            </section>

            <section className={styles.cards}>
                <div className={styles.card}>
                    <BadgePercent className={styles.icon} />
                    <h3>Oferte avantajoase</h3>
                    <p>
                        Descoperi produse și mese la prețuri reduse, potrivite pentru
                        cumpărături rapide, prânzuri accesibile sau surprize culinare locale.
                    </p>
                </div>

                <div className={styles.card}>
                    <MapPin className={styles.icon} />
                    <h3>Aproape de tine</h3>
                    <p>
                        Folosești harta și filtrele pentru a găsi rapid vendorii și produsele
                        disponibile în zona ta.
                    </p>
                </div>

                <div className={styles.card}>
                    <Leaf className={styles.icon} />
                    <h3>Consum responsabil</h3>
                    <p>
                        Alegând produse disponibile local, contribui la reducerea risipei
                        alimentare și susții o comunitate mai atentă la resurse.
                    </p>
                </div>
            </section>

            <section className={styles.split}>
                <div className={styles.split__content}>
                    <div>
                        <ShoppingBag className={styles.large_icon} />
                        <span>
                            Pentru cumpărători
                        </span>
                    </div>
                    <p>
                        DonEat te ajută să găsești rapid produse, mese și pachete alimentare
                        la prețuri accesibile. Poți căuta după categorie, locație, preț sau
                        disponibilitate și poți descoperi oferte de la vendori locali.
                    </p>
                </div>

                <div className={styles.split__content}>
                    <div>
                        <Store className={styles.large_icon} />
                        <span>Pentru vendori</span>
                    </div>
                    <p>
                        Vendorii își pot lista produsele disponibile, pot gestiona comenzile
                        și pot ajunge mai ușor la clienți interesați de oferte locale.
                        Platforma oferă vizibilitate și o modalitate simplă de valorificare
                        a produselor rămase.
                    </p>
                </div>
            </section>

            <section className={styles.mission}>
                <HeartHandshake className={styles.mission_icon} />

                <div>
                    <h2>Misiunea noastră</h2>
                    <p>
                        Ne dorim să facem produsele și mesele bune mai accesibile, să sprijinim
                        vendorii locali și să încurajăm un consum mai responsabil. DonEat nu este
                        doar o platformă de cumpărături, ci un pas spre o comunitate mai conectată,
                        mai eficientă și mai atentă la risipa alimentară.
                    </p>
                </div>
            </section>
        </main>
    );
}

export default AboutPage;