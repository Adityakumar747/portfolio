const config = {
  title: "Aditya Kumar | Full-Stack Developer",
  description: {
    long: "Explore the portfolio of Aditya Kumar, a full-stack web developer specializing in React.js, Next.js, Node.js, and responsive design. Discover innovative projects including VoiceForge, Melon Chat, and more. Let's build something amazing together!",
    short:
      "Discover the portfolio of Aditya Kumar, a full-stack developer creating interactive web applications and innovative projects.",
  },
  keywords: [
    "Aditya Kumar",
    "portfolio",
    "full-stack developer",
    "web development",
    "React.js",
    "Next.js",
    "Node.js",
    "Salon Booking System",
    "Melon Chat",
    "web design",
    "responsive design",
  ],
  author: "Aditya Kumar",
  email: "adityakumar746302@gmail.com",
  site: "https://adityakumar.dev",

  // for github stars button
  githubUsername: "Adityakumar747",
  githubRepo: "portfolio",

  get ogImg() {
    return this.site + "/assets/seo/og-image.png";
  },
  social: {
    twitter: "https://x.com/adityakumar747",
    linkedin: "https://www.linkedin.com/in/aditya-kumar-08780b325/",
    instagram: "https://www.instagram.com/adityakumar747",
    facebook: "https://www.facebook.com/adityakumar747",
    github: "https://github.com/Adityakumar747",
  },
};
export { config };
