import db from './db.js';

export const DEMO_USER_ID = 'user_demo';

export function seedDatabase(force = false) {
  const existingUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();

  if (existingUsers.count > 0 && !force) {
    return;
  }

  // Clear tables if forcing re-seed
  if (force) {
    db.prepare('DELETE FROM matches').run();
    db.prepare('DELETE FROM swipes').run();
    db.prepare('DELETE FROM daily_picks').run();
    db.prepare('DELETE FROM users').run();
  }

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, age, bio, city, college, interests, photos, gender, profession, is_verified, prompts, preferences)
    VALUES (@id, @name, @age, @bio, @city, @college, @interests, @photos, @gender, @profession, @is_verified, @prompts, @preferences)
  `);

  const insertSwipe = db.prepare(`
    INSERT INTO swipes (swiper_id, target_id, action)
    VALUES (?, ?, ?)
  `);

  // Seed Demo User
  insertUser.run({
    id: DEMO_USER_ID,
    name: 'Alex Morgan',
    age: 23,
    bio: 'Product designer & analog photographer. Always down for late night matcha runs or browsing indie bookstores.',
    city: 'San Francisco',
    college: 'Stanford University',
    interests: JSON.stringify(['Design', 'Photography', 'Matcha', 'Indie Rock', 'Coffee', 'Bouldering']),
    photos: JSON.stringify([
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80'
    ]),
    gender: 'Non-binary',
    profession: 'Product Designer @ Studio',
    is_verified: 1,
    prompts: JSON.stringify([
      {
        question: 'My simple pleasures',
        answer: 'Fresh pour-over coffee, finding rare records, and fog rolling over the Golden Gate.'
      },
      {
        question: 'A boundary of mine',
        answer: 'No checking Slack after 7 PM; intentional downtime is non-negotiable.'
      }
    ]),
    preferences: JSON.stringify({
      lookingFor: 'Long-term connection',
      ageRange: [20, 27],
      vibe: 'Creative & curious'
    })
  });

  // 32 Rich Mock Profiles
  const mockProfiles = [
    {
      id: 'prof_1',
      name: 'Aarav Sharma',
      age: 22,
      bio: 'Architecture student who will judge your coffee order and photograph old brutalist buildings.',
      city: 'San Francisco',
      college: 'UC Berkeley',
      interests: ['Architecture', 'Photography', 'Coffee', 'Jazz', 'Bouldering'],
      photos: [
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Man',
      profession: 'Architecture Apprentice',
      is_verified: 1,
      prompts: [
        { question: 'A life goal of mine', answer: 'Designing an off-grid sustainable community library.' },
        { question: 'Ideal lazy Sunday', answer: 'In bed till noon with dusty vinyl records playing.' }
      ],
      preferences: { lookingFor: 'Long-term connection' },
      hasPreLiked: true
    },
    {
      id: 'prof_2',
      name: 'Maya Chen',
      age: 21,
      bio: 'Probably listening to indie rock or learning how to make sourdough. Tell me your worst roommate story.',
      city: 'Berkeley',
      college: 'UC Berkeley',
      interests: ['Indie Rock', 'Photography', 'Hiking', 'Baking', 'Matcha'],
      photos: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Woman',
      profession: 'Cognitive Science Student',
      is_verified: 1,
      prompts: [
        { question: 'Concert etiquette test', answer: 'Front row screaming every lyric with zero shame.' },
        { question: 'The dorkiest thing about me', answer: 'I have a spreadsheet cataloging all sourdough starters I have named.' }
      ],
      preferences: { lookingFor: 'Short-term or dating' },
      hasPreLiked: false
    },
    {
      id: 'prof_3',
      name: 'Rohan Mehta',
      age: 24,
      bio: 'Product designer by day, pottery novice by weekend. Unapologetic anime connoisseur.',
      city: 'San Francisco',
      college: 'Stanford University',
      interests: ['Design', 'Ceramics', 'Anime', 'Bouldering', 'Coffee'],
      photos: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Man',
      profession: 'UX Designer',
      is_verified: 1,
      prompts: [
        { question: 'Road trip essential', answer: 'Curated 6-hour lo-fi playlist and peach gummies.' }
      ],
      preferences: { lookingFor: 'Long-term connection' },
      hasPreLiked: true
    },
    {
      id: 'prof_4',
      name: 'Zara Al-Mansoor',
      age: 23,
      bio: 'Literature master’s candidate. If you have book recommendations that will destroy me emotionally, please share.',
      city: 'New York',
      college: 'Columbia University',
      interests: ['Classic Literature', 'Poetry', 'Matcha', 'Museums', 'Photography'],
      photos: [
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Woman',
      profession: 'Literary Researcher',
      is_verified: 1,
      prompts: [
        { question: 'Rainy afternoon plan', answer: 'Getting lost inside the Strand for 4 hours.' }
      ],
      preferences: { lookingFor: 'Long-term connection' },
      hasPreLiked: true
    },
    {
      id: 'prof_5',
      name: 'Lucas Silva',
      age: 25,
      bio: 'DJ, rooftop plant caretaker, and documentary lover. Let’s find the best taco truck in town.',
      city: 'Austin',
      college: 'UT Austin',
      interests: ['House Music', 'Houseplants', 'Street Food', 'Cycling'],
      photos: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Man',
      profession: 'Audio Engineer',
      is_verified: 0,
      prompts: [
        { question: 'Friday night sweet spot', answer: 'Sunset rooftop set followed by late night street tacos.' }
      ],
      preferences: { lookingFor: 'Casual dating' },
      hasPreLiked: false
    },
    {
      id: 'prof_6',
      name: 'Ananya Sen',
      age: 22,
      bio: 'Neuroscience major with an irrational soft spot for vintage thrift jackets and street dogs.',
      city: 'San Francisco',
      college: 'Stanford University',
      interests: ['Neuroscience', 'Thrifting', 'Dogs', 'Photography', 'Design'],
      photos: [
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Woman',
      profession: 'Neuroscience Fellow',
      is_verified: 1,
      prompts: [
        { question: 'Midnight study break', answer: '2 AM hot chai and spontaneous philosophical tangents.' }
      ],
      preferences: { lookingFor: 'Long-term connection' },
      hasPreLiked: true
    },
    {
      id: 'prof_7',
      name: 'Devansh Singhania',
      age: 23,
      bio: 'Software engineer trying to spend more time outdoors than staring at terminal tabs. Marathon runner.',
      city: 'San Francisco',
      college: 'UC Berkeley',
      interests: ['Running', 'Open Source', 'Coffee', 'Sci-Fi', 'Bouldering'],
      photos: [
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Man',
      profession: 'Distributed Systems Dev',
      is_verified: 1,
      prompts: [
        { question: 'Vacation style', answer: 'High altitude trekking with a tent and cold plunges.' }
      ],
      preferences: { lookingFor: 'Long-term connection' },
      hasPreLiked: false
    },
    {
      id: 'prof_8',
      name: 'Chloe Dupont',
      age: 21,
      bio: 'Art history & visual communications. Will make Spotify playlists for very specific fictional scenarios.',
      city: 'New York',
      college: 'NYU Tisch',
      interests: ['Contemporary Art', 'Playlists', 'Pastels', 'Cinema', 'Design'],
      photos: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Woman',
      profession: 'Curatorial Assistant',
      is_verified: 1,
      prompts: [
        { question: 'Museum etiquette', answer: 'Sitting in front of a single canvas for 30 minutes in silence.' }
      ],
      preferences: { lookingFor: 'Creative spark' },
      hasPreLiked: true
    },
    {
      id: 'prof_9',
      name: 'Kabir Kapoor',
      age: 24,
      bio: 'Filmmaker & scriptwriter. Collecting stories, eccentric conversations, and 35mm cameras.',
      city: 'Los Angeles',
      college: 'USC Cinematic Arts',
      interests: ['Screenwriting', 'Cinema', 'Photography', 'Storytelling'],
      photos: [
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Man',
      profession: 'Independent Filmmaker',
      is_verified: 1,
      prompts: [
        { question: 'Comfort movie', answer: 'Any Studio Ghibli film when it’s raining outside.' }
      ],
      preferences: { lookingFor: 'Long-term connection' },
      hasPreLiked: true
    },
    {
      id: 'prof_10',
      name: 'Elena Rostova',
      age: 22,
      bio: 'Biochem research fellow. In love with botanical gardens, greenhouse smells, and synthwave.',
      city: 'Seattle',
      college: 'University of Washington',
      interests: ['Botanicals', 'Synthwave', 'Tea', 'Astronomy'],
      photos: [
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Woman',
      profession: 'Biochem Fellow',
      is_verified: 1,
      prompts: [
        { question: 'Stargazing mood', answer: 'Telescope on the roof with steaming hot spiced tea.' }
      ],
      preferences: { lookingFor: 'Something real' },
      hasPreLiked: false
    },
    {
      id: 'prof_11',
      name: 'Tariq Farooq',
      age: 23,
      bio: 'Culinary arts graduate & culinary explorer. I test recipes on my friends; you could be next.',
      city: 'San Francisco',
      college: 'Stanford University',
      interests: ['Pastry Arts', 'Coffee', 'Design', 'Wine Pairing', 'Matcha'],
      photos: [
        'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Man',
      profession: 'Sous Chef & Baker',
      is_verified: 1,
      prompts: [
        { question: 'Dinner date dream', answer: 'Making handmade ravioli from scratch while listening to jazz.' }
      ],
      preferences: { lookingFor: 'Long-term connection' },
      hasPreLiked: true
    },
    {
      id: 'prof_12',
      name: 'Riya Varma',
      age: 21,
      bio: 'Law student with a theatre background. Always down for spontaneous road trips or karaoke battles.',
      city: 'San Francisco',
      college: 'UC Berkeley',
      interests: ['Debate', 'Musical Theatre', 'Karaoke', 'Board Games', 'Bouldering'],
      photos: [
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Woman',
      profession: 'Law Student',
      is_verified: 1,
      prompts: [
        { question: 'Karaoke go-to', answer: 'ABBA or 2000s indie rock delivered with 100% drama.' }
      ],
      preferences: { lookingFor: 'Dating & friends' },
      hasPreLiked: false
    },
    {
      id: 'prof_13',
      name: 'Siddharth Nair',
      age: 25,
      bio: 'Sound engineer & ambient music producer. Can spend 4 hours analyzing reverb acoustics in an empty subway.',
      city: 'Berlin / SF',
      college: 'Stanford University',
      interests: ['Audio Production', 'Modular Synths', 'Vinyl', 'Late Walks', 'Photography'],
      photos: [
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Man',
      profession: 'Sound Designer',
      is_verified: 1,
      prompts: [
        { question: 'Soundtrack to my head', answer: 'Tape loop warmth and rain on iron roofs.' }
      ],
      preferences: { lookingFor: 'Long-term connection' },
      hasPreLiked: true
    },
    {
      id: 'prof_14',
      name: 'Meera Joshi',
      age: 22,
      bio: 'Psychology major exploring cognitive science. Obsessed with dream journals and Japanese stationery.',
      city: 'San Francisco',
      college: 'Stanford University',
      interests: ['Stationery', 'Cognitive Science', 'Matcha', 'Pilates', 'Design'],
      photos: [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Woman',
      profession: 'Psychology Researcher',
      is_verified: 1,
      prompts: [
        { question: 'First date vibe', answer: 'Quiet tea house followed by a bookstore exploration.' }
      ],
      preferences: { lookingFor: 'Long-term connection' },
      hasPreLiked: true
    },
    {
      id: 'prof_15',
      name: 'Mateo Rossi',
      age: 24,
      bio: 'Industrial design graduate. Passionate about sustainable materials, espresso bars, and vintage vespas.',
      city: 'New York',
      college: 'Pratt Institute',
      interests: ['Design', 'Espresso', 'Sculpture', 'Architecture'],
      photos: [
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Man',
      profession: 'Product Stylist',
      is_verified: 1,
      prompts: [
        { question: 'City navigation mode', answer: 'Never using maps; getting intentionally lost.' }
      ],
      preferences: { lookingFor: 'Long-term connection' },
      hasPreLiked: false
    },
    {
      id: 'prof_16',
      name: 'Isha Kulkarni',
      age: 23,
      bio: 'Economics analyst with a weakness for street food crawls and live jazz gigs.',
      city: 'San Francisco',
      college: 'UC Berkeley',
      interests: ['Jazz', 'Coffee', 'Photography', 'Cooking', 'Matcha'],
      photos: [
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Woman',
      profession: 'Economic Consultant',
      is_verified: 1,
      prompts: [
        { question: 'Saturday evening', answer: 'Dimly lit jazz speakeasy with old friend energy.' }
      ],
      preferences: { lookingFor: 'Long-term connection' },
      hasPreLiked: true
    },
    {
      id: 'prof_17',
      name: 'Oliver Bennett',
      age: 23,
      bio: 'Marine biology student. Certified scuba diver. If you can name 3 marine species, dinner is on me.',
      city: 'San Diego',
      college: 'UCSD',
      interests: ['Scuba Diving', 'Ocean', 'Surfing', 'Acoustic Guitar'],
      photos: [
        'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Man',
      profession: 'Marine Biologist',
      is_verified: 0,
      prompts: [
        { question: 'Beach day essential', answer: 'Waxed surfboard and sunset bonfire.' }
      ],
      preferences: { lookingFor: 'Casual dating' },
      hasPreLiked: false
    },
    {
      id: 'prof_18',
      name: 'Pooja Chawla',
      age: 22,
      bio: 'Creative copywriter. Can craft puns under high pressure. Dog foster parent.',
      city: 'San Francisco',
      college: 'Stanford University',
      interests: ['Design', 'Dogs', 'Crosswords', 'Coffee', 'Photography'],
      photos: [
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Woman',
      profession: 'Agency Copywriter',
      is_verified: 1,
      prompts: [
        { question: 'Green flag I look for', answer: 'Being overwhelmingly kind to restaurant servers.' }
      ],
      preferences: { lookingFor: 'Long-term connection' },
      hasPreLiked: true
    },
    {
      id: 'prof_19',
      name: 'Arjun Patel',
      age: 25,
      bio: 'Aerospace enthusiast & drone photographer. Loves high vantage points and sunset skies.',
      city: 'Atlanta',
      college: 'Georgia Tech',
      interests: ['Drones', 'Astrophotography', 'Stargazing', 'Hiking'],
      photos: [
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Man',
      profession: 'Aerospace Engineer',
      is_verified: 1,
      prompts: [
        { question: 'Window seat rule', answer: 'Glued to the glass taking cloud photos until landing.' }
      ],
      preferences: { lookingFor: 'Long-term connection' },
      hasPreLiked: false
    },
    {
      id: 'prof_20',
      name: 'Tara Senapati',
      age: 21,
      bio: 'Classical dancer by soul, data scientist by intellect. Big believer in cosmic synchronicities.',
      city: 'San Francisco',
      college: 'UC Berkeley',
      interests: ['Dance', 'Data Science', 'Sufi Music', 'Matcha', 'Design'],
      photos: [
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Woman',
      profession: 'Data Science Student',
      is_verified: 1,
      prompts: [
        { question: 'Life theory', answer: 'Nothing is accidental; we gravitate toward people for reasons.' }
      ],
      preferences: { lookingFor: 'Long-term connection' },
      hasPreLiked: true
    },
    {
      id: 'prof_21',
      name: 'Karan Malhotra',
      age: 24,
      bio: 'Brand strategist. I know all the hidden rooftop coffee spots in the city.',
      city: 'Chicago',
      college: 'Northwestern',
      interests: ['Rooftops', 'Branding', 'Streetwear', 'Cycling'],
      photos: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Man',
      profession: 'Brand Strategist',
      is_verified: 1,
      prompts: [
        { question: 'Coffee order', answer: 'Cortado with oat milk, no sugar, drank standing up.' }
      ],
      preferences: { lookingFor: 'Something genuine' },
      hasPreLiked: false
    },
    {
      id: 'prof_22',
      name: 'Diya Reddy',
      age: 22,
      bio: 'Biotech researcher by day, indie gig-hopper by night. Will teach you Telugu idioms.',
      city: 'San Francisco',
      college: 'Stanford University',
      interests: ['Biotech', 'Live Music', 'Indie Rock', 'Coffee', 'Bouldering'],
      photos: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Woman',
      profession: 'Biotech Lab Specialist',
      is_verified: 1,
      prompts: [
        { question: 'Favorite gig type', answer: 'Unplugged acoustic sets in cozy basement bars.' }
      ],
      preferences: { lookingFor: 'Long-term connection' },
      hasPreLiked: true
    },
    {
      id: 'prof_23',
      name: 'Vikram Choudhury',
      age: 25,
      bio: 'Game developer creating cozy narrative indie games. Cat dad of two orange troublemakers.',
      city: 'Seattle',
      college: 'DigiPen',
      interests: ['Game Design', 'Pixel Art', 'Cats', 'Cozy Games'],
      photos: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Man',
      profession: 'Indie Game Director',
      is_verified: 1,
      prompts: [
        { question: 'Rainy afternoon game', answer: 'Stardew Valley farm maintenance with lo-fi music.' }
      ],
      preferences: { lookingFor: 'Long-term connection' },
      hasPreLiked: false
    },
    {
      id: 'prof_24',
      name: 'Nandini Das',
      age: 23,
      bio: 'Journalist covering culture and environment. Lover of long train rides and yellow post-it notes.',
      city: 'San Francisco',
      college: 'UC Berkeley',
      interests: ['Writing', 'Train Journeys', 'Photography', 'Documentaries', 'Matcha'],
      photos: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Woman',
      profession: 'Environmental Journalist',
      is_verified: 1,
      prompts: [
        { question: 'Travel romance', answer: 'Watching the countryside drift by from an open sleeper train window.' }
      ],
      preferences: { lookingFor: 'Long-term connection' },
      hasPreLiked: true
    },
    {
      id: 'prof_25',
      name: 'Samir Khan',
      age: 24,
      bio: 'Graphic novelist and illustrator. Making comics about awkward moments in everyday life.',
      city: 'Austin',
      college: 'UT Austin',
      interests: ['Comics', 'Drawing', 'Coffee', 'Graphic Novels'],
      photos: [
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Man',
      profession: 'Illustrator & Author',
      is_verified: 0,
      prompts: [
        { question: 'Medium of choice', answer: 'Textured watercolor paper and archival ink pens.' }
      ],
      preferences: { lookingFor: 'Creative friends & dating' },
      hasPreLiked: false
    },
    {
      id: 'prof_26',
      name: 'Shreya Mukherjee',
      age: 22,
      bio: 'Environmental policy researcher. Believes that small collective habits save the world.',
      city: 'San Francisco',
      college: 'Stanford University',
      interests: ['Sustainability', 'Hiking', 'Kayaking', 'Coffee', 'Design'],
      photos: [
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Woman',
      profession: 'Policy Analyst',
      is_verified: 1,
      prompts: [
        { question: 'Dream weekend', answer: 'Off-grid cabin in the redwoods with zero cell service.' }
      ],
      preferences: { lookingFor: 'Long-term connection' },
      hasPreLiked: true
    },
    {
      id: 'prof_27',
      name: 'Reyansh Rawat',
      age: 23,
      bio: 'Trekking guide and wilderness first responder. Ask me how to survive an unexpected mountain storm.',
      city: 'Boulder',
      college: 'CU Boulder',
      interests: ['Trekking', 'Campfires', 'Rock Climbing', 'Acoustic Guitar'],
      photos: [
        'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Man',
      profession: 'Alpine Guide',
      is_verified: 1,
      prompts: [
        { question: 'Mountain summit dawn', answer: 'Up at 4 AM to brew camp stove coffee in freezing wind.' }
      ],
      preferences: { lookingFor: 'Adventure partner' },
      hasPreLiked: false
    },
    {
      id: 'prof_28',
      name: 'Kavya Nambiar',
      age: 21,
      bio: 'Philosophy undergrad. Fascinated by ethics of AI, surrealist cinema, and filter coffee perfection.',
      city: 'San Francisco',
      college: 'Stanford University',
      interests: ['Philosophy', 'Coffee', 'Photography', 'Indie Rock', 'Design'],
      photos: [
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Woman',
      profession: 'Philosophy Researcher',
      is_verified: 1,
      prompts: [
        { question: 'Thought experiment', answer: 'The Ship of Theseus applied to human personality over time.' }
      ],
      preferences: { lookingFor: 'Long-term connection' },
      hasPreLiked: true
    },
    {
      id: 'prof_29',
      name: 'Aditya Verma',
      age: 24,
      bio: 'Urban cyclist and specialty barista. I can pull you the cleanest pour-over of your life.',
      city: 'San Francisco',
      college: 'UC Berkeley',
      interests: ['Coffee', 'Cycling', 'Typewriters', 'Vinyl', 'Bouldering'],
      photos: [
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Man',
      profession: 'Head Barista',
      is_verified: 1,
      prompts: [
        { question: 'Morning ritual', answer: '15-minute hand-ground Chemex pour-over ceremony.' }
      ],
      preferences: { lookingFor: 'Coffee dates & more' },
      hasPreLiked: false
    },
    {
      id: 'prof_30',
      name: 'Sanya Chopra',
      age: 23,
      bio: 'Fashion styling student & retro thrift hunter. Let me style an outfit for you based on your favorite album.',
      city: 'San Francisco',
      college: 'Stanford University',
      interests: ['Design', 'Thrifting', 'Album Art', 'Matcha', 'Photography'],
      photos: [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Woman',
      profession: 'Fashion Stylist',
      is_verified: 1,
      prompts: [
        { question: 'Wardrobe philosophy', answer: 'Expressive eclectic vintage chaos over bland minimalism.' }
      ],
      preferences: { lookingFor: 'Long-term connection' },
      hasPreLiked: true
    },
    {
      id: 'prof_31',
      name: 'Manish Bansal',
      age: 25,
      bio: 'Fintech dev by day, standup comedy open-micer by night. I promise I don’t test crowd work on first dates.',
      city: 'San Francisco',
      college: 'Stanford University',
      interests: ['Comedy', 'Fintech', 'Bad Puns', 'Table Tennis'],
      photos: [
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Man',
      profession: 'Fintech Engineer',
      is_verified: 0,
      prompts: [
        { question: 'Open mic disaster trick', answer: 'Acknowledge the silence and lean in with confidence.' }
      ],
      preferences: { lookingFor: 'Casual dating' },
      hasPreLiked: false
    },
    {
      id: 'prof_32',
      name: 'Alisha Mirza',
      age: 22,
      bio: 'Anthropology student documentarian. Exploring forgotten food recipes and oral storytelling traditions.',
      city: 'San Francisco',
      college: 'Stanford University',
      interests: ['Oral Histories', 'Cooking', 'Photography', 'Design', 'Matcha'],
      photos: [
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80'
      ],
      gender: 'Woman',
      profession: 'Anthropology Fellow',
      is_verified: 1,
      prompts: [
        { question: 'Old city exploration', answer: 'Wandering historic alleys without a map or itinerary.' }
      ],
      preferences: { lookingFor: 'Long-term connection' },
      hasPreLiked: true
    }
  ];

  const insertAll = db.transaction(() => {
    for (const p of mockProfiles) {
      insertUser.run({
        id: p.id,
        name: p.name,
        age: p.age,
        bio: p.bio,
        city: p.city,
        college: p.college,
        interests: JSON.stringify(p.interests),
        photos: JSON.stringify(p.photos),
        gender: p.gender,
        profession: p.profession,
        is_verified: p.is_verified,
        prompts: JSON.stringify(p.prompts),
        preferences: JSON.stringify(p.preferences)
      });

      // Pre-seed incoming like if hasPreLiked is true
      if (p.hasPreLiked) {
        insertSwipe.run(p.id, DEMO_USER_ID, 'like');
      }
    }

    // Seed Today's Pick for demo user (prof_1 by default)
    const today = new Date().toISOString().slice(0, 10);
    db.prepare(`
      INSERT OR REPLACE INTO daily_picks (user_id, profile_id, pick_date)
      VALUES (?, ?, ?)
    `).run(DEMO_USER_ID, 'prof_1', today);
  });

  insertAll();
}

// Auto seed on import if empty
seedDatabase();
