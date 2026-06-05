import Hero from "@/components/Hero";
import Events from "@/components/Events";
import Volunteers from "@/components/Volunteers";
import VenueInfo from "@/components/VenueInfo";
import Info from "@/components/Info";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Events />
      <Volunteers />
      <VenueInfo />
      <Info />
      <Footer />
    </>
  );
}
