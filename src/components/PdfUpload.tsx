import { Upload } from "lucide-react";
import { useState, type ChangeEvent, type DragEvent } from "react";
// 👇 Import pdfjs directly from pdfjs-dist
import * as pdfjsLib from "pdfjs-dist";

export default function PdfUpload({
  setFileUrl,
  pdfPages,
  setPdfPages
}: {
  setFileUrl: (url: string | null) => void;
  pdfPages: { id: number; canvas: HTMLCanvasElement }[];
  setPdfPages: (pages: { id: number; canvas: HTMLCanvasElement }[]) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // helper to check whether dragged items contain a PDF
  const dragContainsPdf = (e: DragEvent<HTMLDivElement>) => {
    const items = e.dataTransfer?.items;
    if (!items) return false;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (it.kind === "file") {
        // prefer MIME type, fallback to filename check if type is empty
        if (it.type === "application/pdf") return true;
        try {
          const f = it.getAsFile();
          if (f && f.name.toLowerCase().endsWith(".pdf")) return true;
        } catch {
          // ignore
        }
      }
    }
    return false;
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dragContainsPdf(e)) {
      setIsDragging(true);
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Only clear when leaving the container (not when moving between child elements)
    setIsDragging(false);
  };

  // Handle file drop
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (uploading) return;
    const uploadedFile = e.dataTransfer.files[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      processAndRenderPdf(uploadedFile);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  // Start upload animation/progress and return a Promise that resolves with the object URL
  const startUpload = (uploadedFile: File): Promise<string> => {
    setUploading(true);
    setProgress(0);
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        setProgress((p) => {
          const next = Math.min(100, p + Math.floor(Math.random() * 12) + 5);
          if (next >= 100) {
            clearInterval(interval);
            const url = URL.createObjectURL(uploadedFile);
            setUploading(false);
            resolve(url);
          }
          return next;
        });
      }, 250);
    });
  };

  // Read and render PDF pages, start upload progress and only set fileUrl after both are done
  const processAndRenderPdf = async (uploadedFile: File) => {
    try {
      // Start reading the file (rendering pages)
      const readPromise = new Promise<void>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = async function () {
          try {
            const typedArray = new Uint8Array(this.result as ArrayBuffer);

            const pdfDoc = await pdfjsLib.getDocument(typedArray).promise;

            const pages: { id: number; canvas: HTMLCanvasElement }[] = [];
            const devicePixelRatio = window.devicePixelRatio || 1;

            for (let i = 1; i <= pdfDoc.numPages; i++) {
              const page = await pdfDoc.getPage(i);
              const viewport = page.getViewport({ scale: 1.5 });

              const canvas = document.createElement("canvas");
              const context = canvas.getContext("2d");

              canvas.width = viewport.width * devicePixelRatio;
              canvas.height = viewport.height * devicePixelRatio;

              if (context) {
                context.scale(devicePixelRatio, devicePixelRatio);
                await page.render({
                  canvasContext: context,
                  viewport,
                  canvas
                }).promise;
              }

              pages.push({ id: i, canvas });
            }

            // set pages
            setPdfPages(pages);
            resolve();
          } catch (err) {
            reject(err);
          }
        };
        fileReader.onerror = () => reject(new Error("Failed to read file"));
        fileReader.readAsArrayBuffer(uploadedFile);
      });

      // Start upload progress animation and get object URL when finished
      const uploadUrlPromise = startUpload(uploadedFile);

      // Wait for both reading and upload to finish
      const [, url] = await Promise.all([readPromise, uploadUrlPromise]);

      // Only set fileUrl after pages have been rendered
      setFileUrl(url as string);
    } catch (err) {
      console.error(err);
      alert("Failed to load PDF");
      setUploading(false);
      setProgress(0);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (uploading) return;
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      processAndRenderPdf(uploadedFile);
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}>
      {!uploading ? (
        <label
          htmlFor="fileUpload"
          className={`relative flex flex-col items-center gap-6 p-12 bg-white rounded-xl shadow-lg cursor-pointer hover:bg-gray-50 transition-colors 
            ${isDragging ? "border-2 border-dashed border-purple-500" : ""}`}>
          <input
            type="file"
            accept="application/pdf"
            id="fileUpload"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center">
            <Upload className="w-8 h-8 text-purple-600" />
          </div>
          <div className="text-center">
            <h2 className="text-gray-800 font-semibold text-xl mb-2">
              Upload PDF to start chatting
            </h2>
            <p className="text-gray-500">
              Click or drag and drop your file here
            </p>
          </div>
        </label>
      ) : progress < 100 ? (
        <div className="w-full max-w-2xl p-6 bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border-4 border-purple-300 animate-spin" />
              <div className="text-purple-600 font-medium">Uploading PDF</div>
            </div>
            <div className="text-purple-600 font-medium">{progress}%</div>
          </div>
          <div className="h-3 bg-purple-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center gap-6 overflow-y-auto max-h-[80vh] p-4 border rounded-lg">
          {pdfPages.map((page) => (
            <div
              key={page.id}
              className="shadow-md border rounded-md max-w-full h-auto">
              {page.canvas && (
                <img
                  src={page.canvas.toDataURL()}
                  alt={`Page ${page.id}`}
                  className="w-full h-auto"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
