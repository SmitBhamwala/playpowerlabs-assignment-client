"use client";
import { useEffect, useRef, useState } from "react";
import PdfUpload, { type UploadedPdf } from "../components/PdfUpload";

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

export default function Home() {
  const [uploadedPdf, setUploadedPdf] = useState<UploadedPdf | null>(null);

  const [numPages, setNumPages] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [pageWidth, setPageWidth] = useState<number | undefined>(undefined);
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < 768);
      // compute page width from container when available
      const container = containerRef.current;
      if (container) {
        // subtract some padding so the page fits nicely
        const w = Math.max(200, container.clientWidth - 32);
        setPageWidth(w);
      } else {
        setPageWidth(Math.min(700, window.innerWidth - 48));
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Helper: wait for an element with the given id to exist and have non-zero height.
  const waitForElement = (
    id: string,
    timeout = 5000,
    interval = 100
  ): Promise<HTMLElement | null> => {
    return new Promise((resolve) => {
      const start = Date.now();
      const timer = setInterval(() => {
        const el = document.getElementById(id) as HTMLElement | null;
        if (el && el.getBoundingClientRect().height > 0) {
          clearInterval(timer);
          resolve(el);
          return;
        }
        if (Date.now() - start > timeout) {
          clearInterval(timer);
          resolve(null);
          return;
        }
      }, interval);
    });
  };

  const scrollToPage = (pageNum: number) => {
    // Make this function async to allow waiting for render. We don't change signature
    // callers can ignore the returned promise.
    (async () => {
      // Determine correct element id based on mobile/modal state
      const id = isMobile ? `pdf-modal-page-${pageNum}` : `pdf-page-${pageNum}`;

      // If on mobile and modal isn't visible, open it first so DOM mounts
      if (isMobile && !showPdfModal) setShowPdfModal(true);

      // Wait for the page element to be present and rendered (height > 0)
      const el = await waitForElement(id, 7000, 100);
      const container = containerRef.current;
      if (!el || !container) {
        // fallback: try immediate scroll to element if present
        const fallback = document.getElementById(id);
        if (fallback && container) {
          const t = fallback as HTMLElement;
          const offset =
            t.getBoundingClientRect().top -
            container.getBoundingClientRect().top;
          container.scrollTo({ top: offset, behavior: "smooth" });
        }
        return;
      }

      const target = el as HTMLElement;
      const offsetTop =
        target.getBoundingClientRect().top -
        container.getBoundingClientRect().top;
      container.scrollTo({ top: offsetTop, behavior: "smooth" });
    })();
  };

  // stacked (mobile) layout helper
  const renderStacked = () => (
    <div className="relative h-screen bg-gray-50">
      {/* Chat occupies full screen height on mobile */}
      <div className="h-screen">
        <ChatPanel
          uploadedPdf={uploadedPdf!}
          setUploadedPdf={setUploadedPdf}
          onScrollToPage={scrollToPage}
          onOpenPdf={() => {
            const container = containerRef.current;
            const w = Math.max(
              200,
              (container?.clientWidth ?? window.innerWidth) - 32
            );
            setPageWidth(w);
            setShowPdfModal(true);
          }}
        />
      </div>

      {/* PDF Modal */}
      {showPdfModal && (
        <div
          className="fixed inset-0 z-50 flex items-stretch justify-center bg-black bg-opacity-60"
          onClick={(e) => {
            // close when clicking on backdrop (but not when clicking inside modal)
            if (e.target === e.currentTarget) setShowPdfModal(false);
          }}>
          {/* Attach ref to this scrollable wrapper so scroll calculations are correct */}
          <div
            ref={containerRef}
            className="relative w-full max-w-lg h-full sm:h-[90vh] bg-white m-4 rounded-lg overflow-auto">
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="font-semibold">PDF Preview</h3>
              <button
                onClick={() => setShowPdfModal(false)}
                className="p-2 rounded-md hover:bg-gray-100">
                Close
              </button>
            </div>
            <div className="p-3">
              <div className="w-full flex flex-col items-center">
                <Document
                  file={uploadedPdf?.fileUrl}
                  onLoadSuccess={(pdf) => setNumPages(pdf.numPages)}
                  loading={<div className="text-center p-8">Loading PDF…</div>}
                  error={
                    <div className="text-center text-red-500">
                      Failed to load PDF
                    </div>
                  }>
                  {Array.from(new Array(numPages ?? 0), (_el, index) => (
                    <div
                      id={`pdf-modal-page-${index + 1}`}
                      key={`modal_page_${index + 1}`}
                      className="mb-4 w-full flex justify-center">
                      <Page
                        pageNumber={index + 1}
                        width={pageWidth}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        loading={
                          <div className="text-center p-4">Rendering page…</div>
                        }
                      />
                    </div>
                  ))}
                </Document>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-100 h-screen">
      {!uploadedPdf ? (
        <PdfUpload setUploadedPdf={setUploadedPdf} />
      ) : isMobile ? (
        renderStacked()
      ) : (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel minSize={20}>
            <ChatPanel
              uploadedPdf={uploadedPdf}
              setUploadedPdf={setUploadedPdf}
              onScrollToPage={scrollToPage}
              onOpenPdf={() => {
                const container = containerRef.current;
                const w = Math.max(
                  200,
                  (container?.clientWidth ?? window.innerWidth) - 32
                );
                setPageWidth(w);
                setShowPdfModal(true);
              }}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20}>
            <div
              className="h-screen overflow-y-scroll flex flex-col items-center py-4"
              ref={containerRef}>
              <Document
                file={uploadedPdf.fileUrl}
                onLoadSuccess={(pdf) => setNumPages(pdf.numPages)}
                loading={<div className="text-center p-8">Loading PDF…</div>}
                error={
                  <div className="text-center text-red-500">
                    Failed to load PDF
                  </div>
                }>
                {Array.from(new Array(numPages ?? 0), (_el, index) => (
                  <div
                    id={`pdf-page-${index + 1}`}
                    key={`page_${index + 1}`}
                    className="mb-4 w-full flex justify-center">
                    <Page
                      pageNumber={index + 1}
                      width={pageWidth}
                      className="overflow-hidden shadow-lg"
                      renderTextLayer={true}
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
