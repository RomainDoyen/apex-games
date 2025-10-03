import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { axiosInstanceBackend } from '../api/Instances';
import '../styles/pages/ForgotPassword.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            setError('Veuillez saisir votre adresse email');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await axiosInstanceBackend.post('/auth/forgot-password', { email });
            setIsSubmitted(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de l\'envoi de l\'email');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="forgot-password-page">
                <Header />
                <main className="forgot-password-main">
                    <div className="auth-form-container">
                        <div className="auth-form">
                            <div className="auth-form-header">
                                <h2>Email envoyé</h2>
                                <p>Vérifiez votre boîte de réception</p>
                            </div>
                            
                            <div className="success-content">
                                <div className="success-icon">✓</div>
                                <p>
                                    Nous avons envoyé un lien de réinitialisation à l'adresse :
                                    <br />
                                    <strong>{email}</strong>
                                </p>
                                <p className="instruction">
                                    Cliquez sur le lien dans l'email pour réinitialiser votre mot de passe.
                                    Le lien expire dans 1 heure.
                                </p>
                                
                                <div className="action-buttons">
                                    <Link to="/login" className="back-to-login">
                                        Retour à la connexion
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="forgot-password-page">
            <Header />
            <main className="forgot-password-main">
                <div className="auth-form-container">
                    <div className="auth-form">
                        <div className="auth-form-header">
                            <h2>Mot de passe oublié</h2>
                            <p>Saisissez votre email pour recevoir un lien de réinitialisation</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="auth-form-content">
                            <div className="form-group">
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Adresse email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="auth-input"
                                    icon={null}
                                />
                            </div>
                            
                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}
                            
                            <Button
                                text={isLoading ? "Envoi en cours..." : "Envoyer le lien"}
                                color="#fff"
                                backgroundColor="#646cff"
                                link=""
                                disabled={isLoading}
                            />
                        </form>
                        
                        <div className="auth-form-footer">
                            <p>
                                Vous vous souvenez de votre mot de passe ? 
                                <Link to="/login" className="switch-form-btn">
                                    Se connecter
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
