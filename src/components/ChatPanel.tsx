import { Bot, CircleAlert, FileText, Send, User, X } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "../lib/utils";
import type { UploadedPdf } from "./PdfUpload";
import TypingDots from "./TypingDots";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "./ui/dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

interface ChatPanelProps {
  uploadedPdf: UploadedPdf;
  setUploadedPdf: React.Dispatch<React.SetStateAction<UploadedPdf | null>>;
  onScrollToPage?: (pageNum: number) => void;
  onOpenPdf?: () => void;
}

type ChatMessage = {
  role: "user" | "bot";
  text?: string;
  answer?: string;
  citations?: number[];
};

export default function ChatPanel({
  uploadedPdf,
  setUploadedPdf,
  onScrollToPage,
  onOpenPdf
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [chatStarted, setChatStarted] = useState(false);

  const handleSend = async (ques: string) => {
    if (!uploadedPdf.pdfId || !ques) return;
    if (!chatStarted) {
      setChatStarted(true);
    }

    setMessages((messages) => [...messages, { role: "user", text: ques }]);
    setQuestion("");
    setMessages((messages) => [
      ...messages,
      { role: "bot", answer: "", citations: [] }
    ]);

    const res = await fetch("http://localhost:5001/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pdfId: uploadedPdf.pdfId, question: ques })
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const decoded = decoder.decode(value);
      const lines = decoded.trim().split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const parsed = JSON.parse(line.replace("data: ", ""));
          const { text, citations }: { text: string; citations: number[] } =
            parsed;

          setMessages((messages) => {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage && lastMessage.role === "bot") {
              return [
                ...messages.slice(0, -1),
                {
                  role: "bot",
                  answer: (lastMessage.answer || "") + text,
                  citations
                }
              ];
            } else {
              return [...messages, { role: "bot", answer: text, citations }];
            }
          });
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end mt-4 mr-4 px-4 sm:px-0 items-center space-x-2">
        <div>
          <button
            onClick={() => onOpenPdf && onOpenPdf()}
            aria-label="Open PDF"
            className="bg-white visible lg:hidden rounded-full shadow-lg p-2 cursor-pointer inline-flex items-center justify-center">
            <FileText className="w-5 h-5 text-purple-600" />
          </button>
        </div>
        <HoverCard openDelay={100} closeDelay={100}>
          <Dialog>
            <DialogTrigger>
              <HoverCardTrigger>
                <div className="flex text-right bg-white rounded-full shadow-lg p-2 cursor-pointer">
                  <X />
                </div>
              </HoverCardTrigger>
              <HoverCardContent
                side="left"
                className="bg-black text-white px-2 py-2 w-fit cursor-pointer">
                <h3 className="text-lg font-semibold">Upload New PDF?</h3>
              </HoverCardContent>
            </DialogTrigger>
            <DialogContent className="w-full max-w-md">
              <DialogHeader>
                <DialogTitle>
                  <div className="flex items-center gap-3 mb-2">
                    <CircleAlert className="w-6 h-6 text-yellow-500" />
                    Upload New PDF?
                  </div>
                </DialogTitle>
                <DialogDescription className="text-gray-600 mb-3 text-base">
                  This will end your current chat session. Are you sure you want
                  to upload a new PDF?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild className="mr-1 cursor-pointer">
                  <button className="px-4 py-2 rounded-lg hover:bg-gray-100">
                    Cancel
                  </button>
                </DialogClose>

                <button
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white cursor-pointer"
                  onClick={() => {
                    setUploadedPdf(null);
                  }}>
                  Upload New PDF
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </HoverCard>
      </div>

      <div className="px-4 sm:px-6 py-4 flex-1 items-center overflow-y-auto">
        {chatStarted ? (
          <div className="p-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex mb-2",
                  i % 2 == 0 ? "justify-end" : "justify-start"
                )}>
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 max-w-[80%] text-sm",
                    i % 2 == 0 ? "bg-blue-100" : "bg-purple-100"
                  )}>
                  <div className="flex gap-2">
                    {m.text ? (
                      <User className="w-5 h-5 mt-[2px] text-blue-600 flex-shrink-0" />
                    ) : (
                      <Bot className="w-5 h-5 mt-[2px] text-purple-600 flex-shrink-0" />
                    )}

                    {m.text && (
                      <p className="whitespace-pre-wrap break-words text-sm">
                        {m.text}
                      </p>
                    )}

                    {m.answer && (
                      <div className="whitespace-pre-wrap break-words text-sm">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            ul: (props) => (
                              <ul className="list-disc pl-5" {...props} />
                            ),
                            ol: (props) => (
                              <ol className="list-decimal pl-5" {...props} />
                            )
                          }}>
                          {m.answer}
                        </ReactMarkdown>
                      </div>
                    )}
                    {!m.answer && m.role === "bot" && (
                      <div className="whitespace-pre-wrap break-words">
                        <TypingDots />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2 text-sm">
                    {m.citations &&
                      m.citations.length > 0 &&
                      m.citations.map((page: number, idx: number) => (
                        <p
                          className="w-fit px-2 py-1 rounded text-purple-700 bg-purple-300 cursor-pointer text-xs"
                          onClick={() => {
                            if (onScrollToPage) onScrollToPage(page);
                          }}
                          key={idx}>
                          Page: {page}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-purple-500 mb-4 flex flex-col">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 inline-block mr-2" />
              <h3 className="text-purple-700 font-bold">
                Your document is ready!
              </h3>
            </div>
            <p className="text-sm">
              You can now ask questions about your document. For example:
            </p>
            <button
              onClick={async () => {
                await handleSend("What is the main topic of this document?");
              }}
              className="w-full text-left sm:w-fit bg-[#efe1ff] hover:bg-[#ecdbff] rounded-lg px-3 py-2 mt-2 cursor-pointer text-sm">
              <p>What is the main topic of this document?</p>
            </button>
            <button
              onClick={async () => {
                await handleSend("Can you summarize the key points?");
              }}
              className="w-full text-left sm:w-fit bg-[#efe1ff] hover:bg-[#ecdbff] rounded-lg px-3 py-2 mt-2 cursor-pointer text-sm">
              <p>Can you summarize the key points?</p>
            </button>
            <button
              onClick={async () => {
                await handleSend(
                  "What are the conclusions or recommendations?"
                );
              }}
              className="w-full text-left sm:w-fit bg-[#efe1ff] hover:bg-[#ecdbff] rounded-lg px-3 py-2 mt-2 cursor-pointer text-sm">
              <p>What are the conclusions or recommendations?</p>
            </button>
          </div>
        )}
      </div>
      <div className="p-3 border-t bg-white w-full flex flex-col sm:flex-row gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (question.trim()) {
                void handleSend(question);
              }
            }
          }}
          placeholder="Ask about the document..."
          className="border py-2 px-3 w-full bg-gray-100 flex-1 rounded-lg text-sm"
        />

        <button
          onClick={async () => {
            await handleSend(question);
          }}
          className="ml-2 bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer flex items-center justify-center"
          aria-label="Send question">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
