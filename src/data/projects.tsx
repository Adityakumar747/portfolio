import AceTernityLogo from "@/components/logos/aceternity";
import SlideShow from "@/components/slide-show";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import { ReactNode } from "react";
// Spline has no thesvg entry — keep the Three.js mark as its stand-in.
import { SiThreedotjs } from "react-icons/si";
const BASE_PATH = "/assets/projects-screenshots";

// Renders a brand SVG from /public as a monochrome glyph that inherits the
// surrounding text color (the skill dock styles every icon via currentColor),
// so full-color marks like Mistral flatten to match the rest of the set.
const MaskIcon = ({ src, title }: { src: string; title?: string }) => (
  <span
    role="img"
    aria-label={title}
    className="block bg-current"
    style={{
      width: "1em",
      height: "1em",
      WebkitMaskImage: `url(${src})`,
      maskImage: `url(${src})`,
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
      WebkitMaskSize: "contain",
      maskSize: "contain",
    }}
  />
);

export type Skill = {
  title: string;
  bg: string;
  fg: string;
  icon: ReactNode;
};
// Brand chips sourced from thesvg CLI mono SVGs in /public/assets/logos,
// rendered via MaskIcon so each one inherits the dock's currentColor.
const brand = (title: string, file: string): Skill => ({
  title,
  bg: "black",
  fg: "white",
  icon: <MaskIcon src={`/assets/logos/${file}`} title={title} />,
});
const PROJECT_SKILLS = {
  next: brand("Next.js", "nextdotjs-mono.svg"),
  chakra: brand("Chakra UI", "chakra-ui-mono.svg"),
  node: brand("Node.js", "nodedotjs-mono.svg"),
  python: brand("Python", "python-mono.svg"),
  prisma: brand("Prisma", "prisma-mono.svg"),
  postgres: brand("PostgreSQL", "postgresql-mono.svg"),
  mongo: brand("MongoDB", "mongodb-mono.svg"),
  express: brand("Express", "express-mono.svg"),
  reactQuery: brand("React Query", "react-query-mono.svg"),
  shadcn: brand("shadcn/ui", "shadcn-ui-mono.svg"),
  // Not in the thesvg registry — keep the existing custom logo.
  aceternity: {
    title: "Aceternity",
    bg: "black",
    fg: "white",
    icon: <AceTernityLogo />,
  },
  tailwind: brand("Tailwind", "tailwind-css-mono.svg"),
  docker: brand("Docker", "docker-mono.svg"),
  // Not in the thesvg registry — keep the text mark.
  yjs: {
    title: "Y.js",
    bg: "black",
    fg: "white",
    icon: (
      <span>
        <strong>Y</strong>js
      </span>
    ),
  },
  firebase: brand("Firebase", "firebase-mono.svg"),
  sockerio: brand("Socket.io", "socketdotio-mono.svg"),
  js: brand("JavaScript", "javascript-mono.svg"),
  ts: brand("TypeScript", "typescript-mono.svg"),
  vue: brand("Vue.js", "vuedotjs-mono.svg"),
  react: brand("React.js", "react-mono.svg"),
  sanity: brand("Sanity", "sanity-mono.svg"),
  // Not in the thesvg registry — keep the Three.js stand-in.
  spline: {
    title: "Spline",
    bg: "black",
    fg: "white",
    icon: <SiThreedotjs />,
  },
  gsap: brand("GSAP", "gsap-mono.svg"),
  motion: brand("Motion", "motion.svg"),
  supabase: brand("Supabase", "supabase-mono.svg"),
  trpc: brand("tRPC", "trpc-mono.svg"),
  drizzle: brand("Drizzle ORM", "drizzle-mono.svg"),
  hono: brand("Hono", "hono-mono.svg"),
  redis: brand("Redis / BullMQ", "redis-mono.svg"),
  cloudflare: brand("Cloudflare", "cloudflare-mono.svg"),
  // React Native reuses the React mark.
  reactNative: brand("React Native", "react-mono.svg"),
  betterAuth: brand("Better Auth", "better-auth-mono.svg"),
  // Not in the thesvg registry — keep the text marks.
  zustand: {
    title: "Zustand",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">Zu</span>,
  },
  partykit: {
    title: "PartyKit",
    bg: "black",
    fg: "white",
    icon: <span className="text-base">🎈</span>,
  },
  hocuspocus: {
    title: "Hocuspocus",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">Hp</span>,
  },
  // React Flow ships under the xyflow brand.
  reactFlow: brand("React Flow", "xyflow-mono.svg"),
  codemirror: brand("CodeMirror", "codemirror-mono.svg"),
  // "Satori / sharp" — uses the sharp mark.
  satori: brand("Satori / sharp", "sharp-mono.svg"),
  turborepo: brand("Turborepo", "turborepo-mono.svg"),
  // Vercel AI SDK uses the Vercel mark.
  aiSDK: brand("Vercel AI SDK", "vercel-mono.svg"),
  anthropic: brand("Anthropic Claude", "anthropic-mono.svg"),
  mistral: brand("Mistral AI", "mistral-ai-mono.svg"),
  // Not in the thesvg registry — keep the text mark.
  nextIntl: {
    title: "next-intl",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">i18n</span>,
  },
  // Not in the thesvg registry — keep the text marks.
  expo: {
    title: "Expo",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">Expo</span>,
  },
  mcp: {
    title: "MCP",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">MCP</span>,
  },
  mysql: {
    title: "MySQL",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">MySQL</span>,
  },
  paypal: {
    title: "PayPal",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">PayPal</span>,
  },
  vercel: {
    title: "Vercel",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">Vercel</span>,
  },
  twilio: {
    title: "Twilio",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">Twilio</span>,
  },
  groq: {
    title: "Groq",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">Groq</span>,
  },
  clerk: {
    title: "Clerk",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">Clerk</span>,
  },
  stream: {
    title: "Stream",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">Stream</span>,
  },
  php: {
    title: "PHP",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">PHP</span>,
  },
  bootstrap: {
    title: "Bootstrap",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">BS</span>,
  },
  html5: {
    title: "HTML5",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">HTML5</span>,
  },
  css3: {
    title: "CSS3",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">CSS3</span>,
  },
  flexbox: {
    title: "Flexbox",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">Flexbox</span>,
  },
  googleFonts: {
    title: "Google Fonts",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">GFonts</span>,
  },
  figma: {
    title: "Figma",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">Figma</span>,
  },
  context: {
    title: "Context API",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">Context</span>,
  },
  mongodbAtlas: {
    title: "MongoDB Atlas",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">Mongo Atlas</span>,
  },
  jwt: {
    title: "JWT",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">JWT</span>,
  },
  bcrypt: {
    title: "Bcrypt",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">Bcrypt</span>,
  },
  cloudinary: {
    title: "Cloudinary",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">Cloudinary</span>,
  },
  render: {
    title: "Render",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">Render</span>,
  },
};
export type Project = {
  id: string;
  category: string;
  title: string;
  src: string;
  screenshots: string[];
  skills: { frontend: Skill[]; backend: Skill[] };
  content: React.ReactNode | any;
  github?: string;
  live: string;
};
const projects: Project[] = [
  {
    id: "voiceforge",
    category: "AI Agent Application",
    title: "Voice Forge",
    src: "/assets/projects-screenshots/voiceforge/VoiceForge1.png",
    screenshots: ["VoiceForge1.png", "VoiceForge2.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.prisma,
        PROJECT_SKILLS.postgres,
        PROJECT_SKILLS.redis,
        PROJECT_SKILLS.twilio,
        PROJECT_SKILLS.sockerio,
        PROJECT_SKILLS.jwt,
        PROJECT_SKILLS.groq,
      ],
      backend: [
        PROJECT_SKILLS.node,
        PROJECT_SKILLS.aiSDK,
      ],
    },
    live: "https://ai-agent-flow-lake.vercel.app/",
    github: "",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Voice Forge — AI-Powered Voice Agent Platform
          </TypographyP>
          <TypographyP className="font-mono ">
            Voice Forge is an enterprise-grade AI voice automation platform that orchestrates intelligent outbound campaigns, inbound call handling, and appointment scheduling through natural voice conversations. Built with a robust full-stack architecture, it combines real-time telephony, background job orchestration, and LLM-powered agent reasoning into a unified command center.
          </TypographyP>
          <SlideShow
            images={[
              `${BASE_PATH}/voiceforge/VoiceForge1.png`,
              `${BASE_PATH}/voiceforge/VoiceForge2.png`,
            ]}
          />
          <p className="font-mono mb-2">
            At the core of Voice Forge is an AI agent capable of conducting natural conversations using GPT-4 and Whisper. The system handles end-to-end calling campaigns — from automated outbound dialing to smart IVR for inbound calls — with real-time sentiment analysis and dynamic FAQ resolution from a customizable knowledge base.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/voiceforge/VoiceForge1.png`,
              `${BASE_PATH}/voiceforge/VoiceForge2.png`,
            ]}
          />

          <TypographyH3 className="my-4 mt-8">Real-Time Operations Dashboard</TypographyH3>
          <p className="font-mono mb-2">
            A comprehensive analytics dashboard provides live visibility into active calls, campaign progress, conversion rates, and sentiment trends. WebSocket-powered updates ensure instant status changes, while JWT-based RBAC secures access across Admin, Agent, and Viewer roles. Twilio integration handles telephony infrastructure with webhook signature validation and rate limiting.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/voiceforge/VoiceForge1.png`,
              `${BASE_PATH}/voiceforge/VoiceForge2.png`,
            ]}
          />
        </div>
      );
    },
  },
  {
    id: "salon",
    category: "Full-Stack Web App",
    title: "Salon Booking App",
    src: "/assets/projects-screenshots/salon/salon_landing.png",
    screenshots: ["salon_landing.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.tailwind,
        PROJECT_SKILLS.motion,
        PROJECT_SKILLS.reactQuery,
        PROJECT_SKILLS.context,
      ],
      backend: [
        PROJECT_SKILLS.node,
        PROJECT_SKILLS.express,
        PROJECT_SKILLS.mongodbAtlas,
        PROJECT_SKILLS.jwt,
        PROJECT_SKILLS.bcrypt,
        PROJECT_SKILLS.cloudinary,
        PROJECT_SKILLS.vercel,
        PROJECT_SKILLS.render,
      ],
    },
    live: "https://github.com/Adityakumar747/salon-booking-fullstack",
    github: "https://github.com/Adityakumar747/salon-booking-fullstack",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Jawed Habib • Salon Booking Platform
          </TypographyP>
          <TypographyP className="font-mono ">
            A modern, high-luxury full-stack salon management and booking platform inspired by the premium Jawed Habib heritage brand. The application delivers a seamless experience for both customers and administrators, featuring luxury branding, intelligent booking logic, and a comprehensive admin command center.
          </TypographyP>
          <TypographyH3 className="my-4 mt-8">Luxury Experience &amp; Smart Booking</TypographyH3>
          <p className="font-mono mb-2">
            The platform features high-contrast premium UI/UX with smooth Framer Motion animations and elite portfolio imagery across 12+ service categories — from Hair and Skin to Bridal and Grooming. Smart booking logic includes date/time slot validation, auto-advance scheduling, and dynamic audience filtering for Men, Women, and Kids.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/salon/salon1.png`,
              `${BASE_PATH}/salon/salon2.png`,
              `${BASE_PATH}/salon/salon3.png`,
            ]}
          />

          <TypographyH3 className="my-4 mt-8">Authentication &amp; Admin Command Center</TypographyH3>
          <p className="font-mono mb-2">
            Secure JWT-based authentication protects both user and admin accounts. The admin dashboard provides full control over services, real-time analytics, and appointment management. Media assets are optimized and served via Cloudinary, with the frontend deployed on Vercel and the backend on Render for scalable performance.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/salon/salon4.png`,
              `${BASE_PATH}/salon/salon5.png`,
              `${BASE_PATH}/salon/salon6.png`,
            ]}
          />
        </div>
      );
    },
  },
  {
    id: "melonchat",
    category: "Real-time Chat App",
    title: "Melonchat",
    src: "/assets/projects-screenshots/melonchat/melonchat_landing.png",
    screenshots: ["melonchat_landing.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.tailwind,
        PROJECT_SKILLS.clerk,
        PROJECT_SKILLS.stream,
        PROJECT_SKILLS.js,
        PROJECT_SKILLS.vercel,
      ],
      backend: [],
    },
    live: "https://github.com/Adityakumar747/Melonchat",
    github: "https://github.com/Adityakumar747/Melonchat",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Melon Chat — Real-Time Community Platform
          </TypographyP>
          <TypographyP className="font-mono ">
            A modern full-stack chat application built with Next.js, Clerk authentication, and Stream Chat APIs. It enables users to securely authenticate, join topic-based discussion forums, and engage in real-time conversations with a sleek, responsive UI.
          </TypographyP>
          <TypographyH3 className="my-4 mt-8">Secure Authentication &amp; Onboarding</TypographyH3>
          <p className="font-mono mb-2">
            Users authenticate securely through Clerk, gaining access to topic-based discussion forums. Each topic maps directly to a Stream chat channel, creating a structured yet flexible community experience.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/melonchat/melonchat1.png`,
              `${BASE_PATH}/melonchat/melonchat2.png`,
              `${BASE_PATH}/melonchat/melonchat3.png`,
            ]}
          />

          <TypographyH3 className="my-4 mt-8">Real-Time Messaging &amp; Community</TypographyH3>
          <p className="font-mono mb-2">
            Multiple users can join the same discussion room and exchange messages instantly via Stream's real-time infrastructure. The platform supports typing indicators, online presence, and organized channel management for seamless community engagement.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/melonchat/melonchat4.png`,
              `${BASE_PATH}/melonchat/melonchat5.png`,
              `${BASE_PATH}/melonchat/melonchat6.png`,
            ]}
          />
        </div>
      );
    },
  },
  {
    id: "flyby",
    category: "Travel Booking Platform",
    title: "Flyby",
    src: "/assets/projects-screenshots/flyby/flyby1.png",
    screenshots: ["flyby1.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.php,
        PROJECT_SKILLS.bootstrap,
      ],
      backend: [
        PROJECT_SKILLS.php,
        PROJECT_SKILLS.mysql,
        PROJECT_SKILLS.paypal,
      ],
    },
    live: "https://github.com/Adityakumar747/Flyby",
    github: "https://github.com/Adityakumar747/Flyby",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Flyby — Travel Booking Platform
          </TypographyP>
          <TypographyP className="font-mono ">
            A full-featured travel booking website built with PHP and MySQL, enabling users to browse destinations, book travel orders, and complete payments securely through PayPal integration. The platform manages the complete booking lifecycle from search to confirmation.
          </TypographyP>
          <TypographyH3 className="my-4 mt-8">Travel Search &amp; Booking Flow</TypographyH3>
          <p className="font-mono mb-2">
            Users can search for travel destinations, view available options, and book orders through an intuitive booking interface. The system handles booking management, availability tracking, and order confirmation workflows powered by a robust PHP backend.
          </p>
          <SlideShow images={[
              `${BASE_PATH}/flyby/flyby2.png`,
              `${BASE_PATH}/flyby/flyby3.png`,
              `${BASE_PATH}/flyby/flyby4.png`,
              `${BASE_PATH}/flyby/flyby5.png`,
          ]} />

          <TypographyH3 className="my-4 mt-8">Secure Payments &amp; Data Management</TypographyH3>
          <p className="font-mono mb-2">
            PayPal integration ensures secure, trusted payment processing for travel bookings. All booking data, user information, and transaction records are managed through a MySQL database, providing reliable data persistence and retrieval across the platform.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/flyby/flyby6.png`,
              `${BASE_PATH}/flyby/flyby7.png`,
              `${BASE_PATH}/flyby/flyby8.png`,
              `${BASE_PATH}/flyby/flyby9.png`,
            ]}
          />
        </div>
      );
    },
  },
  {
    id: "idr",
    category: "Responsive Homepage Design",
    title: "IDR Digital",
    src: "/assets/projects-screenshots/idr/idr.png",
    screenshots: ["idr.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.html5,
        PROJECT_SKILLS.css3,
        PROJECT_SKILLS.js,
        PROJECT_SKILLS.flexbox,
        PROJECT_SKILLS.googleFonts,
        PROJECT_SKILLS.figma,
      ],
      backend: [],
    },
    live: "https://github.com/Adityakumar747/IDR-Digital",
    github: "https://github.com/Adityakumar747/IDR-Digital",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            IDR Digital — Institute of Digital Risk
          </TypographyP>
          <TypographyP className="font-mono ">
            A fully responsive, professionally designed homepage for the Institute of Digital Risk (IDR). The design is built around a cube-inspired geometric logo concept representing structured systems, layered digital risk, and stability in complex environments.
          </TypographyP>
          <TypographyH3 className="my-4 mt-8">Design System &amp; Identity</TypographyH3>
          <p className="font-mono mb-2">
            The visual identity combines an orange accent for innovation and forward momentum with a black and white base for a clean, professional look. Modern, minimal typography reinforces credibility, while the logo appears in both icon-only and full-institute-name variants across the site.
          </p>
          <SlideShow images={[`${BASE_PATH}/idr/idr1.png`]} />

          <TypographyH3 className="my-4 mt-8">Core Pillars &amp; Community</TypographyH3>
          <p className="font-mono mb-2">
            The site highlights three foundational pillars: the Academy for training programs, Innovation & Incubation for AI and risk models, and Advisory Services covering NIST, ISO 27001, and NIS2 frameworks. A dedicated community section supports students and professionals in upskilling within cyber risk.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/idr/idr2.png`,
              `${BASE_PATH}/idr/idr3.png`,
            ]}
          />
        </div>
      );
    },
  },
  {
    id: "pmjs",
    category: "Financial Web Application",
    title: "Pmjs Wealth",
    src: "/assets/projects-screenshots/pmjs/pmjs1.png",
    screenshots: ["pmjs1.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.js,
        PROJECT_SKILLS.bootstrap,
      ],
      backend: [
        PROJECT_SKILLS.php,
      ],
    },
    live: "https://github.com/Adityakumar747/Pmjs-wealth-",
    github: "https://github.com/Adityakumar747/Pmjs-wealth-",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            PMJS Wealth — Financial Planning Platform
          </TypographyP>
          <TypographyP className="font-mono ">
            A comprehensive web platform built for a financial services brand, focusing on SIP investments, insurance planning, and holistic wealth management. The site provides an intuitive interface for users to explore financial products and plan their financial futures.
          </TypographyP>
          <TypographyH3 className="my-4 mt-8">Financial Products &amp; Services</TypographyH3>
          <p className="font-mono mb-2">
            The platform showcases a curated suite of financial offerings including Systematic Investment Plans (SIP), life and general insurance products, and personalized financial planning tools. Structured sections guide users through product discovery and comparison.
          </p>
          <SlideShow images={[
              `${BASE_PATH}/pmjs/pmjs2.png`,
              `${BASE_PATH}/pmjs/pmjs3.png`,
              `${BASE_PATH}/pmjs/pmjs4.png`,
          ]} />

          <TypographyH3 className="my-4 mt-8">Wealth Management &amp; Insights</TypographyH3>
          <p className="font-mono mb-2">
            Interactive dashboards and reporting sections help users visualize their financial health, track investments, and understand growth trajectories. The design balances data density with readability, making complex financial information accessible.
          </p>
          <SlideShow images={[
              `${BASE_PATH}/pmjs/pmjs5.png`,
              `${BASE_PATH}/pmjs/pmjs6.png`,
              `${BASE_PATH}/pmjs/pmjs7.png`,
              `${BASE_PATH}/pmjs/pmjs8.png`,
          ]} />
        </div>
      );
    },
  },
  {
    id: "setulink",
    category: "Web Platform",
    title: "Setulink",
    src: "/assets/projects-screenshots/setulink/setulink1.png",
    screenshots: ["setulink1.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.bootstrap,
      ],
      backend: [
        PROJECT_SKILLS.php,
      ],
    },
    live: "https://github.com/Adityakumar747/Setulink-website-",
    github: "https://github.com/Adityakumar747/Setulink-website-",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            SetuLink — CCTV Services Platform
          </TypographyP>
          <TypographyP className="font-mono ">
            A professional web platform built for a CCTV services company, designed to showcase security solutions, service offerings, and enable seamless customer engagement. The site presents a modern, trustworthy digital presence for a surveillance and security business.
          </TypographyP>
          <TypographyH3 className="my-4 mt-8">Service Showcase</TypographyH3>
          <p className="font-mono mb-2">
            The platform highlights a comprehensive range of CCTV and security services, from installation and maintenance to surveillance system consulting. Clean layouts and structured sections guide visitors through offerings, helping them find the right security solution.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/setulink/setulink2.png`,
              `${BASE_PATH}/setulink/setulink3.png`,
              `${BASE_PATH}/setulink/setulink4.png`,
            ]}
          />

          <TypographyH3 className="my-4 mt-8">Customer Engagement &amp; Inquiry</TypographyH3>
          <p className="font-mono mb-2">
            Integrated contact and inquiry flows make it easy for potential clients to reach out for consultations, quotes, and support requests. The design emphasizes trust and professionalism through consistent branding and clear call-to-action pathways.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/setulink/setulink5.png`,
              `${BASE_PATH}/setulink/setulink6.png`,
            ]}
          />
        </div>
      );
    },
  },
  {
    id: "karopitch",
    category: "Landing Page",
    title: "Karo Pitch",
    src: "/assets/projects-screenshots/karopitch/karopitch.png",
    screenshots: ["karopitch.png"],
    live: "https://github.com/Adityakumar747/Karopitch",
    github: "https://github.com/Adityakumar747/Karopitch",
    skills: {
      frontend: [
        PROJECT_SKILLS.html5,
        PROJECT_SKILLS.css3,
        PROJECT_SKILLS.js,
      ],
      backend: [],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Karo Pitch — Startup Pitch Platform
          </TypographyP>
          <TypographyP className="font-mono ">
            A modern, responsive landing page designed to support founders across India in raising funding. The platform connects startups with investors through a structured pitch process, backed by KaroStartup's storytelling platform.
          </TypographyP>
          <TypographyH3 className="my-4 mt-8">How It Works</TypographyH3>
          <p className="font-mono mb-2">
            A simple 4-step process guides founders from application to funding. Startups apply with their pitch deck, get shortlisted by KaroStartup, pitch live to investors, and raise funding to scale their ventures.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/karopitch/karopitch2.png`,
              `${BASE_PATH}/karopitch/karopitch3.png`,
            ]}
          />

          <TypographyH3 className="my-4 mt-8">Who Can Apply</TypographyH3>
          <p className="font-mono mb-2">
            The platform is open to a diverse range of startup categories: D2C Brands, Consumer Startups, MSMEs, SaaS Startups, Manufacturing Businesses, and Bharat-focused startups. Each category is represented through dedicated sections and investor matching.
          </p>
          <SlideShow images={[`${BASE_PATH}/karopitch/karopitch4.png`]} />

          <TypographyH3 className="my-4 mt-8">Investors &amp; Featured Startups</TypographyH3>
          <p className="font-mono mb-2">
            A dedicated investors section showcases the ecosystem of backers attending pitch events. Featured startup cards display sample ventures across categories, giving visitors a clear picture of the platform's reach and impact.
          </p>
        </div>
      );
    },
  },
];
export default projects;
