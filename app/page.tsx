"use client";

import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

const DynamicEBookViewer = dynamic(() => import('./EBookViewer'), { ssr: false });

// --- COMPONENTS เดิม (ไม่แตะต้อง Logic) ---

function Calculator() {
  const [a, setA] = useState<string>("");
  const [b, setB] = useState<string>("");
  const [op, setOp] = useState<string>("+");
  const [result, setResult] = useState<string>("");

  const compute = () => {
    const na = parseFloat(a);
    const nb = parseFloat(b);
    if (Number.isNaN(na) || Number.isNaN(nb)) {
      setResult("กรุณาใส่ตัวเลขที่ถูกต้อง");
      return;
    }
    let r = 0;
    switch (op) {
      case "+": r = na + nb; break;
      case "-": r = na - nb; break;
      case "*": r = na * nb; break;
      case "/": r = nb === 0 ? NaN : na / nb; break;
      default: r = NaN;
    }
    setResult(Number.isFinite(r) ? String(r) : "ไม่สามารถคำนวณได้");
  };

  const clear = () => {
    setA(""); setB(""); setResult("");
  };

  return (
    <section className="card">
      <h2 className="card-title">เครื่องคิดเลข</h2>
      <div className="row">
        <input className="input" value={a} onChange={(e) => setA(e.target.value)} placeholder="ตัวเลขแรก" />
        <select className="select" value={op} onChange={(e) => setOp(e.target.value)}>
          <option value="+">+</option>
          <option value="-">-</option>
          <option value="*">×</option>
          <option value="/">÷</option>
        </select>
        <input className="input" value={b} onChange={(e) => setB(e.target.value)} placeholder="ตัวเลขที่สอง" />
      </div>
      <div className="row actions">
        <button className="btn" onClick={compute} aria-label="คำนวณ">คำนวณ</button>
        <button className="btn ghost" onClick={clear} aria-label="ล้าง">ล้าง</button>
      </div>
      <div className="result">ผลลัพธ์: <strong>{result || "-"}</strong></div>
    </section>
  );
}

function Grader() {
  const [name, setName] = useState<string>("");
  const [score, setScore] = useState<string>("");
  const [grade, setGrade] = useState<string>("");

  const calcGrade = () => {
    const s = Number(score);
    if (Number.isNaN(s) || s < 0 || s > 100) {
      setGrade("กรุณาใส่คะแนน 0–100");
      return;
    }
    let g = "F";
    if (s >= 80) g = "A";
    else if (s >= 75) g = "B+";
    else if (s >= 70) g = "B";
    else if (s >= 65) g = "C+";
    else if (s >= 60) g = "C";
    else if (s >= 55) g = "D+";
    else if (s >= 50) g = "D";
    else g = "F";
    
    setGrade(`${g} (${s}%)`);
  };

  return (
    <section className="card grader-card">
      <h2 className="card-title">คำนวณเกรด</h2>
      <div style={{ display: 'grid', alignItems: 'start' }}>
        <div>
          <div className="col">
            <label className="label">ชื่อ นาม</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น สมชาย" />
          </div>
          <div className="col">
            <label className="label">คะแนน (0–100)</label>
            <input className="input" value={score} onChange={(e) => setScore(e.target.value)} placeholder="เช่น 87" />
          </div>
          <div className="row actions">
            <button className="btn" onClick={calcGrade}>คำนวณเกรด</button>
            <button className="btn ghost" onClick={() => { setName(""); setScore(""); setGrade(""); }}>ล้าง</button>
          </div>
        </div>
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
          <div>
            <p style={{ fontSize: '12px', color: '#666', margin: '0 0 4px 0' }}>ชื่อ</p>
            <p style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>{name || "-"}</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#666', margin: '0 0 4px 0' }}>เกรด</p>
            <p style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: '#4f46e5' }}>{grade || "-"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CourseInfo() {
  const [section, setSection] = useState<"all" | "overview" | "units" | "meta" | "assessment" | "resources">("all");

  return (
    <section className="card course-card">
      <div className="ribbon">BSCCT604</div>
      <div className="course-header">
        <div>
          <h2 className="card-title">การบริหารเครือข่ายคอมพิวเตอร์</h2>
          <p className="label">Computer Network Administration</p>
        </div>
        <div className="badges">
          <span className="badge">หน่วยที่: 7</span>
          <span className="badge">หน่วยกิต: 3</span>
          <span className="badge">รูปแบบ: ปฏิบัติการ + บรรยาย</span>
        </div>
      </div>

      <div className="section-menu">
        <button className={`sec-btn ${section === 'all' ? 'active' : ''}`} onClick={() => setSection('all')}>แสดงทั้งหมด</button>
        <button className={`sec-btn ${section === 'overview' ? 'active' : ''}`} onClick={() => setSection('overview')}>ภาพรวม</button>
        <button className={`sec-btn ${section === 'meta' ? 'active' : ''}`} onClick={() => setSection('meta')}>ข้อมูลวิชา</button>
        <button className={`sec-btn ${section === 'units' ? 'active' : ''}`} onClick={() => setSection('units')}>หน่วยการเรียน</button>
      </div>

      <div className="course-grid">
        <aside className="course-meta">
          <div className={`section-content ${section === 'all' || section === 'meta' ? 'show' : 'hide'}`}>
            <p><strong>วิชาบังคับก่อน :</strong> BSCCT603</p>
            <div className="stats">
              <div className="stat"><div className="stat-number">7</div><div className="stat-label">บทเรียน</div></div>
              <div className="stat"><div className="stat-number">3</div><div className="stat-label">หน่วยกิต</div></div>
            </div>
          </div>
        </aside>

        <div className="course-body">
          <div className={`section-content ${section === 'all' || section === 'overview' ? 'show' : 'hide'}`}>
            <p>ศึกษาและฝึกปฏิบัติเกี่ยวกับการติดตั้งและกำหนดค่าทางเครือข่ายคอมพิวเตอร์...</p>
          </div>

          <div className={`section-content ${section === 'all' || section === 'units' ? 'show' : 'hide'}`}>
            <h3 className="card-title">หน่วยการเรียน</h3>
            <div className="units">
              <details>
                <summary>หน่วยที่ 1: พื้นฐานและองค์ประกอบของระบบเครือข่าย</summary>
                <ul><li>ความหมายและประเภทของเครือข่าย</li></ul>
              </details>
              {/* (ย่อส่วนหน่วยเรียนเพื่อความกระชับ แต่โค้ดจริงคุณสามารถใส่ให้ครบได้) */}
              <p style={{color:'#666', fontStyle:'italic'}}>...เนื้อหาหน่วยเรียนอื่นๆ...</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- MAIN PAGE ---

export default function Home() {
  // เพิ่ม state "document" เข้าไปใน view
  const [view, setView] = useState<"home" | "calculator" | "grader" | "document">("document");

  return (
    <>
      <nav className="topbar">
        <div className="topbar-inner">
          <a href="#" className="topbar-brand">
            <span className="topbar-title">KHAJONSAK</span>
          </a>

          <div className="topbar-nav">
            <a className={`topbar-link ${view === 'home' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setView('home'); }}>Home</a>
            <a className={`topbar-link ${view === 'document' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setView('document'); }}>Document</a>
            <a className={`topbar-link ${view === 'calculator' || view === 'grader' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setView('calculator'); }}>Tools</a>
          </div>
        </div>
      </nav>

      <div className="page">
        <main className="container">
          {/* Sub-Menu สำหรับ Tools */}
          {(view === 'calculator' || view === 'grader') && (
            <nav className="nav">
              <div className="nav-left">
                <div className="brand">NumberTools</div>
                <div className="nav-sub">คำนวณ & คำนวณเกรด</div>
              </div>
              <ul className="nav-list">
                <li className={`nav-item ${view === "calculator" ? "active" : ""}`} onClick={() => setView("calculator")}>เครื่องคิดเลข</li>
                <li className={`nav-item ${view === "grader" ? "active" : ""}`} onClick={() => setView("grader")}>คำนวณเกรด</li>
              </ul>
            </nav>
          )}

          <header className="hero">
            <h1 className="title">
              {view === 'home' && 'BSCCT604 — การบริหารเครือข่ายคอมพิวเตอร์'}
              {view === 'calculator' && 'เครื่องคิดเลข'}
              {view === 'grader' && 'คำนวณเกรด'}
              {view === 'document' && 'เอกสารประกอบการเรียน (E-book)'}
            </h1>
            <p className="subtitle">
              {view === 'home' && 'ข้อมูลรายวิชาและหน่วยการเรียน'}
              {view === 'calculator' && 'คำนวณตัวเลขระหว่างค่า'}
              {view === 'grader' && 'ป้อนคะแนนเพื่อดูเกรด'}
              {view === 'document' && 'เปิดอ่านเอกสาร Lab 001 แบบหนังสือ'}
            </p>
          </header>

          <div className="grid">
            {view === 'home' && <CourseInfo />}
            {view === 'calculator' && <Calculator />}
            {view === 'grader' && <Grader />}
            {/* แสดงผล EBookViewer เมื่อเลือกเมนู Document */}
            {view === 'document' && <DynamicEBookViewer />}
          </div>

        </main>
      </div>
    </>
  );
}