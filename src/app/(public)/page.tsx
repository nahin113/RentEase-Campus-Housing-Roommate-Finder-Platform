import Banner from "@/components/home/Banner";
import CampusNeighborhoods from "@/components/home/CampusNeighborhoods";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import FeaturedStudents from "@/components/home/FeaturedStudents";
import FeatureSection from "@/components/home/FeatureSection";
import HowItWorks from "@/components/home/HowItWorks";
import Reviews from "@/components/home/Reviews";

export default function Home() {
  return (
    <div>
      <Banner />
      <FeaturedProperties/>
      <FeatureSection />
      <FeaturedStudents/>
      <CampusNeighborhoods/>
      <HowItWorks/>
      <Reviews/>
    </div>
  );
}
