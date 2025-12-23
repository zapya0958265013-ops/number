"use client";

import React, { useEffect, useState, useMemo } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";

// ตั้งค่า Worker เหมือนเดิม
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

// --- 1. ข้อมูลจำลองรายชื่อเอกสาร (เพิ่มไฟล์ใหม่ที่นี่) ---
const DOCUMENTS = [
  { id: 1, title: "Lab 001: พื้นฐานระบบเครือข่าย", filename: "lab001.pdf", tags: ["network", "basic", "lab1"] },
  { id: 2, title: "Lab 002: การติดตั้งและกำหนดค่า", filename: "lad002.pdf", tags: ["config", "setup", "lab2"] }, // ชื่อไฟล์ตามที่คุณแจ้ง (lad002)
  { id: 3, title: "Lab 003: การออกแบบเครือข่ายย่อย VLSM", filename: "lab003.pdf", tags: ["config", "setup", "lab3"] }, // ชื่อไฟล์ตามที่คุณแจ้ง (lad002)

];

export default function EBookViewer() {
  // State สำหรับ PDF Viewer
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State สำหรับระบบค้นหา
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<typeof DOCUMENTS[0] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // --- Logic ค้นหาอัจฉริยะ (กรองตามชื่อ หรือ tags) ---
  const filteredDocs = useMemo(() => {
    if (!searchTerm) return [];
    const lowerTerm = searchTerm.toLowerCase();
    return DOCUMENTS.filter(doc => 
      doc.title.toLowerCase().includes(lowerTerm) || 
      doc.filename.toLowerCase().includes(lowerTerm) ||
      doc.tags.some(tag => tag.includes(lowerTerm))
    );
  }, [searchTerm]);

  // ฟังก์ชันเลือกเอกสาร
  const handleSelectDoc = (doc: typeof DOCUMENTS[0]) => {
    setSelectedDoc(doc);
    setSearchTerm(""); // เคลียร์คำค้นหา
    setIsSearching(false); // ปิด popup ค้นหา
    setNumPages(null); // รีเซ็ตจำนวนหน้า
    setError(null); // รีเซ็ต error
  };

  // ฟังก์ชันกลับไปหน้าค้นหา
  const handleBackToSearch = () => {
    setSelectedDoc(null);
    setSearchTerm("");
    setNumPages(null);
  };

  // PDF Handlers
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setError(null);
  }
  function onDocumentLoadError(err: Error) {
    console.error("PDF Error:", err);
    setError(`ไม่สามารถอ่านไฟล์ได้: ${err.message}`);
  }

  if (!isClient) return <div className="p-4 text-center">กำลังเตรียมระบบ...</div>;

  return (
    <section className="card" style={{ maxWidth: "1000px", margin: "0 auto", overflow: "visible", minHeight: '700px' }}>
      
      {/* --- ส่วนค้นหา (อยู่ด้านบนสุด) --- */}
      <div style={{ marginBottom: "20px", position: "relative", zIndex: 10 }}>
        <label className="label" style={{marginBottom: '5px', display: 'block'}}>ค้นหาเอกสารเรียน</label>
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <input 
              className="input" 
              placeholder="พิมพ์ชื่อเอกสาร เช่น lab001..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsSearching(true);
                if (selectedDoc) setSelectedDoc(null); // ถ้าพิมพ์ใหม่ ให้เคลียร์การเลือกเดิม
              }}
              onFocus={() => setIsSearching(true)}
              style={{ width: "100%" }}
            />
            
            {/* Dropdown ผลการค้นหา */}
            {isSearching && searchTerm && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                backgroundColor: "white",
                border: "1px solid #ddd",
                borderRadius: "0 0 8px 8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                maxHeight: "200px",
                overflowY: "auto",
                zIndex: 20
              }}>
                {filteredDocs.length > 0 ? (
                  filteredDocs.map(doc => (
                    <div 
                      key={doc.id}
                      onClick={() => handleSelectDoc(doc)}
                      style={{
                        padding: "10px 15px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                        transition: "background 0.2s"
                      }}
                      className="hover:bg-gray-100" // ใช้ Tailwind class หรือ style hover เองก็ได้
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                    >
                      <div style={{ fontWeight: "bold", fontSize: "14px" }}>{doc.title}</div>
                      <div style={{ fontSize: "12px", color: "#666" }}>ไฟล์: {doc.filename}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "15px", textAlign: "center", color: "#999" }}>
                    ไม่พบเอกสารที่ค้นหา
                  </div>
                )}
              </div>
            )}
          </div>
          <button className="btn" onClick={() => setIsSearching(false)}>ค้นหา</button>
        </div>
      </div>

      {/* --- ส่วนแสดงผล (แสดงเมื่อเลือกเอกสารแล้วเท่านั้น) --- */}
      {selectedDoc ? (
        <div className="fade-in">
          {/* Header: ชื่อเอกสาร และ ปุ่มดาวน์โหลด */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", flexWrap: "wrap", gap: "10px", borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <h2 className="card-title" style={{ margin: 0, fontSize: '1.25rem' }}>
              📖 {selectedDoc.title}
            </h2>
            <div style={{display: 'flex', gap: '10px'}}>
              <a 
                href={`/document/${selectedDoc.filename}`} 
                download
                className="btn"
                style={{ backgroundColor: "#2563eb", color: "white", textDecoration: "none", fontSize: "14px", padding: "8px 12px" }}
              >
                📥 ดาวน์โหลด
              </a>
              <button 
                onClick={handleBackToSearch}
                className="btn ghost"
                style={{ fontSize: "14px", padding: "8px 12px" }}
              >
                ❌ ปิด
              </button>
            </div>
          </div>

          <p className="subtitle" style={{ marginBottom: "20px" }}>คลิกที่มุมกระดาษหรือลากเมาส์เพื่อเปิดหน้า</p>

          {error ? (
             <div className="card p-4 text-center" style={{ color: 'red', border: '1px dashed red' }}>
                <p>{error}</p>
                <p className="text-sm text-black mt-2">ตรวจสอบว่าไฟล์ <b>public/document/{selectedDoc.filename}</b> มีอยู่จริง</p>
             </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#525659",
                padding: "20px",
                borderRadius: "8px",
                minHeight: "600px",
                overflow: 'hidden'
              }}
            >
              <Document 
                file={`/document/${selectedDoc.filename}`} 
                onLoadSuccess={onDocumentLoadSuccess} 
                onLoadError={onDocumentLoadError}
                className="hidden"
              >
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
                          file={`/document/${selectedDoc.filename}`} 
                          loading={<div style={{ padding: 20 }}>กำลังโหลด...</div>}
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
                <div style={{ color: "white" }}>กำลังโหลดเอกสาร...</div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* --- State: ยังไม่ได้เลือกเอกสาร --- */
        <div style={{ 
          textAlign: "center", 
          padding: "60px 20px", 
          background: "#f9fafb", 
          borderRadius: "8px", 
          border: "2px dashed #ddd",
          color: "#666"
        }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>📚</div>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "5px" }}>ยังไม่ได้เลือกเอกสาร</h3>
          <p>กรุณาพิมพ์ชื่อเอกสารในช่องค้นหาด้านบน เพื่อเปิดอ่าน E-book</p>
          <div style={{marginTop: '20px', fontSize: '12px', color: '#999'}}>
             เอกสารที่มี: lab001, lad002
          </div>
        </div>
      )}
    </section>
  );
}