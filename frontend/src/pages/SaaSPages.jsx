import React, { useEffect, useMemo, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { motion, useScroll, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import Lenis from "lenis";
import { SynapseXNavbar } from "../components/SynapseXNavbar.jsx";
import { ScrambleIn } from "../components/ScrambleIn.jsx";
import { SynapseXLogo } from "../components/SynapseXLogo.jsx";
import { Logo } from "../components/Logo.jsx";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Bell,
  BookOpen,
  Building2,
  Check,
  Code2,
  CreditCard,
  FileText,
  Github,
  GitBranch,
  KeyRound,
  LockKeyhole,
  Mail,
  MonitorDot,
  Network,
  Radar,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
  Eye,
  EyeOff,
  RefreshCw,
  ShieldAlert,
  User,
  Lock,
} from "lucide-react";
import { fetchAuthArchitecture, fetchBillingCatalog, fetchMonitoringWorkflows, fetchNotificationCenter, fetchOnboarding, fetchSubscriptionStatus, fetchTeamDirectory, fetchTrustCenter, loginAccount, registerAccount, requestPasswordReset, verifyOtp } from "../services/api.js";

const featureGroups = [
  ["Attack Surface Discovery", Network, "Continuously discover internet-facing domains, services, APIs, and ownership signals."],
  ["Exposure Intelligence", Shield, "Score exploitable exposure, identity drift, evidence quality, and business blast radius."],
  ["API Security", Code2, "Analyze OpenAPI, GraphQL, Postman, and discovered endpoints with safe fuzzing controls."],
  ["Threat Intelligence", Bell, "Correlate current exploit pressure, technology signals, and operational alerting."],
  ["Continuous Monitoring", MonitorDot, "Detect surface drift, new findings, and posture changes before they become incidents."],
  ["Attack Path Analysis", GitBranch, "Connect exposed assets, findings, identities, and remediation owners into risk paths."],
  ["AI Risk Prioritization", Sparkles, "Summarize validated impact and next actions for executives and security teams."],
  ["Reporting", FileText, "Generate executive, technical, compliance, and evidence-backed reports."],
  ["DevSecOps Integration", BadgeCheck, "Bring exposure gates, scan profiles, and APIs into delivery pipelines."],
];

const docs = ["Getting Started", "Authentication", "Organizations", "Assets", "Monitoring", "Exposure Intelligence", "APIs", "Reports", "Team Management", "Integrations"];
const roles = ["Owner", "Admin", "Security Engineer", "Analyst", "Viewer"];

export function MarketingHome({ onNavigate, isAuthenticated, logout }) {
  const [entranceComplete, setEntranceComplete] = useState(false);
  const heroVideoRef = useRef(null);
  const lastClientXRef = useRef(-1);
  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);

  // Initialize Lenis smooth scroll specifically for the landing page
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Entrance complete state triggers after 800ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setEntranceComplete(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Hero Video Scrubbing Logic
  const handleHeroMouseMove = (e) => {
    const video = heroVideoRef.current;
    if (!video || !video.duration) return;

    if (lastClientXRef.current === -1) {
      lastClientXRef.current = e.clientX;
      return;
    }

    const deltaX = e.clientX - lastClientXRef.current;
    lastClientXRef.current = e.clientX;

    const duration = video.duration;
    const change = (deltaX / window.innerWidth) * duration * 0.8;
    let newTime = video.currentTime + change;

    newTime = Math.max(0, Math.min(newTime, duration));
    targetTimeRef.current = newTime;

    if (!isSeekingRef.current) {
      isSeekingRef.current = true;
      video.currentTime = newTime;
    }
  };

  const handleHeroMouseEnter = (e) => {
    lastClientXRef.current = e.clientX;
  };

  const handleHeroMouseLeave = () => {
    lastClientXRef.current = -1;
  };

  const handleHeroSeeked = () => {
    const video = heroVideoRef.current;
    if (!video) return;

    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.01) {
      video.currentTime = targetTimeRef.current;
    } else {
      isSeekingRef.current = false;
    }
  };

  // Section 2 Scroll 3D text rotation setup
  const section2Ref = useRef(null);
  const { scrollYProgress: scroll2 } = useScroll({
    target: section2Ref,
    offset: ["start end", "end start"],
  });
  
  const scroll2Smooth = useSpring(scroll2, {
    stiffness: 15,
    damping: 32,
    mass: 1.8,
  });

  const yScaleValue = useTransform(scroll2Smooth, [0, 1], [60, -120]);
  const transform3d = useMotionTemplate`perspective(400px) rotateX(24deg) translateY(${yScaleValue}px) translateZ(15px)`;
  const opacity3d = useTransform(scroll2Smooth, [0.3, 0.5], [0, 1]);

  return (
    <div className="w-full min-h-screen bg-black text-white relative font-sans selection:bg-white selection:text-black">
      {/* Custom SynapseX Navbar */}
      <SynapseXNavbar
        entranceComplete={entranceComplete}
        onNavigate={onNavigate}
        isAuthenticated={isAuthenticated}
        logout={logout}
      />

      {/* SECTION 1: HERO */}
      <section
        onMouseMove={handleHeroMouseMove}
        onMouseEnter={handleHeroMouseEnter}
        onMouseLeave={handleHeroMouseLeave}
        className="relative w-full h-screen h-[100dvh] overflow-hidden flex flex-col justify-end select-none"
      >
        {/* Background Video */}
        <video
          ref={heroVideoRef}
          onSeeked={handleHeroSeeked}
          preload="auto"
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_083515_290e5a10-0b95-41af-a5e2-32b6389baa4d.mp4"
        />

        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Large background watermark text */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 translate-y-[50px] pointer-events-none select-none text-[clamp(120px,30vw,521px)] font-bold uppercase tracking-[-4px] opacity-10 whitespace-nowrap text-center text-transparent"
          style={{
            fontFamily: '"Anton SC", sans-serif',
            backgroundImage: "radial-gradient(circle, rgba(142,127,148,0) 0%, #8E7F94 70%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          INTELLIGENCE
        </div>

        {/* Content Overlay */}
        <motion.div
          animate={entranceComplete ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.0 }}
          className="relative z-10 w-full flex-1 flex flex-col justify-end px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12"
        >
          {/* Bottom row */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between w-full">
            {/* Left Column */}
            <div className="flex flex-col gap-4">
              <h1 className="text-white font-light leading-[0.95] tracking-[-0.03em] text-[clamp(40px,10vw,100px)]">
                <ScrambleIn text="Attack Surface" delay={200} triggered={entranceComplete} />
                <br />
                <ScrambleIn text="Intelligence" delay={500} triggered={entranceComplete} />
              </h1>
              
              <motion.p
                initial={{ y: 25, opacity: 0 }}
                animate={entranceComplete ? { y: 0, opacity: 1 } : { y: 25, opacity: 0 }}
                transition={{
                  duration: 0.9,
                  ease: [0.215, 0.61, 0.355, 1],
                  delay: 0.2,
                }}
                className="max-w-sm text-[13px] sm:text-[15px] text-white/60 leading-relaxed font-sans"
              >
                Built at the intersection of external asset discovery and continuous vulnerability monitoring.
                AdaptiveScan continuously maps your perimeter and exposure risk.
              </motion.p>
            </div>

            {/* Right Column */}
            <div>
              <h1 className="text-white font-light leading-[0.95] tracking-[-0.03em] text-[clamp(40px,10vw,100px)] text-left md:text-right">
                <ScrambleIn text="Zero" delay={700} triggered={entranceComplete} />
                <br />
                <ScrambleIn text="Exposure" delay={1000} triggered={entranceComplete} />
              </h1>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: CINEMATIC TEXT */}
      <section
        ref={section2Ref}
        className="relative w-full h-screen h-[100dvh] overflow-hidden flex items-center justify-center bg-black"
      >
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-80"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_092455_089c54f8-3b03-4966-9df1-e9746063d0ef.mp4"
        />

        {/* Top gradient overlay */}
        <div className="absolute top-0 left-0 w-full h-[180px] bg-gradient-to-b from-[#010103] to-transparent z-10 pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 max-w-5xl px-6 sm:px-12 flex items-center justify-center">
          <motion.p
            style={{ transform: transform3d, opacity: opacity3d }}
            className="font-sans font-normal text-[22px] sm:text-[30px] md:text-[36px] lg:text-[42px] text-white leading-[1.35] tracking-[-0.02em] select-none text-center"
          >
            An enterprise exposure intelligence platform built on active perimeter mapping.
            AdaptiveScan discovers external assets, scores exposure, and validates attack paths in real time.
            Every system becomes visible, structured, and monitored. It continuously monitors security drift
            and guides remediation.
          </motion.p>
        </div>
      </section>

      {/* SECTION 3: METRICS */}
      <section className="relative w-full min-h-screen min-h-[100dvh] overflow-hidden flex items-center justify-center bg-black py-32 px-6">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095810_ecea3dd2-fc5e-4e41-8696-4219290b6589.mp4"
        />

        {/* Metrics Content */}
        <div className="relative z-10 max-w-6xl w-full flex flex-col items-center">
          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2 }}
            className="text-white/40 text-[13px] sm:text-[14px] tracking-[0.2em] uppercase mb-20 text-center select-none"
          >
            Performance Metrics
          </motion.div>

          {/* Metrics Grid */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 w-full text-center"
          >
            {/* Metric 1 */}
            <motion.div
              variants={{
                hidden: { y: 30, opacity: 0 },
                show: { y: 0, opacity: 1, transition: { duration: 0.8 } },
              }}
              className="flex flex-col items-center"
            >
              <span className="text-white text-[clamp(48px,10vw,96px)] font-light tracking-[-0.04em] leading-none">
                2,418
              </span>
              <span className="text-white/40 text-[13px] sm:text-[15px] mt-4 tracking-wide">
                Monitored Assets
              </span>
            </motion.div>

            {/* Metric 2 */}
            <motion.div
              variants={{
                hidden: { y: 30, opacity: 0 },
                show: { y: 0, opacity: 1, transition: { duration: 0.8 } },
              }}
              className="flex flex-col items-center"
            >
              <span className="text-white text-[clamp(48px,10vw,96px)] font-light tracking-[-0.04em] leading-none">
                14
              </span>
              <span className="text-white/40 text-[13px] sm:text-[15px] mt-4 tracking-wide">
                Validated Paths
              </span>
            </motion.div>

            {/* Metric 3 */}
            <motion.div
              variants={{
                hidden: { y: 30, opacity: 0 },
                show: { y: 0, opacity: 1, transition: { duration: 0.8 } },
              }}
              className="flex flex-col items-center"
            >
              <span className="text-white text-[clamp(48px,10vw,96px)] font-light tracking-[-0.04em] leading-none">
                82
              </span>
              <span className="text-white/40 text-[13px] sm:text-[15px] mt-4 tracking-wide">
                Exposure Score
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: TECHNOLOGY / ADAPTIVE INTELLIGENCE */}
      <section className="relative w-full h-screen h-[100dvh] overflow-hidden flex flex-col justify-between bg-black px-8 sm:px-12 md:px-16 py-12 sm:py-16">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-50"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095750_32a52ce0-2005-45c9-9093-41f03fde9530.mp4"
        />

        {/* Top area */}
        <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-start gap-6 w-full">
          {/* Left heading */}
          <motion.h2
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.0 }}
            className="text-white font-light text-[clamp(36px,8vw,72px)] leading-[0.95] tracking-[-0.03em]"
          >
            Continuous <br />
            Operations
          </motion.h2>

          {/* Right paragraph */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.0, delay: 0.2 }}
            className="text-white/50 text-[13px] sm:text-[15px] leading-relaxed max-w-xs md:text-right md:pt-2"
          >
            The system continuously discovers cloud resources and internet-facing assets.
            From there, vulnerabilities and exposure risks are scored and triaged in real time.
          </motion.p>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                delayChildren: 0.3,
                staggerChildren: 0.1,
              },
            },
          }}
          className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 w-full"
        >
          {[
            {
              title: "Surface Discovery",
              desc: "Real-time mapping of active domains, IPs, and cloud environments.",
            },
            {
              title: "Exposure Scoring",
              desc: "Quantifies risk based on exploit pressure and asset criticality.",
            },
            {
              title: "API Security",
              desc: "Discovers endpoints and runs safe, active vulnerability validation.",
            },
            {
              title: "Remediation Paths",
              desc: "Connects findings to codebases, pipelines, and engineering owners.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { y: 20, opacity: 0 },
                show: { y: 0, opacity: 1, transition: { duration: 0.7 } },
              }}
              className="flex flex-col"
            >
              <h3 className="text-white text-[14px] sm:text-[16px] font-normal mb-2">
                {item.title}
              </h3>
              <p className="text-white/40 text-[12px] sm:text-[14px] leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* SECTION 5: ARCHITECTURE */}
      <section className="relative w-full min-h-screen min-h-[100dvh] bg-black overflow-hidden flex items-center justify-center px-6 py-32">
        {/* Centered Content */}
        <div className="max-w-3xl w-full flex flex-col items-center">
          {/* Heading block */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.0 }}
            className="text-center w-full"
          >
            <div className="text-white/40 text-[13px] sm:text-[14px] tracking-[0.2em] uppercase mb-8">
              Workflow Layers
            </div>
            <h2 className="text-white font-light text-[clamp(28px,6vw,56px)] leading-[1.15] tracking-[-0.02em] mb-10">
              Three steps. Zero friction.
            </h2>
            <p className="text-white/45 text-[15px] sm:text-[17px] leading-relaxed max-w-xl mx-auto">
              Scope layer defines active domains. Discovery layer runs non-disruptive scans.
              Intelligence layer prioritizes findings and automates ticketing.
            </p>
          </motion.div>

          {/* Layer Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="w-full flex flex-col items-center gap-4 mt-20"
          >
            {/* Card 1 */}
            <div className="w-full max-w-md h-[72px] border border-white/10 rounded-lg flex items-center justify-between px-6 bg-transparent hover:border-white/20 transition-colors">
              <span className="text-white/30 text-[12px] tracking-[0.15em] uppercase select-none">
                Step 1
              </span>
              <span className="text-white text-[16px] sm:text-[18px] font-light">
                Define Scope
              </span>
            </div>

            {/* Card 2 */}
            <div className="w-full max-w-md h-[72px] border border-white/10 rounded-lg flex items-center justify-between px-6 bg-transparent hover:border-white/20 transition-colors">
              <span className="text-white/30 text-[12px] tracking-[0.15em] uppercase select-none">
                Step 2
              </span>
              <span className="text-white text-[16px] sm:text-[18px] font-light">
                Discover & Validate
              </span>
            </div>

            {/* Card 3 */}
            <div className="w-full max-w-md h-[72px] border border-white/10 rounded-lg flex items-center justify-between px-6 bg-transparent hover:border-white/20 transition-colors">
              <span className="text-white/30 text-[12px] tracking-[0.15em] uppercase select-none">
                Step 3
              </span>
              <span className="text-white text-[16px] sm:text-[18px] font-light">
                Prioritize & Resolve
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-black overflow-hidden border-t border-white/10">
        <div className="flex flex-col md:flex-row min-h-[400px] w-full">
          {/* Left Column (Video) */}
          <div className="w-full md:w-1/2 h-[300px] md:h-auto relative overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_080203_fd7f4f85-3a86-4837-8192-85e7bfe68e75.mp4"
            />
          </div>

          {/* Right Column (Info) */}
          <div className="w-full md:w-1/2 p-10 sm:p-16 flex flex-col justify-between bg-black">
            {/* Top Area */}
            <div>
              <div className="flex items-center gap-2 mb-8 text-white/70">
                <Logo size={24} />
                <span className="text-[15px] font-medium tracking-tight whitespace-nowrap">
                  AdaptiveScan
                </span>
              </div>
              
              <p className="text-white/40 text-[14px] sm:text-[15px] leading-relaxed max-w-sm">
                The next evolution of exposure management. Built for security teams who refuse to be
                limited by point-in-time scanning.
              </p>
            </div>

            {/* Bottom Area */}
            <div className="text-white/25 text-[12px] mt-12 select-none">
              &copy; 2026 AdaptiveScan Labs. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function FeaturesPage() {
  return <section className="saas-page"><PageTitle eyebrow="Features" title="Enterprise exposure intelligence across the whole attack surface." /><FeatureBand expanded /></section>;
}

export function PricingPage() {
  const [catalog, setCatalog] = useState(null);
  useEffect(() => { fetchBillingCatalog().then(setCatalog).catch(() => setCatalog(null)); }, []);
  const plans = catalog?.plans ?? [
    { name: "Starter", price: "$99/mo", monitored_assets: 50, team_members: 3, api_access: "limited", monitoring: "weekly", support: "community" },
    { name: "Professional", price: "$399/mo", monitored_assets: 500, team_members: 10, api_access: "standard", monitoring: "daily", support: "business hours" },
    { name: "Business", price: "$999/mo", monitored_assets: 2500, team_members: 30, api_access: "advanced", monitoring: "continuous", support: "priority" },
    { name: "Enterprise", price: "Custom", monitored_assets: "unlimited", team_members: "unlimited", api_access: "enterprise", monitoring: "continuous", support: "dedicated" },
  ];
  return (
    <section className="saas-page">
      <PageTitle eyebrow="Pricing" title="Billing-ready plans for every exposure program." />
      <div className="pricing-grid">
        {plans.map((plan) => (
          <article className="price-card" key={plan.name}>
            <span>{plan.name}</span>
            <strong>{plan.price}</strong>
            <p>{plan.monitored_assets} monitored assets</p>
            <ul>
              <li><Users size={15} /> {plan.team_members} team members</li>
              <li><Code2 size={15} /> {plan.api_access} API access</li>
              <li><MonitorDot size={15} /> {plan.monitoring} monitoring</li>
              <li><Shield size={15} /> {plan.support} support</li>
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export function DocumentationPage() {
  const [query, setQuery] = useState("");
  const filtered = docs.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
  return (
    <section className="saas-page">
      <PageTitle eyebrow="Documentation" title="AdaptiveScan documentation portal." />
      <label className="doc-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search documentation" /></label>
      <div className="docs-grid">
        {filtered.map((item) => <article key={item}><BookOpen size={20} /><strong>{item}</strong><p>Guides, API patterns, operational practices, and security workflows for {item.toLowerCase()}.</p></article>)}
      </div>
    </section>
  );
}

export function ContactPage() {
  return (
    <section className="saas-page">
      <PageTitle eyebrow="Contact" title="Talk with AdaptiveScan." />
      <div className="contact-grid">
        {["Contact form", "Demo request", "Enterprise inquiry", "Support inquiry"].map((item) => <ContactForm key={item} title={item} />)}
      </div>
    </section>
  );
}

export function AuthPage({ mode = "login", onNavigate }) {
  const { login, completeMfa, checkSession, user } = useAuth();
  const [form, setForm] = useState(() => ({
    first_name: "",
    last_name: "",
    company_name: "",
    work_email: "",
    email: window.localStorage.getItem("adaptiveScan.pendingEmail") || "",
    password: "",
    confirm_password: "",
    code: ""
  }));
  
  const [mfaStep, setMfaStep] = useState(() => mode === "mfa" ? "verify" : ""); // "", "verify", "enroll", "recovery_codes"
  const [totpSecret, setTotpSecret] = useState("");
  const [provisioningUri, setProvisioningUri] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState([]);

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [ssoLoading, setSsoLoading] = useState(null);
  const [mfaSecondsLeft, setMfaSecondsLeft] = useState(120);

  const isRegister = mode === "register";
  const isOtp = mode === "otp" || mode === "mfa";
  const isForgot = mode === "forgot";
  const title = mfaStep === "enroll"
    ? "Configure Authenticator App"
    : mfaStep === "verify"
    ? "Verify Authenticator Code"
    : mfaStep === "recovery_codes"
    ? "Emergency Recovery Keys"
    : isRegister
    ? "Create your AdaptiveScan workspace"
    : isOtp
    ? "Verify secure access"
    : isForgot
    ? "Reset your password"
    : "Sign in to AdaptiveScan";

  // Password strength logic
  const passwordStrength = useMemo(() => {
    const p = form.password;
    if (!p) return { score: 0, text: "None", color: "transparent", width: "0%" };
    let score = 0;
    if (p.length >= 8) score += 1;
    if (/[A-Z]/.test(p)) score += 1;
    if (/[0-9]/.test(p)) score += 1;
    if (/[^A-Za-z0-9]/.test(p)) score += 1;

    if (score <= 1) return { score, text: "Weak", color: "#ef4444", width: "25%" };
    if (score === 2) return { score, text: "Fair", color: "#f59e0b", width: "50%" };
    if (score === 3) return { score, text: "Good", color: "#3b82f6", width: "75%" };
    return { score, text: "Strong", color: "#10b981", width: "100%" };
  }, [form.password]);

  // MFA OTP Countdown Timer
  useEffect(() => {
    if (!isOtp) return;
    const interval = setInterval(() => {
      setMfaSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOtp]);

  // Sync email field with local storage when transitioning to OTP/MFA modes
  useEffect(() => {
    if (mode === "otp" || mode === "mfa") {
      const pending = window.localStorage.getItem("adaptiveScan.pendingEmail");
      if (pending) {
        setForm((prev) => ({ ...prev, email: prev.email || pending }));
      }
    }
  }, [mode]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "sso_success") {
        setSsoLoading(null);
        setMessage(`SSO successful via ${event.data.provider}. Welcome ${event.data.name}!`);
        window.localStorage.setItem("adaptiveScan.pendingEmail", event.data.email);
        window.localStorage.setItem("adaptiveScan.accessToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_sso_token");
        window.localStorage.setItem("adaptiveScan.refreshToken", "dummy_sso_refresh");
        setTimeout(() => {
          onNavigate("home");
        }, 1000);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onNavigate]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleResendOtp = () => {
    setMfaSecondsLeft(120);
    setMessage("A fresh secure passcode has been dispatched to your primary mailbox.");
  };

  // SSO Authentication Simulation
  const handleSsoClick = (providerName) => {
    setSsoLoading(providerName);
    
    // Open a popup window for the SSO handshake
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    const popup = window.open(
      "",
      "SSO_Auth",
      `width=${width},height=${height},left=${left},top=${top},status=0,menubar=0,toolbar=0,location=0`
    );
    
    if (!popup) {
      // If popup blocker, fallback
      setTimeout(() => {
        setSsoLoading(null);
        window.localStorage.setItem("adaptiveScan.accessToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_sso_token");
        window.localStorage.setItem("adaptiveScan.refreshToken", "dummy_sso_refresh");
        onNavigate("home");
      }, 1500);
      return;
    }

    if (providerName === "Google SSO") {
      popup.document.write(`
        <html>
          <head>
            <title>Sign in with Google</title>
            <style>
              body { font-family: Roboto, Arial, sans-serif; background: #111; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .card { width: 360px; padding: 40px; border: 1px solid rgba(0, 242, 254, 0.2); background: #18191c; border-radius: 8px; text-align: center; box-shadow: 0 0 20px rgba(0, 242, 254, 0.1); }
              .logo { font-size: 24px; font-weight: bold; margin-bottom: 20px; font-family: 'Product Sans', sans-serif; }
              .logo span:nth-child(1) { color: #4285F4; }
              .logo span:nth-child(2) { color: #EA4335; }
              .logo span:nth-child(3) { color: #FBBC05; }
              .logo span:nth-child(4) { color: #4285F4; }
              .logo span:nth-child(5) { color: #34A853; }
              .logo span:nth-child(6) { color: #EA4335; }
              h1 { font-size: 22px; font-weight: 400; margin-bottom: 8px; color: #fff; }
              p { color: #94a3b8; font-size: 14px; margin-bottom: 30px; }
              .account-row { display: flex; align-items: center; padding: 12px; border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; cursor: pointer; margin-bottom: 12px; transition: all 0.2s; background: rgba(255,255,255,0.02); }
              .account-row:hover { background: rgba(0, 242, 254, 0.08); border-color: #00f2fe; }
              .avatar { width: 32px; height: 32px; border-radius: 50%; background: #4285F4; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; }
              .details { text-align: left; }
              .details strong { display: block; font-size: 14px; color: #fff; }
              .details span { color: #94a3b8; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="logo">
                <span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span>
              </div>
              <h1>Sign in</h1>
              <p>to continue to AdaptiveScan</p>
              <div class="account-row" onclick="selectAccount('admin@recoxy.com', 'System Administrator')">
                <div class="avatar">A</div>
                <div class="details">
                  <strong>admin@recoxy.com</strong>
                  <span>System Administrator</span>
                </div>
              </div>
              <div class="account-row" onclick="selectAccount('security@recoxy.com', 'SecOps Engineer')">
                <div class="avatar">S</div>
                <div class="details">
                  <strong>security@recoxy.com</strong>
                  <span>SecOps Engineer</span>
                </div>
              </div>
            </div>
            <script>
              function selectAccount(email, name) {
                window.opener.postMessage({ type: 'sso_success', email, name, provider: 'Google' }, '*');
                window.close();
              }
            </script>
          </body>
        </html>
      `);
    } else if (providerName === "GitHub SSO") {
      popup.document.write(`
        <html>
          <head>
            <title>Authorize AdaptiveScan</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; background: #0d1117; color: #c9d1d9; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .card { width: 440px; background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 24px; box-sizing: border-box; box-shadow: 0 0 20px rgba(0,0,0,0.5); }
              .header { text-align: center; margin-bottom: 24px; }
              .header svg { fill: #c9d1d9; }
              h1 { font-size: 20px; font-weight: 600; margin: 16px 0 8px; color: #fff; }
              .permissions { border: 1px solid #30363d; border-radius: 6px; padding: 16px; margin-bottom: 24px; text-align: left; background: #0d1117; }
              .permission-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; font-size: 14px; }
              .permission-item strong { display: block; color: #fff; }
              .permission-item span { color: #8b949e; }
              .actions { display: flex; gap: 12px; }
              button { flex: 1; padding: 10px; font-size: 14px; font-weight: 600; border-radius: 6px; border: 1px solid rgba(240,246,252,0.1); cursor: pointer; }
              button.authorize { background: #238636; color: #fff; }
              button.authorize:hover { background: #2ea043; }
              button.cancel { background: #21262d; color: #c9d1d9; }
              button.cancel:hover { background: #30363d; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="header">
                <svg height="48" viewBox="0 0 16 16" version="1.1" width="48" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                <h1>Authorize AdaptiveScan</h1>
                <p style="color:#8b949e;font-size:14px;">by <strong>Recoxy</strong></p>
              </div>
              <div class="permissions">
                <div class="permission-item">
                  <div style="font-size: 20px;">👤</div>
                  <div>
                    <strong>Personal user data</strong>
                    <span>Read access to profile information and email address.</span>
                  </div>
                </div>
              </div>
              <div class="actions">
                <button class="cancel" onclick="window.close()">Cancel</button>
                <button class="authorize" onclick="authorize()">Authorize Recoxy</button>
              </div>
            </div>
            <script>
              function authorize() {
                window.opener.postMessage({ type: 'sso_success', email: 'github-user@recoxy.com', name: 'GitHub Developer', provider: 'GitHub' }, '*');
                window.close();
              }
            </script>
          </body>
        </html>
      `);
    } else {
      setTimeout(() => {
        setSsoLoading(null);
        window.localStorage.setItem("adaptiveScan.accessToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_sso_token");
        window.localStorage.setItem("adaptiveScan.refreshToken", "dummy_sso_refresh");
        onNavigate("home");
      }, 1500);
    }
  };

  async function submit(event) {
    event.preventDefault();
    setMessage("Processing secure token exchange...");
    try {
      if (isRegister) {
        if (form.password !== form.confirm_password) {
          throw new Error("Password confirmation does not match the entered password.");
        }
        const result = await registerAccount(form);
        window.localStorage.setItem("adaptiveScan.pendingEmail", form.work_email);
        setMessage(`Workspace created successfully. Dev OTP: ${result.verification?.dev_code ?? "sent"}`);
        onNavigate("otp");
      } else if (mfaStep === "verify" || mfaStep === "enroll") {
        const emailToUse = form.email || user?.email || window.localStorage.getItem("adaptiveScan.pendingEmail");
        const result = await completeMfa(emailToUse, form.code);
        if (result.success) {
          setMessage("MFA verification successful.");
          if (result.data?.recovery_codes) {
            setRecoveryCodes(result.data.recovery_codes);
            setMfaStep("recovery_codes");
          } else {
            window.localStorage.removeItem("adaptiveScan.pendingEmail");
            onNavigate("home");
          }
        } else {
          setMessage(result.message || "MFA validation failed.");
        }
      } else if (isOtp) {
        if (mode === "mfa") {
          const result = await completeMfa(form.email || form.work_email, form.code);
          if (result.success) {
            setMessage("MFA Verification successful.");
            window.localStorage.removeItem("adaptiveScan.pendingEmail");
            onNavigate("home");
          } else {
            setMessage(result.message || "MFA validation failed.");
          }
        } else {
          const result = await verifyOtp({
            email: form.email || form.work_email,
            code: form.code,
            purpose: "email_verification"
          });
          setMessage(result.verified ? "MFA Verification successful." : "The passcode is invalid. Please try again.");
          if (result.verified) {
            window.localStorage.removeItem("adaptiveScan.pendingEmail");
            await checkSession();
            onNavigate("onboarding");
          }
        }
      } else if (isForgot) {
        const result = await requestPasswordReset({ email: form.email });
        setMessage(`Reset OTP issued. Dev OTP: ${result.reset?.dev_code ?? "sent"}`);
      } else {
        const result = await login(form.email, form.password);
        if (result.success) {
          window.localStorage.setItem("adaptiveScan.pendingEmail", form.email);
          if (result.data?.requires_mfa) {
            setMfaStep(result.data.mfa_configured ? "verify" : "enroll");
            setTotpSecret(result.data.totp_secret || "");
            setProvisioningUri(result.data.provisioning_uri || "");
            setMessage(result.data.mfa_configured ? "MFA required. Please enter your authenticator app code." : "MFA setup required. Scan the QR code and enter the code to configure.");
          } else {
            setMessage("Welcome back.");
            window.localStorage.setItem("adaptiveScan.accessToken", result.data?.tokens?.access_token ?? "");
            window.localStorage.setItem("adaptiveScan.refreshToken", result.data?.tokens?.refresh_token ?? "");
            onNavigate("home");
          }
        } else {
          setMessage(result.message);
        }
      }
    } catch (error) {
      setMessage(String(error.message ?? error));
    }
  }

  return (
    <section className="auth-stage">
      {ssoLoading && (
        <div className="sso-overlay">
          <RefreshCw className="sso-spinner" size={48} />
          <div className="sso-text-container">
            <h3>Secure SSO Handshake</h3>
            <p>Redirecting to {ssoLoading} Identity Provider to verify your session credentials...</p>
          </div>
        </div>
      )}

      <form className="auth-card" onSubmit={submit}>
        <span className="saas-eyebrow" style={{ letterSpacing: "0.05em" }}>
          SECURE PORTAL &middot; {mode.toUpperCase()}
        </span>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: "8px 0 20px" }}>{title}</h1>
        
        {!mfaStep && (
          <>
            {/* Register Fields */}
            {isRegister && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="auth-input-group">
                    <label>First Name</label>
                    <div className="auth-input-wrapper">
                      <User size={16} />
                      <input
                        placeholder="Jane"
                        value={form.first_name}
                        onChange={(event) => setForm({ ...form, first_name: event.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="auth-input-group">
                    <label>Last Name</label>
                    <div className="auth-input-wrapper">
                      <User size={16} />
                      <input
                        placeholder="Doe"
                        value={form.last_name}
                        onChange={(event) => setForm({ ...form, last_name: event.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="auth-input-group">
                  <label>Company Name</label>
                  <div className="auth-input-wrapper">
                    <Building2 size={16} />
                    <input
                      placeholder="Acme Corporation"
                      value={form.company_name}
                      onChange={(event) => setForm({ ...form, company_name: event.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="auth-input-group">
                  <label>Work Email</label>
                  <div className="auth-input-wrapper">
                    <Mail size={16} />
                    <input
                      type="email"
                      placeholder="jane@company.com"
                      value={form.work_email}
                      onChange={(event) => setForm({ ...form, work_email: event.target.value })}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Regular Login / Forgot Fields */}
            {!isRegister && !isOtp && (
              <div className="auth-input-group">
                <label>Work Email</label>
                <div className="auth-input-wrapper">
                  <Mail size={16} />
                  <input
                    type="email"
                    placeholder="jane@company.com"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            {/* Password Fields */}
            {!isOtp && !isForgot && (
              <>
                <div className="auth-input-group">
                  <label>Password</label>
                  <div className="auth-input-wrapper">
                    <LockKeyhole size={16} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(event) => setForm({ ...form, password: event.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="eye-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle Password Visibility"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Password Strength Meter */}
                {isRegister && form.password && (
                  <div className="password-strength-container">
                    <div className="password-strength-bar-bg">
                      <div
                        className="password-strength-bar"
                        style={{
                          width: passwordStrength.width,
                          backgroundColor: passwordStrength.color
                        }}
                      />
                    </div>
                    <div className="password-strength-label">
                      <span>Complexity Strength: <strong>{passwordStrength.text}</strong></span>
                      <span>Min. 8 characters</span>
                    </div>
                  </div>
                )}

                {isRegister && (
                  <div className="auth-input-group">
                    <label>Confirm Password</label>
                    <div className="auth-input-wrapper">
                      <LockKeyhole size={16} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={form.confirm_password}
                        onChange={(event) => setForm({ ...form, confirm_password: event.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="eye-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label="Toggle Confirm Password Visibility"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* OTP Fields */}
            {isOtp && (
              <>
                <div className="auth-input-group">
                  <label>Verification Email Address</label>
                  <div className="auth-input-wrapper">
                    <Mail size={16} />
                    <input
                      type="email"
                      placeholder="jane@company.com"
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="auth-input-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label>Secure Passcode (OTP)</label>
                    <span style={{ fontSize: "0.78rem", color: mfaSecondsLeft > 0 ? "#6ee7b7" : "#ef4444", fontWeight: 600 }}>
                      Expires in {formatTimer(mfaSecondsLeft)}
                    </span>
                  </div>
                  <div className="auth-input-wrapper">
                    <LockKeyhole size={16} />
                    <input
                      placeholder="Enter 6-digit code"
                      value={form.code}
                      onChange={(event) => setForm({ ...form, code: event.target.value })}
                      maxLength={6}
                      required
                    />
                  </div>
                  
                  {mfaSecondsLeft === 0 ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      style={{
                        alignSelf: "flex-start",
                        background: "transparent",
                        border: 0,
                        color: "#6ee7b7",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        padding: 0,
                        marginTop: "4px",
                        fontWeight: 700
                      }}
                    >
                      <RefreshCw size={12} style={{ marginRight: "4px", verticalAlign: "middle" }} /> Resend verification code
                    </button>
                  ) : null}
                </div>
              </>
            )}

            {/* Remember Me and Forgot Password row */}
            {!isOtp && !isForgot && (
              <div className="auth-remember-row">
                <label>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  Keep me signed in on this device
                </label>
                <button
                  type="button"
                  className="auth-forgot-link"
                  onClick={() => onNavigate("forgot")}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button className="primary-action" type="submit" style={{ marginTop: "10px" }}>
              <LockKeyhole size={16} /> {isOtp ? "Verify & Proceed" : isRegister ? "Create Workspace" : "Authenticate"}
            </button>

            <div style={{ display: "flex", alignItems: "center", margin: "16px 0 8px" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
              <span style={{ padding: "0 10px", fontSize: "0.74rem", color: "#64748b", fontWeight: 700 }}>OR SIGN IN WITH</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
            </div>

            <div className="social-row" style={{ gap: "8px" }}>
              <button type="button" onClick={() => handleSsoClick("Google SSO")}>
                <Search size={15} /> Google
              </button>
              <button type="button" onClick={() => handleSsoClick("GitHub SSO")}>
                <Github size={15} /> GitHub
              </button>
              <button type="button" onClick={() => handleSsoClick("Microsoft SSO")}>
                <Building2 size={15} /> SSO
              </button>
            </div>

            <div className="auth-links" style={{ marginTop: "14px" }}>
              {mode !== "login" && (
                <button type="button" onClick={() => onNavigate("login")}>
                  Return to Sign In
                </button>
              )}
              {mode !== "register" && (
                <button type="button" onClick={() => onNavigate("register")}>
                  Create an Account
                </button>
              )}
              {mode !== "mfa" && !isOtp && (
                <button type="button" onClick={() => onNavigate("mfa")}>
                  MFA Challenge
                </button>
              )}
            </div>
          </>
        )}

        {mfaStep === "verify" && (
          <>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "16px", lineHeight: "1.5" }}>
              Enter the 6-digit code generated by your authenticator app (Google Authenticator, Microsoft Authenticator, Duo, etc.).
            </p>
            <div className="auth-input-group">
              <label>Authentication Code</label>
              <div className="auth-input-wrapper">
                <LockKeyhole size={16} />
                <input
                  placeholder="000 000"
                  value={form.code}
                  onChange={(event) => setForm({ ...form, code: event.target.value })}
                  maxLength={6}
                  required
                  style={{ textAlign: "center", fontSize: "1.2rem", letterSpacing: "4px" }}
                />
              </div>
            </div>
            <button className="primary-action" type="submit" style={{ marginTop: "10px" }}>
              <LockKeyhole size={16} /> Verify & Proceed
            </button>
            <button type="button" className="ghost-button" onClick={() => { setMfaStep(""); setForm({ ...form, code: "" }); }} style={{ marginTop: "8px", width: "100%" }}>
              Cancel
            </button>
          </>
        )}

        {mfaStep === "enroll" && (
          <>
            <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "12px", lineHeight: "1.4" }}>
              Multi-Factor Authentication is required for your role. Scan this QR code with your authenticator app (Google Authenticator, Microsoft Authenticator, 1Password, etc.) or enter the secret key manually.
            </p>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px", background: "white", borderRadius: "8px", width: "fit-content", margin: "0 auto 12px" }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(provisioningUri)}`}
                alt="Scan QR code"
                style={{ display: "block" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--subtle)", fontWeight: 700 }}>SECRET KEY</span>
              <code style={{ padding: "6px 12px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--accent)", fontSize: "0.85rem", fontFamily: "monospace" }}>
                {totpSecret}
              </code>
            </div>
            <div className="auth-input-group">
              <label>Enter 6-Digit Code to Confirm</label>
              <div className="auth-input-wrapper">
                <LockKeyhole size={16} />
                <input
                  placeholder="000 000"
                  value={form.code}
                  onChange={(event) => setForm({ ...form, code: event.target.value })}
                  maxLength={6}
                  required
                  style={{ textAlign: "center", fontSize: "1.2rem", letterSpacing: "4px" }}
                />
              </div>
            </div>
            <button className="primary-action" type="submit" style={{ marginTop: "10px" }}>
              <LockKeyhole size={16} /> Confirm & Activate
            </button>
            <button type="button" className="ghost-button" onClick={() => { setMfaStep(""); setForm({ ...form, code: "" }); }} style={{ marginTop: "8px", width: "100%" }}>
              Cancel
            </button>
          </>
        )}

        {mfaStep === "recovery_codes" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#10b981", marginBottom: "12px" }}>
              <ShieldCheck size={20} />
              <strong style={{ fontSize: "1rem" }}>MFA Activated</strong>
            </div>
            <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: "12px", lineHeight: "1.4" }}>
              Save these recovery codes securely. If you lose access to your authenticator device, you can use these to gain entry. Each code can be used once.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontFamily: "monospace", fontSize: "0.85rem", padding: "12px", background: "rgba(0,0,0,0.25)", borderRadius: "6px", border: "1px solid var(--border)", marginBottom: "16px", color: "#e0e0e0" }}>
              {recoveryCodes.map((code) => <div key={code} style={{ textAlign: "center" }}>{code}</div>)}
            </div>
            <button type="button" className="primary-action" onClick={() => {
              navigator.clipboard.writeText(recoveryCodes.join("\n"));
              setMessage("Recovery codes copied successfully!");
            }} style={{ marginBottom: "8px", width: "100%" }}>
              Copy Recovery Codes
            </button>
            <button type="button" className="ghost-button" onClick={() => {
              window.localStorage.removeItem("adaptiveScan.pendingEmail");
              onNavigate("home");
            }} style={{ width: "100%" }}>
              Continue to Dashboard
            </button>
          </>
        )}

        {message && (
          <div
            style={{
              marginTop: "16px",
              padding: "10px 12px",
              background: "rgba(110, 231, 183, 0.08)",
              border: "1px solid rgba(110, 231, 183, 0.2)",
              borderRadius: "6px",
              color: "#6ee7b7",
              fontSize: "0.82rem",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <ShieldCheck size={16} style={{ flexShrink: 0 }} />
            <span>{message}</span>
          </div>
        )}

        {/* Security & SOC 2 Badges */}
        <div className="trust-badge-row">
          <div className="trust-badge">
            <Shield size={12} /> SSL Secured
          </div>
          <div className="trust-badge">
            <BadgeCheck size={12} /> SOC 2 compliant
          </div>
          <div className="trust-badge">
            <Lock size={12} /> Argon2id Enforced
          </div>
        </div>
      </form>
      <AuthArchitecturePanel />
    </section>
  );
}

export function OnboardingPage({ onNavigate }) {
  const [state, setState] = useState(null);
  const [setup, setSetup] = useState({ organization: "", primaryAsset: "", cadence: "Daily exposure monitoring", invite: "" });
  useEffect(() => { fetchOnboarding().then(setState).catch(() => setState(null)); }, []);
  const steps = state?.steps ?? [];
  return (
    <section className="saas-page">
      <PageTitle eyebrow="Onboarding" title="Launch your first exposure program." />
      <div className="onboarding-layout">
        <div className="onboarding-grid">
          {steps.map((step, index) => <article key={step.id}><span>{index + 1}</span><strong>{step.title}</strong><p>{step.options?.join(", ") || step.roles?.join(", ") || step.placeholder || step.status}</p></article>)}
        </div>
        <form className="onboarding-form">
          <label><span>Organization</span><input value={setup.organization} placeholder="Acme Security" onChange={(event) => setSetup({ ...setup, organization: event.target.value })} /></label>
          <label><span>Primary Asset</span><input value={setup.primaryAsset} placeholder="example.com" onChange={(event) => setSetup({ ...setup, primaryAsset: event.target.value })} /></label>
          <label><span>Monitoring Cadence</span><select value={setup.cadence} onChange={(event) => setSetup({ ...setup, cadence: event.target.value })}>{["Daily exposure monitoring", "Weekly executive review", "On-demand assessment"].map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Invite Owner</span><input value={setup.invite} placeholder="appsec@example.com" onChange={(event) => setSetup({ ...setup, invite: event.target.value })} /></label>
        </form>
      </div>
      <button className="primary-action" type="button" onClick={() => onNavigate("dashboard")}><Radar size={16} /> Start Monitoring</button>
    </section>
  );
}

export function TeamManagementPage() {
  const [team, setTeam] = useState(null);
  useEffect(() => { fetchTeamDirectory().then(setTeam).catch(() => setTeam(null)); }, []);
  const items = team?.members?.map((member) => `${member.name} · ${member.role} · ${member.status}`) ?? roles.map((role) => `${role} role policy`);
  return <PlatformAdminPage eyebrow="Team Management" title="Invite users, assign roles, and enforce MFA." items={items} icon={Users} />;
}

export function BillingPage() {
  const [subscription, setSubscription] = useState(null);
  useEffect(() => { fetchSubscriptionStatus().then(setSubscription).catch(() => setSubscription(null)); }, []);
  const usage = subscription?.usage ?? {};
  return <PlatformAdminPage eyebrow="Billing" title="Plans, subscription, usage, and invoices." items={[
    `Current plan: ${subscription?.plan ?? "Professional"}`,
    `Status: ${subscription?.status ?? "trialing"}`,
    `Assets: ${usage.monitored_assets ?? 128}/${usage.asset_limit ?? 500}`,
    `API usage: ${usage.api_calls_this_month ?? 0} calls this month`,
  ]} icon={CreditCard} />;
}

export function SaaSSettingsPage() {
  return <PlatformAdminPage eyebrow="Settings" title="Profile, MFA, API keys, notifications, and organization settings." items={["Profile security", "MFA methods", "API key management", "Notification routing", "Organization settings"]} icon={Settings} />;
}

export function NotificationCenterPage() {
  const [center, setCenter] = useState(null);
  useEffect(() => { fetchNotificationCenter().then(setCenter).catch(() => setCenter(null)); }, []);
  const items = [
    ...(center?.channels ?? []).map((channel) => `${channel.name} · ${channel.status} · ${channel.routing}`),
    ...(center?.rules ?? []).map((rule) => `${rule.name} · ${rule.severity} · ${rule.channels.join(", ")}`),
  ];
  return <PlatformAdminPage eyebrow="Notification Center" title="Route exposure alerts to the right teams." items={items.length ? items : ["Email routing", "Slack alerts", "Webhook delivery", "Executive digest"]} icon={Bell} />;
}

export function MonitoringWorkflowsPage() {
  const [catalog, setCatalog] = useState(null);
  useEffect(() => { fetchMonitoringWorkflows().then(setCatalog).catch(() => setCatalog(null)); }, []);
  const items = catalog?.workflows?.map((workflow) => `${workflow.name} · ${workflow.cadence} · ${workflow.status}`) ?? ["Continuous external monitoring", "New asset discovery", "Executive reporting", "Finding retest"];
  return <PlatformAdminPage eyebrow="Monitoring Workflows" title="Operational monitoring built around assets and exposure." items={items} icon={MonitorDot} />;
}

export function TrustPage() {
  const [trust, setTrust] = useState(null);
  useEffect(() => { fetchTrustCenter().then(setTrust).catch(() => setTrust(null)); }, []);
  const sections = [
    ["Security", ShieldCheck, trust?.security ?? ["MFA enforcement", "RBAC", "Audit logging"]],
    ["Compliance", BadgeCheck, trust?.compliance ?? ["SOC 2 readiness", "ISO 27001 mapping", "OWASP evidence exports"]],
    ["Privacy", LockKeyhole, trust?.privacy ?? ["Tenant isolation", "Least privilege tokens", "Retention controls"]],
  ];
  return (
    <section className="saas-page">
      <PageTitle eyebrow="Trust Center" title="Security, compliance, and privacy for enterprise buyers." />
      <div className="docs-grid">
        {sections.map(([title, Icon, items]) => <article key={title}><Icon size={20} /><strong>{title}</strong><p>{items.join(", ")}</p></article>)}
      </div>
    </section>
  );
}

function PageTitle({ eyebrow, title }) {
  return <header className="saas-title"><span className="saas-eyebrow">{eyebrow}</span><h1>{title}</h1></header>;
}

function FeatureBand({ expanded = false }) {
  return <section className={`feature-band ${expanded ? "expanded" : ""}`}>{featureGroups.map(([title, Icon, copy]) => <article key={title}><Icon size={22} /><strong>{title}</strong><p>{copy}</p></article>)}</section>;
}

function ContactForm({ title }) {
  return <form className="contact-form"><strong>{title}</strong><input placeholder="Name" /><input placeholder="Work Email" /><textarea placeholder="Message" /><button type="button">Submit</button></form>;
}

function AuthArchitecturePanel() {
  const [architecture, setArchitecture] = useState(null);
  useEffect(() => { fetchAuthArchitecture().then(setArchitecture).catch(() => setArchitecture(null)); }, []);
  const controls = architecture?.security_controls ?? ["JWT auth", "Refresh tokens", "RBAC", "MFA", "Audit logging"];
  return <aside className="auth-architecture"><KeyRound size={24} /><strong>Enterprise auth architecture</strong>{controls.map((item) => <span key={item}><Check size={14} /> {item}</span>)}</aside>;
}

function PlatformAdminPage({ eyebrow, title, items, icon: Icon }) {
  return <section className="page-stack"><header className="saas-title compact"><span className="saas-eyebrow">{eyebrow}</span><h1>{title}</h1></header><div className="admin-grid">{items.map((item) => <article key={item}><Icon size={20} /><strong>{item}</strong><p>Configured for SaaS operations and enterprise governance.</p></article>)}</div></section>;
}

function SaaSFooter({ onNavigate }) {
  return (
    <footer className="saas-footer">
      <div className="footer-brand-recoxy" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px" }}>
        <strong>AdaptiveScan</strong>
        <span className="footer-rights" style={{ fontSize: "0.76rem", color: "var(--subtle)" }}>
          All rights reserved to Recoxy
        </span>
      </div>
      <nav>{["features", "pricing", "documentation", "contact", "login"].map((item) => <button key={item} type="button" onClick={() => onNavigate(item)}>{item}</button>)}</nav>
    </footer>
  );
}
