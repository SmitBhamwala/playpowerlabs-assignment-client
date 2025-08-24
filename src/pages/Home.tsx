"use client";
import { useRef, useState } from "react";
import PdfUpload from "../components/PdfUpload";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "../components/ui/resizable";

// use react-pdf for rendering
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import ChatPanel from "../components/ChatPanel";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type UploadedPdf = {
  pdfId: string;
  fileUrl: string;
};

export default function Home() {
  const [uploadedPdf, setUploadedPdf] = useState<UploadedPdf | null>(null);

  const [numPages, setNumPages] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="bg-gray-100 h-screen">
      {!uploadedPdf ? (
        <PdfUpload setUploadedPdf={setUploadedPdf} />
      ) : (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel minSize={20}>
            <ChatPanel
              uploadedPdf={uploadedPdf}
              setUploadedPdf={setUploadedPdf}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20}>
            <div
              className="h-screen overflow-y-scroll flex flex-col items-center py-4"
              ref={containerRef}>
              <Document
                file={uploadedPdf.fileUrl}
                scale={1}
                onLoadSuccess={(pdf) => setNumPages(pdf.numPages)}
                loading={<div className="text-center p-8">Loading PDF…</div>}
                error={
                  <div className="text-center text-red-500">
                    Failed to load PDF
                  </div>
                }>
                {Array.from(new Array(numPages ?? 0), (_el, index) => (
                  <div key={`page_${index + 1}`} className="mb-4">
                    <Page
                      pageNumber={index + 1}
                      className={"w-fit h-fit overflow-hidden shadow-lg"}
                      renderTextLayer={true}
                      scale={1}
                      renderAnnotationLayer={true}
                      loading={
                        <div className="text-center p-4">Rendering page…</div>
                      }
                    />
                  </div>
                ))}
              </Document>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
