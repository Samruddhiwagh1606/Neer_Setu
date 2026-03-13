import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  type: 'bot' | 'user';
  text: string;
}

const FAQ_RESPONSES = [
  { keywords: ['house', 'home', 'residential'], response: "For a standard home, we recommend a rooftop rainwater harvesting system costing ₹8,000-₹15,000. It can collect 50,000+ litres per year." },
  { keywords: ['apartment', 'flat', 'building'], response: "Apartments need centralized terrace collection systems. Cost: ₹15,000-₹50,000 for the building. Contact an NGO to coordinate." },
  { keywords: ['farm', 'rural', 'agriculture', 'field'], response: "For farms, recharge pits (₹2,000-₹5,000) or farm ponds work well. Rajasthan and Maharashtra offer subsidies up to 50%." },
  { keywords: ['cost', 'price', 'expensive', 'money', 'budget'], response: "Systems range from ₹2,000 (simple rain barrels) to ₹50,000+ (underground tanks). Government subsidies can cover 50-90% of costs." },
  { keywords: ['scheme', 'government', 'subsidy', 'policy'], response: "Multiple state schemes are available! Maharashtra MWRRA offers 75% subsidy, Rajasthan Mukhyamantri Jal Swavlamban gives ₹50,000 per structure. Check our Schemes page." },
  { keywords: ['school', 'education'], response: "Schools can install rooftop systems for ₹10,000-₹30,000. Many NGOs offer free installation for government schools. Contact us!" }
];

const DEFAULT_RESPONSE = "Hi! I'm NeerSetu's assistant. I can help you with information about rainwater harvesting systems, costs, government schemes, and finding providers. What would you like to know?";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', type: 'bot', text: DEFAULT_RESPONSE }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', text: userMsg }]);
    setInput("");

    // Simple keyword matching logic
    setTimeout(() => {
      const lowerInput = userMsg.toLowerCase();
      let foundMatch = false;

      for (const faq of FAQ_RESPONSES) {
        if (faq.keywords.some(kw => lowerInput.includes(kw))) {
          setMessages(prev => [...prev, { id: Date.now().toString(), type: 'bot', text: faq.response }]);
          foundMatch = true;
          break;
        }
      }

      if (!foundMatch) {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          type: 'bot', 
          text: "I'm still learning! For specific details, please check our awareness pages or submit a consultation request." 
        }]);
      }
    }, 600);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform z-50"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] bg-white rounded-2xl shadow-2xl border border-border/50 z-50 flex flex-col overflow-hidden"
            style={{ height: '500px', maxHeight: '80vh' }}
          >
            {/* Header */}
            <div className="bg-primary px-4 py-4 flex items-center justify-between text-primary-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">NeerSetu Assistant</h3>
                  <p className="text-xs text-primary-foreground/80">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-md transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[80%] space-x-2 ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${msg.type === 'user' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>
                      {msg.type === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                    </div>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                      msg.type === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                        : 'bg-white border border-border shadow-sm rounded-tl-sm text-foreground'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-border">
              <form onSubmit={handleSend} className="flex items-center space-x-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about systems, costs, schemes..."
                  className="flex-1 bg-muted/50 border border-border rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <Button type="submit" size="icon" className="rounded-full flex-shrink-0" disabled={!input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
