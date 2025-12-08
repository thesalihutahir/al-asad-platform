import Link from 'next/link';

const articles = [
  {
    title: "Preserving Quranic Manuscripts: A Digital Imperative",
    excerpt: "How the intersection of archival science and digital technology is ensuring the longevity of our most precious heritage...",
    date: "November 2, 2024",
    readTime: "8 min read",
    author: "Ustaz Salihu Tahir",
    tag: "Cultural Heritage"
  },
  {
    title: "The Ethics of Islamic Philanthropy in the 21st Century",
    excerpt: "Moving beyond immediate relief to sustainable community development through institutionalized Zakat and Sadaqah...",
    date: "October 20, 2024",
    readTime: "12 min read",
    author: "Dr. Sulaiman Tahir",
    tag: "Social Impact"
  },
  {
    title: "Mentorship: The Missing Link in Student Success",
    excerpt: "Why technical knowledge alone is insufficient for the modern student without the guidance of a traditional mentor...",
    date: "September 15, 2024",
    readTime: "6 min read",
    author: "Sheikh Ahmad Al-Asad",
    tag: "Education"
  }
];

export default function ArticlesPage() {
  return (
    <main className="bg-brand-sand min-h-screen pb-20">
      {/* Article Header */}
      <section className="pt-32 pb-12 px-6">
        <div className="container mx-auto">
          <Link href="/blogs" className="text-brand-gold font-bold font-lato hover:underline mb-4 inline-block">
            ← Back to Blog Hub
          </Link>
          <h1 className="font-agency text-5xl md:text-6xl text-brand-brown-dark uppercase tracking-tight">
            Thought <span className="text-brand-gold">Articles</span>
          </h1>
          <p className="font-lato text-brand-brown mt-4 text-lg max-w-2xl leading-relaxed">
            In-depth perspectives on spirituality, technology, and social development 
            from our leading scholars and partners.
          </p>
        </div>
      </section>

      {/* Articles List */}
      <section className="container mx-auto px-6 space-y-8">
        {articles.map((article, index) => (
          <article 
            key={index} 
            className="bg-white rounded-[2rem] p-8 md:p-12 card-shadow group transition-all hover:bg-brand-brown-dark"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="md:w-3/4">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-brand-gold/10 text-brand-gold font-bold font-lato text-xs px-3 py-1 rounded-full group-hover:bg-white/20 group-hover:text-white transition-colors">
                    {article.tag}
                  </span>
                  <span className="text-brand-brown group-hover:text-gray-300 text-xs font-lato">{article.date}</span>
                </div>
                
                <h2 className="font-agency text-3xl md:text-4xl text-brand-brown-dark group-hover:text-white uppercase transition-colors mb-4">
                  {article.title}
                </h2>
                <p className="font-lato text-brand-brown group-hover:text-gray-300 leading-relaxed max-w-3xl">
                  {article.excerpt}
                </p>
                
                <div className="mt-8 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-gold"></div> {/* Author Avatar Placeholder */}
                    <span className="font-lato font-bold text-sm text-brand-brown-dark group-hover:text-white">
                      {article.author}
                    </span>
                  </div>
                  <span className="text-xs text-brand-brown/60 group-hover:text-gray-400 font-lato">{article.readTime}</span>
                </div>
              </div>

              <div className="md:w-1/4 flex justify-end">
                <Link 
                  href="#" 
                  className="w-16 h-16 rounded-full border-2 border-brand-gold flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-all text-2xl"
                >
                  →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-6 mt-20">
        <div className="bg-brand-brown-dark rounded-[3rem] p-12 text-center featured-background relative overflow-hidden border-none">
          <h2 className="font-agency text-4xl text-white uppercase mb-4 relative z-10">Get Articles in your Inbox</h2>
          <p className="font-lato text-gray-300 mb-8 max-w-md mx-auto relative z-10">
            Join 2,000+ readers and receive our monthly collection of scholarly perspectives.
          </p>
          <form className="max-w-md mx-auto flex gap-2 relative z-10">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow p-4 rounded-full border-none font-lato outline-none focus:ring-2 focus:ring-brand-gold"
            />
            <button className="bg-brand-gold text-white font-bold px-8 rounded-full hover:brightness-110 transition-all">
              Join
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
