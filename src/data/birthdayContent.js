// ============================================================================
// BIRTHDAY CONFIGURATION FOR JAYA
// You can easily edit any text, secret messages, memories, or photos right here!
// ============================================================================

export const birthdayContent = {
  // Birthday person's name
  name: "Jaya",

  // Screen 1: The Secret Gift Box
  screen1: {
    giftHint: "TAP TO UNWRAP",
    openingText: "for someone special...",
  },

  // Screen 2: Interactive Bow & Heart
  screen2: {
    intro: "a little something for you",
    pullHint: "PULL & RELEASE",
  },

  // Screen 3: The Love Tree
  tree: {
    eyebrow: "and... make it count",
    title: "Happy Birthday",
    subtext: "here's to a year that blooms",
    secretsGoal: 10,
    subtleHint: "Looks like the tree has a few more things to say...",
    nextButtonText: "Starting my letter for you ❤️",
  },

  // Secret messages hidden in the tree hearts (tappable by Jaya)
  // Edit or add as many personal secrets as you like!
  secretMessages: [
    "Some people make ordinary days feel special. ❤️",
    "Your smile has a way of making everything brighter.",
    "I hope this year gives you a thousand reasons to smile.",
    "You deserve beautiful things and beautiful moments.",
    "Here's to memories that haven't happened yet.",
    "May this year be gentle, exciting and full of happiness.",
    "Never forget that you are someone's very special person.",
    "Keep being you, Jaya. ❤️",
    "You bring warmth wherever you go without even trying.",
    "I hope every dream you hold close to your heart finds its way to you.",
    "May your laughs always be loud and your days be full of wonder.",
    "Thank you for being such an extraordinary part of life.",
    "You are more appreciated and loved than words could ever show.",
    "The world is undeniably softer and brighter with you in it.",
  ],

  // Screen 4: Memory Lane (Scrapbook photos)
  // Can also be edited live on the website via the "✎ Edit Memories" button!
  memories: [
    {
      id: 1,
      image: "./images/memory1.jpg",
      caption: "A smile that lights up the whole room ✨",
      rotation: -3,
      date: "A quiet moment",
    },
    {
      id: 2,
      image: "./images/memory2.jpg",
      caption: "Laughter that makes everything feel right in the world 🌸",
      rotation: 2.5,
      date: "Pure joy",
    },
    {
      id: 3,
      image: "./images/memory3.jpg",
      caption: "Some memories remain golden no matter how much time passes ☕",
      rotation: -1.5,
      date: "Unforgettable",
    },
    {
      id: 4,
      image: "./images/memory4.jpg",
      caption: "Every day spent with you has its own little magic 💫",
      rotation: 3.8,
      date: "Sweetest smile",
    },
    {
      id: 5,
      image: "./images/memory5.jpg",
      caption: "Here's to you, Jaya — beautiful inside and out ❤️",
      rotation: -2,
      date: "Always cherished",
    },
  ],

  // Screen 5: The Emotional Birthday Letter
  letterTitle: "A Letter For You",
  letter: `Jaya,

I wanted to give you something a little different this year.

Not just a birthday wish,
but a tiny place filled with little moments,
little surprises,
and a few words meant just for you.

I hope this new year of your life brings you beautiful memories,
unexpected happiness,
peace on difficult days,
and countless reasons to smile.

Keep being the person you are.

Happy Birthday, Jaya. ❤️`,

  // Screen 6: Final Emotional Reveal
  finalGreeting: "One last thing...",
  finalMessage: "Happy Birthday, Jaya ❤️",
  finalSubtext: "May this year be one you'll always remember.",

  // Background romantic music (placed in public/music/)
  music: "./music/birthday.mp3",
};

export default birthdayContent;
