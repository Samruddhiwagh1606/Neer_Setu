import { PlayCircle } from "lucide-react";

const videos = [
  { id: "k_f5k0bOmj0", title: "DIY Rain Barrels Setup", desc: "Learn how to set up a simple rain barrel system at home for under ₹3000.", category: "Beginner" },
  { id: "ORg-DZE2yNE", title: "Rooftop Harvesting Complete Guide", desc: "Step-by-step animation of how rooftop water is collected and filtered.", category: "Intermediate" },
  { id: "2vx3nt0bRCA", title: "How to Build a Recharge Pit", desc: "Groundwater recharge techniques for individual houses and small plots.", category: "Intermediate" },
  { id: "4YD3AcR0v5U", title: "Farm Ponds & Agriculture RWH", desc: "Large scale harvesting for farmers to ensure year-round crop irrigation.", category: "Farming" },
  { id: "B39_tJBmAUA", title: "Understanding Groundwater Recharge", desc: "The science behind why we need to send water back into the earth.", category: "Science" },
  { id: "TvZMH-XNsno", title: "School RWH Project Case Study", desc: "How a government school became water independent in just one monsoon.", category: "Case Study" },
];

export default function Videos() {
  return (
    <div className="py-16 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Video Learning Library</h1>
            <p className="text-lg text-muted-foreground">
              Watch step-by-step guides, case studies, and tutorials on installing and maintaining rainwater harvesting systems.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((vid, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow group">
              <div className="aspect-video w-full bg-slate-100 relative">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${vid.id}?modestbranding=1&rel=0`}
                  title={vid.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6">
                <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{vid.category}</div>
                <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">{vid.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{vid.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
