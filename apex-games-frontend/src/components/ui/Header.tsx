import banner from "../../assets/images/banner.png"
import "../../styles/components/Header.css"
import Input from "./Input"
import { SearchIcon } from "lucide-react"
import Image from "./Image"
import { Link } from 'react-router-dom'
import logo from "../../assets/images/logo-apex.png"

export default function Header() {
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

                        <Link to="/login">Connexion</Link>
                        <Link to="/register">Inscription</Link>
                       <Link to="/games">Jeux</Link>
                        <a href="/backlog">Backlog</a>

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