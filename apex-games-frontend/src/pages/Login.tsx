import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../components/ui/LoginForm';
import RegisterForm from '../components/ui/RegisterForm';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        // Vérifier si l'utilisateur vient d'une inscription réussie
        if (location.state?.fromRegister) {
            setSuccessMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
            // Supprimer le message après 5 secondes
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [location.state]);

    const switchToRegister = () => {
        setIsLogin(false);
    };

    const switchToLogin = () => {
        setIsLogin(true);
    };

    return (
        <div className="login-page">
            <Header />
            <div className="login-main">
                {successMessage && (
                    <div className="success-message">
                        <p>{successMessage}</p>
                    </div>
                )}
                
                {isLogin ? (
                    <LoginForm 
                        onSwitchToRegister={switchToRegister}
                    />
                ) : (
                    <RegisterForm 
                        onSwitchToLogin={switchToLogin}
                    />
                )}
            </div>
            <Footer />
        </div>
    );
}
