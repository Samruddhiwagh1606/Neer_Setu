import { motion } from "framer-motion";
import { CheckCircle2, IndianRupee, Wrench, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const systems = [
  {
    tier: "Low Cost",
    price: "₹2,000 - ₹5,000",
    color: "bg-emerald-50 border-emerald-200",
    textColor: "text-emerald-700",
    btnColor: "bg-emerald-600 hover:bg-emerald-700",
    items: [
      {
        name: "Rain Barrels",
        desc: "Simple collection for gardening and outdoor use.",
        difficulty: "Easy",
        benefits: ["DIY Installation", "Zero energy cost", "Perfect for small gardens"]
      },
      {
        name: "Matka Filtration",
        desc: "Traditional low-cost filtration using earthen pots.",
        difficulty: "Easy",
        benefits: ["Natural filtration", "Extremely cheap", "Readily available materials"]
      },
      {
        name: "Simple Recharge Pits",
        desc: "Small pits to direct runoff into the ground.",
        difficulty: "Medium",
        benefits: ["Improves local water table", "Prevents yard flooding", "Low maintenance"]
      }
    ]
  },
  {
    tier: "Medium Cost",
    price: "₹5,000 - ₹15,000",
    color: "bg-blue-50 border-blue-200 shadow-xl scale-105 z-10",
    textColor: "text-blue-700",
    btnColor: "bg-blue-600 hover:bg-blue-700",
    badge: "Most Popular",
    items: [
      {
        name: "Terrace Drum System",
        desc: "Connected drums with basic filtration for secondary use.",
        difficulty: "Medium",
        benefits: ["Stores 500-1000L", "Good for car wash/cleaning", "Moderate setup time"]
      },
      {
        name: "Rooftop to Borewell",
        desc: "Filtering roof water directly into existing dry borewells.",
        difficulty: "Medium",
        benefits: ["Revives dry borewells", "Handles large volumes", "High environmental impact"]
      }
    ]
  },
  {
    tier: "Advanced",
    price: "₹15,000+",
    color: "bg-slate-50 border-slate-200",
    textColor: "text-slate-700",
    btnColor: "bg-slate-800 hover:bg-slate-900",
    items: [
      {
        name: "Underground Tanks",
        desc: "Large capacity concrete or syntax tanks for year-round supply.",
        difficulty: "Expert",
        benefits: ["Massive storage (5000L+)", "Out of sight", "Full home integration possible"]
      },
      {
        name: "Apartment Complexes",
        desc: "Centralized dual plumbing and massive recharge trenches.",
        difficulty: "Expert",
        benefits: ["Serves 100+ families", "Mandatory in some states", "Huge ROI long term"]
      }
    ]
  }
];

export default function Systems() {
  return (
    <div className="py-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">Affordable Systems</h1>
          <p className="text-lg text-muted-foreground">
            Rainwater harvesting doesn't have to be expensive. Explore solutions ranging from simple DIY setups to advanced community systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pt-8">
          {systems.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`relative rounded-3xl border p-8 ${tier.color} transition-transform duration-300`}
            >
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-primary/80 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md uppercase tracking-wider">
                  {tier.badge}
                </div>
              )}
              
              <div className="text-center mb-8">
                <h2 className={`text-xl font-bold uppercase tracking-wide mb-2 ${tier.textColor}`}>{tier.tier}</h2>
                <div className="text-3xl font-display font-extrabold text-foreground flex items-center justify-center">
                  {tier.price}
                </div>
              </div>

              <div className="space-y-6">
                {tier.items.map((item, j) => (
                  <div key={j} className="bg-white rounded-2xl p-5 shadow-sm border border-border/50">
                    <h3 className="font-bold text-foreground mb-1 text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                    
                    <div className="flex items-center text-xs font-medium text-slate-500 mb-3 bg-slate-100 w-fit px-2.5 py-1 rounded-md">
                      <Wrench className="w-3 h-3 mr-1.5" /> Difficulty: {item.difficulty}
                    </div>

                    <ul className="space-y-2">
                      {item.benefits.map((ben, k) => (
                         <li key={k} className="flex items-start text-sm text-slate-700">
                           <CheckCircle2 className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${tier.textColor}`} />
                           <span>{ben}</span>
                         </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/providers">
                  <Button className={`w-full rounded-xl py-6 text-white shadow-md hover:-translate-y-0.5 transition-all ${tier.btnColor}`}>
                    Find Installers
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
