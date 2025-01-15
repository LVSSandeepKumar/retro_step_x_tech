"use client";
import { MessageCircle, Minimize2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ChatBot = ({ revenueData, financeData, selectedOverview }) => {
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

  const getAnswerFromData = (question) => {
    const lowercaseQuestion = question.toLowerCase();

    if (lowercaseQuestion.includes("help")) {
      return `You can ask me about:
1. Revenue metrics (sales, services, others)
2. Financial metrics (cash, UPI, expenses)
3. Current period: ${revenueData.period}
Try questions like:
- "What are the current sales?"
- "Show me services revenue"
- "How much is the cash collection?"
- "What are the total expenses?"`;
    }

    // Handle revenue questions
    if (lowercaseQuestion.includes("sales")) {
      return `Sales for ${PERIODS[revenueData.period]}: ${formatValue(
        revenueData.sales,
        revenueData.period
      )}`;
    }

    if (lowercaseQuestion.includes("service")) {
      return `Services revenue for ${
        PERIODS[revenueData.period]
      }: ${formatValue(revenueData.services, revenueData.period)}`;
    }

    if (lowercaseQuestion.includes("other")) {
      return `Other revenue for ${PERIODS[revenueData.period]}: ${formatValue(
        revenueData.others,
        revenueData.period
      )}`;
    }

    // Handle finance questions
    if (lowercaseQuestion.includes("cash")) {
      return `Cash collections for ${
        PERIODS[financeData.period]
      }: ${formatValue(financeData.cash, financeData.period)}`;
    }

    if (lowercaseQuestion.includes("upi")) {
      return `UPI collections for ${PERIODS[financeData.period]}: ${formatValue(
        financeData.upi,
        financeData.period
      )}`;
    }

    if (lowercaseQuestion.includes("expense")) {
      return `Total expenses for ${PERIODS[financeData.period]}: ${formatValue(
        financeData.expenses,
        financeData.period
      )}`;
    }

    if (lowercaseQuestion.includes("collection")) {
      const total = financeData.cash + financeData.upi;
      return `Total collections for ${PERIODS[financeData.period]}:
Cash: ${formatValue(financeData.cash, financeData.period)}
UPI: ${formatValue(financeData.upi, financeData.period)}
Total: ${formatValue(total, financeData.period)}`;
    }

    if (
      lowercaseQuestion.includes("period") ||
      lowercaseQuestion.includes("timeframe")
    ) {
      return `Current period settings:
Revenue data: ${PERIODS[revenueData.period]}
Finance data: ${PERIODS[financeData.period]}`;
    }

    return "You can ask about sales, services, other revenue, cash collections, UPI payments, or expenses. Try asking 'help' for more information.";
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
