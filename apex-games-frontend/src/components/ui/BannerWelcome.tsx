import "../../styles/components/BannerWelcome.css"
import Button from "./Button"
import Compteur from "./Compteur"

export default function BannerWelcome() {
    return (
        <div className="banner-welcome">
            <h1>APEX Games</h1>
            <h5>Découvrez, collectez, analysez vos jeux</h5>
            <div className="metrics">
                <Compteur title="Joués" value={42.7} valueMetrics="M" pastilleColor="#EA377A" />
                <Compteur title="Jeux" value={302} valueMetrics="K" pastilleColor="#43B94F" />
                <Compteur title="Notes" value={25.5} valueMetrics="M" pastilleColor="#4B7BD4" />
                <Compteur title="Avis" value={3.01} valueMetrics="M" pastilleColor="#E69B3E" />
                <Compteur title="Listes" value={526} valueMetrics="K" pastilleColor="#EA4747" />
            </div>
            <div className="banner-welcome-button">
                <Button text="Créer un compte gratuit" color="#ffffff" backgroundColor="#008AC0" link="/register" />
                <p>ou <a href="/login" className="banner-welcome-button-link">connexion</a> si vous avez un compte</p>
            </div>
            <div className="banner-welcome-description">
                <p>APEX Games est une plateforme de gestion de jeux qui permet de suivre les jeux que vous avez joué, de les ajouter à vos listes, de les noter et de les partager avec vos amis.</p>
            </div>
        </div>
    )
}