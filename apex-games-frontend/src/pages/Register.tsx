import { useState } from 'react';
import RegisterForm from '../components/ui/RegisterForm';
import LoginForm from '../components/ui/LoginForm';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

export default function Register() {
    const [isLogin, setIsLogin] = useState(false);

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
                        onSwitchToRegister={switchToRegister}
                    />
                ) : (
                    <RegisterForm 
                        onSwitchToLogin={switchToLogin}
                    />
                )}
            </main>
            <Footer />
        </div>
    );
}
