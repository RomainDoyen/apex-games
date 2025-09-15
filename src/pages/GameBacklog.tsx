import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import GameBacklogBoard from "../components/ui/GameBacklogBoard";

export default function GameBacklog() {
    return (
        <div className="gamesPage-container">
            <div className="gamesPage-content">
               <Header /> 
            </div>
            <div className="gamePage-board">
                <GameBacklogBoard />
            </div>
            <div className="gamesPage-footer">
                <Footer />
            </div>
        </div>
    )
}
