import AceTernityLogo from "@/components/logos/aceternity";
import SlideShow from "@/components/slide-show";
import { Button } from "@/components/ui/button";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import { ArrowUpRight, ExternalLink, Link2, MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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

const ProjectsLinks = ({ live, repo }: { live?: string; repo?: string }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-start gap-3 my-3 mb-8">
      {live && live !== "#" && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={live}
        >
          <Button variant={"default"} size={"sm"}>
            Visit Website
            <ArrowUpRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      )}
      {repo && repo !== "#" && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={repo}
        >
          <Button variant={"default"} size={"sm"}>
            Github
            <ArrowUpRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      )}
    </div>
  );
};

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
    id: "salon",
    category: "Full-Stack Web App",
    title: "Salon Booking App",
    src: "/assets/projects-screenshots/salon/salon_landing.png",
    screenshots: ["salon_landing.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.tailwind,
      ],
      backend: [
        PROJECT_SKILLS.node,
        PROJECT_SKILLS.express,
        PROJECT_SKILLS.mongo,
      ],
    },
    live: "https://github.com/Adityakumar747/salon-booking-fullstack",
    github: "https://github.com/Adityakumar747/salon-booking-fullstack",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            A full-stack salon booking application built with the MERN stack.
          </TypographyP>
          <TypographyP className="font-mono ">
            Features user authentication, service browsing, and appointment scheduling with a responsive UI. Designed to streamline operations for salon businesses while providing an intuitive booking experience for clients.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          
          <TypographyH3 className="my-4 mt-8">Authentication &amp; User Flow</TypographyH3>
          <p className="font-mono mb-2">
            Secure user authentication allowing clients to create accounts, manage profiles, and track their past and upcoming salon appointments seamlessly.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/salon/salon1.png`,
              `${BASE_PATH}/salon/salon2.png`,
              `${BASE_PATH}/salon/salon3.png`,
            ]}
          />

          <TypographyH3 className="my-4 mt-8">Service Management</TypographyH3>
          <p className="font-mono mb-2">
            Dynamic service catalog integration where administrators can update offerings, pricing, and availability in real-time, displayed with elegant styling.
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
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.tailwind,
      ],
      backend: [
        PROJECT_SKILLS.node,
      ],
    },
    live: "https://github.com/Adityakumar747/Melonchat",
    github: "https://github.com/Adityakumar747/Melonchat",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Real-time community chat platform.
          </TypographyP>
          <TypographyP className="font-mono ">
            Built with Next.js, Clerk authentication, and Stream Chat APIs. It allows users to connect, form communities, and engage in real-time conversations with a sleek and modern UI.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />

          <TypographyH3 className="my-4 mt-8">Real-time Messaging</TypographyH3>
          <p className="font-mono mb-2">
            Instant message delivery, typing indicators, and online presence features powered by Stream Chat APIs to provide a robust and engaging chat experience.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/melonchat/melonchat1.png`,
              `${BASE_PATH}/melonchat/melonchat2.png`,
              `${BASE_PATH}/melonchat/melonchat3.png`,
            ]}
          />

          <TypographyH3 className="my-4 mt-8">Community &amp; Channels</TypographyH3>
          <p className="font-mono mb-2">
            Support for multiple channels, direct messaging, and community management tools allowing users to organize discussions based on different topics or interests.
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
    category: "Web Application",
    title: "Flyby",
    src: "/assets/projects-screenshots/flyby/flyby1.png",
    screenshots: ["flyby1.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.tailwind,
      ],
      backend: [
        PROJECT_SKILLS.node,
      ],
    },
    live: "https://github.com/Adityakumar747/Flyby",
    github: "https://github.com/Adityakumar747/Flyby",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            A modern, fast, and scalable web application.
          </TypographyP>
          <TypographyP className="font-mono ">
            Flyby is designed to deliver high performance and exceptional user experience. Incorporating modern design patterns and optimized architecture to handle intensive workloads gracefully.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />

          <TypographyH3 className="my-4 mt-8">Dashboard &amp; Analytics</TypographyH3>
          <p className="font-mono mb-2">
            A comprehensive dashboard providing insights, data visualization, and quick controls for effective management of application resources.
          </p>
          <SlideShow images={[
              `${BASE_PATH}/flyby/flyby2.png`,
              `${BASE_PATH}/flyby/flyby3.png`,
              `${BASE_PATH}/flyby/flyby4.png`,
              `${BASE_PATH}/flyby/flyby5.png`,
          ]} />

          <TypographyH3 className="my-4 mt-8">Resource Library</TypographyH3>
          <p className="font-mono mb-2">
            An organized repository interface to manage files, digital assets, and configurations seamlessly within the browser.
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
        PROJECT_SKILLS.js,
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.tailwind,
      ],
      backend: [],
    },
    live: "https://github.com/Adityakumar747/IDR-Digital",
    github: "https://github.com/Adityakumar747/IDR-Digital",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Institute of Digital Risk (IDR) Homepage
          </TypographyP>
          <TypographyP className="font-mono ">
            This project is a fully responsive, beautifully designed homepage for the Institute of Digital Risk. Built using modern frontend tools to showcase organizational goals and resources effectively.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />

          <TypographyH3 className="my-4 mt-8">Modern Aesthetic</TypographyH3>
          <p className="font-mono mb-2">
            Clean typography, balanced whitespace, and interactive elements designed to draw user attention to key information and call-to-actions.
          </p>
          <SlideShow images={[`${BASE_PATH}/idr/idr1.png`]} />

          <TypographyH3 className="my-4 mt-8">Interactive Sections</TypographyH3>
          <p className="font-mono mb-2">
            Dynamic content areas that adapt to various screen sizes, ensuring a consistent and engaging experience across desktop and mobile devices.
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
        PROJECT_SKILLS.tailwind,
      ],
      backend: [
        PROJECT_SKILLS.docker,
      ],
    },
    live: "https://github.com/Adityakumar747/Pmjs-wealth-",
    github: "https://github.com/Adityakumar747/Pmjs-wealth-",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            A comprehensive wealth management and tracking platform.
          </TypographyP>
          <TypographyP className="font-mono ">
            Built to handle financial operations, track portfolios, and provide valuable insights for wealth management through an intuitive interface.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />

          <TypographyH3 className="my-4 mt-8">Financial Dashboard</TypographyH3>
          <p className="font-mono mb-2">
            A centralized view of financial health, displaying key metrics, recent transactions, and portfolio performance trends in an easy-to-read format.
          </p>
          <SlideShow images={[
              `${BASE_PATH}/pmjs/pmjs2.png`,
              `${BASE_PATH}/pmjs/pmjs3.png`,
              `${BASE_PATH}/pmjs/pmjs4.png`,
          ]} />

          <TypographyH3 className="my-4 mt-8">Insights &amp; Analytics</TypographyH3>
          <p className="font-mono mb-2">
            Detailed reporting tools that break down expenses, investments, and growth over time to help users make informed financial decisions.
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
        PROJECT_SKILLS.js,
        PROJECT_SKILLS.tailwind,
        PROJECT_SKILLS.react,
      ],
      backend: [
        PROJECT_SKILLS.node,
      ],
    },
    live: "https://github.com/Adityakumar747/Setulink-website-",
    github: "https://github.com/Adityakumar747/Setulink-website-",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            A dynamic and responsive platform to connect users seamlessly.
          </TypographyP>
          <TypographyP className="font-mono ">
            Setulink provides a comprehensive suite of tools designed for collaboration and resource sharing, wrapped in a modern, user-friendly interface.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />

          <TypographyH3 className="my-4 mt-8">Interactive Dashboard</TypographyH3>
          <p className="font-mono mb-2">
            A streamlined control center that gives users quick access to their projects, settings, and communication channels.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/setulink/setulink2.png`,
              `${BASE_PATH}/setulink/setulink3.png`,
              `${BASE_PATH}/setulink/setulink4.png`,
            ]}
          />

          <TypographyH3 className="my-4 mt-8">Project Management</TypographyH3>
          <p className="font-mono mb-2">
            Integrated tools for tracking progress, managing tasks, and collaborating with team members efficiently.
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
        PROJECT_SKILLS.js,
        PROJECT_SKILLS.tailwind,
        PROJECT_SKILLS.react,
      ],
      backend: [],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            A highly optimized and visually appealing landing page.
          </TypographyP>
          <TypographyP className="font-mono ">
            Karo Pitch is a modern, responsive landing page designed to capture attention and deliver information effectively with smooth animations and clean layouts.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          
          <TypographyH3 className="my-4 mt-8">Responsive Design</TypographyH3>
          <p className="font-mono mb-2">
            Carefully crafted to look perfect on devices of all sizes, from large desktop monitors down to mobile phones, ensuring a consistent user experience.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/karopitch/karopitch2.png`,
              `${BASE_PATH}/karopitch/karopitch3.png`,
            ]}
          />
          
          <TypographyH3 className="my-4 mt-8">Performance Optimized</TypographyH3>
          <p className="font-mono mb-2">
            Built with modern web standards prioritizing fast load times, accessibility, and high performance scores across all metrics.
          </p>
          <SlideShow images={[`${BASE_PATH}/karopitch/karopitch4.png`]} />
        </div>
      );
    },
  },
];
export default projects;
