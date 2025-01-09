import React, { useState, useEffect } from "react";
import { totals, enrichedParent } from "../../lib/relations";
import VaryingLine from "./VaryingLine";

const SelectionGrid = ({ onCardSelect }) => {
  // Add prop for selection handling
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardData, setCardData] = useState([]);

  useEffect(() => {
    setCardData([
      {
        id: "sales",
        title: "Total Sales",
        value: (
          totals.sales.own.salesValue + totals.sales.sub.salesValue
        ).toLocaleString("en-US", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }),
        change: (Math.random() * 10 * (Math.random() > 0.5 ? 1 : -1)).toFixed(
          1
        ),
      },
      {
        id: "services",
        title: "Total Services",
        value: totals.services.own.servicesValue.toLocaleString("en-US", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }),
        change: (Math.random() * 10 * (Math.random() > 0.5 ? 1 : -1)).toFixed(
          1
        ),
      },
    ]);
  }, []);

  const handleCardClick = (cardId) => {
    setSelectedCard(cardId);
    onCardSelect(cardId); // Notify parent of selection
  };

  // Format chart data to use quarterly value directly
  const getChartData = (cardId) => {
    if (cardId === "sales") {
      // Return the quarterly data which contains the value field
      return enrichedParent[0]?.sales?.[0]?.quarterly || [];
    } else if (cardId === "services") {
      return enrichedParent[0]?.services?.[0]?.quarterly || [];
    }
    return [];
  };

  return (
    <div className="flex flex-col gap-8">
      {cardData.map((card) => (
        <div
          key={card.id}
          onClick={() => handleCardClick(card.id)}
          className={`cursor-pointer p-6 rounded-lg shadow-md transition-colors duration-200 ${
            selectedCard === card.id
              ? "border-2 border-blue-500"
              : "border border-transparent hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-2">{card.title}</h3>
              <p className="text-3xl font-bold mb-2">{card.value}</p>
              <p
                className={`text-sm flex items-center ${
                  parseFloat(card.change) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {parseFloat(card.change) >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(parseFloat(card.change))}% since last year
              </p>
            </div>

            <div className="w-48">
              <VaryingLine 
                color={selectedCard === card.id ? '#4f46e5' : '#94a3b8'}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SelectionGrid;
