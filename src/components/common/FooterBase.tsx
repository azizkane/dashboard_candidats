import { Facebook, Instagram, Linkedin } from 'lucide-react';

export const FooterBase = () => {
  return (
    <footer className="px-6 mt-[20px] mb-6 border bg-white shadow-lg rounded-2xl ">
      <div className="max-w-7xl mx-auto w-full  px-4 md:px-6 py-4">
        <div className="flex items-center gap-4">
          <img src="/logo1.jpg" alt="Logo" className="w-9 h-9 rounded-full object-cover" />
          <div className="font-semibold">Votify</div>
          <div className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
            <div className="hidden sm:flex items-center gap-3">
              <span>contact@votify.com</span>
              <span className="opacity-40">•</span>
              <span>+221 77 123 45 67</span>
            </div>
            <div className="flex items-center gap-3">
              <a aria-label="Facebook" href="#" className="hover:text-foreground"><Facebook size={18} /></a>
              <a aria-label="Instagram" href="#" className="hover:text-foreground"><Instagram size={18} /></a>
              <a aria-label="LinkedIn" href="#" className="hover:text-foreground"><Linkedin size={18} /></a>
            </div>
          </div>
        </div>

        <div className="mt-3 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
          <div>© 2024 Votify. Tous droits réservés.</div>
          <div className="flex items-center gap-6">
            <a href="/terms" className="hover:text-foreground">Mentions légales</a>
            <a href="/faq" className="hover:text-foreground">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterBase;


