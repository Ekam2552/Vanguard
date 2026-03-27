import { Button } from "@/components/Button";

export default function Contact() {
  return (
    <main className="relative w-full pt-48 pb-32 px-4 md:px-12 max-w-7xl mx-auto z-10 min-h-[100dvh]">
      <div className="flex flex-col md:flex-row gap-24">
        <div className="w-full md:w-1/2">
          <span className="rounded-full px-3 py-1 text-[10px] w-max uppercase tracking-[0.2em] font-medium border border-white/10 bg-white/5 mb-8 inline-block">Initiate</span>
          <h1 className="text-6xl md:text-8xl font-light tracking-tighter mb-8 leading-[0.9]">
            Let's <br/> <span className="text-white/40 italic">Connect.</span>
          </h1>
          <p className="text-white/50 max-w-sm mb-12">
            For project inquiries, partnerships, or to request our full digital folio.
          </p>
          
          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">Studio</p>
              <p className="text-white/80 font-light">1200 Ethereal Ave, Suite 400<br/>San Francisco, CA 94103</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">Direct</p>
              <p className="text-white/80 font-light">inquiries@vanguard.studio<br/>+1 (800) 555-0199</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="p-2 rounded-[2rem] bg-white/5 ring-1 ring-white/10 backdrop-blur-xl">
            <div className="relative w-full h-full rounded-[calc(2rem-0.5rem)] bg-[#0a0a0a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-8 md:p-12">
              <form className="space-y-8 flex flex-col">
                <div className="space-y-2 relative">
                  <label className="text-xs text-white/50 uppercase tracking-widest block">Name</label>
                  <input type="text" className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-white transition-colors" placeholder="Jane Doe" />
                </div>
                
                <div className="space-y-2 relative">
                  <label className="text-xs text-white/50 uppercase tracking-widest block">Email</label>
                  <input type="email" className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-white transition-colors" placeholder="jane@example.com" />
                </div>

                <div className="space-y-2 relative">
                  <label className="text-xs text-white/50 uppercase tracking-widest block">Inquiry Type</label>
                  <select className="w-full bg-transparent border-b border-white/10 py-3 text-white/80 focus:outline-none focus:border-white transition-colors appearance-none outline-none">
                    <option className="bg-[#0a0a0a]">Residential Design</option>
                    <option className="bg-[#0a0a0a]">Commercial Architecture</option>
                    <option className="bg-[#0a0a0a]">3D Visualization</option>
                    <option className="bg-[#0a0a0a]">Other</option>
                  </select>
                </div>

                <div className="space-y-2 relative pb-8">
                  <label className="text-xs text-white/50 uppercase tracking-widest block">Message</label>
                  <textarea rows={4} className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-white transition-colors resize-none" placeholder="Details about your project..." />
                </div>

                <Button variant="primary" className="w-max self-start" type="button">Send Transmission</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
