import Header from "../components/ui/Header";
import BannerWelcome from "../components/ui/BannerWelcome";
import TrendingGames from "../components/ui/TrendingGames";
import "../styles/pages/Home.css";
import Footer from "../components/ui/Footer";

export default function Home() {
    return (
        <div className="home-container">
            <div className="home-content">
               <Header /> 
            </div>
            <div className="home-banner">
                <BannerWelcome />
            </div>
            <div className="home-cards">
                <TrendingGames />
            </div>
            <div className="home-footer">
                <Footer />
            </div>
        </div>
    )
}