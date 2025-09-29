import React, { useState } from 'react';
import "../../styles/components/RegisterForm.css";
import Button from "./Button";
import Input from "./Input";
import type { RegisterFormData } from "../../types/types";

interface RegisterFormProps {
    onSubmit: (data: RegisterFormData) => void;
    onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSubmit, onSwitchToLogin }: RegisterFormProps) {
    const [formData, setFormData] = useState<RegisterFormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<Partial<RegisterFormData>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name as keyof RegisterFormData]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<RegisterFormData> = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Le nom d\'utilisateur est requis';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'L\'email n\'est pas valide';
        }

        if (!formData.password) {
            newErrors.password = 'Le mot de passe est requis';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
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
        <div className="auth-form-container">
            <div className="auth-form">
                <div className="auth-form-header">
                    <h2>Inscription</h2>
                    <p>Créez votre compte Apex Games</p>
                </div>
                
                <form onSubmit={handleSubmit} className="auth-form-content">
                    <div className="form-group">
                        <Input
                            type="text"
                            name="username"
                            placeholder="Nom d'utilisateur"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="auth-input"
                            icon={null}
                        />
                        {errors.username && <span className="error-message">{errors.username}</span>}
                    </div>
                    
                    <div className="form-group">
                        <Input
                            type="email"
                            name="email"
                            placeholder="Adresse email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="auth-input"
                            icon={null}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    
                    <div className="form-group">
                        <Input
                            type="password"
                            name="password"
                            placeholder="Mot de passe"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="auth-input"
                            icon={null}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>
                    
                    <div className="form-group">
                        <Input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirmer le mot de passe"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="auth-input"
                            icon={null}
                        />
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>
                    
                    <div className="form-terms">
                        <label className="terms-checkbox">
                            <input type="checkbox" required />
                            <span>J'accepte les <a href="/terms">conditions d'utilisation</a> et la <a href="/privacy">politique de confidentialité</a></span>
                        </label>
                    </div>
                    
                    <Button
                        text="S'inscrire"
                        color="#fff"
                        backgroundColor="rgb(0, 138, 192)"
                        link=""
                    />
                </form>
                
                <div className="auth-form-footer">
                    <p>
                        Déjà un compte ? 
                        <button 
                            type="button" 
                            className="switch-form-btn"
                            onClick={onSwitchToLogin}
                        >
                            Se connecter
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
