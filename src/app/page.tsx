// app/page.tsx
"use client";

import { useState } from "react";

type Goal =
  | "bulk"
  | "cut"
  | "maintain"
  | "preworkout"
  | "postworkout"
  | "rest";

interface MealSuggestion {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  description: string;
  timing: string;
  tag: string;
}

const MEAL_DATABASE: Record<Goal, MealSuggestion[]> = {
  bulk: [
    {
      name: "Chicken & Rice Bowl",
      calories: 650,
      protein: 55,
      carbs: 75,
      fats: 15,
      description:
        "Classic lean bulk meal – easy to digest, high protein, steady carbs.",
      timing: "Lunch / Dinner",
      tag: "Lean bulk",
    },
    {
      name: "Beef Pasta with Olive Oil",
      calories: 780,
      protein: 48,
      carbs: 90,
      fats: 24,
      description:
        "Higher calories for a surplus day, great after heavy lifts.",
      timing: "Post-workout / Dinner",
      tag: "High calorie",
    },
    {
      name: "Salmon, Potatoes & Veg",
      calories: 710,
      protein: 45,
      carbs: 65,
      fats: 30,
      description:
        "Omega-3s for recovery + enough carbs to fuel your sessions.",
      timing: "Dinner",
      tag: "Healthy fats",
    },
  ],
  cut: [
    {
      name: "Grilled Chicken Salad (Extra Protein)",
      calories: 420,
      protein: 45,
      carbs: 25,
      fats: 14,
      description:
        "High protein, low-ish carb, lots of volume from veggies for fullness.",
      timing: "Lunch / Dinner",
      tag: "Low calorie, filling",
    },
    {
      name: "Tofu Stir Fry with Veggies",
      calories: 380,
      protein: 30,
      carbs: 35,
      fats: 11,
      description:
        "Great plant-based option to cut without feeling dead inside.",
      timing: "Lunch / Dinner",
      tag: "Plant-based",
    },
    {
      name: "Greek Yogurt Bowl with Berries",
      calories: 320,
      protein: 28,
      carbs: 35,
      fats: 5,
      description:
        "Light, sweet, and macro-friendly. Good for dessert or light meal.",
      timing: "Snack / Light meal",
      tag: "High protein snack",
    },
  ],
  maintain: [
    {
      name: "Teriyaki Chicken Rice with Veggies",
      calories: 580,
      protein: 40,
      carbs: 70,
      fats: 15,
      description:
        "Balanced meal for maintenance days – not too heavy, not too light.",
      timing: "Lunch / Dinner",
      tag: "Balanced",
    },
    {
      name: "Poke Bowl with Tuna/Salmon",
      calories: 560,
      protein: 38,
      carbs: 65,
      fats: 16,
      description:
        "Fresh, tasty, and macro-aware. Choose extra protein if you can.",
      timing: "Lunch",
      tag: "Macro-friendly",
    },
    {
      name: "Omelette with Toast & Fruit",
      calories: 520,
      protein: 32,
      carbs: 50,
      fats: 18,
      description:
        "Perfect for a brunch day, keeps you satisfied without food coma.",
      timing: "Breakfast / Brunch",
      tag: "All-rounder",
    },
  ],
  preworkout: [
    {
      name: "Oats with Banana & Whey",
      calories: 430,
      protein: 30,
      carbs: 60,
      fats: 7,
      description:
        "Slow + fast carbs combo with protein – ideal 60–90 mins before gym.",
      timing: "60–90 min before workout",
      tag: "Pre-workout fuel",
    },
    {
      name: "Rice Cake, Peanut Butter & Banana",
      calories: 360,
      protein: 14,
      carbs: 45,
      fats: 14,
      description:
        "Light but energizing. Won’t sit too heavy in your stomach.",
      timing: "45–60 min before workout",
      tag: "Light & fast",
    },
    {
      name: "Chicken Wrap",
      calories: 420,
      protein: 32,
      carbs: 45,
      fats: 10,
      description:
        "Good if you’re hungry but still want to train hard in an hour.",
      timing: "60–90 min before workout",
      tag: "Solid meal",
    },
  ],
  postworkout: [
    {
      name: "Protein Shake + Banana",
      calories: 260,
      protein: 30,
      carbs: 30,
      fats: 3,
      description:
        "Fast protein + carbs, easy to drink right after your last set.",
      timing: "0–30 min after workout",
      tag: "Quick recovery",
    },
    {
      name: "Chicken Burrito Bowl",
      calories: 620,
      protein: 45,
      carbs: 70,
      fats: 16,
      description:
        "Refill your glycogen and feed your muscles after a big session.",
      timing: "Within 2 hours after workout",
      tag: "Refuel",
    },
    {
      name: "Sushi Set (Salmon/Tuna focus)",
      calories: 550,
      protein: 35,
      carbs: 80,
      fats: 10,
      description:
        "Easily digestible carbs + lean protein – nice social meal too.",
      timing: "Post-workout dinner",
      tag: "High carb",
    },
  ],
  rest: [
    {
      name: "High Protein Buddha Bowl",
      calories: 500,
      protein: 35,
      carbs: 45,
      fats: 16,
      description:
        "Rest day, but still on track – fiber, micros, and enough protein.",
      timing: "Lunch / Dinner",
      tag: "Recovery focused",
    },
    {
      name: "Cottage Cheese / Greek Yogurt Plate",
      calories: 340,
      protein: 32,
      carbs: 25,
      fats: 8,
      description:
        "Good for a chill day at home, keeps protein high with low effort.",
      timing: "Snack / Light meal",
      tag: "Lazy but healthy",
    },
    {
      name: "Stir-fried Veg + Lean Protein",
      calories: 460,
      protein: 38,
      carbs: 30,
      fats: 15,
      description:
        "Keep it clean but not boring. Add some garlic and chili for life.",
      timing: "Dinner",
      tag: "Clean eating",
    },
  ],
};

const goalLabels: Record<Goal, string> = {
  bulk: "Bulking Day",
  cut: "Cutting / Shredding",
  maintain: "Maintenance",
  preworkout: "Before Workout",
  postworkout: "After Workout",
  rest: "Rest / Active Recovery",
};

const goalEmoji: Record<Goal, string> = {
  bulk: "🍚",
  cut: "🥗",
  maintain: "⚖️",
  preworkout: "⚡",
  postworkout: "🔋",
  rest: "😴",
};

export default function HomePage() {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [suggestion, setSuggestion] = useState<MealSuggestion | null>(null);

  const handleSelectGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    const pool = MEAL_DATABASE[goal];
    const randomIndex = Math.floor(Math.random() * pool.length);
    setSuggestion(pool[randomIndex]);
  };

  const spinAgain = () => {
    if (!selectedGoal) return;
    handleSelectGoal(selectedGoal);
  };

  return (
    <main className="flex items-center justify-center px-4 py-10">
      <div className="max-w-3xl w-full">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-8 shadow-2xl">
          {/* Header */}
          <header className="mb-8 text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-4 py-1 text-xs font-medium text-slate-300 border border-slate-700">
              💪 Gym Edition · What to eat today?
            </p>
            <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
              What Should I Eat Today?
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300">
              Choose your training vibe and I’ll pick a{" "}
              <span className="font-semibold text-sky-300">
                gym-friendly meal
              </span>{" "}
              for you. No more staring at Foodpanda for 20 minutes.
            </p>
          </header>

          {/* Goal selector */}
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wide mb-3">
              1 · What kind of day is it?
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {(Object.keys(goalLabels) as Goal[]).map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleSelectGoal(goal)}
                  className={`group flex flex-col items-start rounded-2xl border px-4 py-3 text-left transition
                    ${
                      selectedGoal === goal
                        ? "border-sky-400 bg-sky-500/10 shadow-lg shadow-sky-900/40"
                        : "border-slate-700 bg-slate-900/60 hover:border-sky-400/70 hover:bg-slate-900"
                    }`}
                >
                  <span className="text-2xl mb-1">
                    {goalEmoji[goal]}
                  </span>
                  <span className="text-sm font-semibold text-slate-100">
                    {goalLabels[goal]}
                  </span>
                  <span className="mt-1 text-xs text-slate-400 group-hover:text-slate-300">
                    {goal === "bulk" && "Calorie surplus, let’s grow."}
                    {goal === "cut" && "Keep it lean, keep it mean."}
                    {goal === "maintain" && "Chill day, stable macros."}
                    {goal === "preworkout" && "Fuel up before gym."}
                    {goal === "postworkout" && "Refuel & recover."}
                    {goal === "rest" && "Rest day but still on track."}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Suggestion card */}
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
                2 · Today&apos;s meal suggestion
              </h2>
              <button
                onClick={spinAgain}
                disabled={!selectedGoal}
                className="text-xs rounded-full border border-slate-600 px-3 py-1 font-medium text-slate-200 hover:border-sky-400 hover:text-sky-200 disabled:border-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed"
              >
                🎲 Spin again
              </button>
            </div>

            {!suggestion ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-4 py-6 text-center text-sm text-slate-400">
                Pick your vibe first. I promise I won&apos;t judge your bulk.
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5 sm:p-6 shadow-lg shadow-slate-900/60">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Recommended meal
                    </p>
                    <h3 className="text-xl font-semibold text-slate-50">
                      {suggestion.name}
                    </h3>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-sky-500/15 px-3 py-1 text-xs font-medium text-sky-200 border border-sky-500/40">
                    {selectedGoal && goalEmoji[selectedGoal]}{" "}
                    <span className="ml-1">{suggestion.tag}</span>
                  </span>
                </div>

                <p className="text-sm text-slate-200 mb-3">
                  {suggestion.description}
                </p>
                <p className="text-xs text-slate-400 mb-4">
                  ⏱{" "}
                  <span className="font-medium text-slate-200">
                    Suggested timing:
                  </span>{" "}
                  {suggestion.timing}
                </p>

                {/* Macros */}
                <div className="grid gap-3 sm:grid-cols-4 text-sm">
                  <MacroCard label="Calories" value={suggestion.calories} unit="kcal" />
                  <MacroCard label="Protein" value={suggestion.protein} unit="g" highlight />
                  <MacroCard label="Carbs" value={suggestion.carbs} unit="g" />
                  <MacroCard label="Fats" value={suggestion.fats} unit="g" />
                </div>

                {/* Macro bars */}
                <div className="mt-5 space-y-2">
                  <p className="text-xs font-medium text-slate-300 uppercase tracking-wide">
                    Macro distribution (rough)
                  </p>
                  <MacroBar
                    label="Protein"
                    percentage={Math.round(
                      (suggestion.protein * 4 * 100) / suggestion.calories
                    )}
                  />
                  <MacroBar
                    label="Carbs"
                    percentage={Math.round(
                      (suggestion.carbs * 4 * 100) / suggestion.calories
                    )}
                  />
                  <MacroBar
                    label="Fats"
                    percentage={Math.round(
                      (suggestion.fats * 9 * 100) / suggestion.calories
                    )}
                  />
                </div>
              </div>
            )}
          </section>

          {/* Footer */}
          <footer className="mt-6 text-center text-[11px] text-slate-500">
            This is a vibe-based suggestion app, not a strict meal plan. Adjust
            portions to your own macros & coach advice. 🧮
          </footer>
        </div>
      </div>
    </main>
  );
}

interface MacroCardProps {
  label: string;
  value: number;
  unit: string;
  highlight?: boolean;
}

function MacroCard({ label, value, unit, highlight }: MacroCardProps) {
  return (
    <div
      className={`rounded-xl border px-3 py-2.5 flex flex-col justify-between
      ${
        highlight
          ? "border-sky-500/70 bg-sky-500/10"
          : "border-slate-700 bg-slate-900/60"
      }`}
    >
      <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className="mt-1 text-lg font-semibold text-slate-50">
        {value}
        <span className="ml-1 text-xs font-normal text-slate-400">
          {unit}
        </span>
      </span>
    </div>
  );
}

interface MacroBarProps {
  label: string;
  percentage: number;
}

function MacroBar({ label, percentage }: MacroBarProps) {
  const safePct = Math.max(0, Math.min(percentage, 100));
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
        <span>{label}</span>
        <span className="text-slate-400">{safePct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-sky-500"
          style={{ width: `${safePct}%` }}
        />
      </div>
    </div>
  );
}
