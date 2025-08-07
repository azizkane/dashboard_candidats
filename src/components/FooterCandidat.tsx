import { Facebook, Instagram, Linkedin } from 'lucide-react';

const FooterElecteur = () => {
  return (
    <footer className="bg-blue-600 text-black py-6 px-4 ml-[280px]">
      <div className="max-w-7xl mx-auto flex flex-wrap gap-10 justify-between">
        {/* Colonne 1 : Logo */}
        <div className="flex items-center space-x-3 min-w-[220px]">
          <img src="/logo1.jpg" alt="Logo" className="w-10 h-10 object-contain rounded-full" />
          <span className="font-bold text-lg">VOTIFY</span>
        </div>

        {/* Colonne 2 : Liens utiles */}
        <div className="min-w-[180px]">
          <h3 className="font-semibold text-black mb-3">Liens utiles</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-gray-700">Accueil</a></li>
            <li><a href="/contact" className="hover:text-gray-700">Contact</a></li>
            <li><a href="/faq" className="hover:text-gray-700">FAQ</a></li>
            <li><a href="/terms" className="hover:text-gray-700">Mentions légales</a></li>
          </ul>
        </div>

        {/* Colonne 3 : Contact */}
        <div className="min-w-[180px]">
          <h3 className="font-semibold text-black mb-3">Contactez-nous</h3>
          <p>Email: contact@votify.com</p>
          <p>Téléphone: +221 77 123 45 67</p>
          <p>Adresse: 123 Rue de Dakar, Sénégal</p>
        </div>

        {/* Colonne 4 : Suivez-nous */}
        <div className="min-w-[180px]">
          <h3 className="font-semibold text-black mb-3">Suivez-nous</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Facebook size={20} /> <a href="#">Facebook</a>
            </li>
            <li className="flex items-center gap-2">
              <Instagram size={20} /> <a href="#">Instagram</a>
            </li>
            <li className="flex items-center gap-2">
              <Linkedin size={20} /> <a href="#">LinkedIn</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default FooterElecteur;
