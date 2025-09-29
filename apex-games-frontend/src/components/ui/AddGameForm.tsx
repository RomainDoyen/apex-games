import React, { useState } from 'react';
import "../../styles/components/AddGameForm.css";
import Button from "./Button";
import Input from "./Input";
import type { AddGameFormData } from "../../types/types";

interface AddGameFormProps {
    onSubmit: (data: AddGameFormData) => void;
    onCancel: () => void;
}

export default function AddGameForm({ onSubmit, onCancel }: AddGameFormProps) {
    const [formData, setFormData] = useState<AddGameFormData>({
        name: '',
        description: '',
        background_image: '',
        rating: 0,
        released: '',
        metacritic: 0,
        website: '',
        genres: '',
        developers: '',
        publishers: ''
    });

    const [errors, setErrors] = useState<Partial<AddGameFormData>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'rating' || name === 'metacritic' ? parseFloat(value) || 0 : value
        }));
        
        // Clear error when user starts typing
        if (errors[name as keyof AddGameFormData]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<AddGameFormData> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Le nom du jeu est requis';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'La description est requise';
        } else if (formData.description.length < 10) {
            newErrors.description = 'La description doit contenir au moins 10 caractères';
        }

        if (!formData.background_image.trim()) {
            newErrors.background_image = 'L\'URL de l\'image est requise';
        } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(formData.background_image)) {
            newErrors.background_image = 'L\'URL de l\'image n\'est pas valide';
        }

        if (formData.rating < 0 || formData.rating > 5) {
            newErrors.rating = 'La note doit être entre 0 et 5';
        }

        if (!formData.released.trim()) {
            newErrors.released = 'La date de sortie est requise';
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.released)) {
            newErrors.released = 'La date doit être au format YYYY-MM-DD';
        }

        if (formData.metacritic < 0 || formData.metacritic > 100) {
            newErrors.metacritic = 'Le score Metacritic doit être entre 0 et 100';
        }

        if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
            newErrors.website = 'L\'URL du site web n\'est pas valide';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <div className="add-game-form-container">
            <div className="add-game-form">
                <div className="add-game-form-header">
                    <h2>Ajouter un nouveau jeu</h2>
                    <p>Remplissez les informations du jeu à ajouter</p>
                </div>
                
                <form onSubmit={handleSubmit} className="add-game-form-content">
                    <div className="form-row">
                        <div className="form-group">
                            <Input
                                type="text"
                                name="name"
                                placeholder="Nom du jeu"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="admin-input"
                                icon={null}
                            />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>
                        
                        <div className="form-group">
                            <Input
                                type="url"
                                name="background_image"
                                placeholder="URL de l'image"
                                value={formData.background_image}
                                onChange={handleInputChange}
                                className="admin-input"
                                icon={null}
                            />
                            {errors.background_image && <span className="error-message">{errors.background_image}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <textarea
                            name="description"
                            placeholder="Description du jeu"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="admin-textarea"
                            rows={4}
                        />
                        {errors.description && <span className="error-message">{errors.description}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <Input
                                type="number"
                                name="rating"
                                placeholder="Note (0-5)"
                                value={formData.rating.toString()}
                                onChange={handleInputChange}
                                className="admin-input"
                                icon={null}
                                min="0"
                                max="5"
                                step="0.1"
                            />
                            {errors.rating && <span className="error-message">{errors.rating}</span>}
                        </div>
                        
                        <div className="form-group">
                            <Input
                                type="date"
                                name="released"
                                placeholder="Date de sortie"
                                value={formData.released}
                                onChange={handleInputChange}
                                className="admin-input"
                                icon={null}
                            />
                            {errors.released && <span className="error-message">{errors.released}</span>}
                        </div>
                        
                        <div className="form-group">
                            <Input
                                type="number"
                                name="metacritic"
                                placeholder="Score Metacritic (0-100)"
                                value={formData.metacritic.toString()}
                                onChange={handleInputChange}
                                className="admin-input"
                                icon={null}
                                min="0"
                                max="100"
                            />
                            {errors.metacritic && <span className="error-message">{errors.metacritic}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <Input
                            type="url"
                            name="website"
                            placeholder="Site web officiel (optionnel)"
                            value={formData.website}
                            onChange={handleInputChange}
                            className="admin-input"
                            icon={null}
                        />
                        {errors.website && <span className="error-message">{errors.website}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <Input
                                type="text"
                                name="genres"
                                placeholder="Genres (séparés par des virgules)"
                                value={formData.genres}
                                onChange={handleInputChange}
                                className="admin-input"
                                icon={null}
                            />
                        </div>
                        
                        <div className="form-group">
                            <Input
                                type="text"
                                name="developers"
                                placeholder="Développeurs (séparés par des virgules)"
                                value={formData.developers}
                                onChange={handleInputChange}
                                className="admin-input"
                                icon={null}
                            />
                        </div>
                        
                        <div className="form-group">
                            <Input
                                type="text"
                                name="publishers"
                                placeholder="Éditeurs (séparés par des virgules)"
                                value={formData.publishers}
                                onChange={handleInputChange}
                                className="admin-input"
                                icon={null}
                            />
                        </div>
                    </div>
                    
                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onCancel}
                        >
                            Annuler
                        </button>
                        <Button
                            text="Ajouter le jeu"
                            color="#fff"
                            backgroundColor="rgb(0, 138, 192)"
                            link=""
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
