import Banner from "@/components/home/Banner";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import FeaturedStudents from "@/components/home/FeaturedStudents";
import FeatureSection from "@/components/home/FeatureSection";

export default function Home() {
  return (
    <div>
      <Banner />
      <FeaturedProperties/>
      <FeatureSection />
      <FeaturedStudents/>
    </div>
  );
}
