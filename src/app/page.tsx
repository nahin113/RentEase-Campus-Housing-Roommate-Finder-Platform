import Banner from "@/components/home/Banner";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import FeaturedStudents from "@/components/home/FeaturedStudents";
import FeatureSection from "@/components/home/FeatureSection";
import HowItWorks from "@/components/home/HowItWorks";

export default function Home() {
  return (
    <div>
      <Banner />
      <FeaturedProperties/>
      <FeatureSection />
      <FeaturedStudents/>
      <HowItWorks/>
    </div>
  );
}
