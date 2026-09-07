import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductRow } from "@/components/home/ProductRow";
import { QuizCta } from "@/components/home/QuizCta";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { WhyBidet } from "@/components/home/WhyBidet";
import { LatestArticles } from "@/components/home/LatestArticles";

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuizCta compact />
      <CategoryGrid />
      <ProductRow heading="Best sellers" subheading="What other customers are buying right now." limit={8} viewAllHref="/collections/all-bidets-1" viewAllLabel="Shop all bidets" muted />
      <ProductRow heading="Bidet seats" subheading="Easy install with heated seats, warm water and remotes." collectionHandle="smart-bidet-seats" />
      <BrandMarquee />
      <ProductRow heading="Bidet attachments" subheading="Non-electric, budget friendly and fits most toilets." collectionHandle="non-electric-bidet-attachments" />
      <WhyBidet />
      <ProductRow heading="Assisted toilet lifts" subheading="Dignity Lifts help you sit and stand safely and independently." collectionHandle="dignity-lifts" muted />
      <LatestArticles />
      <QuizCta />
    </>
  );
}
