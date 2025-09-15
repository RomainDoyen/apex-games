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
                        <a href="#">Connexion</a>
                        <a href="#">Inscription</a>
                       <Link to="/games">Jeux</Link>
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