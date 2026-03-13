import { motion } from "framer-motion";
import { Droplet, Info, Sprout, TrendingDown, RefreshCw } from "lucide-react";

const topics = [
  {
    title: "What is Rainwater Harvesting?",
    desc: "The simple process of collecting and storing rainwater from roofs or ground surfaces for future use instead of letting it run off.",
    icon: Info,
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "The Indian Water Crisis",
    desc: "Despite receiving ~4000 billion cubic meters of rain annually, India captures only 8%. We are depleting groundwater faster than it recharges.",
    icon: TrendingDown,
    color: "bg-red-100 text-red-600"
  },
  {
    title: "Environmental Impact",
    desc: "Reduces soil erosion, mitigates urban flooding, and naturally replenishes underground aquifers essential for local ecosystems.",
    icon: Sprout,
    color: "bg-emerald-100 text-emerald-600"
  },
  {
    title: "Cost vs. Savings",
    desc: "A ₹15,000 system can save you ₹5,000 annually on water tankers. It pays for itself in just 3 years while providing clean water.",
    icon: RefreshCw,
    color: "bg-amber-100 text-amber-600"
  }
];

export default function Awareness() {
  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">Why Harvest Rain?</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Water is our most precious resource. Understanding the 'why' is the first step to securing it for generations to come.
          </p>
        </div>

        {/* Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {topics.map((topic, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-3xl border border-border bg-slate-50 hover:bg-white hover:shadow-xl hover:border-primary/20 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${topic.color} group-hover:scale-110 transition-transform`}>
                <topic.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold font-display mb-3">{topic.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{topic.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Info Graphic Banner */}
        <div className="bg-primary text-white rounded-3xl p-10 md:p-16 relative overflow-hidden">
          {/* abstract pattern */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <h2 className="text-3xl font-display font-bold mb-4">Did you know?</h2>
              <p className="text-primary-foreground/90 text-lg mb-6">
                Just 1 millimeter of rain over 1 square meter of roof yields 1 liter of water. During a standard monsoon, an average Indian home can collect over 50,000 liters.
              </p>
            </div>
            <div className="flex-shrink-0 w-40 h-40 bg-white/10 rounded-full flex items-center justify-center border-4 border-white/20">
              <div className="text-center">
                <div className="text-4xl font-bold font-display">1mm</div>
                <div className="text-sm uppercase tracking-wide opacity-80">= 1 Liter</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
