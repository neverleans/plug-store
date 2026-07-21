import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone } from 'lucide-react';

const ContactPage = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-4xl font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.contactUs}</h1>

      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-semibold">{t.getInTouch}</h2>
          <p className="mb-6 text-muted-foreground">{t.contactDesc}</p>
          <div className="space-y-4">
            {[
              { icon: Mail, label: 'hello@' + theme.name.toLowerCase() + '.com' },
              { icon: Phone, label: '+1 (555) 123-4567' },
              { icon: MapPin, label: '123 Commerce St, New York, NY 10001' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3"><Icon className="h-5 w-5 text-primary" /><span className="text-sm">{label}</span></div>
            ))}
          </div>
        </div>
        <form onSubmit={e => e.preventDefault()} className="space-y-4 rounded-xl border bg-card p-6">
          <div><label className="mb-1 block text-sm font-medium">{t.name}</label><Input placeholder={t.yourName} /></div>
          <div><label className="mb-1 block text-sm font-medium">{t.email}</label><Input type="email" placeholder="you@example.com" /></div>
          <div><label className="mb-1 block text-sm font-medium">{t.message}</label><Textarea placeholder={t.howCanWeHelp} rows={5} /></div>
          <Button className="w-full">{t.sendMessage}</Button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
