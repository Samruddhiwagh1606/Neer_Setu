import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Droplets, ShieldCheck, Sprout, HandHeart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image - Absolute positioned */}
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Water conservation background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-20 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20">
                <Droplets className="w-4 h-4" />
                <span>Save Water, Secure the Future</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-foreground leading-[1.1] mb-6">
                Making Rainwater Harvesting <span className="text-gradient">Affordable</span> & Accessible
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Connect with verified local providers, claim government subsidies, and install rainwater harvesting systems at your home, apartment, or farm seamlessly.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/systems">
                  <Button size="lg" className="w-full sm:w-auto rounded-full px-8 py-6 text-lg shadow-lg shadow-primary/25 hover:-translate-y-1 transition-transform">
                    Explore Systems
                  </Button>
                </Link>
                <Link href="/providers">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 py-6 text-lg border-2 hover:bg-muted transition-colors">
                    Find a Provider <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
              
              <div className="mt-12 flex items-center space-x-8 text-sm font-medium text-muted-foreground">
                <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-secondary mr-2"/> Verified Pros</div>
                <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-secondary mr-2"/> Gov Subsidies</div>
                <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-secondary mr-2"/> Low Cost</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">The Crisis is Real. The Solution is Here.</h2>
            <p className="text-muted-foreground">India receives abundant rainfall, yet faces severe water stress. It's time to capture what falls from the sky.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { stat: "60%", label: "Rainwater Wasted", desc: "Most urban rainwater flows into drains. Let's catch it.", color: "text-destructive" },
              { stat: "600M", label: "Face Water Stress", desc: "Almost half of India's population struggles with water access.", color: "text-primary" },
              { stat: "50k L", label: "Saved Annually", desc: "A standard 100sqm roof can harvest 50,000 liters per year.", color: "text-secondary" }
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-muted/30 rounded-3xl p-8 text-center border border-border/50 hover-elevate"
              >
                <div className={`text-5xl font-display font-bold ${s.color} mb-2`}>{s.stat}</div>
                <div className="text-lg font-semibold text-foreground mb-3">{s.label}</div>
                <p className="text-muted-foreground text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-slate-50 relative">
        <div className="absolute inset-0 opacity-[0.03] z-0" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/pattern-dots.png)` }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">How NeerSetu Works</h2>
            <p className="text-muted-foreground">Three simple steps to secure your water future.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-border -translate-y-1/2 z-0"></div>

            {[
              { step: "01", title: "Choose a System", desc: "Browse affordable systems suited for your space.", icon: ShieldCheck },
              { step: "02", title: "Find a Provider", desc: "Connect with verified local installation experts.", icon: HandHeart },
              { step: "03", title: "Get Installed", desc: "Apply for schemes and get your system running.", icon: Sprout }
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center bg-white p-8 rounded-3xl shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-primary/20 rotate-3 hover:rotate-0 transition-transform">
                  <s.icon className="w-8 h-8" />
                </div>
                <div className="text-sm font-bold text-primary mb-2 tracking-widest uppercase">STEP {s.step}</div>
                <h3 className="text-xl font-bold text-foreground mb-3">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials snippet */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Droplets className="w-12 h-12 mx-auto text-primary-foreground/50 mb-8" />
          <h2 className="text-2xl md:text-4xl font-display font-medium leading-tight mb-8">
            "We installed a simple rooftop system through NeerSetu for just ₹12,000. It paid for itself in water tanker savings within 8 months. Every home should have this."
          </h2>
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
              R
            </div>
            <div className="text-left">
              <div className="font-semibold">Rajesh Kumar</div>
              <div className="text-primary-foreground/70 text-sm">Homeowner, Bangalore</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
