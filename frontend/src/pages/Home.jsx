import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* HERO */}
      <section className="px-6 pt-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden min-h-[500px] flex items-center justify-center">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1600&q=80')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/70 via-primary/60 to-primary-dark/80" />

            <div className="relative z-10 text-center px-6 py-16 max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                <span>🇪🇹</span>
                <span>Twsta Ethiopia Tours</span>
              </div>

              <h1 className="text-white text-5xl md:text-6xl font-extrabold leading-tight mb-4">
                Discover Ethiopia
              </h1>

              <p className="text-white/90 text-xl md:text-2xl font-medium mb-4">
                Authentic. Local. Unforgettable.
              </p>

              <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-10">
                Book amazing experiences with local guides, driver guides, tour operators and travel experts.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/explore" className="btn-primary">
                  Explore Tours →
                </Link>
                <Link to="/about" className="btn-outline">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1 — SIMPLE */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-center mb-8">Who will you book with?</h2>
        <p className="text-center text-muted mb-12">
          Choose from Ethiopia's best travel professionals
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {['🏔️ Tour Guides', '🚗 Driver Guides', '🧭 Tour Operators', '✈️ Travel Agencies', '🏨 Accommodation'].map((item, i) => (
            <div key={i} className="card text-center">
              <p className="font-bold text-lg">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2 — SIMPLE */}
      <section className="py-20 px-6 max-w-7xl mx-auto bg-white">
        <h2 className="text-center mb-8">Why Book With Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <p className="text-4xl mb-3">✅</p>
            <h3 className="mb-2">Verified & Trusted</h3>
            <p className="text-muted text-sm">All suppliers are verified for your safety.</p>
          </div>
          <div className="card text-center">
            <p className="text-4xl mb-3">🌍</p>
            <h3 className="mb-2">Local & Authentic</h3>
            <p className="text-muted text-sm">Genuine local experiences.</p>
          </div>
          <div className="card text-center">
            <p className="text-4xl mb-3">💰</p>
            <h3 className="mb-2">Best Value</h3>
            <p className="text-muted text-sm">Competitive prices and great value.</p>
          </div>
        </div>
      </section>

      {/* SECTION 3 — TESTIMONIALS */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-center mb-8">What Travelers Say</h2>
        <div className="card text-center">
          <p className="text-dark italic mb-4">
            "Best trip in Ethiopia! The local knowledge and hospitality were beyond my expectations."
          </p>
          <p className="font-bold">Emma L.</p>
          <p className="text-muted text-sm">United Kingdom</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-gradient text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-2xl font-bold mb-2">Twsta</p>
          <p className="text-white/70 mb-4">
            Discover Ethiopia. Authentic. Local. Unforgettable.
          </p>
          <p className="text-white/50 text-sm">
            © 2026 Twsta Ethiopia Tours. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;