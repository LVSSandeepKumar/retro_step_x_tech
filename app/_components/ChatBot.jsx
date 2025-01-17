"use client";
import { MessageCircle, Minimize2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Add PERIODS constant at the top
const PERIODS = {
  YESTERDAY: "Yesterday",
  WEEKLY: "Weekly",
  MONTHLY: "This Month",
  YTD: "Year to Date",
};

const ChatBot = ({ revenueData, financeData, selectedOverview }) => {
  // Update state declarations
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", type: "bot" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [localData, setLocalData] = useState({
    revenue: null,
    finance: null,
    isInitialized: false,
  });

  const chatRef = useRef(null);
  const messageContainerRef = useRef(null);

  // Update useEffect for data synchronization
  useEffect(() => {
    if (revenueData && financeData) {
      const newData = {
        revenue: { ...revenueData },
        finance: { ...financeData },
        isInitialized: true,
      };

      setLocalData(newData);

      // Only add the welcome message once when data is first initialized
      if (!localData.isInitialized) {
        setMessages((prev) => [
          ...prev,
          {
            text: `I'm ready to help you with information for ${
              PERIODS[revenueData.period]
            }!`,
            type: "bot",
          },
        ]);
      }
    }
  }, [revenueData, financeData]);

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

  const formatValue = (value, period) => {
    const formatIndianNumber = (num) => {
      const numStr = Math.round(num).toString();
      if (numStr.length > 3) {
        const lastThree = numStr.substring(numStr.length - 3);
        const otherNumbers = numStr.substring(0, numStr.length - 3);
        return (
          otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree
        );
      }
      return numStr;
    };

    let scaledValue = value;
    switch (period) {
      case "YESTERDAY":
        scaledValue = value / 10;
        break;
      case "WEEKLY":
        scaledValue = value;
        break;
      case "MONTHLY":
        scaledValue = value * 10;
        break;
      case "YTD":
        scaledValue = value * 100;
        break;
    }
    return `₹${formatIndianNumber(scaledValue)}`;
  };

  // Add data validation helper
  const validateData = () => {
    if (!localData.isInitialized) {
      return "I'm still initializing. Please wait a moment...";
    }
    if (!localData.revenue || !localData.finance) {
      return "Some data is missing. Please try again in a moment.";
    }
    return null;
  };

  // Update getAnswerFromData to use validation
  const getAnswerFromData = (question) => {
    const validationError = validateData();
    if (validationError) return validationError;

    const lowercaseQuestion = question.toLowerCase();

    if (lowercaseQuestion.includes("help")) {
      return `You can ask me about:
1. Revenue metrics (sales, services, others)
2. Financial metrics (cash, UPI, expenses)
3. Current period: ${localData.revenue?.period || "Not set"}
Try questions like:
- "What are the current sales?"
- "Show me services revenue"
- "How much is the cash collection?"
- "What are the total expenses?"`;
    }

    // Handle revenue questions with null checks
    if (lowercaseQuestion.includes("sales")) {
      return `Sales for ${
        PERIODS[localData.revenue.period] || "current period"
      }: ${formatValue(
        localData.revenue.sales || 0,
        localData.revenue.period
      )}`;
    }

    if (lowercaseQuestion.includes("service")) {
      return `Services revenue for ${
        PERIODS[localData.revenue.period] || "current period"
      }: ${formatValue(
        localData.revenue.services || 0,
        localData.revenue.period
      )}`;
    }

    if (lowercaseQuestion.includes("other")) {
      return `Other revenue for ${
        PERIODS[localData.revenue.period] || "current period"
      }: ${formatValue(
        localData.revenue.others || 0,
        localData.revenue.period
      )}`;
    }

    // Handle finance questions with null checks
    if (lowercaseQuestion.includes("cash")) {
      return `Cash collections for ${
        PERIODS[localData.finance.period] || "current period"
      }: ${formatValue(localData.finance.cash || 0, localData.finance.period)}`;
    }

    if (lowercaseQuestion.includes("upi")) {
      return `UPI collections for ${
        PERIODS[localData.finance.period] || "current period"
      }: ${formatValue(localData.finance.upi || 0, localData.finance.period)}`;
    }

    if (lowercaseQuestion.includes("expense")) {
      return `Total expenses for ${
        PERIODS[localData.finance.period] || "current period"
      }: ${formatValue(
        localData.finance.expenses || 0,
        localData.finance.period
      )}`;
    }

    if (lowercaseQuestion.includes("collection")) {
      const total =
        (localData.finance.cash || 0) + (localData.finance.upi || 0);
      return `Total collections for ${
        PERIODS[localData.finance.period] || "current period"
      }:
Cash: ${formatValue(localData.finance.cash || 0, localData.finance.period)}
UPI: ${formatValue(localData.finance.upi || 0, localData.finance.period)}
Total: ${formatValue(total, localData.finance.period)}`;
    }

    if (
      lowercaseQuestion.includes("period") ||
      lowercaseQuestion.includes("timeframe")
    ) {
      return `Current period settings:
Revenue data: ${PERIODS[localData.revenue.period] || "Not set"}
Finance data: ${PERIODS[localData.finance.period] || "Not set"}`;
    }

    return "You can ask about sales, services, other revenue, cash collections, UPI payments, or expenses. Try asking 'help' for more information.";
  };

  // Update handleSend to include error handling
  const handleSend = () => {
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, type: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    const validationError = validateData();
    if (validationError) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: validationError, type: "bot" },
        ]);
      }, 500);
      return;
    }

    const answer = getAnswerFromData(inputMessage);
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: answer, type: "bot" }]);
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
                onClick={(e) => e.key === "Enter" && handleSend()}
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
