export default function SuccessCases() {
    return (
        <section className="py-24 px-6 bg-white/[0.01] border-y border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-6xl font-display font-bold text-white uppercase tracking-tighter">Resultados <br /> Sin Fricción.</h2>
                    </div>
                    <p className="text-slate-500 font-mono text-xs tracking-widest uppercase pb-2 border-b border-marketnauta-primary/30">
                        Métricas validadas // 2025-2026
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-10 glass-card rounded-[3rem] bg-gradient-to-br from-marketnauta-primary/10 to-transparent">
                        <p className="text-marketnauta-primary font-mono text-sm mb-4">E-commerce Retail</p>
                        <h3 className="text-5xl font-display font-bold text-white mb-6">+340% ROAS</h3>
                        <p className="text-slate-400 leading-relaxed">Centralizamos la data de Meta y Google en BigQuery para optimizar el presupuesto hacia los productos de mayor LTV.</p>
                    </div>
                    <div className="p-10 glass-card rounded-[3rem]">
                        <p className="text-marketnauta-primary font-mono text-sm mb-4">SaaS B2B</p>
                        <h3 className="text-5xl font-display font-bold text-white mb-6">-45% CAC</h3>
                        <p className="text-slate-400 leading-relaxed">Reducción del costo de adquisición mediante la implementación de tracking Server-Side y modelos de atribución personalizados.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}