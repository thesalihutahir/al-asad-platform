import Link from 'next/link';

const ebooks = [
  {
    title: "The Golden Age of Quranic Sciences",
    author: "Dr. Sulaiman Tahir",
    year: "2023",
    pages: "124",
    type: "Research Paper",
    desc: "A comprehensive analysis of historical Quranic education methods and their modern applications."
  },
  {
    title: "Foundations of Fiqh",
    author: "Sheikh Ahmad Al-Asad",
    year: "2024",
    pages: "86",
    type: "Guide",
    desc: "An introductory guide for intermediate students covering the essential pillars of Islamic jurisprudence."
  },
  {
    title: "Community Outreach Manual",
    author: "Al-Asad Editorial Team",
    year: "2022",
    pages: "45",
    type: "Handbook",
    desc: "The official handbook used by our volunteers for community development and welfare projects."
  },
  {
    title: "Annual Impact Report",
    author: "Governance Board",
    year: "2024",
    pages: "30",
    type: "Report",
    desc: "Transparency record detailing the foundation's achievements, financial growth, and scholarship distributions."
  }
];

export default function EbooksPage() {
  return (
    <main className="bg-brand-sand min-h-screen pb-20">
      {/* Header Area */}
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto">
          <Link href="/media" className="text-brand-gold font-bold font-lato hover:underline mb-4 inline-block">
            ← Back to Media Hub
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="font-agency text-5xl md:text-6xl text-brand-brown-dark uppercase tracking-wide">
                eBooks & Publications
              </h1>
              <p className="font-lato text-brand-brown mt-4 text-lg leading-relaxed">
                Download digital editions of our research, student handbooks, and historical archives. 
                Knowledge curated for the modern student.
              </p>
            </div>
            {/* Simple Search bar placeholder */}
            <div className="md:w-1/3">
               <input 
                type="text" 
                placeholder="Search publications..." 
                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
               />
            </div>
          </div>
        </div>
      </section>

      {/* Book Grid */}
      <section className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {ebooks.map((book, index) => (
          <div key={index} className="bg-white rounded-3xl p-6 md:p-8 card-shadow flex flex-col sm:flex-row gap-8 transition-transform hover:scale-[1.01]">
            {/* Book Cover Visualization */}
            <div className="sm:w-1/3 aspect-[3/4] bg-brand-brown-dark rounded-xl flex flex-col justify-between p-4 relative overflow-hidden group">
               <div className="absolute inset-0 bg-brand-gold/10 group-hover:bg-transparent transition-colors"></div>
               <div className="z-10">
                 <div className="w-8 h-1 bg-brand-gold mb-2"></div>
                 <p className="text-[10px] text-brand-gold font-bold uppercase tracking-tighter">{book.type}</p>
               </div>
               <h3 className="z-10 font-agency text-white text-lg uppercase leading-tight">{book.title}</h3>
            </div>

            {/* Book Details */}
            <div className="sm:w-2/3 flex flex-col">
              <div className="flex justify-between items-start">
                <span className="text-brand-gold font-bold font-lato text-xs uppercase tracking-widest">{book.year} Publication</span>
                <span className="text-gray-400 font-lato text-xs">{book.pages} Pages</span>
              </div>
              <h2 className="font-agency text-3xl text-brand-brown-dark mt-2 uppercase">{book.title}</h2>
              <p className="font-lato text-brand-brown italic text-sm mt-1">Author: {book.author}</p>
              
              <p className="font-lato text-brand-brown text-sm mt-4 mb-6 leading-relaxed flex-grow">
                {book.desc}
              </p>

              <div className="flex gap-4">
                 <button className="bg-brand-brown-dark text-white font-bold font-lato px-6 py-2 rounded-lg hover:bg-brand-gold transition-colors text-sm">
                   Download PDF
                 </button>
                 <button className="border border-brand-brown-dark text-brand-brown-dark font-bold font-lato px-6 py-2 rounded-lg hover:bg-brand-sand transition-colors text-sm">
                   Read Online
                 </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Contribution Highlight */}
      <section className="container mx-auto px-6 mt-16">
        <div className="bg-brand-sand border-2 border-brand-gold/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
           <div className="text-4xl">✍️</div>
           <div className="flex-grow">
              <h3 className="font-agency text-2xl text-brand-brown-dark uppercase">Call for Publications</h3>
              <p className="font-lato text-brand-brown text-sm">Are you a researcher or scholar? We accept contributions for our digital archives.</p>
           </div>
           <Link href="/contact" className="bg-white border-2 border-brand-brown-dark text-brand-brown-dark font-bold px-6 py-2 rounded-full font-lato text-sm hover:bg-brand-brown-dark hover:text-white transition-all">
             Submit Interest
           </Link>
        </div>
      </section>
    </main>
  );
}
