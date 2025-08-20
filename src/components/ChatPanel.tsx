import axios from "axios";
import { CircleAlert, FileText, Send, X } from "lucide-react";
import { useState } from "react";
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
  uploadedPdf: { pdfId: string; fileName: string; fileUrl: string };
  setUploadedPdf: React.Dispatch<React.SetStateAction<any>>;
}

export default function ChatPanel({
  uploadedPdf,
  setUploadedPdf
}: ChatPanelProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [question, setQuestion] = useState("");
  const [chatStarted, setChatStarted] = useState(false);

  const handleSend = async () => {
    if (!uploadedPdf.pdfId || !question) return;
    const res = await axios.post("http://localhost:5000/ask", {
      pdfId: uploadedPdf.pdfId,
      question
    });
    setMessages([...messages, { role: "user", text: question }, res.data]);
    setQuestion("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end mt-4 mr-4">
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
            <DialogContent className="w-[28rem]">
              <DialogHeader>
                <DialogTitle>
                  <div className="flex items-center gap-3 mb-2">
                    <CircleAlert className="w-6 h-6 text-yellow-500" />
                    Upload New PDF?
                  </div>
                </DialogTitle>
                <DialogDescription>
                  <p className="text-gray-600 mb-3 text-base">
                    This will end your current chat session. Are you sure you
                    want to upload a new PDF?
                  </p>
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

      <div className="px-6 py-4 flex-1 items-center">
        {chatStarted ? (
          <div className="overflow-y-auto p-2">
            {messages.map((m, i) => (
              <div key={i} className="mb-2">
                <b>{m.role === "user" ? "You:" : "AI:"}</b> {m.text || m.answer}
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
            <p>You can now ask questions about your document. For example:</p>
            <button
              onClick={() => {
                setQuestion("What is the main topic of this document?");
                setChatStarted(true);
              }}
              className="w-fit bg-[#efe1ff] hover:bg-[#ecdbff] rounded-lg px-4 py-2 mt-2 cursor-pointer">
              <p>What is the main topic of this document?</p>
            </button>
            <button
              onClick={() => {
                setQuestion("Can you summarize the key points?");
                setChatStarted(true);
              }}
              className="w-fit bg-[#efe1ff] hover:bg-[#ecdbff] rounded-lg px-4 py-2 mt-2 cursor-pointer">
              <p>Can you summarize the key points?</p>
            </button>
            <button
              onClick={() => {
                setQuestion("What are the conclusions or recommendations?");
                setChatStarted(true);
              }}
              className="w-fit bg-[#efe1ff] hover:bg-[#ecdbff] rounded-lg px-4 py-2 mt-2 cursor-pointer">
              <p>What are the conclusions or recommendations?</p>
            </button>
          </div>
        )}
      </div>
      <div className="p-4 border-t bg-white w-full flex">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about the document..."
          className="border py-2 px-4 w-max bg-gray-100 flex-1 rounded-lg"
        />

        <button
          onClick={handleSend}
          className="ml-2 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
