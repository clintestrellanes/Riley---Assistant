import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Maximize2, Minimize2 } from "lucide-react";
import { RileyBrain } from "../aichat/brain";


export default function Chat() {
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean, timestamp: Date}>>([]);
  const modalTextareaRef = useRef<HTMLTextAreaElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  const AIResponse = async (query: string) => {
    const response = await RileyBrain({ query });
    console.log(response)
  }

  
  const handleSendMessage = async() => {
    if (chatMessage.trim()) {
      // Add user message
      console.log("user query is ", chatMessage)
      setMessages(prev => [...prev, {
        text: chatMessage,
        isUser: true,
        timestamp: new Date()
      }]);

      const aiResponse = await AIResponse(chatMessage);
      
      // TODO: Add your AI response logic here
      // Simulate AI response (remove this in production)
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: "This is a placeholder response. Integrate your AI API here.",
          isUser: false,
          timestamp: new Date()
        }]);
      }, 500);
      
      setChatMessage("");
      
      // Auto resize textarea after clearing
      if (modalTextareaRef.current) {
        modalTextareaRef.current.style.height = 'auto';
      }
      if (chatInputRef.current) {
        chatInputRef.current.style.height = 'auto';
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
      
      // Close expanded view if it's the bottom bar and modal isn't open
      if (!isModalOpen) {
        setIsChatExpanded(false);
        (e.target as HTMLTextAreaElement).blur();
      }
    }
  };
  
  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const autoResizeTextarea = (textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };
  
  useEffect(() => {
    if (isModalOpen && modalTextareaRef.current) {
      modalTextareaRef.current.focus();
    }
  }, [isModalOpen]);
  
  return (
    <>
      {/* --- Chatbot Section --- */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 sm:px-10 z-40">
        {/* This is where the person chats to a chatbot */}
        <div className="relative">
          {/* Expand to Modal Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute -top-12 right-4 p-2 rounded-xl bg-white/40 backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/60 transition-all duration-200 group z-10"
            title="Open in full view"
          >
            <Maximize2 className="w-4 h-4 text-gray-600 group-hover:text-cyan-600 transition-colors" />
          </button>
          
          <div
            className={`
              transition-all duration-300 ease-in-out
              bg-white/85 backdrop-blur-xl border border-white/60 rounded-3xl overflow-hidden
              ${isChatExpanded ? 'h-40 shadow-2xl scale-[1.02] -translate-y-2' : 'h-14 shadow-lg'}
            `}
          >
            <div className="relative w-full h-full flex items-center">
              <textarea
                ref={chatInputRef}
                className="w-full h-full p-4 px-6 pr-14 bg-transparent resize-none focus:outline-none placeholder:text-gray-500 text-gray-800"
                placeholder="Ask me anything..."
                value={chatMessage}
                onChange={(e) => {
                  setChatMessage(e.target.value);
                  autoResizeTextarea(e.target);
                }}
                onFocus={() => setIsChatExpanded(true)}
                onBlur={() => setIsChatExpanded(false)}
                onKeyDown={handleKeyDown}
                style={{ overflow: 'hidden' }}
              />
              
              {/* Send Button for compact view */}
              <button
                onClick={handleSendMessage}
                className="absolute right-3 p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-md group disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!chatMessage.trim()}
              >
                <Send className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* --- Modal for Full Chat View --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-4xl h-[600px] bg-white/95 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Chat Assistant</h2>
                  <p className="text-xs text-gray-500">Ask me anything about your projects</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/50 transition-all duration-200 group"
                >
                  <Minimize2 className="w-5 h-5 text-gray-600 group-hover:text-cyan-600" />
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/50 transition-all duration-200 group"
                >
                  <X className="w-5 h-5 text-gray-600 group-hover:text-red-500" />
                </button>
              </div>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-400/20 flex items-center justify-center mb-4">
                    <MessageCircle className="w-8 h-8 text-cyan-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Welcome to Chat!</h3>
                  <p className="text-sm text-gray-500 max-w-md">
                    Start a conversation by typing a message below. I'm here to help with your projects and answer any questions.
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-200`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-2xl ${
                        message.isUser
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                          : 'bg-white/80 backdrop-blur-sm border border-white/50 text-gray-800'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.isUser ? 'text-cyan-100' : 'text-gray-400'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Input Area */}
            <div className="p-4 border-t border-white/30 bg-white/50 rounded-b-2xl">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <textarea
                    ref={modalTextareaRef}
                    value={chatMessage}
                    onChange={(e) => {
                      setChatMessage(e.target.value);
                      autoResizeTextarea(e.target);
                    }}
                    onKeyDown={handleModalKeyDown}
                    placeholder="Type your message... (Shift + Enter for new line)"
                    className="w-full p-3 pr-12 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-transparent resize-none text-gray-800 placeholder:text-gray-400"
                    rows={1}
                    style={{ overflow: 'hidden' }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim()}
                  className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-md group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Press Enter to send, Shift + Enter for new line
              </p>
            </div>
          </div>
        </div>
      )}
      
     
    </>
  );
}