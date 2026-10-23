import type { Movie, NewsArticle, LivePulseItem, DiscussionThread, IndustryMetadata } from '../types/cinema';

export const INDUSTRIES_METADATA: IndustryMetadata[] = [
  {
    code: 'all',
    name: 'Pan-India Combined',
    nativeName: 'भारतीय सिनेमा',
    scriptClass: 'font-devanagari',
    filmCity: 'National Integrated Terminal',
    boxOfficeShare2025: '100%',
    totalTrackedScreens: 10420,
    marqueeDirectors: ['S.S. Rajamouli', 'Prashanth Neel', 'Sandeep Reddy Vanga', 'Rishab Shetty', 'Nelson Dilipkumar', 'Nitesh Tiwari'],
    description: 'Aggregated real-time box-office telemetry and trade intelligence across all Indian film distribution territories.'
  },
  {
    code: 'tamil',
    name: 'Tamil (Kollywood)',
    nativeName: 'தமிழ் திரையுலகம்',
    scriptClass: 'font-tamil',
    filmCity: 'Chennai (Kodambakkam)',
    boxOfficeShare2025: '29.2%',
    totalTrackedScreens: 2150,
    marqueeDirectors: ['Nelson Dilipkumar', 'Lokesh Kanagaraj', 'H. Vinoth', 'Mani Ratnam', 'Vetrimaran'],
    description: 'Commanding massive multi-territory footprint across South India, Southeast Asia, and European diaspora.'
  },
  {
    code: 'kannada',
    name: 'Kannada (Sandalwood)',
    nativeName: 'ಕನ್ನಡ ಚಿತ್ರರಂಗ',
    scriptClass: 'font-kannada',
    filmCity: 'Bengaluru (Kanteerava & Hombale)',
    boxOfficeShare2025: '24.2%',
    totalTrackedScreens: 1840,
    marqueeDirectors: ['Rishab Shetty', 'Prashanth Neel', 'Rakshit Shetty', 'Geetu Mohandas'],
    description: 'High-concept mythological realism and cinematic mass spectacles commanding national box office records.'
  },
  {
    code: 'hindi',
    name: 'Hindi (Bollywood)',
    nativeName: 'हिंदी सिनेमा',
    scriptClass: 'font-devanagari',
    filmCity: 'Mumbai (Film City Goregaon)',
    boxOfficeShare2025: '26.4%',
    totalTrackedScreens: 3480,
    marqueeDirectors: ['Nitesh Tiwari', 'Ayan Mukerji', 'Siddharth Anand', 'Shiv Rawail', 'Sujoy Ghosh'],
    description: 'Expansive multiplex distribution driving holiday festival tentpoles across northern, western, and central circuits.'
  },
  {
    code: 'telugu',
    name: 'Telugu (Tollywood)',
    nativeName: 'తెలుగు సినీరంగం',
    scriptClass: 'font-telugu',
    filmCity: 'Hyderabad (Film Nagar & Ramoji)',
    boxOfficeShare2025: '14.8%',
    totalTrackedScreens: 2420,
    marqueeDirectors: ['S.S. Rajamouli', 'Sandeep Reddy Vanga', 'Karthik Gattamneni', 'Sukumar', 'Prasanth Varma'],
    description: 'The epicenter of high-concept visual fantasy, technological innovation, and pan-Indian opening-day records.'
  },
  {
    code: 'malayalam',
    name: 'Malayalam (Mollywood)',
    nativeName: 'മലയാള ചലച്ചിത്രം',
    scriptClass: 'font-malayalam',
    filmCity: 'Kochi & Thiruvananthapuram',
    boxOfficeShare2025: '4.8%',
    totalTrackedScreens: 720,
    marqueeDirectors: ['Amal Neerad', 'Chidambaram', 'Lijo Jose Pellissery', 'Jeethu Joseph', 'Rahul Sadasivan'],
    description: 'Industry benchmark for return-on-investment, script integrity, and organic pan-Indian theatrical expansion.'
  },
  {
    code: 'bengali',
    name: 'Bengali (Tollywood East)',
    nativeName: 'বাংলা চলচ্চিত্র',
    scriptClass: 'font-bengali',
    filmCity: 'Kolkata (Tollygunge)',
    boxOfficeShare2025: '1.2%',
    totalTrackedScreens: 410,
    marqueeDirectors: ['Srijit Mukherji', 'Kaushik Ganguly', 'Atanu Ghosh'],
    description: 'Durga Puja festive tentpoles and literary narrative traditions commanding Eastern India circuits.'
  }
];

import { MASTER_MOVIES } from './masterMovies';

export const MOVIES_DATABASE: Movie[] = MASTER_MOVIES;

export const NEWS_EDITORIAL_DATABASE: NewsArticle[] = [
  {
    id: 'news-kalki-nag-ashwin-interview',
    title: 'Behind the Scenes of Kalki 2898 AD – Exclusive with Nag Ashwin',
    excerpt: 'Nag Ashwin explains how he combined 6,000-year-old Mahabharata lore with cutting-edge visual effects to create Indian cinema’s first world-class sci-fi epic.',
    author: 'Nag Ashwin (Interviewed by CineSouth)',
    publisher: 'CineSouth Exclusive',
    publishedAt: '2 hours ago',
    readTime: '6 min read',
    category: 'Production Exclusive',
    relatedMovieId: 'kalki-2898-ad',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    tags: ['Kalki 2898 AD', 'Nag Ashwin', 'Prabhas', 'Interview', 'Telugu'],
    priority: 'lead',
    originalArticleUrl: 'https://cinesouth.com/articles/behind-the-scenes-kalki-2898-ad',
    isVerifiedReport: true
  },
  {
    id: 'news-manjummel-boys-analysis',
    title: 'Why Manjummel Boys Struck a Chord with Audiences',
    excerpt: 'An in-depth analysis of Malayalam cinema’s masterclass in emotional realism, survival tension, and authentic friendship without cinematic melodrama.',
    author: 'Sanjay Nair',
    publisher: 'CineSouth Analysis Desk',
    publishedAt: '4 hours ago',
    readTime: '5 min read',
    category: 'Trade Analysis',
    relatedMovieId: 'manjummel-boys',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    tags: ['Manjummel Boys', 'Malayalam Cinema', 'Box Office Analysis'],
    priority: 'secondary',
    originalArticleUrl: 'https://cinesouth.com/articles/manjummel-boys-audience-analysis',
    isVerifiedReport: true
  },
  {
    id: 'news-rajinikanth-evolution-feature',
    title: 'The Evolution of Rajinikanth – From Mass to Metaphor',
    excerpt: 'Tracing Superstar Rajinikanth’s journey from 1970s anti-hero to an invincible cinematic icon, examining his enduring legacy and cultural transcendence.',
    author: 'V. S. Ramanathan',
    publisher: 'The Hindu Cinema Desk',
    publishedAt: '6 hours ago',
    readTime: '7 min read',
    category: 'Production Exclusive',
    relatedMovieId: 'vettaiyan',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    tags: ['Rajinikanth', 'Tamil Cinema', 'Vettaiyan', 'Superstar'],
    priority: 'secondary',
    originalArticleUrl: 'https://cinesouth.com/articles/evolution-of-rajinikanth',
    isVerifiedReport: true
  },
  {
    id: 'news-south-cinema-global-rise',
    title: 'South Indian Cinema’s Global Rise: What’s Next?',
    excerpt: 'From Telugu high-concept spectacles to Tamil mass epics and Malayalam realism, analyzing the cultural and economic factors taking South India to the global stage.',
    author: 'Aishwarya Menon',
    publisher: 'Variety South Asia',
    publishedAt: '8 hours ago',
    readTime: '8 min read',
    category: 'Trade Analysis',
    relatedMovieId: 'pushpa-2-the-rule',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    tags: ['South Cinema', 'Global Box Office', 'Pan-India', 'Industry News'],
    priority: 'secondary',
    originalArticleUrl: 'https://variety.com/2026/film/global/south-indian-cinema-global-expansion-1236184920/',
    isVerifiedReport: true
  },
  {
    id: 'news-oct-2026-jailer-2-box-office',
    title: 'Jailer 2 Storms to ₹370 Cr Worldwide in Week 1: Rajinikanth & Nelson Reignites Kollywood Festive Dominance',
    excerpt: 'Detailed multi-circuit trade analysis into Tiger Muthuvel Pandian’s explosive opening across 5,200 screens in Tamil Nadu, Telugu states, and overseas diaspora circuits.',
    author: 'Siddharth Rao, Senior Trade Fellow',
    publisher: 'CinéPulse Trade Quarterly',
    publishedAt: '35 mins ago',
    readTime: '6 min read',
    category: 'Trade Analysis',
    relatedMovieId: 'jailer-2',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
    tags: ['Jailer 2', 'Rajinikanth', 'Nelson', 'Sun Pictures', 'Box Office Week 1'],
    priority: 'lead',
    originalArticleUrl: 'https://variety.com/2026/film/global/rajinikanth-jailer-2-box-office-1236184910/',
    isVerifiedReport: true
  },
  {
    id: 'news-thalapathy-69-advance-frenzy',
    title: 'Thalapathy 69: Official Title and First Look to Be Revealed Soon',
    excerpt: 'KVN Productions reports tremendous anticipation for Thalapathy Vijay’s emotional political farewell tentpole ahead of its global release.',
    author: 'Ramesh Bala Desk',
    publisher: 'Deadline South Asia',
    publishedAt: '5 hours ago',
    readTime: '4 min read',
    category: 'Box Office Report',
    relatedMovieId: 'thalapathy-69',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    tags: ['Thalapathy 69', 'Vijay Final Film', 'Global Exhibition'],
    priority: 'feed',
    originalArticleUrl: 'https://deadline.com/2026/10/thalapathy-69-advance-booking-records-vijay-1236184992/',
    isVerifiedReport: true
  }
];

export const LIVE_PULSE_ITEMS: LivePulseItem[] = [
  {
    id: 'pulse-devara-trailer',
    type: 'trailer',
    headline: 'Devara Part 1: Trailer Breaks Records With 50M+ Views In 24 Hours',
    timeAgo: '2 hours ago',
    delta: 'Record Views',
    badge: 'TRAILER RECORD',
    movieId: 'devara-part-1',
    isBreaking: true,
    sourceAttribution: 'Yuvasudha Arts Official'
  },
  {
    id: 'pulse-thalapathy-69',
    type: 'news',
    headline: 'Thalapathy 69: Official Title and First Look to Be Revealed Soon',
    timeAgo: '5 hours ago',
    delta: 'Trending #1',
    badge: 'FIRST LOOK',
    movieId: 'thalapathy-69',
    isBreaking: true,
    sourceAttribution: 'KVN Productions'
  },
  {
    id: 'pulse-pushpa-2',
    type: 'boxoffice',
    headline: 'Pushpa 2: The Rule - Box Office Crosses ₹1000 Crore Worldwide',
    timeAgo: '7 hours ago',
    delta: '₹1,050 Cr WW',
    badge: 'HISTORIC CLUB',
    movieId: 'pushpa-2-the-rule',
    isBreaking: true,
    sourceAttribution: 'Sacnilk & Mythri'
  },
  {
    id: 'pulse-kalki-oscar',
    type: 'milestone',
    headline: 'Kalki 2898 AD Gets Oscar Entry (Officially Confirmed)',
    timeAgo: '10 hours ago',
    delta: 'Official Selection',
    badge: 'OSCAR ENTRY',
    movieId: 'kalki-2898-ad',
    isBreaking: false,
    sourceAttribution: 'Film Federation of India'
  }
];

export const DISCUSSION_THREADS: DiscussionThread[] = [
  {
    id: 'thread-devara-rrr',
    movieId: 'devara-part-1',
    movieTitle: 'Devara Part 1',
    title: 'Is Devara a worthy successor to RRR?',
    author: {
      name: 'Chaitanya Varma',
      handle: '@chaitanya_cinema',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop',
      badge: 'Cinephile Fellow'
    },
    timestamp: '2 hours ago',
    content: 'Jr NTR’s dual role performance in Devara carries raw coastal intensity. Comparing Koratala Siva’s drama to Rajamouli’s scale, does Devara establish NTR as a solo pan-India heavyweight?',
    upvotes: 1420,
    repliesCount: 2400,
    isSpoiler: false,
    tags: ['Devara', 'Jr NTR', 'RRR', 'Telugu Cinema'],
    comments: [
      {
        id: 'c-devara-1',
        author: 'Srinivas Rao',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop',
        badge: 'Box Office Mod',
        text: 'The pre-interval sea battle sequence is on par with any international action block. Anirudh’s score elevated it completely.',
        timestamp: '1 hour ago',
        upvotes: 215
      }
    ]
  },
  {
    id: 'thread-best-screen-presence',
    title: 'Which actor has the best screen presence in South India?',
    author: {
      name: 'Pooja Iyer',
      handle: '@pooja_films',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop',
      badge: 'Film Critic'
    },
    timestamp: '4 hours ago',
    content: 'From Rajinikanth’s timeless swagger to Mohanlal’s natural magnetism, Allu Arjun’s electric swag, Yash’s commanding aura, and Kamal Haasan’s chameleon depth—who commands the screen best?',
    upvotes: 980,
    repliesCount: 1800,
    isSpoiler: false,
    tags: ['South Cinema', 'Screen Presence', 'Superstars', 'Debate'],
    comments: [
      {
        id: 'c-presence-1',
        author: 'Manoj Kumar',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop',
        badge: 'Audience',
        text: 'Rajinikanth in Vettaiyan and Jailer proved that sheer aura alone can silence an auditorium in seconds.',
        timestamp: '3 hours ago',
        upvotes: 188
      }
    ]
  },
  {
    id: 'thread-kantara-2-expectations',
    movieId: 'kantara-chapter-1',
    movieTitle: 'Kantara: Chapter 1',
    title: 'Kantara 2 - What are your expectations?',
    author: {
      name: 'Rohan Hegde',
      handle: '@rohan_kannada',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop',
      badge: 'Verified Trade Analyst'
    },
    timestamp: '5 hours ago',
    content: 'With Rishab Shetty setting Chapter 1 in the 4th-century Kadamba era, the lore behind the Daiva’s divine covenant will be explored at grand mythological scale.',
    upvotes: 754,
    repliesCount: 1200,
    isSpoiler: false,
    tags: ['Kantara', 'Rishab Shetty', 'Kadamba Dynasty', 'Kannada'],
    comments: [
      {
        id: 'c-kantara-1',
        author: 'Deepak Bhat',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop',
        badge: 'Audience',
        text: 'The teasers alone show the Kalaripayattu and martial weapon training Rishab underwent. It will set a new benchmark for Kannada cinema.',
        timestamp: '4 hours ago',
        upvotes: 142
      }
    ]
  },
  {
    id: 'thread-thalapathy-69-last-film',
    movieId: 'thalapathy-69',
    movieTitle: 'Thalapathy 69',
    title: 'Will Thalapathy 69 be his last film?',
    author: {
      name: 'Vignesh Shivan Fan',
      handle: '@vicky_thalapathy',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop',
      badge: 'Audience'
    },
    timestamp: '6 hours ago',
    content: 'With Vijay entering direct electoral politics in Tamil Nadu, all trade indicators confirm Thalapathy 69 under H. Vinoth will be his celebratory swan song on the big screen.',
    upvotes: 890,
    repliesCount: 1100,
    isSpoiler: false,
    tags: ['Thalapathy Vijay', 'Thalapathy 69', 'Kollywood', 'Tamil'],
    comments: []
  },
  {
    id: 'thread-best-south-movie-2024',
    title: 'Best South Indian movie of 2024 so far?',
    author: {
      name: 'CineSouth Poll Desk',
      handle: '@cinesouth_polls',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop',
      badge: 'Verified Trade Analyst'
    },
    timestamp: '8 hours ago',
    content: 'Poll: Vote between Manjummel Boys, Amaran, Kalki 2898 AD, Devara Part 1, Aavesham, and Lucky Baskhar for the most defining theatrical experience of the year.',
    upvotes: 1150,
    repliesCount: 980,
    isSpoiler: false,
    tags: ['Poll', 'Manjummel Boys', 'Amaran', 'Kalki 2898 AD', '2024'],
    comments: []
  }
];
