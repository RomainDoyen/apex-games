import React, { useState } from 'react';
import "../../styles/components/ReviewModal.css";
import type { ReviewModalProps } from "../../types/types";

export default function ReviewModal({ isOpen, onClose, gameId, gameName, onSubmit }: ReviewModalProps) {
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        const newErrors: { rating?: string; comment?: string } = {};
        
        if (rating === 0) {
            newErrors.rating = 'Veuillez donner une note';
        }
        
        if (!comment.trim()) {
            newErrors.comment = 'Veuillez écrire un commentaire';
        } else if (comment.trim().length < 10) {
            newErrors.comment = 'Le commentaire doit contenir au moins 10 caractères';
        }
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            // TODO: Remplacer par la vraie logique d'authentification
            const userId = 1; // Simulation pour l'instant
            
            onSubmit({
                gameId,
                userId,
                rating,
                comment: comment.trim()
            });
            
            // Reset form
            setRating(0);
            setComment('');
            setErrors({});
            onClose();
        }
    };

    const handleClose = () => {
        setRating(0);
        setComment('');
        setErrors({});
        onClose();
    };

    const handleStarClick = (starRating: number) => {
        setRating(starRating);
        if (errors.rating) {
            setErrors(prev => ({ ...prev, rating: undefined }));
        }
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
        if (errors.comment) {
            setErrors(prev => ({ ...prev, comment: undefined }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Donner un avis</h2>
                    <button className="modal-close" onClick={handleClose}>
                        &times;
                    </button>
                </div>
                
                <div className="modal-body">
                    <div className="game-info">
                        <h3>{gameName}</h3>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="review-form">
                        <div className="form-group">
                            <label className="form-label">Votre note *</label>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`star ${star <= rating ? 'active' : ''}`}
                                        onClick={() => handleStarClick(star)}
                                        title={`${star} étoile${star > 1 ? 's' : ''}`}
                                    >
                                        ⭐
                                    </button>
                                ))}
                                <span className="rating-text">
                                    {rating > 0 ? `${rating}/5` : 'Sélectionnez une note'}
                                </span>
                            </div>
                            {errors.rating && <span className="error-message">{errors.rating}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Votre commentaire *</label>
                            <textarea
                                value={comment}
                                onChange={handleCommentChange}
                                placeholder="Partagez votre expérience avec ce jeu..."
                                className="comment-textarea"
                                rows={5}
                            />
                            {errors.comment && <span className="error-message">{errors.comment}</span>}
                        </div>
                        
                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={handleClose}>
                                Annuler
                            </button>
                            <button type="submit" className="submit-btn">
                                Publier l'avis
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
