import { CategoriesGrid } from "@/components/sections/categories-grid";
import { DownloadApp } from "@/components/sections/download-app";
import { FeaturedWorkers } from "@/components/sections/featured-workers";
import { Hero } from "@/components/sections/hero";
import { LatestJobs } from "@/components/sections/latest-jobs";
import { SearchBar } from "@/components/sections/search-bar";
import { Statistics } from "@/components/sections/statistics";
import { WhyChoose } from "@/components/sections/why-choose";

export default function HomePage() {
  return (
    <>
      {/* Hero + Hero Search */}
      <Hero />

      {/* Platform Statistics */}
      <Statistics />

      {/* Categories */}
      <CategoriesGrid />

      {/* Second Search Bar */}
      <SearchBar />

      {/* Featured Workers */}
      <FeaturedWorkers />

      {/* Latest Jobs */}
      <LatestJobs />

      {/* Why Choose */}
      <WhyChoose />

      {/* Download App */}
      <DownloadApp />
    </>
  );
}