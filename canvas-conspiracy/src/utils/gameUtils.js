// Utility Functions
export const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const prompts = [
  "A cat trying to use a computer",
  "An alien ordering pizza",
  "A superhero doing laundry",
  "A robot learning to dance",
  "A dragon at a coffee shop",
  "A pirate at the gym",
  "An astronaut gardening",
  "A wizard using a smartphone",
  "A dinosaur at a birthday party",
  "A ghost trying to cook",
  "A vampire at the beach",
  "A ninja doing yoga",
  "A zombie at a job interview",
  "A werewolf getting a haircut",
  "An octopus playing piano",
  "A penguin skateboarding",
  "A lion at a tea party",
  "A giraffe in an elevator",
  "A shark brushing teeth",
  "A bear riding a bicycle"
];

export const colors = [
  '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000',
  '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008080'
];

export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const calculateScore = (correctGuesses, storyVotes, bonusPoints = 0) => {
  return (correctGuesses * 10) + (storyVotes * 5) + bonusPoints;
};

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};