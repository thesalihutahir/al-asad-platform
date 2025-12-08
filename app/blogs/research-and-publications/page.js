import Link from 'next/link';

const publications = [
  {
    title: "Comparative Analysis of Quranic Pedagogy",
    author: "Dr. Sulaiman Tahir",
    field: "Educational Sciences",
    date: "Dec 2024",
    doi: "10.5521/alasad.2024.01",
    abstract: "This paper examines traditional memorization techniques against modern cognitive load theory to identify efficiency gaps..."
  },
  {
    title: "Linguistic Nuances in early 10th Century Manuscripts",
    author: "Ustaz Salihu Tahir",
    field: "Philology",
    date: "Nov 2024",
    doi: "10.5521/alasad.2024.02",
    abstract: "A deep dive into archival preservation and the subtle shift in script styles across the Saharan scholarship routes..."
  },
  {
    title: "The Economic Impact of Community-Led Endowments",
    author: "Al-Asad Research Group",
    field: "Islamic Economics",
    date: "Oct 2024",
    doi: "10.5521/alasad.2024.03",
    abstract: "An empirical study on how localized Waqf (endowment) can sustain rural education centers without foreign aid reliance..."
  }
];

export default function ResearchPage() {
  return (
    <main className="bg-brand-sand min-h-screen pb-20">
      {/* Header */}
      <section className="pt-32 pb-12 px-6">
        <div className="container mx-auto">
          <Link href="/blogs" className="text-brand-gold font-bold font-lato hover:underline mb-4 inline-block">
            ← Back to Blog Hub
          </Link>
          <h1 className="font-agency text-5xl md:text-6xl text-brand-brown-dark uppercase tracking-tight">
            Research & <span className="text-brand-gold">Papers</span>
          </h1>
          <p className="font-lato text-brand-brown mt-4 text-lg max-w-2xl border-l-4 border-brand-gold pl-6 py-2 leading-relaxed">
            Our formal contribution to the global body of knowledge. We provide rigorous research on 
            history, education, and community development.
          </p>
        </div>
      </section>

      {/* Publications List */}
      <section className="container mx-auto px-6 space-y-6">
        {publications.map((pub, index) => (
          <div key={index} className="bg-white p-8 md:p-10 rounded-2xl card-shadow group hover:bg-brand-brown-dark transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-grow">
                <div className="flex flex-wrap gap-4 mb-4">
                  <span className="text-brand-gold font-bold font-lato text-xs uppercase group-hover:text-white transition-colors">{pub.field}</span>
                  <span className="text-gray-400 text-xs font-lato">{pub.date}</span>
                </div>
                
                <h2 className="font-agency text-3xl text-brand-brown-dark group-hover:text-white transition-colors mb-4 uppercase leading-tight">
                  {pub.title}
                </h2>
                
                <p className="font-lato text-brand-brown group-hover:text-gray-300 text-sm leading-relaxed mb-6 italic">
                  Principal Researcher: {pub.author}
                </p>

                <p className="font-lato text-brand-brown group-hover:text-gray-100 text-sm line-clamp-2 md:line-clamp-none">
                  <span className="font-bold text-brand-brown-dark group-hover:text-brand-gold">Abstract:</span> {pub.abstract}
                </p>
              </div>

              <div className="w-full md:w-auto flex flex-col gap-3">
                 <button className="bg-brand-brown-dark text-white font-bold text-xs py-3 px-6 rounded-lg border border-brand-brown-dark group-hover:bg-brand-gold group-hover:border-brand-gold transition-all">
                   VIEW FULL PAPER
                 </button>
                 <span className="text-[10px] text-gray-400 font-lato tracking-tighter self-center group-hover:text-gray-300">DOI: {pub.doi}</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Submission CTA */}
      <section className="container mx-auto px-6 mt-16 text-center">
        <p className="font-lato text-brand-brown text-sm mb-6">Want to collaborate on our next academic journal?</p>
        <Link 
          href="/contact" 
          className="inline-block border-2 border-brand-brown-dark text-brand-brown-dark font-bold px-10 py-3 rounded-full font-lato hover:bg-brand-brown-dark hover:text-white transition-all"
        >
          Partner with Research Team
        </Link>
      </section>
    </main>
  );
}
