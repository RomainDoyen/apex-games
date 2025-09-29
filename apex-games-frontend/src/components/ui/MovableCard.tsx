import "../../styles/components/MovableCard.css"
import Image from "./Image"
import type { MovableCardProps } from "../../types/types";

export default function MovableCard({id, title, image }: MovableCardProps) {
    return (
        <div 
            className="movableCard" 
            draggable 
            onDragStart={(e) => {
                e.dataTransfer.setData('gameId',id.toString());
            }}
        >
            <div 
                className="movableCard-delete-button" 
                //onClick={handleDeleteClick} 
                title="Supprimer la carte" 
            >
                &times; 
            </div>
            
            <div className="movableCard-image">
                <Image src={image} alt={title} className="movableCard-image" />
            </div>
            
            {/* Contenu qui apparaît au survol */}
            <div className="movableCard-content">
                <h3>{title}</h3>
                
                <div className="card-floating-actions"> 
                    <div 
                        className="action-icon info-icon"
                        //onClick={handleInfoClick} 
                        title="Détails du jeu"
                    >
                        &#x1F6C8; {/* Info */}
                    </div>
                    
                    <div 
                        className="action-icon review-icon"
                        //onClick={handleReviewClick} 
                        title="Donner un avis"
                    >
                        &#9733; {/* Avis */}
                    </div>
                </div>
            </div>
        </div>
    )
}