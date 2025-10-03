import { useState } from "react";
import "../../styles/components/MovableCard.css"
import Image from "./Image"
import ReviewModal from "./ReviewModal"
import type { MovableCardProps, GameReview } from "../../types/types";

export default function MovableCard({id, title, image }: MovableCardProps) {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const handleReviewClick = () => {
        setIsReviewModalOpen(true);
    };

    const handleReviewSubmit = (review: Omit<GameReview, 'id' | 'createdAt' | 'updatedAt'>) => {
        // TODO: Implémenter l'appel API pour sauvegarder l'avis
        console.log('Avis soumis:', review);
        
        // Simulation d'un succès
        alert('Votre avis a été publié avec succès !');
    };

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
                        onClick={handleReviewClick} 
                        title="Donner un avis"
                    >
                        &#9733; {/* Avis */}
                    </div>
                </div>
            </div>
            
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                gameId={id}
                gameName={title}
                onSubmit={handleReviewSubmit}
            />
        </div>
    )
}