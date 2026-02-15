import banner from "../../assets/images/banner.png"
import "../../styles/components/Header.css"
import Input from "./Input"
import { SearchIcon, LogOut, User, Settings } from "lucide-react"
import Image from "./Image"
import { Link } from 'react-router-dom'
import logo from "../../assets/images/logo-apex.png"
import { useAuthStore } from "../../store/authStore"
import { useState, useEffect, useRef } from "react"

export default function Header() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        window.location.href = '/';
        setIsProfileMenuOpen(false);
    };

    // Fermer le menu quand on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };

        if (isProfileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileMenuOpen]);

    return (
        <>
            <div className="header">
                <div className="hero-image">
                    <Image src={banner} alt="Hero Image" />
                </div>
                <nav className="nav-container">
                    <div className="site-title">
                        <Link to="/">
                            <Image src={logo} alt="Logo" />
                        </Link> 
                      </div>
                    <div className="nav-links">
                        {isAuthenticated ? (
                            <>
                                <Link to="/games">Jeux</Link>
                                <Link to="/backlog">Backlog</Link>
                                {(user?.role === 'admin' || user?.role === 'moderator') && (
                                    <Link to="/admin">Admin</Link>
                                )}
                                
                                <div className="user-profile-container" ref={menuRef}>
                                    <button 
                                        className="profile-avatar-btn"
                                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                        aria-label="Menu profil"
                                    >
                                        {user?.avatar ? (
                                            <img 
                                                src={user.avatar} 
                                                alt={user.username} 
                                                className="profile-avatar-img"
                                            />
                                        ) : (
                                            <div className="profile-avatar-icon">
                                                <User size={20} />
                                            </div>
                                        )}
                                    </button>
                                    
                                    {isProfileMenuOpen && (
                                        <div className="profile-dropdown">
                                            <div className="profile-dropdown-header">
                                                <div className="profile-dropdown-greeting">
                                                    Bonjour, {user?.username}
                                                </div>
                                                {user?.role === 'admin' && (
                                                    <span className="role-badge admin">Admin</span>
                                                )}
                                                {user?.role === 'moderator' && (
                                                    <span className="role-badge moderator">Mod</span>
                                                )}
                                            </div>
                                            <div className="profile-dropdown-divider"></div>
                                            <Link 
                                                to="/settings" 
                                                className="profile-dropdown-item"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                            >
                                                <Settings size={16} />
                                                Accéder aux paramètres
                                            </Link>
                                            <button 
                                                className="profile-dropdown-item logout-item"
                                                onClick={handleLogout}
                                            >
                                                <LogOut size={16} />
                                                Déconnexion
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login">Connexion</Link>
                                <Link to="/register">Inscription</Link>
                                <Link to="/games">Jeux</Link>
                                <Link to="/backlog">Backlog</Link>
                            </>
                        )}

                        <Input 
                            type="text" 
                            placeholder="Rechercher" 
                            value="" 
                            onChange={() => {}} className="search-input" icon={<SearchIcon />} 
                        />
                    </div>
                </nav>
            </div>
        </>
    )
}