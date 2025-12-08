import Link from 'next/link';

const values = [
  { title: "Excellence", desc: "Striving for the highest standards in both Quranic and digital education.", icon: "💎" },
  { title: "Empowerment", desc: "Equipping communities to lead their own development projects.", icon: "🌱" },
  { title: "Integrity", desc: "Total transparency in our finances and project executions.", icon: "⚖️" }
];

const leaders = [
  { name: "Sheikh Ahmad Al-Asad", role: "Founder & Spiritual Lead", bio: "Renowned scholar with over 30 years in Quranic pedagogy." },
  { name: "Dr. Sulaiman Tahir", role: "Director of Research", bio: "Academic expert focusing on the intersection of faith and technology." },
  { name: "Ustaz Salihu Tahir", role: "Head of Digital Programs", bio: "Spearheading our innovation and digital literacy initiatives." }
];

export default function AboutPage() {
  return (
    <main className="bg-brand-sand min-h-screen pb-20">
      {/* 1. Who We Are - Narrative Hero */}
      <section className="pt-32 pb-20 px-6 bg-brand-brown-dark text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 font-agency text-[20vw] select-none pointer-events-none -mb-20">AL-ASAD</div>
        <div className="container mx-auto relative z-10">
          <h1 className="font-agency text-5xl md:text-7xl uppercase tracking-widest mb-6">Who We <span className="text-brand-gold">Are</span></h1>
          <p className="font-lato text-lg md:text-xl max-w-3xl mx-auto leading-relaxed opacity-90">
            Founded in 2010, the Al-Asad Education Foundation began as a small study circle 
            and has evolved into a global hub for traditional learning and modern technical excellence.
          </p>
        </div>
      </section>

      {/* 2. Our Story - History Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="font-agency text-4xl text-brand-brown-dark uppercase mb-6">Our Story</h2>
            <div className="space-y-6 font-lato text-brand-brown leading-relaxed text-lg">
              <p>
                Our journey started with a simple question: How do we ensure that the next 
                generation of scholars is just as comfortable in a computer lab as they 
                are with a classical manuscript?
              </p>
              <p>
                Over the past decade, we have established 12 centers, supported over 500 scholars, 
                and launched rural development projects that provide water and health outreach 
                to thousands.
              </p>
            </div>
          </div>
          <div className="md:w-1/2 featured-background rounded-[3rem] p-10 md:p-16 text-center shadow-lg">
             <div className="text-brand-gold font-agency text-7xl mb-4">14+</div>
             <p className="font-lato text-brand-brown-dark font-bold uppercase tracking-widest text-xl">Years of Impact</p>
          </div>
        </div>
      </section>

      {/* 3. Our Values - Grid */}
      <section className="bg-white py-20 px-6 border-y border-gray-100">
        <div className="container mx-auto text-center mb-16">
          <h2 className="font-agency text-4xl text-brand-brown-dark uppercase tracking-tight">Core Values</h2>
          <div className="h-1 bg-brand-gold w-20 mx-auto mt-4"></div>
        </div>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val, i) => (
            <div key={i} className="p-8 rounded-3xl bg-brand-sand card-shadow hover:scale-105 transition-transform text-center">
              <div className="text-4xl mb-6">{val.icon}</div>
              <h3 className="font-agency text-2xl text-brand-brown-dark mb-4">{val.title}</h3>
              <p className="font-lato text-brand-brown">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Leadership - Profile Grid */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="font-agency text-4xl text-brand-brown-dark uppercase text-center mb-16">Leadership</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {leaders.map((leader, i) => (
            <div key={i} className="group">
              <div className="aspect-[4/5] bg-brand-brown-dark rounded-3xl overflow-hidden mb-6 card-shadow relative">
                {/* Image Placeholder */}
                <div className="absolute inset-0 bg-brand-gold/10 group-hover:bg-transparent transition-colors"></div>
              </div>
              <h3 className="font-agency text-2xl text-brand-brown-dark uppercase mb-1">{leader.name}</h3>
              <p className="text-brand-gold font-bold font-lato text-sm uppercase mb-4">{leader.role}</p>
              <p className="font-lato text-brand-brown text-sm leading-relaxed">{leader.bio}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
