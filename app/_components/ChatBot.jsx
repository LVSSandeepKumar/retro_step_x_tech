"use client";
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import { enrichedParent } from "@/lib/relations";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", type: "bot" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const chatRef = useRef(null);
  const messageContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add scroll to bottom effect
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const formatValue = (value) => {
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  const getTimeBasedAnswer = (data, timeframe, type, brandName = '') => {
    const prefix = brandName ? `${brandName}'s` : 'Overall';
    
    if (timeframe === 'monthly') {
        const monthlyData = data.monthly.map(m => ({
            month: m.month,
            value: formatValue(m.value)
        }));
        
        return `${prefix} ${type} by Month:\n${monthlyData.map(m => 
            `${m.month}: ${m.value}`
        ).join('\n')}`;
    }
    
    if (timeframe === 'quarterly') {
        const quarterlyData = data.quarterly.map(q => ({
            quarter: q.quarter,
            value: formatValue(q.value)
        }));
        
        return `${prefix} ${type} by Quarter:\n${quarterlyData.map(q => 
            `${q.quarter}: ${q.value}`
        ).join('\n')}`;
    }
  };

  const getBrandSpecificAnswer = (brand, question) => {
    const lowercaseQuestion = question.toLowerCase();
    
    // Handle time-based queries
    if (lowercaseQuestion.includes('monthly') || lowercaseQuestion.includes('quarterly')) {
        const timeframe = lowercaseQuestion.includes('monthly') ? 'monthly' : 'quarterly';
        
        if (lowercaseQuestion.includes('sales')) {
            const salesData = brand.sales.find(s => s.type === "Own");
            return getTimeBasedAnswer(salesData, timeframe, 'Sales', brand.brandName);
        }
        
        if (lowercaseQuestion.includes('services')) {
            const servicesData = brand.services.find(s => s.type === "Own");
            return getTimeBasedAnswer(servicesData, timeframe, 'Services', brand.brandName);
        }
        
        if (lowercaseQuestion.includes('expenses')) {
            const expensesData = brand.expenses.find(e => e.type === "Own");
            return getTimeBasedAnswer(expensesData, timeframe, 'Expenses', brand.brandName);
        }
    }

    // Get brand data from enriched source
    const brandData = brand;

    if (lowercaseQuestion.includes("sales")) {
      const ownSales = brandData.sales.find((s) => s.type === "Own");
      const subSales = brandData.sales.find((s) => s.type === "Sub");

      if (lowercaseQuestion.includes("own")) {
        return `${brand.brandName} Own Sales: ${formatValue(
          ownSales.salesValue
        )} with ${ownSales.salesCount} units`;
      } else if (lowercaseQuestion.includes("sub")) {
        return `${brand.brandName} Sub Sales: ${formatValue(
          subSales.salesValue
        )} with ${subSales.salesCount} units`;
      }

      return `${brand.brandName} Sales:\nOwn: ${formatValue(
        ownSales.salesValue
      )} (${ownSales.salesCount} units)\nSub: ${formatValue(
        subSales.salesValue
      )} (${subSales.salesCount} units)`;
    }

    if (lowercaseQuestion.includes("inventory")) {
      const ownInventory = brandData.inventory.find((i) => i.type === "Own");
      const subInventory = brandData.inventory.find((i) => i.type === "Sub");

      if (lowercaseQuestion.includes("own")) {
        return `${brand.brandName} Own Inventory: ${formatValue(
          ownInventory.stockValue
        )} with ${ownInventory.stockCount} units`;
      } else if (lowercaseQuestion.includes("sub")) {
        return `${brand.brandName} Sub Inventory: ${formatValue(
          subInventory.stockValue
        )} with ${subInventory.stockCount} units`;
      }

      return `${brand.brandName} Inventory:\nOwn: ${formatValue(
        ownInventory.stockValue
      )} (${ownInventory.stockCount} units)\nSub: ${formatValue(
        subInventory.stockValue
      )} (${subInventory.stockCount} units)`;
    }

    if (lowercaseQuestion.includes("expenses")) {
      const expenses = brandData.expenses.find((e) => e.type === "Own");
      return `${brand.brandName} Expenses: ${formatValue(
        expenses.expensesValue
      )}`;
    }

    if (lowercaseQuestion.includes("services")) {
      const services = brandData.services.find((s) => s.type === "Own");
      return `${brand.brandName} Services: ${formatValue(
        services.servicesValue
      )} with ${services.servicesCount} services`;
    }

    if (
      lowercaseQuestion.includes("payment") ||
      lowercaseQuestion.includes("collections")
    ) {
      const paymentData = brandData.payments[0].paymentType;
      return `${brand.brandName} Collections:\nUPI: ${formatValue(
        paymentData.find((p) => p.mode === "UPI").collections
      )}\nCash: ${formatValue(
        paymentData.find((p) => p.mode === "Cash").collections
      )}`;
    }

    return `I can provide information about ${brand.brandName}'s sales, inventory, expenses, services, and payments.`;
  };

  const getAnswerFromData = (question) => {
    const lowercaseQuestion = question.toLowerCase();
    const overallData = enrichedParent[0];

    // Add help message for time-based queries
    if (lowercaseQuestion.includes('help')) {
      return `You can ask me about:
1. Overall metrics (sales, expenses, inventory, services)
2. Brand specific details (Bajaj, Triumph, Vespa, Tata)
3. Monthly or Quarterly data (e.g., "Show monthly sales for Bajaj")
4. Own/Sub type metrics
Try questions like:
- "What are the monthly sales for Bajaj?"
- "Show quarterly expenses for Triumph"
- "What is the overall monthly revenue?"`;
    }

    // Check if question is about a specific brand
    const brandNames = overallData.brands.map((b) => b.brandName.toLowerCase());
    const mentionedBrand = brandNames.find((name) =>
      lowercaseQuestion.includes(name)
    );

    if (mentionedBrand) {
      const brand = overallData.brands.find(
        (b) => b.brandName.toLowerCase() === mentionedBrand
      );
      return getBrandSpecificAnswer(brand, question);
    }

    // Handle overall metrics
    if (
      lowercaseQuestion.includes("total") ||
      lowercaseQuestion.includes("overall")
    ) {
      // Handle overall metrics without brand name
      if (
        !lowercaseQuestion.includes("bajaj") &&
        !lowercaseQuestion.includes("triumph") &&
        !lowercaseQuestion.includes("vespa") &&
        !lowercaseQuestion.includes("tata")
      ) {
        // Total sales query
        if (lowercaseQuestion.includes("total sales")) {
          const salesData = overallData.sales;
          const ownSales = salesData.find((s) => s.type === "Own");
          const subSales = salesData.find((s) => s.type === "Sub");

          if (lowercaseQuestion.includes("own")) {
            return `Overall Own Sales: ${formatValue(
              ownSales.salesValue
            )} with ${ownSales.salesCount} units`;
          } else if (lowercaseQuestion.includes("sub")) {
            return `Overall Sub Sales: ${formatValue(
              subSales.salesValue
            )} with ${subSales.salesCount} units`;
          }

          return `Overall Sales:\nOwn: ${formatValue(ownSales.salesValue)} (${
            ownSales.salesCount
          } units)\nSub: ${formatValue(subSales.salesValue)} (${
            subSales.salesCount
          } units)`;
        }

        // Total expenses query
        if (lowercaseQuestion.includes("expenses")) {
          const expensesData = overallData.expenses;
          const ownExpenses = expensesData.find((e) => e.type === "Own");
          return `Overall Expenses: ${formatValue(ownExpenses.expensesValue)}`;
        }

        // Total inventory query
        if (lowercaseQuestion.includes("inventory")) {
          const inventoryData = overallData.inventory;
          const ownInventory = inventoryData.find((i) => i.type === "Own");
          const subInventory = inventoryData.find((i) => i.type === "Sub");

          if (lowercaseQuestion.includes("own")) {
            return `Overall Own Inventory: ${formatValue(
              ownInventory.stockValue
            )} with ${ownInventory.stockCount} units`;
          } else if (lowercaseQuestion.includes("sub")) {
            return `Overall Sub Inventory: ${formatValue(
              subInventory.stockValue
            )} with ${subInventory.stockCount} units`;
          }

          return `Overall Inventory:\nOwn: ${formatValue(
            ownInventory.stockValue
          )} (${ownInventory.stockCount} units)\nSub: ${formatValue(
            subInventory.stockValue
          )} (${subInventory.stockCount} units)`;
        }

        // Services query
        if (lowercaseQuestion.includes("services")) {
          const servicesData = overallData.services;
          const ownServices = servicesData.find((s) => s.type === "Own");
          return `Overall Services: ${formatValue(
            ownServices.servicesValue
          )} with ${ownServices.servicesCount} service count`;
        }

        // Payments query
        if (
          lowercaseQuestion.includes("payment") ||
          lowercaseQuestion.includes("collections")
        ) {
          const paymentData = overallData.payments[0].paymentType;
          const upiPayments = paymentData.find((p) => p.mode === "UPI");
          const cashPayments = paymentData.find((p) => p.mode === "Cash");
          return `Overall Collections:\nUPI: ${formatValue(
            upiPayments.collections
          )}\nCash: ${formatValue(cashPayments.collections)}`;
        }

        return "I can help you with overall information about sales, expenses, inventory, services, and payments. You can also ask about specific brands or specify 'Own' or 'Sub' type.";
      }
    }

    return "You can ask me about overall metrics or specific brands (Bajaj, Triumph, Vespa, Tata). Try asking about their sales, expenses, inventory, services, or payments.";
  };

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    setMessages((prev) => [...prev, { text: inputMessage, type: "user" }]);
    setInputMessage("");

    // Get answer based on question
    const answer = getAnswerFromData(inputMessage);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: answer,
          type: "bot",
        },
      ]);
    }, 500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={chatRef}>
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-80 md:w-96 h-[500px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          <div className="bg-primary p-4 text-white flex justify-between items-center">
            <h3 className="font-semibold">Chat Support</h3>
            <button onClick={() => setIsOpen(false)}>
              <Minimize2 className="h-5 w-5" />
            </button>
          </div>

          <div
            ref={messageContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    msg.type === "user"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSend}
                className="bg-primary text-white rounded-lg p-2 hover:bg-primary/90"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white rounded-full p-3 shadow-lg hover:bg-primary/90 transition-all"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default ChatBot;
