export interface BrandInfo {
  name: string;
  logoUrl: string;
  address: string;
  phone: string;
  email: string;
  facebookUrl: string;
}

export interface HeroSection {
  headline: string;
  subtitle: string;
  ctaText: string;
  secondaryCtaText: string;
}

export interface BACMethodology {
  believe: string;
  active: string;
  control: string;
}

export interface Course {
  id: string;
  title: string;
  ageGroup: string;
  duration: string;
  description: string;
  features: string[];
}

export interface SiteContent {
  brand: BrandInfo;
  hero: HeroSection;
  bac: BACMethodology;
  courses: Course[];
  updatedAt: string;
}
