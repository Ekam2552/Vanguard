import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="relative z-20 w-full overflow-hidden bg-[#946e47] py-24 px-4 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-16 md:flex-row">
        <div className="max-w-sm space-y-8">
          <h2 className="text-4xl font-bold tracking-tighter text-white">Vanguard.</h2>
          <p className="text-white/60 leading-relaxed text-sm">
            Architectural visualization and high-end interior design globally. Ethereal spaces for visionary minds.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-12 sm:grid-cols-3">
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold">Studio</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/work" className="hover:text-white transition-colors">Work</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold">Social</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Behance</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mx-auto mt-24 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/30 sm:flex-row">
        <p>© 2026 Vanguard Studio. All rights reserved.</p>
        <p className="uppercase tracking-widest font-medium">Designed with Intent.</p>
      </div>
    </footer>
  );
};
