import Header from "../components/ui/Header";
import "../styles/pages/Games.css";
import Footer from "../components/ui/Footer";
import AllGames from "../components/ui/AllGames";

export default function Games() {
    return (
        <div className="gamesPage-container">
            <div className="gamesPage-content">
               <Header /> 
            </div>
            <div className="gamesPage-cards">
                <AllGames />
            </div>
            <div className="gamesPage-footer">
                <Footer />
            </div>
        </div>
    )
}