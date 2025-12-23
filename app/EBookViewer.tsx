"use client";

import React, { useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";

// ใช้ไฟล์ Worker จาก Local (ตามที่คุณตั้งค่าไว้ถูกต้องแล้ว)
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
      
      {/* --- ส่วนหัวข้อและปุ่มดาวน์โหลด (ปรับปรุงใหม่) --- */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "10px",
        flexWrap: "wrap", // เผื่อหน้าจอเล็กจะได้ไม่เบียดกัน
        gap: "10px"
      }}>
        <h2 className="card-title" style={{ margin: 0 }}>เอกสาร: Lab 001</h2>
        
        {/* ปุ่มดาวน์โหลด */}
        <a 
          href={pdfPath} 
          download="Lab001_Network_Admin.pdf" // ชื่อไฟล์ตอนโหลดลงเครื่อง
          className="btn" // ใช้ class btn เดิมเพื่อให้สไตล์เหมือนปุ่มอื่น
          style={{
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            padding: "8px 16px",
            height: "auto",
            backgroundColor: "#2563eb", // สีน้ำเงินสวยๆ (หรือลบออกถ้า class btn มีสีอยู่แล้ว)
            color: "white"
          }}
        >
          {/* ไอคอนลูกศรลง (SVG) */}
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          ดาวน์โหลด PDF
        </a>
      </div>

      <p className="subtitle" style={{ marginBottom: "20px" }}>คลิกที่มุมกระดาษหรือลากเมาส์เพื่อเปิดหน้า</p>

      {/* --- ส่วนแสดงผล E-Book (เหมือนเดิม) --- */}
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