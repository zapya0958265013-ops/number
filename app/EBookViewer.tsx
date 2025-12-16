"use client";

import React, { useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";

// --- แก้ไขตรงนี้ (สำคัญที่สุด) ---
// ชี้ไปที่ไฟล์ Local ที่เราเพิ่งก๊อปปี้ไปวางใน folder public
// ไม่ต้องใช้ URL ยาวๆ หรือ CDN แล้ว
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export default function EBookViewer() {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // ไฟล์ PDF ของคุณ
  const pdfPath = "/document/lab001.pdf";

  useEffect(() => {
    setIsClient(true);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setError(null);
  }

  function onDocumentLoadError(err: Error) {
    console.error("PDF Error:", err);
    setError(`ไม่สามารถอ่านไฟล์ได้: ${err.message}`);
  }

  if (!isClient) return <div className="p-4 text-center">กำลังเตรียม E-book...</div>;

  if (error) return (
    <div className="card p-4 text-center" style={{maxWidth: '600px', margin: '20px auto', color: 'red'}}>
      <h3>เกิดข้อผิดพลาด</h3>
      <p>{error}</p>
      <p style={{color: 'black', marginTop: '10px', fontSize: '14px'}}>
        คำแนะนำ: ตรวจสอบว่ามีไฟล์ <b>public/pdf.worker.min.js</b> แล้วหรือไม่?
      </p>
    </div>
  );

  return (
    <section className="card" style={{ maxWidth: "1000px", margin: "0 auto", overflow: "hidden" }}>
      <h2 className="card-title">เอกสาร</h2>
      <p className="subtitle" style={{ marginBottom: "20px" }}>คลิกที่มุมกระดาษหรือลากเมาส์เพื่อเปิดหน้า</p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#525659",
          padding: "20px",
          borderRadius: "8px",
          minHeight: "600px",
        }}
      >
        <Document 
          file={pdfPath} 
          onLoadSuccess={onDocumentLoadSuccess} 
          onLoadError={onDocumentLoadError}
          className="hidden"
        >
          {/* Metadata Loader */}
        </Document>

        {numPages ? (
          // @ts-ignore
          <HTMLFlipBook
            width={400}
            height={570}
            showCover={true}
            maxShadowOpacity={0.5}
            className="demo-book"
            style={{ boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div key={`page_${index + 1}`} style={{ backgroundColor: "white", overflow: "hidden", position: "relative" }}>
                <Document 
                    file={pdfPath} 
                    loading={<div style={{ padding: 20 }}>โหลดหน้า...</div>}
                >
                  <Page 
                    pageNumber={index + 1} 
                    width={400} 
                    renderTextLayer={false} 
                    renderAnnotationLayer={false} 
                  />
                </Document>
                <div style={{ position: "absolute", bottom: "10px", width: "100%", textAlign: "center", fontSize: "12px", color: "#999" }}>
                    {index + 1}
                </div>
              </div>
            ))}
          </HTMLFlipBook>
        ) : (
          <div style={{ color: "white" }}>กำลังโหลดไฟล์เอกสาร...</div>
        )}
      </div>
    </section>
  );
}