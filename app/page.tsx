import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden py-24 md:py-32 lg:py-48 bg-background">
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[100px] rounded-full mix-blend-multiply opacity-50 z-0" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-accent/20 blur-[80px] rounded-full mix-blend-multiply opacity-50 z-0" />

        <div className="container relative z-10 mx-auto px-6 text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-text-primary mb-6 text-balance">
            Cook something <span className="text-primary relative inline-block">amazing<svg className="absolute w-full h-3 -bottom-1 left-0 text-accent" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent"/></svg></span> today
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary mb-10 text-balance max-w-2xl mx-auto leading-relaxed">
            Discover, create, and organize your favorite recipes — all in one beautifully crafted place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-2xl shadow-lg hover:-translate-y-1 transition-transform">
                Start cooking
              </Button>
            </Link>
            <Link href="/recipes">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-2xl bg-surface/50 backdrop-blur">
                Browse recipes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface relative z-10 border-t border-border">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Everything you need</h2>
            <p className="text-lg text-text-secondary">A complete toolkit to manage your culinary adventures.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FilterIcon />}
              title="Smart ingredient filtering"
              description="Find precisely the recipes you can make with what you already have in your fridge right now."
            />
            <FeatureCard 
              icon={<TagIcon />}
              title="Tag your favorites"
              description="Organize recipes your way. Create custom tags for diet types, meal occasions, or pure cravings."
            />
            <FeatureCard 
              icon={<ShareIcon />}
              title="Share your creations"
              description="Upload mouthwatering photos, calculate costs, and share external links to original sources."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
      <p className="text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}

// Simple placeholder icons
function FilterIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}
