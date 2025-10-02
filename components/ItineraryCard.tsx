/**
 * ItineraryCard Component
 *
 * Displays a beautiful, structured travel itinerary with day-by-day breakdown.
 * Shows activities for morning, afternoon, evening, and meal recommendations.
 */

import React from "react";

// Type definitions matching the backend structure
interface TimeSlot {
  activities: string[];
  location: string;
}

interface Meals {
  breakfast: string;
  lunch: string;
  dinner: string;
}

interface DayItinerary {
  day: number;
  title: string;
  morning: TimeSlot;
  afternoon: TimeSlot;
  evening: TimeSlot;
  meals: Meals;
}

export interface ItineraryData {
  destination: string;
  days: number;
  itinerary: DayItinerary[];
}

// Restaurant data structure for day-by-day meals
export interface RestaurantData {
  destination: string;
  days: number;
  meals: Array<{
    day: number;
    breakfast: string;
    lunch: string;
    dinner: string;
  }>;
}

interface ItineraryCardProps {
  data: ItineraryData;
  restaurantData?: RestaurantData | null; // Optional restaurant data to populate meals
}

export const ItineraryCard: React.FC<ItineraryCardProps> = ({ data, restaurantData }) => {
  // Get meals for a specific day from restaurant data
  const getMealsForDay = (dayNumber: number): Meals | null => {
    if (!restaurantData) return null;

    const dayMeals = restaurantData.meals.find((m) => m.day === dayNumber);
    if (!dayMeals) return null;

    return {
      breakfast: dayMeals.breakfast,
      lunch: dayMeals.lunch,
      dinner: dayMeals.dinner,
    };
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 my-3 border border-purple-200 shadow-lg animate-fade-in-up">
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🗺️</span>
          <h2 className="text-xl font-bold text-purple-900">{data.destination} Itinerary</h2>
        </div>
        <p className="text-purple-700 text-xs">
          {data.days} day{data.days > 1 ? "s" : ""} of adventure
        </p>
      </div>

      {/* Days */}
      <div className="space-y-3">
        {data.itinerary.map((day, index) => {
          // Try to get restaurant meals for this day
          const restaurantMeals = getMealsForDay(day.day);
          // Use restaurant meals if available, otherwise use original itinerary meals
          const mealsToDisplay = restaurantMeals || day.meals;

          return (
            <div key={index} className="bg-white rounded-lg p-3 shadow-md border border-purple-100">
              {/* Day Header */}
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-purple-100">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white font-bold text-sm">
                  {day.day}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{day.title}</h3>
              </div>

              {/* Time Slots and Meals Side-by-Side */}
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-2">
                {/* Time Slots - Takes 1 column */}
                <div className="lg:col-span-3 space-y-2">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-sm">📅</span>
                    <h4 className="text-sm font-semibold text-gray-800">Day Itinerary</h4>
                  </div>
                  {/* Morning */}
                  <TimeSlotSection
                    icon="🌅"
                    title="Morning"
                    location={day.morning.location}
                    activities={day.morning.activities}
                    color="orange"
                  />

                  {/* Afternoon */}
                  <TimeSlotSection
                    icon="☀️"
                    title="Afternoon"
                    location={day.afternoon.location}
                    activities={day.afternoon.activities}
                    color="yellow"
                  />

                  {/* Evening */}
                  <TimeSlotSection
                    icon="🌆"
                    title="Evening"
                    location={day.evening.location}
                    activities={day.evening.activities}
                    color="blue"
                  />
                </div>

                {/* Meals - Takes 2 columns */}
                <div className="lg:col-span-4 flex flex-col">
                  <div className="lg:border-l lg:border-gray-100 lg:pl-2 flex flex-col h-full">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-sm">🍽️</span>
                      <h4 className="text-sm font-semibold text-gray-800">Meals</h4>
                      {!restaurantMeals && (
                        <span className="ml-auto text-[9px] text-blue-600 font-medium animate-pulse">
                          Loading...
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col justify-between flex-1 space-y-1">
                      {restaurantMeals ? (
                        <>
                          <MealItem icon="🥐" label="Breakfast" meal={mealsToDisplay.breakfast} />
                          <MealItem icon="🍜" label="Lunch" meal={mealsToDisplay.lunch} />
                          <MealItem icon="🍷" label="Dinner" meal={mealsToDisplay.dinner} />
                        </>
                      ) : (
                        // Show placeholder while waiting for restaurant data
                        <>
                          <div className="flex-1 flex items-center justify-center bg-gray-50 rounded p-1">
                            <span className="text-[10px] text-gray-400">
                              Awaiting recommendations...
                            </span>
                          </div>
                          <div className="flex-1 flex items-center justify-center bg-gray-50 rounded p-1">
                            <span className="text-[10px] text-gray-400">
                              Awaiting recommendations...
                            </span>
                          </div>
                          <div className="flex-1 flex items-center justify-center bg-gray-50 rounded p-1">
                            <span className="text-[10px] text-gray-400">
                              Awaiting recommendations...
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Helper component for time slots
interface TimeSlotSectionProps {
  icon: string;
  title: string;
  location: string;
  activities: string[];
  color: "orange" | "yellow" | "blue";
}

const TimeSlotSection: React.FC<TimeSlotSectionProps> = ({
  icon,
  title,
  location,
  activities,
  color,
}) => {
  const colorClasses = {
    orange: "bg-orange-50 border-orange-200",
    yellow: "bg-yellow-50 border-yellow-200",
    blue: "bg-blue-50 border-blue-200",
  };

  return (
    <div className={`rounded-lg p-2 border ${colorClasses[color]}`}>
      <div className="flex items-center gap-1 mb-1">
        <span className="text-sm">{icon}</span>
        <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
        <span className="text-xs text-gray-500">• {location}</span>
      </div>
      <ul className="space-y-0.5 ml-5">
        {activities.map((activity, idx) => (
          <li key={idx} className="text-xs text-gray-700 flex items-start">
            <span className="text-gray-400 mr-1">•</span>
            <span>{activity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Helper component for meals
interface MealItemProps {
  icon: string;
  label: string;
  meal: string;
}

const MealItem: React.FC<MealItemProps> = ({ icon, label, meal }) => {
  return (
    <div className="flex items-start gap-1 p-1 bg-gray-50 rounded flex-1">
      <span className="text-xs">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-gray-500">{label}</div>
        <div className="text-xs text-gray-700 break-words">{meal}</div>
      </div>
    </div>
  );
};
