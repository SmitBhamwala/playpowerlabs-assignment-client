// import React, { useState } from "react";
// import * as pdfjs from "pdfjs-dist";
// import "pdfjs-dist/web/pdf_viewer.css";

// // Setup worker
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.mjs",
//   import.meta.url
// ).toString();

// const NewPdfUpload: React.FC = () => {
//   const [pdfPages, setPdfPages] = useState<{ id: number; canvas: HTMLCanvasElement }[]>([]);

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     if (file && file.type === "application/pdf") {
//       const fileReader = new FileReader();
//       fileReader.onload = async function () {
//         const typedArray = new Uint8Array(this.result as ArrayBuffer);
//         const pdfDoc = await pdfjs.getDocument(typedArray).promise;

//         const pages: { id: number; canvas: HTMLCanvasElement }[] = [];
//         const devicePixelRatio = window.devicePixelRatio || 1;

//         for (let i = 1; i <= pdfDoc.numPages; i++) {
//           const page = await pdfDoc.getPage(i);

//           // Adjust scale for clarity
//           const scale = 1.5;
//           const viewport = page.getViewport({ scale });

//           // Create canvas
//           const canvas = document.createElement("canvas");
//           const context = canvas.getContext("2d");

//           // Scale canvas for HD rendering
//           canvas.width = viewport.width * devicePixelRatio;
//           canvas.height = viewport.height * devicePixelRatio;

//           if (context) {
//             context.scale(devicePixelRatio, devicePixelRatio);
//             await page.render({
//               canvasContext: context,
//               viewport,
//             }).promise;
//           }

//           // Save rendered canvas
//           pages.push({ id: i, canvas });
//         }

//         setPdfPages(pages);
//       };
//       fileReader.readAsArrayBuffer(file);
//     } else {
//       alert("Please upload a valid PDF file");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center gap-4 p-6 border rounded-lg shadow-lg w-full max-w-4xl mx-auto">
//       {/* Upload Button */}
//       <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
//         Upload PDF
//         <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
//       </label>

//       {/* PDF Pages Viewer */}
//       <div className="w-full flex flex-col items-center gap-6 overflow-y-auto max-h-[80vh] p-4 border rounded-lg">
//         {pdfPages.length > 0 ? (
//           pdfPages.map((page) => (
//             <canvas
//               key={page.id}
//               ref={(ref) => {
//                 if (ref && !ref.hasChildNodes()) {
//                   const ctx = ref.getContext("2d");
//                   if (ctx) {
//                     ctx.clearRect(0, 0, ref.width, ref.height);
//                     ctx.drawImage(page.canvas, 0, 0, ref.width, ref.height);
//                   }
//                 }
//               }}
//               width={page.canvas.width}
//               height={page.canvas.height}
//               className="shadow-md border rounded-md max-w-full h-auto"
//             />
//           ))
//         ) : (
//           <p className="text-gray-500">No PDF uploaded</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NewPdfUpload;
