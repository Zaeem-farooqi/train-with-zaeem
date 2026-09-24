/**
 * Section copy and media.
 * Image paths are local placeholders. Swap the files in /public/images
 * and keep the alt text accurate.
 */

export const difference = {
  id: "difference",
  eyebrow: "What's different",
  title: "The plan only works if you can run it.",
  points: [
    {
      index: "01",
      kicker: "Diet",
      title: "A diet built around your life",
      body: "Not a template. Meals, portions, and adjustments written for how you actually eat, train, and recover.",
      // TODO: replace with a real client meal or coaching photo.
      image: "/images/diet.jpg",
      imageAlt: "A simple plated meal on a dark table, used as a placeholder",
    },
    {
      index: "02",
      kicker: "Physical training",
      title: "In the room, in Lahore and Islamabad",
      body: "Hands-on sessions in Lahore and Islamabad. Programming still follows your equipment, schedule, and recovery.",
      // TODO: replace with a real training-floor photo.
      image: "/images/workout.jpg",
      imageAlt: "Dumbbells on a gym floor, used as a placeholder",
    },
    {
      index: "03",
      kicker: "Independence",
      title: "You learn to run it",
      body: "The point is independence. You leave able to plan workouts, food, and adjustments without me in the room.",
      // TODO: replace with a real coaching photo.
      image: "/images/coach.jpg",
      imageAlt: "A person training with a barbell, used as a placeholder",
    },
    {
      index: "04",
      kicker: "Online training",
      title: "Training, anywhere",
      body: "The same programming, check-ins, and adjustments — online, from anywhere, on your schedule, with the equipment you have.",
      // TODO: replace with a real online-training photo.
      image: "/images/online-training.jpg",
      imageAlt: "A person training at home, used as a placeholder",
    },
    {
      index: "05",
      kicker: "Online consultation",
      title: "A consultation, on a call",
      body: "One call, from anywhere, to look at your training, food, and what to change next. Useful if you want direction before a full plan.",
      // TODO: replace with a real consultation photo.
      image: "/images/consult.jpg",
      imageAlt: "A person working on a laptop, used as a placeholder",
    },
  ],
} as const;
