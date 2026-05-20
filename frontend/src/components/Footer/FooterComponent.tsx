import styles from './FooterComponent.module.scss'
import { Link, useNavigate } from "react-router-dom";
import { Github, Linkedin, Mail, Facebook, Instagram, Boxes, Info, LayoutDashboard, Contact } from "lucide-react";
import AnimatedBackground from '../../styles/animatedBackground/AnimatedBackground.tsx';
import logo from '../../assets/images/logo_DONEAT_FIN-01.svg'


export default function FooterComponent() {
    const navigate = useNavigate()
    return (
        <div className={styles.main_container}>
            <AnimatedBackground />
            <div className={styles.logo_container}>
                <img
                    src={logo}
                    alt="Doneat logo"
                    onClick={() => navigate('/')}
                    className="cursor-pointer"
                    loading="lazy"
                    decoding="async"
                />
                <div className={styles.credentials_container}>
                    <p className={styles.credentials_container__content}>
                        Platformă dedicată gestionării donațiilor și conectării organizațiilor cu persoane care vor să ajute.
                    </p >
                    <p className={styles.credentials_container__content}>©2026 Doneat</p>
                </div>

            </div>

            <div className={styles.links_container}>
                <h4>Linkuri rapide</h4>
                <div className={styles.links_container__links}>
                    <div>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Boxes color='var(--color-primary)' size={18} />
                            <span>Oferte</span>
                        </Link>
                        <Link to="/about" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Info color='var(--color-primary)' size={18} />
                            <span>Despre noi</span>
                        </Link>
                    </div>
                    <div>
                        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <LayoutDashboard color='var(--color-primary)' size={18} />
                            <span>Panou de control</span>
                        </Link>
                        <Link to="/contact" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Contact color='var(--color-primary)' size={18} />
                            <span>Contact</span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className={styles.social_media_container}>
                <h4>Social media</h4>
                <div>  <a href="#">
                    <Github size={20} />
                </a>
                    <a href="#">
                        <Facebook size={20} />
                    </a>
                    <a href="#">
                        <Instagram size={20} />
                    </a>

                    <a href="#">
                        <Linkedin size={20} />
                    </a>

                    <a href="#">
                        <Mail size={20} />
                    </a></div>

            </div>
        </div>
    )
}