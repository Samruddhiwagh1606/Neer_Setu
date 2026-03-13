export interface Provider {
  id: number;
  name: string;
  email: string;
  phone: string;
  serviceArea: string;
  city: string;
  state: string;
  portfolio: string;
  experience: number;
  rating: number;
  reviewCount: number;
}

export interface Scheme {
  id: number;
  name: string;
  state: string;
  subsidy: string;
  eligibility: string;
  description: string;
  link: string;
}

export interface ServiceRequest {
  id: number;
  userId: number;
  providerId: number | null;
  requestType: string;
  systemType: string;
  location: string;
  preferredDate: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  notes: string;
  rating: number | null;
  review: string | null;
  userName: string;
  providerName: string | null;
  createdAt: string;
}

export interface Campaign {
  id: number;
  ngoId: number;
  title: string;
  description: string;
  targetAudience: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "planned";
}

export const PROVIDERS: Provider[] = [
  {
    id: 1,
    name: "Suresh Kumar",
    email: "suresh@neersetu.in",
    phone: "9876543210",
    serviceArea: "Mumbai, Thane, Pune",
    city: "Mumbai",
    state: "Maharashtra",
    portfolio: "Installed 50+ rooftop systems in residential areas. Specialises in urban rainwater harvesting with first-flush diverters and underground storage.",
    experience: 8,
    rating: 4.8,
    reviewCount: 32,
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@neersetu.in",
    phone: "9876543211",
    serviceArea: "Jaipur, Ajmer, Jodhpur",
    city: "Jaipur",
    state: "Rajasthan",
    portfolio: "Expert in desert-optimised harvesting systems. Works with NGOs for rural installations and government-subsidised farm ponds.",
    experience: 5,
    rating: 4.6,
    reviewCount: 18,
  },
  {
    id: 3,
    name: "Ramesh Patel",
    email: "ramesh@neersetu.in",
    phone: "9876543212",
    serviceArea: "Chennai, Coimbatore, Madurai",
    city: "Chennai",
    state: "Tamil Nadu",
    portfolio: "Certified installer with government partnership. Over 100 installations completed, including several school projects.",
    experience: 12,
    rating: 4.9,
    reviewCount: 57,
  },
  {
    id: 4,
    name: "Anita Singh",
    email: "anita@neersetu.in",
    phone: "9876543213",
    serviceArea: "Bangalore, Mysore, Hubli",
    city: "Bangalore",
    state: "Karnataka",
    portfolio: "Apartment complex specialist. Handles bulk installations for housing societies and commercial buildings.",
    experience: 6,
    rating: 4.7,
    reviewCount: 24,
  },
  {
    id: 5,
    name: "Vijay Mehta",
    email: "vijay@neersetu.in",
    phone: "9876543214",
    serviceArea: "Ahmedabad, Surat, Vadodara",
    city: "Ahmedabad",
    state: "Gujarat",
    portfolio: "Industrial and residential systems. CREDAI certified partner with experience in large-scale groundwater recharge projects.",
    experience: 10,
    rating: 4.5,
    reviewCount: 41,
  },
  {
    id: 6,
    name: "Kavita Reddy",
    email: "kavita@neersetu.in",
    phone: "9876543215",
    serviceArea: "Hyderabad, Warangal, Vijayawada",
    city: "Hyderabad",
    state: "Telangana",
    portfolio: "Farm and agricultural harvesting specialist. Has worked with 200+ farmers to set up cost-effective recharge pits.",
    experience: 7,
    rating: 4.6,
    reviewCount: 29,
  },
  {
    id: 7,
    name: "Mohan Das",
    email: "mohan@neersetu.in",
    phone: "9876543216",
    serviceArea: "Bhopal, Indore, Gwalior",
    city: "Bhopal",
    state: "Madhya Pradesh",
    portfolio: "Specialises in low-cost matka filtration and traditional storage systems blending modern engineering with local knowledge.",
    experience: 9,
    rating: 4.4,
    reviewCount: 35,
  },
  {
    id: 8,
    name: "Sunita Nair",
    email: "sunita@neersetu.in",
    phone: "9876543217",
    serviceArea: "Kochi, Thiruvananthapuram, Kozhikode",
    city: "Kochi",
    state: "Kerala",
    portfolio: "Expert in high-rainfall region systems. Designs overflow management and efficient storage solutions for Kerala's monsoon climate.",
    experience: 4,
    rating: 4.7,
    reviewCount: 15,
  },
  {
    id: 9,
    name: "Arjun Verma",
    email: "arjun@neersetu.in",
    phone: "9876543218",
    serviceArea: "Lucknow, Kanpur, Agra",
    city: "Lucknow",
    state: "Uttar Pradesh",
    portfolio: "Budget system expert. Builds rain barrel networks and gravity-fed systems under ₹5,000 for lower-income households.",
    experience: 3,
    rating: 4.3,
    reviewCount: 11,
  },
  {
    id: 10,
    name: "Deepika Iyer",
    email: "deepika@neersetu.in",
    phone: "9876543219",
    serviceArea: "Coimbatore, Salem, Erode",
    city: "Coimbatore",
    state: "Tamil Nadu",
    portfolio: "Rooftop and terrace specialist with expertise in textile factory water recycling and industrial effluent reuse.",
    experience: 11,
    rating: 4.8,
    reviewCount: 48,
  },
];

export const SCHEMES: Scheme[] = [
  {
    id: 1,
    name: "Maharashtra Water Resources Regulatory Authority (MWRRA) Scheme",
    state: "Maharashtra",
    subsidy: "75% subsidy up to ₹50,000",
    eligibility: "Residential buildings & societies with rooftop area > 50 sqm",
    description: "State-funded scheme for rooftop rainwater harvesting systems in urban areas of Maharashtra. New constructions above 1,000 sqm are mandated.",
    link: "https://mwrra.org",
  },
  {
    id: 2,
    name: "Mukhyamantri Jal Swavlamban Abhiyan",
    state: "Rajasthan",
    subsidy: "Up to ₹50,000 per structure",
    eligibility: "Farmers and rural households in water-scarce districts",
    description: "Comprehensive water conservation scheme covering rainwater harvesting structures, check dams, and recharge pits to improve groundwater levels.",
    link: "https://mjsa.rajasthan.gov.in",
  },
  {
    id: 3,
    name: "Tamil Nadu Rainwater Harvesting Scheme",
    state: "Tamil Nadu",
    subsidy: "50% subsidy up to ₹25,000",
    eligibility: "All residential and commercial buildings in urban local bodies",
    description: "Mandated rainwater harvesting with government subsidy for new constructions and retrofits. Property tax rebates for compliant buildings.",
    link: "https://tn.gov.in/waterboard",
  },
  {
    id: 4,
    name: "Karnataka Watershed Development Program",
    state: "Karnataka",
    subsidy: "60% subsidy for rural areas",
    eligibility: "Farmers with agricultural land in notified water-scarce taluks",
    description: "Farm pond construction, rooftop harvesting systems, and groundwater recharge structures subsidised by the state government.",
    link: "https://warcom.kar.nic.in",
  },
  {
    id: 5,
    name: "Gujarat Water & Sanitation Management Organization",
    state: "Gujarat",
    subsidy: "90% subsidy for BPL households",
    eligibility: "BPL families and tribal communities in rural Gujarat",
    description: "Free rainwater harvesting installation for below-poverty-line families. Tribal belt communities get 100% government funding.",
    link: "https://gwssb.guj.gov.in",
  },
  {
    id: 6,
    name: "Delhi Jal Board Rooftop Harvesting Scheme",
    state: "Delhi",
    subsidy: "₹10,000 flat rebate on water bill",
    eligibility: "Residential plots above 100 sqm in Delhi NCT",
    description: "Water bill rebate and installation support for rooftop rainwater harvesting systems. Plots above 500 sqm receive free technical consultation.",
    link: "https://delhijalboard.nic.in",
  },
];

export const STORAGE_KEYS = {
  TOKEN: "neersetu_token",
  USER: "neersetu_user",
  REQUESTS: "neersetu_requests",
  SAVED_PROVIDERS: "neersetu_saved_providers",
  CAMPAIGNS: "neersetu_campaigns",
};

export function getRequests(): ServiceRequest[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || "[]");
  } catch { return []; }
}

export function saveRequests(requests: ServiceRequest[]) {
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
}

export function getSavedProviderIds(userId: number): number[] {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_PROVIDERS) || "{}");
    return all[userId] || [];
  } catch { return []; }
}

export function saveFavoriteProvider(userId: number, providerId: number) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_PROVIDERS) || "{}");
  const ids: number[] = all[userId] || [];
  if (!ids.includes(providerId)) ids.push(providerId);
  all[userId] = ids;
  localStorage.setItem(STORAGE_KEYS.SAVED_PROVIDERS, JSON.stringify(all));
}

export function removeFavoriteProvider(userId: number, providerId: number) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_PROVIDERS) || "{}");
  all[userId] = (all[userId] || []).filter((id: number) => id !== providerId);
  localStorage.setItem(STORAGE_KEYS.SAVED_PROVIDERS, JSON.stringify(all));
}

export function getCampaigns(ngoId: number): Campaign[] {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.CAMPAIGNS) || "{}");
    return all[ngoId] || [];
  } catch { return []; }
}

export function addCampaign(ngoId: number, campaign: Omit<Campaign, "id" | "ngoId">) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.CAMPAIGNS) || "{}");
  const list: Campaign[] = all[ngoId] || [];
  const newCampaign: Campaign = { ...campaign, id: Date.now(), ngoId };
  all[ngoId] = [...list, newCampaign];
  localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(all));
  return newCampaign;
}
