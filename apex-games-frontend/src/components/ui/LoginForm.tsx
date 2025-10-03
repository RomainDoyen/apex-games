import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import "../../styles/components/LoginForm.css";
import Button from "./Button";
import Input from "./Input";
import { useAuthStore } from "../../store/authStore";
import type { LoginFormData } from "../../types/types";

interface LoginFormProps {
    onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { login } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Effacer l'erreur quand l'utilisateur tape
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await login(formData.email, formData.password);
            
            // Rediriger vers la page d'origine ou la page d'accueil
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.message || 'Erreur de connexion');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-form-container">
            <div className="auth-form">
                <div className="auth-form-header">
                    <h2>Connexion</h2>
                    <p>Connectez-vous à votre compte Apex Games</p>
                </div>
                
                <form onSubmit={handleSubmit} className="auth-form-content">
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
                    </div>
                    
                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Se souvenir de moi</span>
                        </label>
                        <Link to="/forgot-password" className="forgot-password">Mot de passe oublié ?</Link>
                    </div>
                    
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                    
                    <Button
                        text={isLoading ? "Connexion..." : "Se connecter"}
                        color="#fff"
                        backgroundColor="rgb(0, 138, 192)"
                        link=""
                        disabled={isLoading}
                    />
                </form>
                
                <div className="auth-form-footer">
                    <p>
                        Pas encore de compte ? 
                        <button 
                            type="button" 
                            className="switch-form-btn"
                            onClick={onSwitchToRegister}
                        >
                            S'inscrire
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
