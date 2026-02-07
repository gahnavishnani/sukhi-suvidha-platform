import React, { useState, useEffect } from "react";
import { translate } from "../utils/translations";
import { useLanguage } from "../context/LanguageContext";

const ChatbotWidget = () => {
  const { language } = useLanguage(); 
  const t = translate(language);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState("main");

  
  const [activeSymptom, setActiveSymptom] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);

 
  const mainOptions = [
    { id: "symptoms", text: t.symptoms || "Symptoms" },
    { id: "medicine", text: t.medicine || "Medicine" },
    { id: "routine", text: t.routine || "Daily Health Tips" }
  ];

 
  const symptomOptions = [
    { id: "fever", text: t.fever || "Fever" },
    { id: "headache", text: t.headache || "Headache" },
    { id: "stomach", text: t.stomachPain || "Stomach Pain" }
  ];

  const medicineOptions = [
    { id: "refill", text: t.prescriptionRefill },
    { id: "side", text: t.sideEffects }
  ];

  const routineOptions = [
    { id: "diet", text: t.diet },
    { id: "exercise", text: t.exercise },
    { id: "sleep", text: t.sleep }
  ];

  /* =======================
     MEDICAL FLOWS
  ======================= */
  const symptomFlows = {
    fever: {
      questions: [t.feverQ1, t.feverQ2],
      advice: (a) => {
        const days = parseInt(a[0]);
        if (days > 3 || a[1]?.toLowerCase() === "high") {
          return t.feverAdviceSevere;
        }
        return t.feverAdviceMild;
      }
    },
    headache: {
      questions: [t.headacheQ1, t.headacheQ2],
      advice: (a) =>
        a[1]?.toLowerCase() === "yes"
          ? t.headacheAdviceSevere
          : t.headacheAdviceNormal
    },
    stomach: {
      questions: [t.stomachQ1, t.stomachQ2],
      advice: (a) =>
        a[1]?.toLowerCase() === "yes"
          ? t.stomachAdviceSevere
          : t.stomachAdviceNormal
    }
  };


  const botMessage = (text) =>
    setMessages((p) => [...p, { sender: "bot", text }]);

  const userMessage = (text) =>
    setMessages((p) => [...p, { sender: "user", text }]);

  const showOptions = (options) =>
    setMessages((p) => [...p, { sender: "bot", options }]);

  const handleOptionClick = (id, text) => {
    userMessage(text);

    if (currentStep === "main") {
      if (id === "symptoms") {
        setCurrentStep("symptoms");
        botMessage(t.selectSymptomPrompt);
        showOptions(symptomOptions);
      }
      if (id === "medicine") {
        setCurrentStep("medicine");
        botMessage(t.medicineHelpPrompt);
        showOptions(medicineOptions);
      }
      if (id === "routine") {
        setCurrentStep("routine");
        botMessage(t.routineHelpPrompt);
        showOptions(routineOptions);
      }
      return;
    }

    if (symptomFlows[id]) {
      setActiveSymptom(id);
      setAnswers([]);
      setQuestionIndex(0);
      botMessage(symptomFlows[id].questions[0]);
      return;
    }

    const staticReplies = {
      refill: t.prescriptionRefill,
      side: t.sideEffects,
      diet: t.diet,
      exercise: t.exercise,
      sleep: t.sleep
    };

    botMessage(staticReplies[id] || t.thankYouResponse);
    resetToMain();
  };

 
  const handleUserText = (text) => {
    userMessage(text);
    if (!activeSymptom) return;

    const newAnswers = [...answers, text.toLowerCase()];
    setAnswers(newAnswers);

    const flow = symptomFlows[activeSymptom];
    if (questionIndex + 1 < flow.questions.length) {
      setQuestionIndex((p) => p + 1);
      botMessage(flow.questions[questionIndex + 1]);
    } else {
      botMessage(flow.advice(newAnswers));
      setActiveSymptom(null);
      setQuestionIndex(0);
      resetToMain();
    }
  };

  const resetToMain = () => {
    setTimeout(() => {
      setCurrentStep("main");
      botMessage(t.howElseHelp);
      showOptions(mainOptions);
    }, 800);
  };

  const startChat = () => {
    setIsOpen(true);
    setMessages([
      { sender: "bot", text: t.chatbotHello },
      { sender: "bot", options: mainOptions }
    ]);
  };

 
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-xl shadow-xl w-80 h-96 flex flex-col">
          <div className="bg-green-600 text-white p-4 rounded-t-xl flex justify-between">
            <h3 className="font-semibold">{t.chatbotTitle}</h3>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className={`mb-3 ${msg.sender === "user" ? "text-right" : ""}`}>
                {msg.text && (
                  <div className={`inline-block px-3 py-2 rounded-lg 
                    ${msg.sender === "user" ? "bg-green-600 text-white" : "bg-gray-200"}`}>
                    {msg.text}
                  </div>
                )}

                {msg.options && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {msg.options.map((op) => (
                      <button
                        key={op.id}
                        onClick={() => handleOptionClick(op.id, op.text)}
                        className="bg-green-100 text-green-700 p-2 rounded text-xs hover:bg-green-200"
                      >
                        {op.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {activeSymptom && (
            <div className="p-2 border-t">
              <input
                type="text"
                placeholder={t.typeYourAnswer}
                className="w-full border rounded p-2 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    handleUserText(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={startChat}
          className="bg-green-600 text-white p-4 rounded-full shadow-xl"
        >
          💬
        </button>
      )}
    </div>
  );
};

export default ChatbotWidget;
