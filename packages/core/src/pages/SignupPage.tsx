import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SignupPage = () => {
  const { signup } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup(name, email, password);
    navigate('/');
  };

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border bg-card p-8">
        <h1 className="mb-2 text-center text-2xl font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.createAccount}</h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">{t.joinToday} — {theme.name}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="mb-1 block text-sm font-medium">{t.fullName}</label><Input required value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" /></div>
          <div><label className="mb-1 block text-sm font-medium">{t.email}</label><Input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></div>
          <div><label className="mb-1 block text-sm font-medium">{t.password}</label><Input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" /></div>
          <Button type="submit" className="w-full">{t.createAccount}</Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t.alreadyHaveAccount} <Link to="/login" className="font-medium text-primary hover:underline">{t.signIn}</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
