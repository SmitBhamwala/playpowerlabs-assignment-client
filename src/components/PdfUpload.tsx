import axios from "axios";
import { Upload } from "lucide-react";
import { useState, type ChangeEvent, type DragEvent } from "react";

// exported type so other modules (eg. Home.tsx) can import
export type UploadedPdf = {
  pdfId: string;
  fileUrl: string;
};

interface PdfUploadProps {
  setUploadedPdf: React.Dispatch<React.SetStateAction<UploadedPdf | null>>;
}

export default function PdfUpload({ setUploadedPdf }: PdfUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const uploadedFile = e.dataTransfer.files[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      startUpload(uploadedFile);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      startUpload(uploadedFile);
    }
  };

  const startUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await axios.post("https://playpowerlabs-assignment-server.onrender.com/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) {
            setProgress(Math.round((e.loaded * 100) / e.total));
          }
        }
      });

      // assume backend returns { pdfId, fileUrl } — narrow the type for TS
      setUploadedPdf(res.data as UploadedPdf);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setUploadedPdf(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}>
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
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </label>
      ) : (
        <div className="w-full max-w-2xl p-6 bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full border-4 border-purple-300 border-t-transparent animate-spin"
                aria-hidden="true"
              />
              <span className="sr-only">Uploading</span>
              <div className="text-purple-600 font-medium">
                {progress < 100
                  ? "Uploading PDF"
                  : "Parsing and processing the PDF"}
              </div>
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
      )}
    </div>
  );
}
