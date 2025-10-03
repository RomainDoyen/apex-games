import banner from "../../assets/images/banner.png"
import "../../styles/components/Header.css"
import Input from "./Input"
import { SearchIcon, LogOut, User } from "lucide-react"
import Image from "./Image"
import { Link } from 'react-router-dom'
import logo from "../../assets/images/logo-apex.png"
import { useAuthStore } from "../../store/authStore"

export default function Header() {
    const { isAuthenticated, user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

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
                                
                                <div className="user-menu">
                                    <span className="user-greeting">
                                        <User size={16} />
                                        Bonjour, {user?.username}
                                        {user?.role === 'admin' && <span className="role-badge admin">Admin</span>}
                                        {user?.role === 'moderator' && <span className="role-badge moderator">Mod</span>}
                                    </span>
                                    <button 
                                        className="logout-btn"
                                        onClick={handleLogout}
                                        title="Se déconnecter"
                                    >
                                        <LogOut size={16} />
                                        Déconnexion
                                    </button>
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