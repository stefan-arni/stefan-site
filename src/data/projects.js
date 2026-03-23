const PROJECTS = [
  {
    slug: 'kenni',
    title: 'Kenni',
    status: 'shipped',
    description:
      'AI Icelandic tutor with RAG grammar retrieval, a learner model, and spaced repetition. not a GPT wrapper.',
    tags: ['RAG', 'Gemini API', 'Cloudflare Workers', 'React'],
    hero: 'An AI language tutor where the LLM is just one piece of a bigger system. The conversation engine, learner model, and curriculum planner decide what to teach. The LLM executes within those constraints. That\'s what separates this from a chatbot wrapper.',
    stats: [
      { value: '28', label: 'grammar chunks in RAG corpus' },
      { value: '260+', label: 'validated tutor responses' },
      { value: '5', label: 'motivation-mode curricula' },
      { value: '18', label: 'Icelandic culture cards' },
    ],
    flow: [
      'User message',
      'Error detection',
      'Learner model update',
      'Curriculum planner',
      'RAG retrieval',
      'Prompt builder',
      'Gemini API',
      'Response parser',
      'Vocab logger',
      'Display',
    ],
    sections: [
      {
        heading: 'RAG System',
        body: `28 grammar chunks covering cases, verb conjugation, prepositions, word order, pronouns, impersonal verbs, modal verbs, and common mistakes. Each chunk is tagged with topic, subtopic, title, and keywords.

Instead of stuffing every grammar rule into every prompt (expensive and noisy), the system retrieves only the most relevant chunks per turn and injects them into the system prompt. Way fewer tokens, way better corrections.`,
        formula: {
          label: 'Hybrid retrieval scoring',
          lines: [
            'score = 0.6 × cosine_sim(tfidf_query, tfidf_chunk)',
            '      + 0.3 × keyword_hit_rate(query, chunk.keywords)',
            '      + 0.1 × error_topic_boost(user.errors, chunk.topic)',
          ],
        },
      },
      {
        heading: 'Learner Model & Curriculum',
        body: `Tracks per-concept grammar proficiency with exponential moving average scoring. Vocabulary goes through a state machine: unseen → seen → recognized → producing → mastered. The system also counts error patterns and runs spaced repetition with adjustable ease factors.

Every turn, the curriculum planner picks teaching objectives based on your weakest grammar, errors you keep making, where you are in the grammar order for your motivation mode, and which vocab to introduce next. Five motivation modes, each with its own topics, grammar order, and formality register:`,
        tools: [
          { name: 'Partner', detail: 'Romantic context, informal register, relationship vocabulary' },
          { name: 'Relocation', detail: 'Practical Icelandic for daily life, housing, bureaucracy' },
          { name: 'Travel', detail: 'Tourist scenarios, directions, restaurants, nature' },
          { name: 'Work', detail: 'Professional register, workplace communication, formal email' },
          { name: 'Heritage', detail: 'Family connections, cultural context, naming traditions' },
        ],
      },
      {
        heading: 'Icelandic Quality Pipeline',
        body: `LLMs are bad at Icelandic. So I built a validation pipeline: Python scripts generate 260+ tutor responses across all levels, topics, and motivation modes via the Gemini API, then run every single Icelandic response through Miðeind's GreynirCorrect grammar checker.

This surfaced systemic patterns the model kept getting wrong: case agreement after prepositions, verb number agreement, directional vs. locational adverbs, subjunctive mood in purpose clauses. Catalogued all of them and baked targeted corrections into the system prompt. 3 generation rounds, ~290 total responses analyzed.`,
      },
      {
        heading: 'Tutor Personality',
        body: `Most language apps bury corrections in generic praise. Kenni doesn't do that. It gives specific corrections with explanations, acknowledges when you actually do something well, and calls out repeated mistakes directly.

Scales by level too. Beginners get pattern-based explanations ("when going TO a place, use kaffihúsið. when AT a place, use kaffihúsinu"). Intermediates get grammar terms paired with examples. Advanced users get the full technical breakdown. If you go off-topic and ask it to write code or whatever, it redirects you back to Icelandic in character.`,
      },
      {
        heading: 'Frontend',
        body: `React 19 + TypeScript, mobile-first PWA with service worker caching, homescreen install, and iOS safe area handling. Onboarding asks for your motivation mode, proficiency level, and grammatical gender preference.

Lessons follow a topic flow: pick a topic → flip through vocab intro cards (tap-to-flip with speech synthesis via Web Speech API, Icelandic voice detection with fallback) → guided conversation with the tutor. Every 10 messages you get a session summary with accuracy stats, words learned, and grammar concepts practiced. Daily streak counter with loss-aversion mechanics to keep you coming back.`,
      },
    ],
    github: '',
    demo: '',
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'Cloudflare Workers', 'Cloudflare D1', 'Cloudflare Pages', 'Gemini 2.5 Flash', 'TF-IDF', 'GreynirCorrect', 'Web Speech API', 'Google OAuth'],
  },
  {
    slug: 'trygg',
    title: 'Trygg',
    status: 'shipped',
    description:
      'AI prediction market hedging platform. an autonomous agent searches ~6,000 live contracts and builds optimized portfolios with Kelly sizing and Monte Carlo simulation.',
    tags: ['Agentic AI', 'FastAPI', 'Kelly Criterion', 'Monte Carlo'],
    hero: 'You describe your business in plain English. An autonomous AI agent figures out your risk exposures, searches ~6,000 live prediction market contracts across Polymarket and Kalshi, and builds you an optimized hedging portfolio. Dollar allocations, payout ratios, plain-English explanations for each position.',
    stats: [
      { value: '~6,000', label: 'live contracts searched' },
      { value: '15', label: 'max autonomous agent turns' },
      { value: '10,000', label: 'Monte Carlo simulation runs' },
      { value: '4', label: 'agent tools via function calling' },
    ],
    sections: [
      {
        heading: 'Agent Design',
        body: `The agent runs an agentic loop with OpenAI function calling (o4-mini, up to 15 autonomous reasoning turns). The system prompt has few-shot examples that teach it financial reasoning: prefer cheap asymmetric payouts (a $0.08 contract pays 12:1, while a $0.94 contract has basically no upside), penalize short-duration contracts for ongoing risks, flag low-liquidity positions.

The important architectural decision here: the LLM does qualitative judgment (which contracts matter, which side to buy, how correlated they are) and outputs structured JSON. All the actual math is deterministic. You don't want an LLM doing your portfolio optimization.`,
        tools: [
          { name: 'search_polymarket', detail: 'Tag-based filtering + keyword matching across ~5,000 active events' },
          { name: 'search_kalshi', detail: 'Event-level search with nested market fetching across ~1,000 contracts' },
          { name: 'web_search', detail: 'DuckDuckGo scraping for current event context and news' },
          { name: 'enrich_company', detail: 'Crustdata API for company intel: revenue, headcount, competitors, news' },
        ],
      },
      {
        heading: 'Quantitative Engine',
        body: `The LLM's candidate contracts feed into a 3-stage optimization pipeline. On top of the core stages, the system tracks Herfindahl-based diversification score, coverage ratio, expected value, and budget utilization.`,
        formula: {
          label: 'Kelly Criterion: optimal bet fraction',
          lines: [
            'f* = (p × b - q) / b',
            '',
            'where b = net odds',
            '      p = blended probability (market price + LLM confidence)',
            '      q = 1 - p',
          ],
        },
        tools: [
          { name: 'Kelly Criterion', detail: 'Optimal position sizing for each binary contract' },
          { name: 'Mean-Variance (SLSQP)', detail: 'scipy optimizer with LLM-estimated correlation matrix, 5-50% bounds per position' },
          { name: 'Monte Carlo', detail: '10,000 runs modeling binary payouts, full P/L distribution with P10-P90 percentiles' },
        ],
      },
      {
        heading: 'Real-Time Streaming',
        body: `Nobody wants to stare at a loading spinner for 30 seconds. The agent streams its reasoning to the frontend in real time via Server-Sent Events (SSE) with keepalive. You see each tool call, search result, and reasoning step as it happens.

The frontend parses the SSE stream with ReadableStream and renders a live activity feed showing the agent's thought process while it works.`,
      },
      {
        heading: 'Frontend',
        body: `16 React components with Framer Motion animations. Position cards with expandable detail views: market probability bars, payout breakdowns, real price history charts fetched from Polymarket's CLOB API.

Quantitative analytics panel with a Monte Carlo histogram, percentile table, and position-level optimization breakdown (Kelly fraction, allocation weight, expected value per position). Portfolio summary with donut chart allocation, coverage ratio spotlight, premium vs. max protection.

Live market data via a trending markets panel and scrolling ticker feed, proxied through the backend to dodge CORS. 4 demo personas so you can try it instantly without typing anything.`,
      },
    ],
    github: '',
    demo: 'https://trygg.io',
    stack: ['React 19', 'Vite', 'Framer Motion', 'FastAPI', 'Python', 'OpenAI o4-mini', 'scipy', 'Polymarket API', 'Kalshi API', 'Crustdata API', 'SSE', 'DuckDuckGo'],
  },
  {
    slug: 'pharmacy-desert-finder',
    title: 'Pharmacy Desert Finder',
    status: 'shipped',
    description:
      'ZIP-code level pharmacy access shortfall index. Poisson GLM + XGBoost residual correction. Presented to Walgreens, in commercialization discussions with a Fortune 10 healthcare company.',
    tags: ['XGBoost', 'GLM', 'Geospatial'],
    hero: '',
    stats: [],
    sections: [],
    github: '',
    demo: '',
    stack: [],
  },
  {
    slug: 'esp32-tinyml-voice-control',
    title: 'ESP32 TinyML Voice Control',
    status: 'shipped',
    description:
      'End-to-end keyword spotting on an ESP32 microcontroller. MFCC preprocessing, compact CNN, deployed as int8 TFLite Micro model under 32KB.',
    tags: ['C/C++', 'TFLite Micro', 'TinyML'],
    hero: '',
    stats: [],
    sections: [],
    github: '',
    demo: '',
    stack: [],
  },
  {
    slug: 'llm-fine-tuning',
    title: 'LLM Fine-tuning',
    status: 'building',
    description:
      'QLoRA fine-tune for a specialized NLP task. Synthetic data generation pipeline, rigorous evaluation. Details dropping soon.',
    tags: ['LLM', 'QLoRA', 'HuggingFace'],
    hero: '',
    stats: [],
    sections: [],
    github: '',
    demo: '',
    stack: [],
  },
];

export default PROJECTS;
