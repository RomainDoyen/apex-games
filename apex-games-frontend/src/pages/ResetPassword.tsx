import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { axiosInstanceBackend } from '../api/Instances';
import '../styles/pages/ForgotPassword.css';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            navigate('/forgot-password');
        }
    }, [token, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!password || !confirmPassword) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await axiosInstanceBackend.post('/auth/reset-password', {
                token,
                newPassword: password
            });
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la réinitialisation');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="forgot-password-page">
                <Header />
                <main className="forgot-password-main">
                    <div className="auth-form-container">
                        <div className="auth-form">
                            <div className="auth-form-header">
                                <h2>Mot de passe mis à jour</h2>
                                <p>Votre mot de passe a été réinitialisé avec succès</p>
                            </div>
                            
                            <div className="success-content">
                                <div className="success-icon">✓</div>
                                <p>
                                    Votre mot de passe a été mis à jour avec succès.
                                    Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                                </p>
                                
                                <div className="action-buttons">
                                    <button 
                                        onClick={() => navigate('/login')} 
                                        className="back-to-login"
                                    >
                                        Se connecter
                                    </button>
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
                            <h2>Nouveau mot de passe</h2>
                            <p>Saisissez votre nouveau mot de passe</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="auth-form-content">
                            <div className="form-group">
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="Nouveau mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="auth-input"
                                    icon={null}
                                />
                            </div>
                            
                            <div className="form-group">
                                <Input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirmer le mot de passe"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                                text={isLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
                                color="#fff"
                                backgroundColor="#646cff"
                                link=""
                                disabled={isLoading}
                            />
                        </form>
                        
                        <div className="auth-form-footer">
                            <p>
                                <Link to="/login" className="switch-form-btn">
                                    Retour à la connexion
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
