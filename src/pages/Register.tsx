import React, { useState } from 'react';
import RegisterForm from '../components/ui/RegisterForm';
import LoginForm from '../components/ui/LoginForm';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import type { LoginFormData, RegisterFormData } from '../types/types';

export default function Register() {
    const [isLogin, setIsLogin] = useState(false);

    const handleLogin = (data: LoginFormData) => {
        console.log('Login data:', data);
        // Ici vous ajouterez la logique d'authentification
        alert('Connexion réussie !');
    };

    const handleRegister = (data: RegisterFormData) => {
        console.log('Register data:', data);
        // Ici vous ajouterez la logique d'inscription
        alert('Inscription réussie !');
    };

    const switchToRegister = () => {
        setIsLogin(false);
    };

    const switchToLogin = () => {
        setIsLogin(true);
    };

    return (
        <div className="register-page">
            <Header />
            <main className="register-main">
                {isLogin ? (
                    <LoginForm 
                        onSubmit={handleLogin}
                        onSwitchToRegister={switchToRegister}
                    />
                ) : (
                    <RegisterForm 
                        onSubmit={handleRegister}
                        onSwitchToLogin={switchToLogin}
                    />
                )}
            </main>
            <Footer />
        </div>
    );
}
