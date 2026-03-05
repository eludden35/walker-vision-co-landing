import AboutUsContent from "@/components/Common/AboutUsContent";
import AnimationMovingText from "@/components/Common/AnimationMovingText";
import Cta from "@/components/Common/Cta";
import ExploreServicesCategories from "@/components/HomeRenovation/ExploreServicesCategories";
import HeroBanner from "@/components/HomeRenovation/HeroBanner";
import OurCommitment from "@/components/HomeRenovation/OurCommitment";
import OurProjects from "@/components/HomeRenovation/OurProjects";
import Footer from "@/components/Layout/Footer";
import HashScrollHandler from "@/components/Layout/HashScrollHandler";
import Navbar from "@/components/Layout/Navbar";

export default function Home() {
  return (
    <>
      <HashScrollHandler />
      <Navbar />

      <HeroBanner />

      <section id="services">
        <ExploreServicesCategories />
      </section>

      <div className="pb-120">
        <AnimationMovingText />
      </div>

      <section id="about">
        <AboutUsContent />
      </section>

      <OurCommitment />

      <section id="projects">
        <OurProjects />
      </section>

      <div className="pb-120">
        <AnimationMovingText />
      </div>

      <Cta />

      <Footer />
    </>
  );
}
