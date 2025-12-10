import AboutUsContent from "@/components/Common/AboutUsContent";
import AnimationMovingText from "@/components/Common/AnimationMovingText";
import Cta from "@/components/Common/Cta";
import MeetTheTeams from "@/components/Common/MeetTheTeams";
import Testimonials from "@/components/Common/Testimonials";
import AreasWeServe from "@/components/HomeRenovation/AreasWeServe";
import BlogPosts from "@/components/HomeRenovation/BlogPosts";
import ExploreServicesCategories from "@/components/HomeRenovation/ExploreServicesCategories";
import HeroBanner from "@/components/HomeRenovation/HeroBanner";
import OurCommitment from "@/components/HomeRenovation/OurCommitment";
import OurProjects from "@/components/HomeRenovation/OurProjects";
import WhatWeOffers from "@/components/HomeRenovation/WhatWeOffers";
import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <HeroBanner />

      <ExploreServicesCategories />

      <div className="pb-120">
        <AnimationMovingText />
      </div>

      <AboutUsContent />

      {/* <WhatWeOffers /> */}

      <OurCommitment />

      <OurProjects />

      <div className="pb-120">
        <AnimationMovingText />
      </div>

      <Cta />

      {/* <Testimonials /> */}

      <MeetTheTeams />

      <AreasWeServe />

      <BlogPosts />

      <Footer />
    </>
  );
}
