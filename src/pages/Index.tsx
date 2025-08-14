import Navigation from '@/components/Navigation';
import HeroSection from '@/components/Dashboard/HeroSection';
import StatsCards from '@/components/Dashboard/StatsCards';
import ActivityFeed from '@/components/Dashboard/ActivityFeed';
import QuickStats from '@/components/Dashboard/QuickStats';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="mb-8">
          <HeroSection />
        </section>

        {/* Statistics Cards */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-foreground font-cairo mb-6 animate-fade-in">
            نظرة عامة على الأداء
          </h2>
          <StatsCards />
        </section>

        {/* Activity and Quick Stats */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
          <div className="lg:col-span-1">
            <QuickStats />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
