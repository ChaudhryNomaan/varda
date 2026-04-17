import React from 'react';
import Link from 'next/link';

export const AtelierFeature = () => {
  return (
    <section className="bg-charcoal py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Left: Text Content */}
        <div className="space-y-8 order-2 md:order-1">
          <div className="space-y-2">
            <span className="text-gold tracking-[0.5em] uppercase text-[10px] font-light">
              Sınırlı Üretim
            </span>
            <h2 className="text-4xl md:text-6xl font-serif italic text-bone leading-tight">
              Atelier <br /> 
              <span className="font-sans not-italic font-extralight text-3xl md:text-5xl tracking-widest opacity-80">
                Serisi
              </span>
            </h2>
          </div>

          <p className="text-bone/60 text-xs md:text-sm leading-relaxed tracking-widest uppercase max-w-md">
            Geleneksel terzilik sanatından ilham alan özel bir seri. 
            Her bir parça, Londra stüdyomuzda en nadide kumaşlar kullanılarak 
            el işçiliği ile sınırlı sayıda üretilmektedir.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-6">
            <Link 
              href="/collections/atelier" 
              className="border border-gold text-gold px-10 py-4 text-[10px] uppercase tracking-[0.3em] hover:bg-gold hover:text-charcoal transition-all duration-500 text-center"
            >
              Koleksiyonu Keşfet
            </Link>
          </div>
        </div>

        {/* Right: Immersive Visual */}
        <div className="relative order-1 md:order-2">
          {/* Decorative Gold Frame */}
          <div className="absolute -inset-4 border border-gold/20 translate-x-4 translate-y-4 z-0" />
          
          <div className="relative z-10 aspect-[4/5] overflow-hidden bg-espresso">
            <img 
              src="https://images.unsplash.com/photo-1551163943-3f6a855d1153?q=80&w=1887&auto=format&fit=crop" 
              alt="Atelier Detayı" 
              className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
            />
          </div>

          {/* Floating Detail Badge */}
          <div className="absolute -bottom-6 -left-6 bg-charcoal border border-gold/30 p-6 hidden lg:block z-20">
            <p className="text-gold text-[9px] uppercase tracking-[0.4em] leading-loose">
              Özel El İşçiliği <br />
              London Design Studio
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};