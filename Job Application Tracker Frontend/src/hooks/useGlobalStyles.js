import { useEffect } from "react";

export function useGlobalStyles() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@400;500&display=swap');
      @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      * { box-sizing: border-box; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      .job-row:hover { background: rgba(255,255,255,0.04) !important; }
      .job-row { transition: background 0.15s; cursor: pointer; }
      .tab-btn:hover { color: #E8E4DC !important; }
      select { background-color: rgba(255,255,255,0.05) !important; color: #E8E4DC !important; }
      select:focus { background-color: rgba(255,255,255,0.08) !important; }
      option { background-color: #0C0B10 !important; color: #E8E4DC !important; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
}
