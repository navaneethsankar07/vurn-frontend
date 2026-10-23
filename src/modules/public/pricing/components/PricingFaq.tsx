const FAQS = [
  {
    q: "Is Vurn free?",
    a: "Yes. Only AI credits are paid.",
  },
  {
    q: "Can I use Vurn without buying credits?",
    a: "Yes. Every engineering feature works without AI.",
  },
  {
    q: "Do AI credits expire?",
    a: "No.",
  },
  {
    q: "Are AI credits shared?",
    a: "Yes. Credits belong to the organization.",
  },
];

export function PricingFaq() {
  return (
    <section className="px-6 py-16 max-w-8xl mx-35 font-mono">
      <div className="space-y-4 mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          Frequently asked questions
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FAQS.map((faq, idx) => (
          <div
            key={idx}
            className="border border-white/10 rounded-xs bg-[#0C0C0E] p-6 space-y-2"
          >
            <h3 className="text-sm font-bold text-white font-sans">{faq.q}</h3>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
