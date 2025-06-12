// context/MessageContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

type MessageType = "success" | "error" | "confirm";

interface MessageState {
  visible: boolean;
  type: MessageType;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface MessageContextProps {
  showMessage: (message: string, type: MessageType, options?: Partial<Omit<MessageState, "message" | "type">>) => void;
  hideMessage: () => void;
}

const MessageContext = createContext<MessageContextProps | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<MessageState>({
    visible: false,
    type: "success",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const showMessage = (message: string, type: MessageType, options: Partial<Omit<MessageState, "message" | "type">> = {}) => {
    setState({ visible: true, type, message, ...options });
  };

  const hideMessage = () => {
    setState({ ...state, visible: false });
  };

  return (
    <MessageContext.Provider value={{ showMessage, hideMessage }}>
      {children}
      {state.visible &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 pointer-events-auto"></div>

            {/* Message Modal */}
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full text-center mx-5 sm:mx-0 relative z-[10000] pointer-events-auto">
              <p className={`text-lg font-semibold mb-4 ${state.type === "success" ? "text-green-600" : state.type === "error" ? "text-red-600" : "text-yellow-600"}`}>{state.message}</p>

              {state.type === "confirm" ? (
                <div className="flex justify-center space-x-4">
                  <button
                    className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={() => {
                      setIsLoading(true);
                      state.onConfirm?.();
                      setIsLoading(false);
                      hideMessage();
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Yes"}
                  </button>
                  <button
                    className="cursor-pointer bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => {
                      state.onCancel?.();
                      hideMessage();
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Cancel"}
                  </button>
                </div>
              ) : (
                <button
                  className={`cursor-pointer mt-4 px-4 py-2 rounded text-white ${state.type === "success" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                  onClick={() => {
                    state.onConfirm?.();
                    hideMessage();
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "OK"}
                </button>
              )}
            </div>
          </div>,
          document.body // This makes the modal a direct child of the body, avoiding any stacking issues
        )}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) throw new Error("useMessage must be used within a MessageProvider");
  return context;
};
