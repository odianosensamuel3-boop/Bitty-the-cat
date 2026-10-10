/**
 * Editorial content for the marketing sections.
 * Copy lives here (not inside components) so it can be edited independently —
 * and so roadmap phases / gallery items can be added without touching JSX.
 */

/* ------------------------------------------------------------------ about */
export const aboutIntro = [
  "Bitty the Cat is more than a cute face. It's a community-driven meme coin built around an unmistakable orange cat, crypto culture, and the power of internet memes.",
  "From the first paw print to the next viral moment, Bitty is here to bring people together through creativity, humor, and a shared love of cats and crypto.",
  "No complicated story needed.",
  "Just Bitty, the memes, and the community.",
];

export const aboutCards = [
  {
    title: "The Mascot",
    description: "An iconic orange cat with unmistakable Bitcoin energy.",
    icon: "cat",
    accent: "from-orange/25 to-transparent",
  },
  {
    title: "The Community",
    description: "A place for cat lovers, meme creators, and crypto enthusiasts.",
    icon: "users",
    accent: "from-bitcoin/25 to-transparent",
  },
  {
    title: "The Memes",
    description: "Creative content, community moments, and endless opportunities to meme.",
    icon: "meme",
    accent: "from-golden/25 to-transparent",
  },
] as const;

/* --------------------------------------------------------------- how to buy */
export const buySteps = [
  {
    step: "01",
    title: "Set Up Your Wallet",
    description:
      "Choose a compatible cryptocurrency wallet that supports the blockchain on which Bitty launches.",
    icon: "wallet",
  },
  {
    step: "02",
    title: "Fund Your Wallet",
    description: "Obtain the appropriate network token to cover the purchase and transaction fees.",
    icon: "spark",
  },
  {
    step: "03",
    title: "Buy Bitty",
    description:
      "Use the official decentralized exchange link to find the verified Bitty contract and review the transaction before confirming.",
    icon: "shield",
  },
] as const;

/* ---------------------------------------------------------------- gallery */
export type GalleryItem = {
  /** Files generated into /public/gallery — replace these with your own art. */
  base: string;
  alt: string;
  caption: string;
  /** Marked as a placeholder so the UI can label it honestly. */
  placeholder?: boolean;
};

export const galleryItems: GalleryItem[] = [
  {
    base: "/gallery/bullish",
    alt: "Bitty the Cat in Bitcoin sunglasses with a rising green chart behind him",
    caption: "Bitty is bullish",
    placeholder: true,
  },
  {
    base: "/gallery/lasers",
    alt: "Bitty the Cat with glowing orange laser eyes and Bitcoin energy",
    caption: "Bitcoin energy",
    placeholder: true,
  },
  {
    base: "/gallery/wink",
    alt: "Bitty the Cat with a price tag showing one Bitcoin equals one Bitcoin",
    caption: "Just a cat",
    placeholder: true,
  },
  {
    base: "/gallery/hodl",
    alt: "Bitty the Cat surrounded by floating diamonds on a cool grey background",
    caption: "HODL the paw",
    placeholder: true,
  },
  {
    base: "/gallery/gm",
    alt: "Bitty the Cat in a warm sunrise palette with the words GM, Bitty",
    caption: "GM, Bitty",
    placeholder: true,
  },
  {
    base: "/gallery/moon",
    alt: "Bitty the Cat under a moon and stars on a deep blue night sky",
    caption: "To the moon?",
    placeholder: true,
  },
  {
    base: "/gallery/chill",
    alt: "Bitty the Cat on a cool blue background with calm wave lines",
    caption: "Chill cat energy",
    placeholder: true,
  },
  {
    base: "/gallery/community",
    alt: "Bitty the Cat surrounded by paw prints on an orange gradient",
    caption: "Community cat",
    placeholder: true,
  },
];

export const gallerySrcWidths = [400, 640, 900] as const;

/* ---------------------------------------------------------------- roadmap */
export type RoadmapPhase = {
  phase: string;
  title: string;
  items: string[];
  status: "complete" | "active" | "upcoming";
};

/**
 * Presented as goals, not guarantees. Edit freely as the project develops —
 * `status` drives the visual treatment of each phase.
 */
export const roadmapPhases: RoadmapPhase[] = [
  {
    phase: "Phase 1",
    title: "The Arrival",
    items: ["Introduce Bitty the Cat.", "Establish the visual identity.", "Prepare official project channels."],
    status: "active",
  },
  {
    phase: "Phase 2",
    title: "The Community",
    items: ["Welcome early supporters.", "Encourage community-created memes.", "Grow the project's social presence."],
    status: "upcoming",
  },
  {
    phase: "Phase 3",
    title: "The Meme Movement",
    items: ["Release new mascot artwork.", "Organize community activities.", "Explore creative collaborations."],
    status: "upcoming",
  },
  {
    phase: "Phase 4",
    title: "The Bitty Era",
    items: [
      "Continue developing the brand.",
      "Expand community initiatives.",
      "Explore future opportunities based on community interest.",
    ],
    status: "upcoming",
  },
];

/* -------------------------------------------------------------------- FAQ */
export const faqItems = [
  {
    question: "What is Bitty the Cat?",
    answer:
      "Bitty the Cat ($BTC) is a cat-themed meme coin project inspired by crypto culture, internet memes, and community participation.",
  },
  {
    question: "What is the $BTC ticker?",
    answer:
      "$BTC is the ticker used for the Bitty the Cat project. Always verify the official contract address before making a transaction.",
  },
  {
    question: "Which blockchain is Bitty on?",
    answer: "The official blockchain details will be published here once confirmed.",
  },
  {
    question: "How can I buy Bitty?",
    answer:
      "Follow the official purchase instructions and use only the verified contract and exchange links published through official project channels.",
  },
  {
    question: "Is Bitty an investment?",
    answer:
      "Bitty is a meme coin and may be highly volatile. There are no guarantees of returns or future value. Only participate with funds you can afford to lose.",
  },
  {
    question: "Where can I join the community?",
    answer: "Official community links will be published on this website once available.",
  },
];

/* -------------------------------------------------------------- marquee */
export const marqueeItems = [
  "THE CAT WITH BITCOIN ENERGY",
  "$BTC",
  "ORANGE FUR. BIG DREAMS.",
  "UNLIMITED MEMES",
  "ONE CAT. ONE COMMUNITY.",
  "BITTY ERA",
];
