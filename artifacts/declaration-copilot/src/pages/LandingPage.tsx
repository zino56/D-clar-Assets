import { useState, useEffect, Suspense, lazy } from "react";
import { Link } from "wouter";
import { Clock, ArrowRight, Menu, X, ShieldCheck, FileUp, Cpu, CheckCircle2, FileText, Brain, Calculator } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "../components/FadeIn";

// Safe import for shaders — all must be inside a <Shader> root component
const ShaderRoot = lazy(() => import("shaders/react").then(m => ({ default: m.Shader })).catch(() => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> })));
const Swirl = lazy(() => import("shaders/react").then(m => ({ default: m.Swirl })).catch(() => ({ default: () => null })));
const ChromaFlow = lazy(() => import("shaders/react").then(m => ({ default: m.ChromaFlow })).catch(() => ({ default: () => null })));
const FlutedGlass = lazy(() => import("shaders/react").then(m => ({ default: m.FlutedGlass })).catch(() => ({ default: () => null })));
const FilmGrain = lazy(() => import("shaders/react").then(m => ({ default: m.FilmGrain })).catch(() => ({ default: () => null })));

function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const str = new Intl.DateTimeFormat("fr-DZ", {
          timeZone: "Africa/Algiers",
          hour: "2-digit",
          minute: "2-digit"
        }).format(new Date());
        setTime(`${str} à Alger`);
      } catch (e) {
        setTime("Alger");
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return <span className="text-[13px] text-gray-600">{time}</span>;
}

function HoverRollText({ text }: { text: string }) {
  return (
    <span className="relative overflow-hidden h-[20px] flex items-center">
      <span className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
        <span className="h-[20px] flex items-center leading-none">{text}</span>
        <span className="h-[20px] flex items-center leading-none">{text}</span>
      </span>
    </span>
  );
}

const anomalies = [
  { color: "bg-red-500", code: "ANOMALIE_NIF_ACHAT", codeColor: "text-red-600", desc: "NIF fournisseur absent — TVA déductible rejetée" },
  { color: "bg-red-500", code: "ANOMALIE_RC_ACHAT", codeColor: "text-red-600", desc: "RC fournisseur absent — TVA déductible rejetée" },
  { color: "bg-orange-500", code: "ANOMALIE_ART_ACHAT", codeColor: "text-orange-600", desc: "Article d'imposition absent — déductibilité risquée" },
  { color: "bg-orange-500", code: "ANOMALIE_ADRESSE_ACHAT", codeColor: "text-orange-600", desc: "Adresse fournisseur manquante" },
  { color: "bg-yellow-500", code: "ANOMALIE_MODE_PAIEMENT_VENTE", codeColor: "text-yellow-700", desc: "Mode de paiement non renseigné" },
  { color: "bg-red-700", code: "ANOMALIE_ESPECE_VENTE", codeColor: "text-red-800", desc: "Paiement espèces > 1.000.000 DA — infraction légale" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoConfirmed, setDemoConfirmed] = useState(false);
  const [accessConfirmed, setAccessConfirmed] = useState(false);

  return (
    <div className="w-full bg-[#F4F3EF] min-h-screen text-[#1C1A16] font-sans selection:bg-[#1A6B5E] selection:text-white">

      {/* ─── SECTION 1: HERO — no entrance animations (above fold) ─── */}
      <section className="relative w-full min-h-[100dvh] flex flex-col overflow-hidden">
        {/* Shaders Background */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <Suspense fallback={null}>
            <ShaderRoot style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <Swirl colorA="#f4f3ef" colorB="#e8e6e0" detail={1.4} />
              <ChromaFlow baseColor="#f4f3ef" downColor="#1A6B5E" leftColor="#1A6B5E" rightColor="#1A6B5E" upColor="#1A6B5E" momentum={10} radius={3.2} />
              <FlutedGlass aberration={0.45} angle={25} frequency={7} highlight={0.10} highlightSoftness={0} lightAngle={-80} refraction={3.5} shape="rounded" softness={1} speed={0.12} />
              <FilmGrain strength={0.04} />
            </ShaderRoot>
          </Suspense>
        </div>

        {/* Navbar */}
        <div className="relative z-20 w-full max-w-[1440px] mx-auto p-2 sm:p-3">
          <nav className="bg-white rounded-full shadow-sm p-[5px] flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-[#141210] rounded-full flex items-center justify-center text-white text-[10px] sm:text-[11px] font-bold tracking-tight">
                DC
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <a href="#features" className="text-[14px] text-gray-900 hover:text-[#1A6B5E] transition-colors duration-300">Fonctionnalités</a>
                <a href="#how" className="text-[14px] text-gray-900 hover:text-[#1A6B5E] transition-colors duration-300">Comment ça marche</a>
                <a href="#pricing" className="text-[14px] text-gray-900 hover:text-[#1A6B5E] transition-colors duration-300">Tarifs</a>
                <a href="#contact" className="text-[14px] text-gray-900 hover:text-[#1A6B5E] transition-colors duration-300">Contact</a>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <span className="hidden lg:block text-[13px] text-gray-500">Disponible pour comptables algériens</span>
              <div className="flex items-center gap-1.5 px-3">
                <Clock className="w-3.5 h-3.5 text-gray-600" />
                <LiveClock />
              </div>
              {demoConfirmed ? (
                <span className="text-[13px] text-[#1A6B5E] font-medium px-4 py-2 bg-[#1A6B5E]/8 rounded-full flex items-center gap-2" data-testid="btn-demo-nav-confirmed">
                  <CheckCircle2 className="w-4 h-4" />
                  Merci — nous vous contacterons sous 24h.
                </span>
              ) : (
                <button onClick={() => setDemoConfirmed(true)} className="group bg-[#141210] text-white text-[13px] font-medium rounded-full pl-5 pr-2 py-2 flex items-center gap-3 hover:bg-black transition-colors" data-testid="btn-demo-nav">
                  <HoverRollText text="Demander une démo" />
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5 text-[#141210] transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45" />
                  </div>
                </button>
              )}
            </div>

            <button
              className="md:hidden w-9 h-9 sm:w-10 sm:h-10 bg-[#141210] rounded-full flex items-center justify-center text-white mr-1"
              onClick={() => setMobileMenuOpen(true)}
              data-testid="btn-menu-open"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black/60 md:hidden flex flex-col justify-end"
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className="bg-white rounded-2xl mx-3 mb-3 p-6 flex flex-col"
              >
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                    <Clock className="w-3.5 h-3.5 text-gray-600" />
                    <LiveClock />
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center" data-testid="btn-menu-close">
                    <X className="w-5 h-5 text-gray-900" />
                  </button>
                </div>

                <div className="flex flex-col gap-4 mb-10">
                  <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-[28px] sm:text-[32px] font-medium leading-none tracking-tight">Fonctionnalités</a>
                  <a href="#how" onClick={() => setMobileMenuOpen(false)} className="text-[28px] sm:text-[32px] font-medium leading-none tracking-tight">Comment ça marche</a>
                  <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-[28px] sm:text-[32px] font-medium leading-none tracking-tight">Tarifs</a>
                  <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-[28px] sm:text-[32px] font-medium leading-none tracking-tight">Contact</a>
                </div>

                <button className="w-full bg-[#1A6B5E] text-white text-[16px] font-medium rounded-full py-4 flex items-center justify-center gap-2" data-testid="btn-start-mobile">
                  Commencer gratuitement
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Content — no FadeIn (above fold) */}
        <div className="relative z-20 flex-1 flex flex-col justify-end w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20">
          <div className="max-w-4xl">
            <p className="text-[13px] sm:text-[14px] text-[#1C1A16] tracking-wide mb-5 sm:mb-8 font-medium">Déclaration Copilot</p>
            <h1 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-[600] leading-[1.08] tracking-[-0.03em] text-[#1C1A16]">
              Vos documents G50, <br className="hidden sm:block" /><span className="sm:hidden"> </span>prêts à déclarer — <br className="hidden sm:block" /><span className="sm:hidden"> </span>sans effort, sans erreur.
            </h1>
            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
              <button className="group bg-[#1A6B5E] hover:bg-[#145549] text-white text-[13px] sm:text-[14px] font-medium rounded-full pl-5 sm:pl-6 pr-2 py-2 flex items-center gap-3 transition-colors" data-testid="btn-start-hero">
                <HoverRollText text="Commencer maintenant" />
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1A6B5E] transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45" />
                </div>
              </button>
              <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-[4px] px-3 py-2 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#1A6B5E]" />
                <span className="text-[13px] sm:text-[14px] font-medium">Fiscalité algérienne 2025</span>
                <span className="text-[10px] sm:text-[11px] bg-[#141210] text-white px-2 py-0.5 rounded font-medium tracking-wide">DGI Aligné</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: WHAT IT DOES ─── */}
      <section className="bg-white py-16 sm:py-20 lg:py-32 w-full">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">

          <FadeIn delay={0}>
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1A6B5E] text-white text-[11px] font-semibold flex items-center justify-center">1</div>
              <div className="text-[12px] font-medium border border-gray-200 rounded-full px-3 sm:px-4 py-1 text-[#1C1A16]">Ce que fait le Copilot</div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-[#1C1A16] mb-12 sm:mb-16 lg:mb-28 max-w-4xl">
              OCR, extraction, scoring G50 — <br className="hidden sm:block" /><span className="sm:hidden"> </span>tout le pipeline, sans saisie manuelle.
            </h2>
          </FadeIn>

          {/* Desktop Layout */}
          <div className="hidden lg:grid grid-cols-[26%_1fr_48%] items-end gap-6 xl:gap-8">
            <FadeIn delay={0.15} direction="left">
              <div className="self-end bg-[#F4F3EF] rounded-2xl p-6">
                <h3 className="text-[14px] font-semibold mb-4 text-[#1C1A16]">Pipeline automatique</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3 items-start">
                    <FileUp className="w-4 h-4 text-[#1A6B5E] mt-0.5 flex-shrink-0" />
                    <span className="text-[13px] text-[#1C1A16] font-medium">OCR extraction</span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <Cpu className="w-4 h-4 text-[#1A6B5E] mt-0.5 flex-shrink-0" />
                    <span className="text-[13px] text-[#1C1A16] font-medium">Classification Hermes</span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <CheckCircle2 className="w-4 h-4 text-[#1A6B5E] mt-0.5 flex-shrink-0" />
                    <span className="text-[13px] text-[#1C1A16] font-medium">Vérification arithmétique</span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <FileText className="w-4 h-4 text-[#E8A020] mt-0.5 flex-shrink-0" />
                    <span className="text-[13px] text-[#E8A020] font-medium">Score G50 + statut</span>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="self-start flex flex-col justify-end h-full pt-8">
                <p className="text-[16px] xl:text-[18px] leading-[1.65] text-[#1C1A16] max-w-[38ch] mb-8">
                  Importez une facture, un bon de livraison ou tout document DGI. Le Copilot extrait les champs, vérifie les calculs TVA, détecte les anomalies fiscales et vous dit exactement ce qui manque pour votre G50.
                </p>
                <div>
                  <button className="group bg-[#1A6B5E] hover:bg-[#145549] text-white text-[13px] font-medium rounded-full pl-5 pr-2 py-2 inline-flex items-center gap-3 transition-colors" data-testid="btn-demo-section2">
                    <HoverRollText text="Voir la démo" />
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <ArrowRight className="w-3.5 h-3.5 text-[#1A6B5E] transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45" />
                    </div>
                  </button>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.25} direction="right">
              <div className="self-end bg-[#141210] rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A6B5E] animate-pulse"></div>
                  <h3 className="text-[12px] text-gray-400 font-medium tracking-wide uppercase">Document analysé</h3>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center py-2.5 border-b border-white/10">
                    <span className="text-[13px] text-gray-300">NIF Fournisseur</span>
                    <span className="text-[10px] bg-green-900/50 text-green-400 px-2 py-0.5 rounded font-semibold tracking-wider">TROUVÉ</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-white/10">
                    <span className="text-[13px] text-gray-300">RC Fournisseur</span>
                    <span className="text-[10px] bg-red-900/50 text-red-400 px-2 py-0.5 rounded font-semibold tracking-wider">MANQUANT</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-white/10">
                    <span className="text-[13px] text-gray-300">Calcul TVA HT+TVA=TTC</span>
                    <span className="text-[10px] bg-green-900/50 text-green-400 px-2 py-0.5 rounded font-semibold tracking-wider">VÉRIFIÉ</span>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="text-[12px] text-gray-400 mb-2 font-medium tracking-wide">Score G50</div>
                  <div className="h-2 bg-white/10 rounded-full w-full overflow-hidden">
                    <div className="h-full bg-[#1A6B5E] w-[65%] rounded-full"></div>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-2 font-medium">65 / 100 — INCOMPLET</div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden flex flex-col gap-8">
            <FadeIn delay={0.15}>
              <div>
                <p className="text-[16px] leading-[1.65] text-[#1C1A16] mb-6">
                  Importez une facture, un bon de livraison ou tout document DGI. Le Copilot extrait les champs, vérifie les calculs TVA, détecte les anomalies fiscales et vous dit exactement ce qui manque pour votre G50.
                </p>
                <button className="group bg-[#1A6B5E] hover:bg-[#145549] text-white text-[13px] font-medium rounded-full pl-5 pr-2 py-2 inline-flex items-center gap-3 transition-colors" data-testid="btn-demo-section2-mobile">
                  <HoverRollText text="Voir la démo" />
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5 text-[#1A6B5E] transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45" />
                  </div>
                </button>
              </div>
            </FadeIn>

            <FadeIn delay={0.25}>
              <div className="bg-[#141210] rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A6B5E] animate-pulse"></div>
                  <h3 className="text-[12px] text-gray-400 font-medium tracking-wide uppercase">Document analysé</h3>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center py-2.5 border-b border-white/10">
                    <span className="text-[13px] text-gray-300">NIF Fournisseur</span>
                    <span className="text-[10px] bg-green-900/50 text-green-400 px-2 py-0.5 rounded font-semibold tracking-wider">TROUVÉ</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-white/10">
                    <span className="text-[13px] text-gray-300">RC Fournisseur</span>
                    <span className="text-[10px] bg-red-900/50 text-red-400 px-2 py-0.5 rounded font-semibold tracking-wider">MANQUANT</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-white/10">
                    <span className="text-[13px] text-gray-300">Calcul TVA HT+TVA=TTC</span>
                    <span className="text-[10px] bg-green-900/50 text-green-400 px-2 py-0.5 rounded font-semibold tracking-wider">VÉRIFIÉ</span>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="text-[12px] text-gray-400 mb-2 font-medium tracking-wide">Score G50</div>
                  <div className="h-2 bg-white/10 rounded-full w-full overflow-hidden">
                    <div className="h-full bg-[#1A6B5E] w-[65%] rounded-full"></div>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-2 font-medium">65 / 100 — INCOMPLET</div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: WHAT HERMES DOES ─── */}
      <section className="bg-[#F4F3EF] py-16 sm:py-20 lg:py-28 w-full">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">

          <FadeIn delay={0}>
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1A6B5E] text-white text-[11px] font-semibold flex items-center justify-center">2</div>
              <div className="text-[12px] font-medium border border-gray-300 rounded-full px-3 sm:px-4 py-1 text-[#1C1A16]">Le rôle de l'IA</div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[#1C1A16] mb-10 sm:mb-14 lg:mb-16">
              L'IA lit. Python calcule. <br className="hidden sm:block" /><span className="sm:hidden"> </span>Vous validez.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7">
            <FadeIn delay={0.15} direction="left">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm h-full">
                <div className="text-[11px] font-semibold tracking-widest uppercase text-[#1A6B5E] mb-4">Intelligence artificielle</div>
                <h3 className="text-[20px] sm:text-[22px] font-semibold text-[#1C1A16] mb-3">Hermes lit et comprend</h3>
                <p className="text-[14px] sm:text-[15px] leading-[1.65] text-[#6B6966]">
                  Hermes lit le texte OCR de chaque facture et comprend le contexte. Il extrait le NIF, le RC, les montants — même sur des formats jamais vus. Il classe le document, détecte le régime fiscal (IFU/RNS/IBS) et rédige les relances bilingues français/arabe.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["Classification", "Extraction NIF/RC", "Détection régime", "Relances FR/AR", "Confiance 0–1"].map((tag) => (
                    <span key={tag} className="text-[#1A6B5E] bg-[#1A6B5E]/8 rounded-full px-3 py-1 text-[12px] font-medium">{tag}</span>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-[12px] text-gray-400 font-medium">4 compétences</span>
                  <Brain className="w-[18px] h-[18px] text-[#1A6B5E]" />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.25} direction="right">
              <div className="bg-[#141210] rounded-2xl p-6 sm:p-8 shadow-xl h-full">
                <div className="text-[11px] font-semibold tracking-widest uppercase text-[#E8A020] mb-4">Outils déterministes</div>
                <h3 className="text-[20px] sm:text-[22px] font-semibold text-white mb-3">Python calcule et décide</h3>
                <p className="text-[14px] sm:text-[15px] leading-[1.65] text-gray-400">
                  Toute la fiscalité algérienne est codée en Python pur. TVA 19%/9%, IFU 5%/12%, IRG barème APLF 2022, IBS 19%/26%, amortissements, vérification arithmétique, détection espèces {'>'} 1.000.000 DA. Résultat : READY / INCOMPLETE / BLOCKED.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["TVA nette G50", "IFU trimestriel", "IRG barème 2022", "IBS secteur", "Espèces illégales", "Score 0–100"].map((tag) => (
                    <span key={tag} className="text-[#E8A020] bg-[#E8A020]/10 rounded-full px-3 py-1 text-[12px] font-medium">{tag}</span>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-[12px] text-gray-500 font-medium">9 fonctions · 0 hallucinations</span>
                  <Calculator className="w-[18px] h-[18px] text-[#E8A020]" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: ANOMALY DETECTION ─── */}
      <section className="bg-white py-16 sm:py-20 lg:py-28 w-full">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">

          <FadeIn delay={0}>
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1A6B5E] text-white text-[11px] font-semibold flex items-center justify-center">3</div>
              <div className="text-[12px] font-medium border border-gray-200 rounded-full px-3 sm:px-4 py-1 text-[#1C1A16]">Contrôle fiscal automatique</div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[#1C1A16] mb-10 sm:mb-14 max-w-4xl">
              11 anomalies détectées <br className="hidden sm:block" /><span className="sm:hidden"> </span>automatiquement.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {anomalies.map((a, i) => (
              <FadeIn key={a.code} delay={0.15 + i * 0.07}>
                <div className="rounded-xl border border-gray-100 p-4 sm:p-5 bg-white hover:shadow-md transition-shadow duration-200 flex items-start gap-3 h-full">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${a.color}`}></div>
                  <div>
                    <div className={`text-[11px] font-mono font-medium mb-1 ${a.codeColor}`}>{a.code}</div>
                    <div className="text-[13px] text-gray-600">{a.desc}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.55}>
            <a href="#anomalies" className="group inline-flex items-center gap-1 hover:gap-2 text-[13px] text-[#1A6B5E] font-medium mt-6 transition-all duration-200">
              Voir les 11 anomalies <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ─── SECTION 5: BILINGUAL MESSAGES ─── */}
      <section className="bg-[#F4F3EF] py-16 sm:py-20 lg:py-24 w-full">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">

          <FadeIn delay={0}>
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1A6B5E] text-white text-[11px] font-semibold flex items-center justify-center">4</div>
              <div className="text-[12px] font-medium border border-gray-300 rounded-full px-3 sm:px-4 py-1 text-[#1C1A16]">Relances bilingues automatiques</div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] text-[#1C1A16] mb-10 sm:mb-12 max-w-4xl tracking-[-0.03em]">
              Relances fournisseur <br className="hidden sm:block" /><span className="sm:hidden"> </span>en français et en arabe.
            </h2>
          </FadeIn>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <FadeIn delay={0.15} direction="left" className="flex-1">
              <div className="bg-white rounded-2xl p-5 sm:p-6 h-full shadow-sm">
                <div className="text-[13px] font-semibold text-[#1C1A16] mb-3 flex items-center gap-2">
                  <span>🇫🇷</span> Message Français
                </div>
                <div className="flex flex-wrap items-baseline gap-1.5 mb-3">
                  <span className="text-[11px] text-gray-400">Objet:</span>
                  <span className="text-[13px] text-[#1C1A16] font-medium">Facture N°2025/047 — NIF manquant</span>
                </div>
                <div className="border-t border-gray-100 my-3"></div>
                <div className="text-[13px] leading-[1.7] text-[#6B6966] whitespace-pre-line mb-6">
                  Madame, Monsieur,{"\n"}
                  Suite à l'examen de votre facture N°2025/047, nous constatons l'absence du Numéro d'Identification Fiscale (NIF) de votre fournisseur.{"\n"}
                  Sans ce document, la TVA déductible de 28.500 DA sera rejetée lors de votre déclaration G50.
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded font-semibold tracking-wide">CRITIQUE</span>
                  <button className="text-[#1A6B5E] text-[13px] font-medium hover:underline" data-testid="btn-copy-fr">Copier</button>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.3} direction="right" className="flex-1">
              <div className="bg-[#141210] rounded-2xl p-5 sm:p-6 h-full shadow-xl flex flex-col">
                <div className="text-[13px] font-semibold text-white mb-3 flex items-center justify-end gap-2" dir="rtl">
                  رسالة بالعربية <span>🇩🇿</span>
                </div>
                <div className="flex flex-wrap-reverse items-baseline justify-start gap-1.5 mb-3" dir="rtl">
                  <span className="text-[11px] text-gray-500">الموضوع:</span>
                  <span className="text-[13px] text-gray-200 font-medium">فاتورة رقم 2025/047 — الرقم الجبائي مفقود</span>
                </div>
                <div className="border-t border-white/10 my-3"></div>
                <div className="text-[13px] leading-[1.9] text-gray-400 whitespace-pre-line text-right mb-6 flex-grow" dir="rtl">
                  السيد/السيدة،{"\n"}
                  بعد مراجعة الفاتورة رقم 2025/047، لاحظنا غياب الرقم الجبائي للمورد.{"\n"}
                  بدون هذه الوثيقة، سيتم رفض ضريبة القيمة المضافة القابلة للخصم البالغة 28.500 دج عند تقديم إقرار G50.
                </div>
                <div className="flex items-center justify-between">
                  <button className="text-[#E8A020] text-[13px] font-medium hover:underline" data-testid="btn-copy-ar">نسخ</button>
                  <span className="text-[10px] bg-red-900/50 text-red-400 px-2 py-0.5 rounded font-semibold tracking-wide" dir="rtl">عاجل</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: DEPLOYMENT & SCALE ─── */}
      <section className="bg-[#141210] py-16 sm:py-20 lg:py-24 w-full">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">

          <FadeIn delay={0}>
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1A6B5E] text-white text-[11px] font-semibold flex items-center justify-center">5</div>
              <div className="text-[12px] font-medium border border-white/10 rounded-full px-3 sm:px-4 py-1 text-gray-400">Déploiement & mise à l'échelle</div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] text-white mb-10 sm:mb-14 max-w-4xl tracking-[-0.03em]">
              Un serveur, 200+ comptables, <br className="hidden sm:block" /><span className="sm:hidden"> </span>isolation totale des données.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <FadeIn delay={0.15}>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/8 h-full">
                <div className="text-[clamp(2.5rem,6vw,4rem)] font-bold text-white leading-none">15</div>
                <div className="text-[14px] text-gray-400 mt-2 font-medium">clients / KVM2</div>
                <div className="text-[12px] text-gray-600 mt-3">Isolation Docker par client</div>
              </div>
            </FadeIn>

            <FadeIn delay={0.25}>
              <div className="bg-[#1A6B5E]/20 rounded-2xl p-6 border border-[#1A6B5E]/30 relative overflow-hidden h-full">
                <div className="text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#4AA89A] leading-none">200+</div>
                <div className="text-[14px] text-gray-400 mt-2 font-medium">clients / serveur</div>
                <div className="text-[12px] text-gray-500 mt-3 flex items-center gap-2">
                  Multi-tenant PostgreSQL
                  <span className="text-[10px] bg-[#1A6B5E]/30 text-[#4AA89A] px-2 py-0.5 rounded font-bold">V2</span>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.35}>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/8 h-full">
                <div className="text-[clamp(2.5rem,6vw,4rem)] font-bold text-white leading-none">~10€</div>
                <div className="text-[14px] text-gray-400 mt-2 font-medium">/ mois KVM2</div>
                <div className="text-[12px] text-gray-600 mt-3">Hostinger VPS — pas de Kubernetes</div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: CTA FOOTER ─── */}
      <footer className="bg-[#1A6B5E] py-16 sm:py-20 lg:py-24 w-full text-center px-5 sm:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <FadeIn delay={0} direction="none">
            <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-medium text-white mb-4 leading-tight tracking-[-0.02em]">
              Prêt à automatiser vos déclarations G50 ?
            </h2>
          </FadeIn>

          <FadeIn delay={0.1} direction="none">
            <p className="text-[16px] text-white/70 mb-8 max-w-lg">
              Importez votre première facture. Résultat en 30 secondes.
            </p>
          </FadeIn>

          <FadeIn delay={0.2} direction="up">
            {accessConfirmed ? (
              <span className="text-[14px] text-[#1A6B5E] font-medium px-6 py-3 bg-white rounded-full flex items-center gap-2" data-testid="btn-cta-footer-confirmed">
                <CheckCircle2 className="w-4 h-4" />
                Merci — nous vous contacterons sous 24h.
              </span>
            ) : (
              <button onClick={() => setAccessConfirmed(true)} className="group bg-white text-[#1A6B5E] text-[14px] font-medium rounded-full pl-6 pr-2 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors" data-testid="btn-cta-footer">
                <HoverRollText text="Demander l'accès anticipé" />
                <div className="w-8 h-8 bg-[#1A6B5E]/10 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-[#1A6B5E] transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45" />
                </div>
              </button>
            )}
          </FadeIn>

          <FadeIn delay={0.3} direction="none">
            <p className="mt-6 text-white/50 text-[12px] font-medium tracking-wide max-w-md">
              Fiscalité algérienne 2025 · IFU · IRG · IBS · TVA · G50 · Sans carte bancaire
            </p>
          </FadeIn>
        </div>
      </footer>
    </div>
  );
}
