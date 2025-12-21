import React from "react";
import { translate } from "../utils/translations.js";

const HealthyDietPage = () => {
  const [t, setT] = React.useState(translate("en"));

  React.useEffect(() => {
    const lang = localStorage.getItem("preferredLanguage") || "en";
    setT(translate(lang));
  }, []);

  // DO NOT PUT TRANSLATIONS INSIDE THIS OBJECT (keeps it safe)
  const dietPlans = {
    children: {
      title: "Children (5-12 years)",
      description: "Nutrition for growing kids",
      image:
        "https://static.vecteezy.com/system/resources/thumbnails/035/778/532/small/ai-generated-three-children-happily-smiling-in-a-field-of-daisies-enjoying-the-beauty-of-nature-and-the-warmth-of-the-sun-generative-ai-photo.jpeg",
      meals: {
        breakfast: "Whole grain cereal with milk and fruits",
        lunch: "Roti with vegetables and dal",
        snack: "Fruit or yogurt",
        dinner: "Rice with fish or chicken and vegetables",
      },
      tips: [
        "Include dairy for calcium needs",
        "Limit sugary snacks and drinks",
        "Encourage variety of fruits and vegetables",
      ],
    },

    teenagers: {
      title: "Teenagers (13-19 years)",
      description: "Nutrition for active teens",
      image:
        "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=300&fit=crop",
      meals: {
        breakfast: "Eggs or poha with milk",
        lunch: "Rice with curry and salad",
        snack: "Nuts and fruits",
        dinner: "Chapati with vegetables and dal",
      },
      tips: [
        "Ensure adequate protein for growth",
        "Include iron-rich foods",
        "Stay hydrated with water",
      ],
    },

    adults: {
      title: "Adults (20-50 years)",
      description: "Balanced nutrition for busy adults",
      image:
        "https://www.shutterstock.com/image-photo/diverse-team-project-managers-enjoying-260nw-2532428491.jpg",
      meals: {
        breakfast: "Oatmeal with fruits and nuts",
        lunch: "Quinoa or brown rice with grilled chicken and vegetables",
        snack: "Green tea with whole grain biscuits",
        dinner: "Salad with lean protein",
      },
      tips: [
        "Focus on whole foods",
        "Limit processed foods",
        "Maintain regular meal times",
      ],
    },

    elders: {
      title: "Elderly (50+ years)",
      description: "Nutrition for golden years",
      image:
        "https://www.shutterstock.com/image-illustration/active-senior-couple-holding-hands-260nw-2524336771.jpg",
      meals: {
        breakfast: "Sooji upma or boiled eggs",
        lunch: "Khichdi with vegetables",
        snack: "Fruit smoothie",
        dinner: "Soft cooked vegetables and dal",
      },
      tips: [
        "Include calcium and vitamin D",
        "Focus on fiber-rich foods",
        "Ensure adequate hydration",
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-50 to-orange-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-800 mb-2">
            {t.healthyDiet || "Healthy Diet Plans"}
          </h1>
          <p className="text-orange-600">
            {t.dietDesc || "Nutrition plans for different life stages"}
          </p>
        </div>

        {/* Diet Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(dietPlans).map(([key, plan]) => (
            <div
              key={key}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <img
                src={plan.image}
                alt={plan.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {plan.title}
                </h2>
                <p className="text-orange-600 mb-4">{plan.description}</p>

                {/* Meals */}
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">
                    {t.dailyMealPlan || "Daily Meal Plan"}:
                  </h3>

                  <ul className="space-y-2 text-sm">
                    <li>
                      <strong>{t.breakfast || "Breakfast"}:</strong>{" "}
                      {plan.meals.breakfast}
                    </li>
                    <li>
                      <strong>{t.lunch || "Lunch"}:</strong>{" "}
                      {plan.meals.lunch}
                    </li>
                    <li>
                      <strong>{t.snack || "Snack"}:</strong>{" "}
                      {plan.meals.snack}
                    </li>
                    <li>
                      <strong>{t.dinner || "Dinner"}:</strong>{" "}
                      {plan.meals.dinner}
                    </li>
                  </ul>
                </div>

                {/* Tips */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">
                    {t.healthTips || "Health Tips"}:
                  </h3>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {plan.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-orange-700 font-medium hover:text-orange-900 transition"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t.backToFacilities || "Back to Facilities"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthyDietPage;
