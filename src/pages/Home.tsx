"use client";
import { useState } from "react";
import PdfUpload from "../components/PdfUpload";

// 👇 Use pdfjs from pdfjs-dist, not react-pdf
import { GlobalWorkerOptions } from "pdfjs-dist";

// Fix worker issue
GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function Home() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [pdfPages, setPdfPages] = useState<
    { id: number; canvas: HTMLCanvasElement }[]
  >([]);

  return (
    <div className="min-h-screen bg-gray-100">
      {!fileUrl ? (
        <PdfUpload
          setFileUrl={setFileUrl}
          pdfPages={pdfPages}
          setPdfPages={setPdfPages}
        />
      ) : (
        // Simple viewer: display rendered pages as images
        <div className="min-h-screen flex items-start justify-center p-6">
          <div className="w-full max-w-4xl bg-white rounded-lg shadow p-4">
            {pdfPages.length > 0 ? (
              pdfPages.map((page) => (
                <div key={page.id} className="mb-4">
                  <img
                    src={page.canvas.toDataURL()}
                    alt={`Page ${page.id}`}
                    className="w-full h-auto rounded"
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-600">
                No preview available for this PDF.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
