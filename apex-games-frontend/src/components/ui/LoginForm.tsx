import React, { useState } from 'react';
import "../../styles/components/LoginForm.css";
import Button from "./Button";
import Input from "./Input";
import type { LoginFormData } from "../../types/types";

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => void;
    onSwitchToRegister: () => void;
}

export default function LoginForm({ onSubmit, onSwitchToRegister }: LoginFormProps) {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
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
                        <a href="#" className="forgot-password">Mot de passe oublié ?</a>
                    </div>
                    
                    <Button
                        text="Se connecter"
                        color="#fff"
                        backgroundColor="#646cff"
                        link=""
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
