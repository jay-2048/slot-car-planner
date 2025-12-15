import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
    ArrowLeft, ArrowRight, RotateCcw, Trash2, Plus, 
    Undo2, Redo2, MoveUp, MoveDown, CheckCircle, AlertTriangle,
    Scissors, Grip, MousePointer2, Copy, Eraser, Magnet,
    Settings, List, X, Ruler, Box, Package, Layout, Shuffle,
    Minimize2, XCircle, Download, Image as ImageIcon, FileSpreadsheet,
    Zap, PenLine, Globe, MousePointer, Save, FolderOpen, Info, BookOpen,
    Eye, EyeOff, Coffee, ShieldCheck
} from 'lucide-react';

// --- 應用程式版本 ---
const APP_VERSION = "v3.1.4 (Fix PC Export)";
const FILE_FORMAT_VERSION = 2; 

// --- 多語言字典 ---
const I18N = {
    en: {
        // UI Labels
        settings: "Settings",
        track_name: "Track Name",
        language: "Language",
        lanes: "Lanes",
        unit: "Unit",
        width: "Width",
        depth: "Depth",
        history: "History",
        undo: "Undo",
        redo: "Redo",
        clear_all: "Clear All",
        clear_confirm_title: "Clear All Tracks?",
        clear_confirm_msg: "This will remove all track pieces. This action cannot be undone.",
        clear_confirm_btn: "Clear All",
        status_closed: "Closed",
        status_open: "Gap",
        total_length: "Length",
        bom: "Bill of Materials",
        export_csv: "Export CSV",
        export_img: "Export Image",
        parts_library: "Parts Library",
        parts_special: "Special",
        parts_straight: "Straight",
        parts_curve: "Curve",
        qty: "Qty",
        part_name: "Part Name",
        brand_col: "Brand",
        total_parts: "Total Parts",
        no_parts: "No parts added",
        start_title: "Start Designing",
        start_desc: "Select a brand on the right and add your first piece",
        left: "L",
        right: "R",
        rotate_left: "Rotate Left",
        rotate_right: "Rotate Right",
        split: "Split Tool",
        select: "Select Tool",
        flip: "Flip",
        delete: "Delete",
        hint: "Hint",
        hint_desc: "Different brands cannot be connected directly.",
        csv_header_part: "Part Name",
        csv_header_qty: "Quantity",
        img_title: "Slot Car Track Design",
        img_dim: "Dimensions",
        img_area: "Area",
        split_mode_hint: "Click on a joint to split the track",
        save_track: "Save Track",
        load_track: "Load Track",
        load_confirm_title: "Overwrite Track?",
        load_confirm_msg: "Loading a file will replace your current design.",
        load_confirm_btn: "Yes, Overwrite",
        cancel: "Cancel",
        file_error: "Invalid file format",
        load_success: "Track loaded successfully",
        clear_success: "All tracks cleared",
        help_title: "User Manual",
        help_mouse: "Mouse / Touch",
        help_mouse_pan: "Middle Mouse / 2-Finger Drag: Pan View",
        help_mouse_zoom: "Scroll Wheel / 2-Finger Pinch: Zoom",
        help_mouse_select: "Left Click / 1-Finger Tap: Select & Move",
        help_features: "Features",
        help_brand: "Multi-Brand: Supports AFX & Tyco mixing (cannot connect directly).",
        help_split: "Split Tool: Click joint to separate sections.",
        help_specs: "Specs",
        help_hairpin: "Hairpin: R1.5\" + 6\" Straight (Total 9\"x6\")",
        help_about: "About",
        help_privacy: "This app runs entirely in your browser. No data is sent to any server. No login required.",
        toggle_ui: "Toggle UI (Focus Mode)",
        kofi: "Buy Me a Coffee",
        
        // Track Piece Names
        'S15': '15" Straight',
        'S9': '9" Straight',
        'S6': '6" Straight',
        'S3': '3" Straight',
        'TERM': '15" Terminal',
        'TERM9': '9" Terminal',
        'CX9': '9" Crisscross',
        'SQ9': '9" Squeeze',
        'SQ15': '15" Squeeze',
        'X9': '9" Intersection',
        'C3': 'Hairpin 9"x6"',
        'C6': '6" Curve (1/8)',
        'C6_90': '6" Curve (1/4)',
        'C9': '9" Curve (1/4)',
        'C9_45': '9" Curve (1/8)',
        'C12': '12" Curve (1/8)',
        'C15': '15" Curve (1/8)',
        'C18': '18" Curve (1/8)',
    },
    zh: {
        // UI Labels
        settings: "設定",
        track_name: "跑道名稱",
        language: "語言",
        lanes: "車道",
        unit: "單位",
        width: "寬度",
        depth: "深度",
        history: "歷史紀錄",
        undo: "復原",
        redo: "重做",
        clear_all: "清除全部",
        clear_confirm_title: "清除所有軌道？",
        clear_confirm_msg: "這將會移除目前所有的軌道零件。此動作無法復原。",
        clear_confirm_btn: "確認清除",
        status_closed: "已閉合",
        status_open: "未閉合",
        total_length: "總長",
        bom: "材料清單",
        export_csv: "匯出 CSV",
        export_img: "匯出圖片",
        parts_library: "零件庫",
        parts_special: "特殊",
        parts_straight: "直線",
        parts_curve: "彎道",
        qty: "數量",
        part_name: "零件名稱",
        brand_col: "品牌",
        total_parts: "總計零件",
        no_parts: "尚無零件",
        start_title: "開始設計您的賽道",
        start_desc: "從右側選單選擇品牌並添加第一片軌道",
        left: "左",
        right: "右",
        rotate_left: "左旋轉",
        rotate_right: "右旋轉",
        split: "剪刀工具",
        select: "選取工具",
        flip: "翻轉",
        delete: "刪除",
        hint: "提示",
        hint_desc: "拖曳賽道頭尾靠近時會自動吸附。使用「分離」將賽道拆開。",
        csv_header_part: "零件名稱",
        csv_header_qty: "數量",
        img_title: "Slot Car 賽道設計圖",
        img_dim: "桌面尺寸",
        img_area: "跑道佔地",
        split_mode_hint: "點擊軌道接口處進行切斷",
        save_track: "儲存賽道",
        load_track: "讀取賽道",
        load_confirm_title: "覆蓋目前設計？",
        load_confirm_msg: "讀取檔案將會完全取代目前的賽道設計。",
        load_confirm_btn: "確定覆蓋",
        cancel: "取消",
        file_error: "檔案格式無效",
        load_success: "賽道讀取成功",
        clear_success: "已清除所有軌道",
        help_title: "操作說明",
        help_mouse: "操作方式",
        help_mouse_pan: "滑鼠中鍵 / 雙指拖曳：移動畫布",
        help_mouse_zoom: "滾輪 / 雙指縮放：放大縮小",
        help_mouse_select: "左鍵 / 單指：選取或拖曳零件",
        help_features: "功能說明",
        help_brand: "多品牌支援：右側可切換 AFX / Tyco (不同品牌無法直接對接)",
        help_split: "分離工具 (剪刀)：點擊軌道接口處可將賽道切斷",
        help_specs: "規格備註",
        help_hairpin: "髮夾彎 (C3)：半徑 1.5\" + 直線 6\" (總尺寸 9\"x6\")",
        help_about: "關於",
        help_privacy: "本程式完全在您的瀏覽器中運作。不會上傳數據到任何伺服器，亦無需登入即可使用。",
        toggle_ui: "隱藏介面 (專注模式)",
        kofi: "贊助 (Ko-fi)",

        // Track Piece Names
        'S15': '15" 直線',
        'S9': '9" 直線',
        'S6': '6" 直線',
        'S3': '3" 直線',
        'TERM': '15" 電源軌', // AFX
        'TERM9': '9" 電源軌', // Tyco
        'CX9': '9" 變換車道',
        'SQ9': '9" 擠壓軌',
        'SQ15': '15" 擠壓軌',
        'X9': '9" 交叉軌',
        'C3': '髮夾彎 (6"直段)', 
        'C6': '6" 彎道 (1/8)', // AFX 45deg
        'C6_90': '6" 彎道 (1/4)', // Tyco 90deg
        'C9': '9" 彎道 (1/4)',
        'C9_45': '9" 彎道 (1/8)',
        'C12': '12" 彎道 (1/8)',
        'C15': '15" 彎道 (1/8)',
        'C18': '18" 彎道 (1/8)',
    }
};

// --- 軌道資料庫 ---
const TRACK_DATA = {
    AFX: {
        name: "Tomy AFX",
        color: "#2563eb",
        trackColor: "#334155", // Dark Gray
        laneSpacing: 1.5,
        pieces: {
            straight_15: { id: 'S15', length: 15, type: 'straight' },
            straight_9: { id: 'S9', length: 9, type: 'straight' },
            straight_6: { id: 'S6', length: 6, type: 'straight' },
            straight_3: { id: 'S3', length: 3, type: 'straight' },
            terminal: { id: 'TERM', length: 15, type: 'straight' },
            crisscross: { id: 'CX9', length: 9, type: 'straight', isLaneChanger: true },
            squeeze: { id: 'SQ9', length: 9, type: 'straight', isSqueeze: true },
            curve_3: { id: 'C3', radius: 1.5, degree: 180, type: 'curve', isHairpin: true, straightLength: 6 },
            curve_6: { id: 'C6', radius: 6, degree: 45, type: 'curve' },
            curve_9: { id: 'C9', radius: 9, degree: 90, type: 'curve' },
            curve_12: { id: 'C12', radius: 12, degree: 45, type: 'curve' },
            curve_15: { id: 'C15', radius: 15, degree: 45, type: 'curve' },
            curve_18: { id: 'C18', radius: 18, degree: 45, type: 'curve' },
        }
    },
    TYCO: {
        name: "Tyco / Mattel",
        color: "#dc2626",
        trackColor: "#94a3b8", // Light Gray for distinction
        laneSpacing: 1.5,
        pieces: {
            // Straights: 6", 9", 15"
            straight_15: { id: 'S15', length: 15, type: 'straight' },
            straight_9: { id: 'S9', length: 9, type: 'straight' },
            straight_6: { id: 'S6', length: 6, type: 'straight' },
            
            // Special
            terminal: { id: 'TERM9', length: 9, type: 'straight' }, // Tyco Terminal is 9"
            crisscross: { id: 'CX9', length: 9, type: 'straight', isLaneChanger: true }, // Crossover 9"
            squeeze: { id: 'SQ15', length: 15, type: 'straight', isSqueeze: true }, // Squeeze 15"
            
            // Curves
            // 1/4 Curves (90 deg): 6" and 9"
            curve_6_90: { id: 'C6_90', radius: 6, degree: 90, type: 'curve' }, 
            curve_9: { id: 'C9', radius: 9, degree: 90, type: 'curve' },
            
            // 1/8 Curves (45 deg): 9" and 12"
            curve_9_45: { id: 'C9_45', radius: 9, degree: 45, type: 'curve' },
            curve_12: { id: 'C12', radius: 12, degree: 45, type: 'curve' },
        }
    }
};

const App = () => {
    // --- 核心狀態 ---
    const [lang, setLang] = useState('en'); 
    const [trackName, setTrackName] = useState('Track 01');
    const [lanes, setLanes] = useState(2);
    const [unit, setUnit] = useState('cm');
    const [tableWidth, setTableWidth] = useState(244);
    const [tableDepth, setTableDepth] = useState(122);
    
    // Brand Selection State (UI only, default to AFX)
    const [activeBrand, setActiveBrand] = useState('AFX');

    // Canvas 尺寸狀態
    const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    // 視圖變換狀態 (Pan & Zoom)
    const [viewTransform, setViewTransform] = useState({ x: 0, y: 0, k: 1 });

    const [sections, setSections] = useState([
        { id: 'main', x: 0, y: 0, heading: 0, pieces: [] }
    ]);

    const [history, setHistory] = useState([]);
    const [future, setFuture] = useState([]);
    const [selected, setSelected] = useState(null); 
    
    // UI 狀態
    const [showBOM, setShowBOM] = useState(false);
    const [showSettings, setShowSettings] = useState(true); 
    const [showHelp, setShowHelp] = useState(false); 
    const [closureStatus, setClosureStatus] = useState({ closed: false, gap: 0 });
    const [previewPiece, setPreviewPiece] = useState(null);
    const [showUI, setShowUI] = useState(true); // Control UI visibility

    // Track Stats: 儲存兩個長度值
    const [trackStats, setTrackStats] = useState({ displayLength: 0, maxLength: 0, width: 0, height: 0 });
    
    // 工具模式
    const [toolMode, setToolMode] = useState('select');
    const [hoveredJoint, setHoveredJoint] = useState(null);

    // 拖曳與吸附狀態
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [sectionStartPos, setSectionStartPos] = useState({ x: 0, y: 0 });
    const [snapCandidate, setSnapCandidate] = useState(null); 
    
    // Panning State
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });

    // Touch gesture state
    const touchCache = useRef([]);
    const touchStartDist = useRef(0);
    const touchStartScale = useRef(1);
    const touchStartPan = useRef({ x: 0, y: 0 });
    const touchStartView = useRef({ x: 0, y: 0 });

    const [showLoadConfirm, setShowLoadConfirm] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [pendingLoadData, setPendingLoadData] = useState(null);
    const [notification, setNotification] = useState(null);

    const canvasRef = useRef(null);
    const fileInputRef = useRef(null); 
    const hitRegionsRef = useRef([]); 
    const jointsRef = useRef([]); 
    const scaleRef = useRef(10); 
    const viewParamsRef = useRef({ startX: 0, startY: 0, scale: 10, tablePxW: 0, tablePxH: 0 }); 
    const trackBoundsRef = useRef({ minX: 0, maxX: 0, minY: 0, maxY: 0 });

    // 監聽視窗大小變化
    useEffect(() => {
        const handleResize = () => {
            setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 當選擇改變時，切換零件庫 Brand
    useEffect(() => {
        if (selected) {
            const sec = sections.find(s => s.id === selected.sectionId);
            if (sec && sec.pieces[selected.pieceIndex]) {
                const piece = sec.pieces[selected.pieceIndex];
                if (piece.brand && piece.brand !== activeBrand) {
                    setActiveBrand(piece.brand);
                }
            }
        }
    }, [selected, sections]); 

    // 翻譯助手
    const t = (key) => I18N[lang][key] || key;
    const getPieceName = (id) => I18N[lang][id] || id;

    const formatLength = (valInches) => {
        const num = Number(valInches);
        if (isNaN(num)) return "0.0" + (unit === 'cm' ? " cm" : '"'); 

        if (unit === 'cm') {
            return (num * 2.54).toFixed(1) + " cm";
        }
        return num.toFixed(1) + '"';
    };

    // 單位切換功能
    const changeUnit = (newUnit) => {
        if (unit === newUnit) return;
        
        // 進行數值換算
        if (newUnit === 'in') {
            // cm -> in
            setTableWidth(prev => parseFloat((prev / 2.54).toFixed(1)));
            setTableDepth(prev => parseFloat((prev / 2.54).toFixed(1)));
        } else {
            // in -> cm
            setTableWidth(prev => parseFloat((prev * 2.54).toFixed(1)));
            setTableDepth(prev => parseFloat((prev * 2.54).toFixed(1)));
        }
        setUnit(newUnit);
    };

    // --- BOM Calculation ---
    const bom = useMemo(() => {
        const counts = {}; 
        sections.forEach(s => s.pieces.forEach(p => {
            const qty = (lanes === 4 && p.type === 'straight') ? 2 : 1;
            const name = getPieceName(p.id);
            const brandName = p.brand || 'AFX'; 
            const key = `${brandName} - ${name}`;
            counts[key] = (counts[key] || 0) + qty;
        }));
        return counts;
    }, [sections, lanes, lang]);

    // 當語言改變時，更新預設跑道名稱
    useEffect(() => {
        if (trackName === 'Track 01' && lang === 'zh') setTrackName('跑道01');
        if (trackName === '跑道01' && lang === 'en') setTrackName('Track 01');
    }, [lang]);

    // 自動隱藏通知
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // --- 輔助函式 ---
    const cmToInch = (cm) => cm / 2.54;
    const toRad = (deg) => deg * Math.PI / 180;

    const getCanvasCoordinates = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        
        let clientX, clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const pushHistory = (newSections) => {
        setHistory(prev => [...prev, sections]);
        setFuture([]);
        setSections(newSections);
    };

    const handleUndo = () => {
        if (history.length === 0) return;
        const prev = history[history.length - 1];
        setFuture(curr => [sections, ...curr]);
        setSections(prev);
        setHistory(curr => curr.slice(0, -1));
        setSelected(null);
    };

    const handleRedo = () => {
        if (future.length === 0) return;
        const next = future[0];
        setHistory(curr => [...curr, sections]);
        setSections(next);
        setFuture(curr => curr.slice(1));
        setSelected(null);
    };

    const reversePieces = (pieces) => {
        return pieces.slice().reverse().map(p => {
            if (p.type === 'curve') return { ...p, dir: p.dir * -1 }; 
            return p;
        });
    };

    const calculateSectionEndpoints = (sec) => {
        let x = sec.x; let y = sec.y; let h = sec.heading;
        sec.pieces.forEach(p => {
            if (p.isHairpin) {
                x += Math.cos(toRad(h)) * p.straightLength; y += Math.sin(toRad(h)) * p.straightLength;
                const r = p.radius; const dir = p.dir;
                const cA = h + (dir * 90);
                const cx = x + Math.cos(toRad(cA)) * r; const cy = y + Math.sin(toRad(cA)) * r;
                const eA = cA + 180 + p.degree * dir;
                x = cx + Math.cos(toRad(eA)) * r; y = cy + Math.sin(toRad(eA)) * r;
                h += p.degree * dir;
                x += Math.cos(toRad(h)) * p.straightLength; y += Math.sin(toRad(h)) * p.straightLength;
            } else if (p.type === 'straight') {
                x += Math.cos(toRad(h)) * p.length; y += Math.sin(toRad(h)) * p.length;
            } else {
                const r = p.radius; const dir = p.dir;
                const cA = h + (dir * 90);
                const cx = x + Math.cos(toRad(cA)) * r; const cy = y + Math.sin(toRad(cA)) * r;
                const eA = cA + 180 + p.degree * dir;
                x = cx + Math.cos(toRad(eA)) * r; y = cy + Math.sin(toRad(eA)) * r;
                h += p.degree * dir;
            }
        });
        return { start: { x: sec.x, y: sec.y, heading: sec.heading, type: 'start' }, end: { x, y, heading: h, type: 'end' } };
    };

    // --- Action Handlers ---
    
    const performSplit = (sectionId, pieceIndex) => {
        const secIndex = sections.findIndex(s => s.id === sectionId);
        if (secIndex === -1) return;
        const section = sections[secIndex];
        if (pieceIndex >= section.pieces.length - 1) return;
        const piecesBefore = section.pieces.slice(0, pieceIndex + 1);
        const piecesAfter = section.pieces.slice(pieceIndex + 1);
        let cx = section.x, cy = section.y, ch = section.heading;
        piecesBefore.forEach(p => {
             if (p.isHairpin) {
                const sl = p.straightLength;
                cx += Math.cos(toRad(ch)) * sl; cy += Math.sin(toRad(ch)) * sl;
                const cA = ch + (p.dir * 90);
                const ox = cx + Math.cos(toRad(cA)) * p.radius; const oy = cy + Math.sin(toRad(cA)) * p.radius;
                const eA = cA + 180 + p.degree * p.dir;
                cx = ox + Math.cos(toRad(eA)) * p.radius; cy = oy + Math.sin(toRad(eA)) * p.radius;
                ch += p.degree * p.dir;
                cx += Math.cos(toRad(ch)) * sl; cy += Math.sin(toRad(ch)) * sl;
             } else if (p.type === 'straight') {
                cx += Math.cos(toRad(ch)) * p.length; cy += Math.sin(toRad(ch)) * p.length;
            } else {
                const cA = ch + (p.dir * 90);
                const ox = cx + Math.cos(toRad(cA)) * p.radius; const oy = cy + Math.sin(toRad(cA)) * p.radius;
                const eA = cA + 180 + p.degree * p.dir;
                cx = ox + Math.cos(toRad(eA)) * p.radius; cy = oy + Math.sin(toRad(eA)) * p.radius;
                ch += p.degree * p.dir;
            }
        });
        cx += 2; cy += 2;
        const newSection1 = { ...section, pieces: piecesBefore };
        const newSection2 = { id: `sec_${Date.now()}`, x: cx, y: cy, heading: ch, pieces: piecesAfter };
        const newSections = [...sections];
        newSections.splice(secIndex, 1, newSection1, newSection2);
        pushHistory(newSections);
        setToolMode('select');
        setSelected({ sectionId: newSection2.id, pieceIndex: 0, pieceUid: piecesAfter[0].uid });
    };

    const handleSplitButtonClick = () => { setToolMode('split'); setSelected(null); };

    const rotateSection = (angle) => {
        if (!selected) return;
        const newSections = sections.map(sec => sec.id === selected.sectionId ? { ...sec, heading: sec.heading + angle } : sec);
        pushHistory(newSections);
    };

    const handleDelete = () => {
        if (!selected) return;
        const secIndex = sections.findIndex(s => s.id === selected.sectionId);
        if (secIndex === -1) return;
        const section = sections[secIndex];
        const pieceIndex = selected.pieceIndex;
        if (pieceIndex === 0 || pieceIndex === section.pieces.length - 1) {
            if (section.pieces.length === 1) {
                const newSections = sections.filter(s => s.id !== selected.sectionId);
                pushHistory(newSections);
                setSelected(null);
                return;
            }
            if (pieceIndex === 0) {
                 const firstPiece = section.pieces[0];
                 const p = firstPiece;
                 let newX = section.x, newY = section.y, newH = section.heading;
                 if (p.isHairpin) {
                     const r = p.radius; const dir = p.dir;
                     const dx = -2 * r * dir * Math.sin(toRad(newH));
                     const dy = 2 * r * dir * Math.cos(toRad(newH));
                     newX += dx; newY += dy; newH += p.degree * dir;
                 } else if (p.type === 'straight') {
                     newX += Math.cos(toRad(newH)) * p.length;
                     newY += Math.sin(toRad(newH)) * p.length;
                 } else {
                     const r = p.radius; const dir = p.dir;
                     const cA = newH + (dir * 90);
                     const cx = newX + Math.cos(toRad(cA)) * r; const cy = newY + Math.sin(toRad(cA)) * r;
                     const eA = cA + 180 + p.degree * dir;
                     newX = cx + Math.cos(toRad(eA)) * r; newY = cy + Math.sin(toRad(eA)) * r;
                     newH += p.degree * dir;
                 }
                 const newPieces = section.pieces.slice(1);
                 const newSections = [...sections];
                 newSections[secIndex] = { ...section, x: newX, y: newY, heading: newH, pieces: newPieces };
                 pushHistory(newSections);
                 setSelected(null);
            } else {
                 const newPieces = section.pieces.slice(0, -1);
                 const newSections = [...sections];
                 newSections[secIndex] = { ...section, pieces: newPieces };
                 pushHistory(newSections);
                 setSelected(null);
            }
        } else {
            performSplit(selected.sectionId, selected.pieceIndex, true); 
        }
    };

    const handleFlip = () => {
        if (!selected) return;
        const newSections = sections.map(sec => {
            if (sec.id === selected.sectionId) {
                const newPieces = [...sec.pieces];
                const piece = newPieces[selected.pieceIndex];
                if (piece.type === 'curve') {
                    newPieces[selected.pieceIndex] = { ...piece, dir: piece.dir * -1 };
                }
                return { ...sec, pieces: newPieces };
            }
            return sec;
        });
        pushHistory(newSections);
    };

    const addPiece = (pieceKey, turnDirection = 1) => {
        const pieceData = TRACK_DATA[activeBrand].pieces[pieceKey];
        if (!pieceData) return;
        if (toolMode === 'split') setToolMode('select');
        const newPiece = { ...pieceData, brand: activeBrand, dir: turnDirection, uid: Date.now() + Math.random() };
        const newSections = [...sections];
        let targetSectionIndex = sections.length - 1;
        if (selected) targetSectionIndex = sections.findIndex(s => s.id === selected.sectionId);
        
        let canConnect = true;
        let existingBrand = null;
        if (targetSectionIndex !== -1 && newSections[targetSectionIndex].pieces.length > 0) {
             existingBrand = newSections[targetSectionIndex].pieces[0].brand || 'AFX';
             if (existingBrand !== activeBrand) canConnect = false;
        }

        if (targetSectionIndex === -1 || newSections.length === 0 || !canConnect) {
            newSections.push({ id: `sec_${Date.now()}`, x: 0, y: 0, heading: 0, pieces: [newPiece] });
            targetSectionIndex = newSections.length - 1;
            pushHistory(newSections);
            setSelected({ sectionId: newSections[targetSectionIndex].id, pieceIndex: 0, pieceUid: newPiece.uid });
        } else {
            const section = { ...newSections[targetSectionIndex] };
            const isCloserToStart = selected && (selected.pieceIndex < section.pieces.length / 2);
            if (isCloserToStart) {
                const targetEndHeading = section.heading;
                let newStartHeading = targetEndHeading;
                if (newPiece.type === 'curve') newStartHeading = targetEndHeading - (newPiece.degree * newPiece.dir);
                let dx = 0, dy = 0;
                if (newPiece.type === 'straight') {
                    dx = Math.cos(toRad(newStartHeading)) * newPiece.length;
                    dy = Math.sin(toRad(newStartHeading)) * newPiece.length;
                } else {
                    const r = newPiece.radius; const dir = newPiece.dir;
                    const cAngle = newStartHeading + (dir * 90);
                    const cx = Math.cos(toRad(cAngle)) * r; const cy = Math.sin(toRad(cAngle)) * r;
                    const sAng = toRad(cAngle + 180);
                    const sweep = toRad(newPiece.degree * dir);
                    const eAng = sAng + sweep;
                    dx = cx + Math.cos(eAng) * r; dy = cy + Math.sin(eAng) * r;
                }
                section.x -= dx; section.y -= dy;
                section.heading = newStartHeading;
                section.pieces = [newPiece, ...section.pieces];
                newSections[targetSectionIndex] = section;
                pushHistory(newSections);
                setSelected({ sectionId: section.id, pieceIndex: 0, pieceUid: newPiece.uid });
            } else {
                section.pieces = [...section.pieces, newPiece];
                newSections[targetSectionIndex] = section;
                pushHistory(newSections);
                setSelected({ sectionId: section.id, pieceIndex: section.pieces.length - 1, pieceUid: newPiece.uid });
            }
        }
    };

    // --- MOUSE HANDLERS ---
    const handleMouseDown = (e) => {
        const pos = getCanvasCoordinates(e);
        if (e.button === 1 || toolMode === 'pan') {
            setIsPanning(true);
            setPanStart(pos);
            return;
        }

        if (toolMode === 'split') {
            // FIX: iPad touch split support - Calculate nearest joint on click/tap
            let bestJoint = null;
            let minJointDist = 30; 
            jointsRef.current.forEach(joint => {
                const dist = Math.sqrt(Math.pow(pos.x - joint.x, 2) + Math.pow(pos.y - joint.y, 2));
                if (dist < minJointDist) { minJointDist = dist; bestJoint = joint; }
            });
            
            if (bestJoint) { 
                performSplit(bestJoint.sectionId, bestJoint.pieceIndex); 
            } else { 
                setToolMode('select'); 
            }
            return;
        }
        
        let hit = null; let minD = 30;
        for (let i = hitRegionsRef.current.length - 1; i >= 0; i--) {
            const region = hitRegionsRef.current[i];
            let d = Infinity;
            if (region.type === 'line') {
                const {x1, y1, x2, y2} = region;
                const A = pos.x - x1, B = pos.y - y1, C = x2 - x1, D = y2 - y1;
                const dot = A * C + B * D, len_sq = C * C + D * D;
                let param = -1; if (len_sq !== 0) param = dot / len_sq;
                let xx, yy; if (param < 0) { xx = x1; yy = y1; } else if (param > 1) { xx = x2; yy = y2; } else { xx = x1 + param * C; yy = y1 + param * D; }
                const dx = pos.x - xx, dy = pos.y - yy; d = Math.sqrt(dx * dx + dy * dy);
            } else if (region.type === 'arc') {
                const dx = pos.x - region.cx, dy = pos.y - region.cy;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const distDiff = Math.abs(dist - region.r);
                if (distDiff < minD) {
                    let angle = Math.atan2(dy, dx) - region.sAng;
                    while (angle <= -Math.PI) angle += 2*Math.PI; while (angle > Math.PI) angle -= 2*Math.PI;
                    const tol = 0.3;
                    if (region.dir === 1) { if (angle >= -tol && angle <= region.sweep + tol) d = Math.abs(dist - region.r); }
                    else { if (angle >= -region.sweep - tol && angle <= tol) d = Math.abs(dist - region.r); }
                }
            }
            if (d < minD) { minD = d; hit = region; }
        }
        
        if (hit) {
            setSelected({ sectionId: hit.sectionId, pieceIndex: hit.index, pieceUid: hit.uid });
            setIsDragging(true); 
            setDragStart(pos);
            const sec = sections.find(s => s.id === hit.sectionId);
            if (sec) setSectionStartPos({ x: sec.x, y: sec.y });
        } else { 
            setSelected(null);
        }
    };

    const handleMouseMove = (e) => {
        const pos = getCanvasCoordinates(e);
        
        if (isPanning) {
            const dx = (pos.x - panStart.x);
            const dy = (pos.y - panStart.y);
            setViewTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
            setPanStart(pos);
            return;
        }

        if (toolMode === 'split') {
            let bestJoint = null; let minJointDist = 20;
            jointsRef.current.forEach(joint => {
                const dist = Math.sqrt(Math.pow(pos.x - joint.x, 2) + Math.pow(pos.y - joint.y, 2));
                if (dist < minJointDist) { minJointDist = dist; bestJoint = joint; }
            });
            setHoveredJoint(bestJoint); return;
        }
        if (!isDragging || !selected) return;
        const scale = scaleRef.current;
        
        const totalScale = scale * viewTransform.k;
        const dxInch = (pos.x - dragStart.x) / totalScale; 
        const dyInch = (pos.y - dragStart.y) / totalScale;
        
        const newX = sectionStartPos.x + dxInch; 
        const newY = sectionStartPos.y + dyInch;
        
        let bestSnap = null; let minSnapDist = 1.0;
        const draggingSection = sections.find(s => s.id === selected.sectionId);
        if (!draggingSection) return;
        const tempDragSection = { ...draggingSection, x: newX, y: newY };
        const dragPoints = calculateSectionEndpoints(tempDragSection); const dragSnapPoints = [dragPoints.start, dragPoints.end];
        
        const draggedBrand = draggingSection.pieces.length > 0 ? (draggingSection.pieces[0].brand || 'AFX') : 'AFX';

        sections.forEach(targetSec => {
            if (targetSec.id === selected.sectionId) return;
            const targetBrand = targetSec.pieces.length > 0 ? (targetSec.pieces[0].brand || 'AFX') : 'AFX';
            if (draggedBrand !== targetBrand) return; 

            const targetPoints = calculateSectionEndpoints(targetSec); const targetSnapPoints = [targetPoints.start, targetPoints.end];
            dragSnapPoints.forEach(dragPt => {
                targetSnapPoints.forEach(targetPt => {
                    const dist = Math.sqrt(Math.pow(dragPt.x - targetPt.x, 2) + Math.pow(dragPt.y - targetPt.y, 2));
                    if (dist < minSnapDist) { minSnapDist = dist; bestSnap = { targetSectionId: targetSec.id, targetEnd: targetPt.type, sourceEnd: dragPt.type, targetPoint: targetPt, sourcePoint: dragPt }; }
                });
            });
        });
        setSnapCandidate(bestSnap);
        setSections(prev => prev.map(sec => { if (sec.id === selected.sectionId) return { ...sec, x: newX, y: newY }; return sec; }));
    };

    const handleMouseUp = () => {
        if (isDragging) {
            if (snapCandidate) {
                const draggedSecIdx = sections.findIndex(s => s.id === selected.sectionId);
                const targetSecIdx = sections.findIndex(s => s.id === snapCandidate.targetSectionId);
                if (draggedSecIdx !== -1 && targetSecIdx !== -1) {
                    const draggedSec = sections[draggedSecIdx]; const targetSec = sections[targetSecIdx];
                    const anchor = snapCandidate.targetPoint; const targetHeadingForSource = anchor.heading;
                    let finalX, finalY, finalHeading;
                    let piecesToMerge = draggedSec.pieces;
                    const needReverse = (snapCandidate.sourceEnd === snapCandidate.targetEnd);
                    if (needReverse) piecesToMerge = reversePieces(piecesToMerge);
                    const attachHead = (snapCandidate.sourceEnd === 'start' && !needReverse) || (snapCandidate.sourceEnd === 'end' && needReverse);
                    if (attachHead) { finalX = anchor.x; finalY = anchor.y; finalHeading = targetHeadingForSource; } else {
                        const rel = calculateSectionEndpoints({ ...draggedSec, pieces: piecesToMerge, x:0, y:0, heading: 0 }).end;
                        const totalChange = rel.heading; finalHeading = targetHeadingForSource - totalChange;
                        const newRel = calculateSectionEndpoints({ ...draggedSec, pieces: piecesToMerge, x:0, y:0, heading: finalHeading }).end;
                        finalX = anchor.x - newRel.x; finalY = anchor.y - newRel.y;
                    }
                    let mergedPieces = null;
                    const addToTargetTail = (anchor.type === 'end'); const dragIsHead = attachHead;
                    if (addToTargetTail && dragIsHead) mergedPieces = [...targetSec.pieces, ...piecesToMerge];
                    else if (!addToTargetTail && !dragIsHead) mergedPieces = [...piecesToMerge, ...targetSec.pieces];
                    else { if (addToTargetTail) mergedPieces = [...targetSec.pieces, ...piecesToMerge]; else mergedPieces = [...piecesToMerge, ...targetSec.pieces]; }
                    const newSecList = [...sections];
                    if (mergedPieces) {
                        const isDragFirst = !addToTargetTail;
                        const finalSec = { ...targetSec, pieces: mergedPieces, ...(isDragFirst ? { x: finalX, y: finalY, heading: finalHeading } : { x: targetSec.x, y: targetSec.y, heading: targetSec.heading }) };
                        const listWithoutDrag = newSecList.filter(s => s.id !== draggedSec.id);
                        const targetIdx = listWithoutDrag.findIndex(s => s.id === targetSec.id);
                        listWithoutDrag[targetIdx] = finalSec;
                        pushHistory(listWithoutDrag);
                        setSelected({ sectionId: finalSec.id, pieceIndex: 0, pieceUid: finalSec.pieces[0].uid });
                    } else {
                        const updatedSec = { ...draggedSec, x: finalX, y: finalY, heading: finalHeading };
                        const idx = newSecList.findIndex(s => s.id === draggedSec.id);
                        newSecList[idx] = updatedSec;
                        pushHistory(newSecList);
                    }
                }
            } else { pushHistory(sections); }
            setIsDragging(false); setSnapCandidate(null);
        }
        setIsPanning(false);
    };

    const handleWheel = useCallback((e) => {
        e.preventDefault(); 
        const scaleAmount = -e.deltaY * 0.001;
        const newScale = Math.min(Math.max(0.1, viewTransform.k * (1 + scaleAmount)), 5);
        setViewTransform(prev => ({ ...prev, k: newScale }));
    }, [viewTransform]);

    // --- TOUCH HANDLERS (Must be after Mouse Handlers) ---
    const handleTouchStart = (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
            const cx = (t1.clientX + t2.clientX) / 2;
            const cy = (t1.clientY + t2.clientY) / 2;
            
            touchStartDist.current = dist;
            touchStartScale.current = viewTransform.k;
            touchStartPan.current = { x: cx, y: cy };
            touchStartView.current = { x: viewTransform.x, y: viewTransform.y }; 
        } else if (e.touches.length === 1) {
             // 1 Finger: Try Hit Detection
             handleMouseDown(e.touches[0]);
        }
    };

    const handleTouchMove = (e) => {
         if (e.touches.length === 2) {
            e.preventDefault();
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
            
            // Calculate Scale
            const scaleFactor = dist / touchStartDist.current;
            const newScale = Math.min(Math.max(0.1, touchStartScale.current * scaleFactor), 5);
            
            // Calculate Pan Delta (from start)
            const cx = (t1.clientX + t2.clientX) / 2;
            const cy = (t1.clientY + t2.clientY) / 2;
            const dx = cx - touchStartPan.current.x;
            const dy = cy - touchStartPan.current.y;
            
            // Apply absolute transform (base view + delta) to avoid speed compounding
            setViewTransform(prev => ({
                ...prev,
                k: newScale,
                x: touchStartView.current.x + dx,
                y: touchStartView.current.y + dy
            }));
         } else if (e.touches.length === 1) {
             // 1 Finger: Delegate to handleMouseMove
             handleMouseMove(e.touches[0]);
         }
    };
    
    const handleTouchEnd = (e) => {
        handleMouseUp();
    };

    // --- File & Save Handlers ---
    const handleSaveTrack = () => {
        const trackData = {
            formatVersion: FILE_FORMAT_VERSION,
            appVersion: APP_VERSION,
            timestamp: new Date().toISOString(),
            settings: { trackName, lanes, unit, tableWidth, tableDepth, lang },
            data: { sections },
            view: viewTransform 
        };
        const jsonString = JSON.stringify(trackData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const safeName = trackName.replace(/[^a-z0-9\u4e00-\u9fa5]/gi, '_').substring(0, 50) || 'track';
        link.download = `${safeName}.json`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleLoadTrackClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; 
            fileInputRef.current.click();
        }
    };

    const executeLoad = (json) => {
        const s = json.settings;
        if (s.trackName) setTrackName(s.trackName);
        if (s.lanes) setLanes(s.lanes);
        if (s.unit) setUnit(s.unit);
        if (s.tableWidth) setTableWidth(s.tableWidth);
        if (s.tableDepth) setTableDepth(s.tableDepth);

        if (json.data.sections && Array.isArray(json.data.sections)) {
            pushHistory(sections); 
            setSelected(null);
            setToolMode('select');
            const loadedSections = json.data.sections.map(sec => ({
                ...sec,
                pieces: sec.pieces.map(p => ({ ...p, brand: p.brand || 'AFX' }))
            }));
            setSections(loadedSections);
            setViewTransform({ x: 0, y: 0, k: 1 });
            setFuture([]); 
            setNotification({ msg: t('load_success'), type: 'success' });
        }
        setShowLoadConfirm(false);
        setPendingLoadData(null);
        setShowSettings(false); 
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target.result);
                if (!json.formatVersion || !json.data || !json.settings) {
                    setNotification({ msg: t('file_error'), type: 'error' });
                    return;
                }
                const isEmpty = sections.length === 1 && sections[0].pieces.length === 0;
                if (!isEmpty) {
                    setPendingLoadData(json);
                    setShowLoadConfirm(true);
                } else {
                    executeLoad(json);
                }
            } catch (err) {
                setNotification({ msg: t('file_error'), type: 'error' });
            }
        };
        reader.readAsText(file);
    };

    const executeClearAll = () => {
        const initialSections = [{ id: 'main', x: 0, y: 0, heading: 0, pieces: [] }];
        pushHistory(sections); 
        setSelected(null);
        setToolMode('select');
        setSections(initialSections);
        setViewTransform({ x: 0, y: 0, k: 1 }); 
        setFuture([]); 
        setShowClearConfirm(false);
        setNotification({ msg: t('clear_success'), type: 'success' });
    };

    const clearAll = () => {
        const isEmpty = sections.length === 0 || (sections.length === 1 && sections[0].pieces.length === 0);
        if (isEmpty) return;
        setShowClearConfirm(true);
    };

    const handleExportCSV = () => {
        let csvContent = `\uFEFF${t('csv_header_part')},${t('brand_col')},${t('csv_header_qty')}\n`;
        Object.entries(bom).forEach(([key, count]) => {
            const [brand, name] = key.split(' - ');
            csvContent += `${name},${brand},${count}\n`;
        });
        const fileName = (trackName.trim() || 'track') + '.csv';
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportImage = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const footerHeight = 60; 
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height + footerHeight;
        
        const tCtx = tempCanvas.getContext('2d');
        tCtx.fillStyle = '#ffffff';
        tCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        renderScene(tCtx, canvas.width, canvas.height, true);

        tCtx.save();
        tCtx.fillStyle = '#1e293b'; 
        let fontSize = 24;
        tCtx.font = `bold ${fontSize}px sans-serif`;
        const wInch = (trackBoundsRef.current.maxX - trackBoundsRef.current.minX).toFixed(1);
        const hInch = (trackBoundsRef.current.maxY - trackBoundsRef.current.minY).toFixed(1);
        const infoText = `${trackName.trim() || t('track_name')}  |  ${t('img_dim')}: ${tableWidth} x ${tableDepth} ${unit}  |  ${t('total_length')}: ${formatLength(trackStats.displayLength)}  |  ${t('img_area')}: ${wInch}" x ${hInch}"`;
        const textMetrics = tCtx.measureText(infoText);
        const maxTextWidth = tempCanvas.width - 40; 
        if (textMetrics.width > maxTextWidth) {
            const ratio = maxTextWidth / textMetrics.width;
            fontSize = Math.floor(fontSize * ratio);
            tCtx.font = `bold ${fontSize}px sans-serif`;
        }
        tCtx.textAlign = 'center';
        tCtx.textBaseline = 'middle';
        tCtx.fillText(infoText, tempCanvas.width / 2, canvas.height + footerHeight / 2);
        tCtx.restore();

        const fileName = (trackName.trim() || 'track') + '.png';

        // iOS Export Fix & PC Blob Download Fix
        // Use createObjectURL for PC to force download, Share API for Mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 0 && /MacIntel/.test(navigator.userAgent)); // iPad detection

        tempCanvas.toBlob(async (blob) => {
             if (!blob) return;
             
             if (isMobile && navigator.canShare && navigator.canShare({ files: [new File([blob], fileName, { type: 'image/png' })] })) {
                 const file = new File([blob], fileName, { type: 'image/png' });
                 try {
                     await navigator.share({
                         files: [file],
                         title: 'Slot Car Track',
                     });
                 } catch (err) {
                     console.error("Share failed", err);
                 }
             } else {
                 // Desktop Fallback: Force Download
                 const url = URL.createObjectURL(blob);
                 const link = document.createElement('a');
                 link.download = fileName;
                 link.href = url;
                 document.body.appendChild(link);
                 link.click();
                 document.body.removeChild(link);
                 URL.revokeObjectURL(url);
             }
        }, 'image/png');
    };

    const renderScene = useCallback((ctx, width, height, isExport = false) => {
        // --- 1. 定義所有變數，確保作用域正確 ---
        let baseSlotOffsets = lanes === 4 ? [-2.25, -0.75, 0.75, 2.25] : [-0.75, 0.75];
        let totalLen = 0; 
        let minTx = Infinity, maxTx = -Infinity, minTy = Infinity, maxTy = -Infinity;
        let finalX = 0; 
        let finalY = 0;
        let maxSecLen = 0;
        let selectedSecLen = 0;
        let endXWorld, endYWorld; 

        ctx.clearRect(0, 0, width, height);

        const tableWInch = unit === 'cm' ? cmToInch(tableWidth) : tableWidth; 
        const tableDInch = unit === 'cm' ? cmToInch(tableDepth) : tableDepth;
        
        const marginPx = isExport ? 60 : 60; 
        const scaleX = (width - marginPx * 2) / tableWInch; 
        const scaleY = (height - marginPx * 2) / tableDInch;
        const baseScale = Math.min(scaleX, scaleY);
        
        if (!isExport) scaleRef.current = baseScale;
        
        const tablePxW = tableWInch * baseScale; 
        const tablePxH = tableDInch * baseScale;
        const baseStartX = (width - tablePxW) / 2; 
        const baseStartY = (height - tablePxH) / 2;
        
        const effectiveScale = isExport ? baseScale : (baseScale * viewTransform.k);
        const effectiveOffsetX = isExport ? baseStartX : (baseStartX + viewTransform.x);
        const effectiveOffsetY = isExport ? baseStartY : (baseStartY + viewTransform.y);
        
        const worldToScreen = (wx, wy) => {
             return {
                 x: effectiveOffsetX + (tableWInch * effectiveScale)/2 + wx * effectiveScale,
                 y: effectiveOffsetY + (tableDInch * effectiveScale)/2 + wy * effectiveScale
             };
        };

        if (!isExport) { 
            viewParamsRef.current = { startX: effectiveOffsetX, startY: effectiveOffsetY, scale: effectiveScale, tablePxW: tableWInch*effectiveScale, tablePxH: tableDInch*effectiveScale }; 
        }
        
        ctx.fillStyle = '#f8fafc'; 
        ctx.fillRect(effectiveOffsetX, effectiveOffsetY, tableWInch*effectiveScale, tableDInch*effectiveScale);
        ctx.strokeStyle = '#cbd5e1'; 
        ctx.lineWidth = 2 * (isExport ? 1 : viewTransform.k); 
        ctx.strokeRect(effectiveOffsetX, effectiveOffsetY, tableWInch*effectiveScale, tableDInch*effectiveScale);
        
        if (!isExport) { 
            ctx.fillStyle = '#94a3b8'; 
            ctx.font = '12px sans-serif'; 
            ctx.fillText(`${t('width')}: ${tableWidth} x ${t('depth')}: ${tableDepth} ${unit}`, effectiveOffsetX + 10, effectiveOffsetY - 10); 
            hitRegionsRef.current = []; 
            jointsRef.current = []; 
        }

        const bodyWidth = (lanes === 4 ? 6 : 3) * effectiveScale; 
        const laneWidth = 2 * (effectiveScale / 12);
        const laneColors = lanes === 4 ? ['#ef4444', '#3b82f6', '#eab308', '#3b82f6'] : ['#ef4444', '#3b82f6'];
        const scale = effectiveScale; 

        if (!isExport && previewPiece && !isDragging) {
            let targetSec = sections[sections.length - 1];
            if (selected) targetSec = sections.find(s => s.id === selected.sectionId) || targetSec;
            let startPt, startHeading;
            if (!targetSec) { startPt = worldToScreen(0, 0); startHeading = 0; } else {
                const pts = calculateSectionEndpoints(targetSec);
                const isPrepend = selected && (selected.pieceIndex < targetSec.pieces.length / 2);
                if (isPrepend) {
                    const targetEndH = pts.start.heading; let newStartH = targetEndH;
                    if (previewPiece.type === 'curve') newStartH = targetEndH - (previewPiece.degree * previewPiece.dir);
                    let dx=0, dy=0;
                    if (previewPiece.type === 'straight') { dx = Math.cos(toRad(newStartH)) * previewPiece.length; dy = Math.sin(toRad(newStartH)) * previewPiece.length; } else {
                        const r = previewPiece.radius; const dir = previewPiece.dir;
                        const cA = newStartH + (dir*90); const sAng = toRad(cA+180); const eAng = sAng + toRad(previewPiece.degree*dir);
                        const cx = Math.cos(toRad(cA))*r; const cy = Math.sin(toRad(cA))*r;
                        dx = cx + Math.cos(eAng)*r; dy = cy + Math.sin(eAng)*r;
                    }
                    startPt = worldToScreen(pts.start.x - dx, pts.start.y - dy); startHeading = newStartH;
                } else { startPt = worldToScreen(pts.end.x, pts.end.y); startHeading = pts.end.heading; }
            }
            ctx.globalAlpha = 0.5; ctx.lineCap = 'butt'; ctx.lineWidth = bodyWidth; ctx.strokeStyle = '#9ca3af'; ctx.setLineDash([5, 5]); ctx.beginPath();
            if (previewPiece.isHairpin) {
                 const slPx = previewPiece.straightLength * scale; const rPx = previewPiece.radius * scale;
                 let tempX = startPt.x, tempY = startPt.y, tempH = startHeading;
                 let ex = tempX + Math.cos(toRad(tempH)) * slPx; let ey = tempY + Math.sin(toRad(tempH)) * slPx;
                 ctx.moveTo(tempX, tempY); ctx.lineTo(ex, ey); tempX = ex; tempY = ey;
                 const dir = previewPiece.dir; const cAngle = tempH + (dir * 90); const cAngRad = toRad(cAngle);
                 const cxScreen = tempX + Math.cos(cAngRad) * rPx; const cyScreen = tempY + Math.sin(cAngRad) * rPx;
                 const sAng = toRad(cAngle + 180); const sweep = toRad(previewPiece.degree); const eAng = sAng + sweep * dir;
                 ctx.arc(cxScreen, cyScreen, rPx, sAng, eAng, dir === -1);
                 const endAngTotal = tempH + (dir * 90) + 180 + (previewPiece.degree * dir);
                 tempH += previewPiece.degree * dir;
                 tempX = cxScreen + Math.cos(toRad(endAngTotal)) * rPx; tempY = cyScreen + Math.sin(toRad(endAngTotal)) * rPx;
                 ex = tempX + Math.cos(toRad(tempH)) * slPx; ey = tempY + Math.sin(toRad(tempH)) * slPx;
                 ctx.moveTo(tempX, tempY); ctx.lineTo(ex, ey);
            } else if (previewPiece.type === 'straight') {
                const len = previewPiece.length * scale;
                const endX = startPt.x + Math.cos(toRad(startHeading)) * len; const endY = startPt.y + Math.sin(toRad(startHeading)) * len;
                ctx.moveTo(startPt.x, startPt.y); ctx.lineTo(endX, endY);
            } else {
                const r = previewPiece.radius * scale; const rPx = r; const dir = previewPiece.dir;
                const cAngle = startHeading + (dir * 90); const cAngRad = toRad(cAngle);
                const cxScreen = startPt.x + Math.cos(cAngRad) * rPx; const cyScreen = startPt.y + Math.sin(cAngRad) * rPx;
                const sAng = toRad(cAngle + 180); const sweep = toRad(previewPiece.degree); const eAng = sAng + sweep * dir;
                ctx.arc(cxScreen, cyScreen, rPx, sAng, eAng, dir === -1);
            }
            ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1.0;
        }

        // Draw Sections
        sections.forEach((sec, secIdx) => {
            let curX = sec.x; let curY = sec.y; let heading = sec.heading; let currentLaneOffsets = [...baseSlotOffsets];
            let currentSecLen = 0; 
            const secBrand = sec.pieces.length > 0 ? (sec.pieces[0].brand || 'AFX') : 'AFX';
            const secColor = TRACK_DATA[secBrand].trackColor || '#334155';

            sec.pieces.forEach((p, idx) => {
                const isSelected = !isExport && selected && selected.pieceUid === p.uid;
                const startPt = worldToScreen(curX, curY); const startHeading = heading; let endPt;
                
                let pLen = 0;
                if (p.isHairpin) { pLen = (p.straightLength * 2) + (Math.PI * p.radius); } 
                else if (p.type === 'straight') pLen = p.length; 
                else pLen = (2 * Math.PI * p.radius) * (p.degree / 360);
                currentSecLen += pLen;

                let hitData = { uid: p.uid, sectionId: sec.id, index: idx };
                ctx.lineCap = 'butt'; ctx.lineWidth = bodyWidth; 
                ctx.strokeStyle = isSelected ? '#fbbf24' : secColor;
                
                if (p.isHairpin) {
                    const sl = p.straightLength; const slPx = sl * scale; const r = p.radius; const rPx = r * scale; const dir = p.dir;
                    ctx.beginPath();
                    endXWorld = curX + Math.cos(toRad(heading)) * sl; endYWorld = curY + Math.sin(toRad(heading)) * sl;
                    let p1 = worldToScreen(curX, curY); let p2 = worldToScreen(endXWorld, endYWorld);
                    ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
                    curX = endXWorld; curY = endYWorld;
                    const cAngle = heading + (dir * 90); const cAngRad = toRad(cAngle);
                    const cxScreen = p2.x + Math.cos(cAngRad) * rPx; const cyScreen = p2.y + Math.sin(cAngRad) * rPx;
                    const sAng = toRad(cAngle + 180); const sweep = toRad(p.degree); const eAng = sAng + sweep * dir;
                    ctx.arc(cxScreen, cyScreen, rPx, sAng, eAng, dir === -1);
                    if (!isExport) { hitData.type = 'arc'; hitData.cx = cxScreen; hitData.cy = cyScreen; hitData.r = rPx; hitData.sAng = sAng; hitData.sweep = sweep; hitData.dir = dir; }
                    const endAngTotal = heading + (dir * 90) + 180 + (p.degree * dir);
                    const cxWorld = curX + Math.cos(toRad(cAngle)) * r; const cyWorld = curY + Math.sin(toRad(cAngle)) * r;
                    curX = cxWorld + Math.cos(toRad(endAngTotal)) * r; curY = cyWorld + Math.sin(toRad(endAngTotal)) * r;
                    heading += p.degree * dir;
                    endXWorld = curX + Math.cos(toRad(heading)) * sl; endYWorld = curY + Math.sin(toRad(heading)) * sl;
                    let p3 = worldToScreen(curX, curY); let p4 = worldToScreen(endXWorld, endYWorld);
                    ctx.moveTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y);
                    ctx.stroke();
                    if (isSelected) { ctx.lineWidth = bodyWidth + 4; ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)'; ctx.stroke(); }
                    if (!isExport) hitRegionsRef.current.push(hitData);
                    curX = endXWorld; curY = endYWorld; endPt = p4;
                    ctx.lineWidth = laneWidth * (isExport ? 1 : viewTransform.k); 
                    let nextLaneOffsets = [...currentLaneOffsets];
                    currentLaneOffsets.forEach((offset, i) => {
                        ctx.strokeStyle = laneColors[i]; ctx.beginPath(); const offsetPx = offset * scale;
                        const nx1 = -Math.sin(toRad(startHeading)); const ny1 = Math.cos(toRad(startHeading));
                        const ls1 = p1.x + nx1 * offsetPx; const ls1y = p1.y + ny1 * offsetPx; const le1 = p2.x + nx1 * offsetPx; const le1y = p2.y + ny1 * offsetPx;
                        ctx.moveTo(ls1, ls1y); ctx.lineTo(le1, le1y);
                        const rAdj = Math.max(0, p.radius - (offset * dir)) * scale; ctx.arc(cxScreen, cyScreen, rAdj, sAng, eAng, dir === -1);
                        const nx2 = -Math.sin(toRad(heading)); const ny2 = Math.cos(toRad(heading));
                        const le2 = p4.x + nx2 * offsetPx; const le2y = p4.y + ny2 * offsetPx;
                        ctx.lineTo(le2, le2y); ctx.stroke();
                    });
                } else if (p.type === 'straight') {
                    const len = p.length; endXWorld = curX + Math.cos(toRad(heading)) * len; endYWorld = curY + Math.sin(toRad(heading)) * len;
                    curX = endXWorld; curY = endYWorld; endPt = worldToScreen(curX, curY);
                    minTx = Math.min(minTx, curX); maxTx = Math.max(maxTx, curX); minTy = Math.min(minTy, curY); maxTy = Math.max(maxTy, curY);
                    ctx.beginPath(); ctx.moveTo(startPt.x, startPt.y); ctx.lineTo(endPt.x, endPt.y); ctx.stroke();
                    if (isSelected) { ctx.lineWidth = bodyWidth + 4; ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)'; ctx.stroke(); }
                    if (!isExport) { hitData.type = 'line'; hitData.x1 = startPt.x; hitData.y1 = startPt.y; hitData.x2 = endPt.x; hitData.y2 = endPt.y; hitRegionsRef.current.push(hitData); }
                    ctx.lineWidth = laneWidth; let nextLaneOffsets = [...currentLaneOffsets]; if (p.isLaneChanger) nextLaneOffsets.reverse();
                    currentLaneOffsets.forEach((startOffset, i) => {
                        const endOffset = nextLaneOffsets[i]; ctx.strokeStyle = laneColors[i]; ctx.beginPath();
                        const startOffsetPx = startOffset * scale; const endOffsetPx = endOffset * scale;
                        const hRad = toRad(startHeading); const nx = -Math.sin(hRad); const ny = Math.cos(hRad);
                        const sx = startPt.x + nx * startOffsetPx; const sy = startPt.y + ny * startOffsetPx; const ex = endPt.x + nx * endOffsetPx; const ey = endPt.y + ny * endOffsetPx;
                        if (p.isSqueeze) {
                            const forwardX = Math.cos(hRad); const forwardY = Math.sin(hRad); const midOffsetPx = startOffsetPx * 0.3; const lenPx = p.length * scale;
                            const cp1x = startPt.x + forwardX * (lenPx * 0.33) + nx * midOffsetPx; const cp1y = startPt.y + forwardY * (lenPx * 0.33) + ny * midOffsetPx;
                            const cp2x = startPt.x + forwardX * (lenPx * 0.66) + nx * midOffsetPx; const cp2y = startPt.y + forwardY * (lenPx * 0.66) + ny * midOffsetPx;
                            ctx.moveTo(sx, sy); ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, ex, ey);
                        } else { ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); }
                        ctx.stroke();
                    });
                    currentLaneOffsets = nextLaneOffsets;
                } else {
                    const r = p.radius; const dir = p.dir; const cAngle = startHeading + (dir * 90);
                    const cxWorld = curX + Math.cos(toRad(cAngle)) * r; const cyWorld = curY + Math.sin(toRad(cAngle)) * r;
                    const endAngTotal = heading + (dir * 90) + 180 + (p.degree * dir);
                    curX = cxWorld + Math.cos(toRad(endAngTotal)) * r; curY = cyWorld + Math.sin(toRad(endAngTotal)) * r;
                    heading += p.degree * dir; endPt = worldToScreen(curX, curY);
                    minTx = Math.min(minTx, curX - p.radius); maxTx = Math.max(maxTx, curX + p.radius); minTy = Math.min(minTy, curY - p.radius); maxTy = Math.max(maxTy, curY + p.radius);
                    const rPx = r * scale; const cAngRad = toRad(cAngle);
                    const cxScreen = startPt.x + Math.cos(cAngRad) * rPx; const cyScreen = startPt.y + Math.sin(cAngRad) * rPx;
                    const sAng = toRad(cAngle + 180); const sweep = toRad(p.degree); const eAng = sAng + sweep * dir;
                    ctx.beginPath(); ctx.arc(cxScreen, cyScreen, rPx, sAng, eAng, dir === -1); ctx.stroke();
                    if (isSelected) { ctx.lineWidth = bodyWidth + 4; ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)'; ctx.stroke(); }
                    if (!isExport) { hitData.type = 'arc'; hitData.cx = cxScreen; hitData.cy = cyScreen; hitData.r = rPx; hitData.sAng = sAng; hitData.sweep = sweep; hitData.dir = dir; hitRegionsRef.current.push(hitData); }
                    ctx.lineWidth = laneWidth;
                    currentLaneOffsets.forEach((startOffset, i) => {
                        ctx.strokeStyle = laneColors[i]; ctx.beginPath();
                        const rAdj = Math.max(0, p.radius - (startOffset * dir)) * scale;
                        ctx.arc(cxScreen, cyScreen, rAdj, sAng, eAng, dir === -1); ctx.stroke();
                    });
                }
                
                if (!isExport && idx < sec.pieces.length - 1) { 
                    jointsRef.current.push({ x: endPt.x, y: endPt.y, sectionId: sec.id, pieceIndex: idx, heading: heading }); 
                }
                
                if (p.type === 'straight' && ((p.id && (p.id.startsWith('TERM') || p.id === 'SQ9' || p.id === 'SQ15')) || p.isSqueeze)) {
                    const midX = (startPt.x + endPt.x) / 2; const midY = (startPt.y + endPt.y) / 2;
                    ctx.save(); ctx.translate(midX, midY); ctx.rotate(toRad(startHeading));
                    if (p.id && p.id.startsWith('TERM')) { const boxS = 4; ctx.fillStyle = '#fff'; ctx.fillRect(-boxS, -bodyWidth/2, boxS*2, bodyWidth); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.rect(-boxS, -bodyWidth/2, boxS, bodyWidth/2); ctx.rect(0, 0, boxS, bodyWidth/2); ctx.fill(); } 
                    else if (p.isSqueeze) { ctx.strokeStyle = '#eab308'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-10, -bodyWidth/2); ctx.lineTo(0, 0); ctx.lineTo(10, -bodyWidth/2); ctx.moveTo(-10, bodyWidth/2); ctx.lineTo(0, 0); ctx.lineTo(10, bodyWidth/2); ctx.stroke(); }
                    ctx.restore();
                }
            });

            if (currentSecLen > maxSecLen) maxSecLen = currentSecLen;
            if (selected && sec.id === selected.sectionId) selectedSecLen = currentSecLen;
            
            const targetGapSectionId = selected ? selected.sectionId : (sections.length > 0 ? sections[0].id : null);
            if (sec.id === targetGapSectionId) {
                finalX = curX;
                finalY = curY;
            }
        });

        if (!isExport && toolMode === 'split') {
            jointsRef.current.forEach(joint => { ctx.beginPath(); ctx.arc(joint.x, joint.y, 4, 0, Math.PI*2); ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; ctx.fill(); });
            if (hoveredJoint) {
                const { x, y, heading } = hoveredJoint; ctx.save(); ctx.translate(x, y); ctx.rotate(toRad(heading));
                ctx.beginPath(); ctx.moveTo(0, -bodyWidth/2 - 10); ctx.lineTo(0, bodyWidth/2 + 10); ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3; ctx.setLineDash([4, 4]); ctx.stroke();
                ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI*2); ctx.fillStyle = '#ef4444'; ctx.fill(); ctx.restore();
                ctx.fillStyle = 'white'; ctx.font = '20px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('✂️', x, y - 25);
            }
        }
        if (!isExport) {
            setTrackStats({ displayLength: selected ? selectedSecLen : maxSecLen, maxLength: maxSecLen, width: maxTx - minTx, height: maxTy - minTy });
            trackBoundsRef.current = { minX: minTx, maxX: maxTx, minY: minTy, maxY: maxTy };
            if (snapCandidate) { const pt = worldToScreen(snapCandidate.targetPoint.x, snapCandidate.targetPoint.y); ctx.beginPath(); ctx.arc(pt.x, pt.y, 15, 0, Math.PI*2); ctx.fillStyle = 'rgba(34, 197, 94, 0.5)'; ctx.fill(); ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2; ctx.stroke(); }
            if (sections.length > 0) {
                 // Calculate gap for the target section
                 const targetGapSectionId = selected ? selected.sectionId : sections[0].id;
                 const targetSection = sections.find(s => s.id === targetGapSectionId);
                 if (targetSection) {
                     const startX = targetSection.x; const startY = targetSection.y;
                     const dx = finalX - startX; const dy = finalY - startY;
                     const gap = Math.sqrt(dx*dx + dy*dy);
                     setClosureStatus({ closed: gap < 0.2, gap: gap });
                 } else {
                     setClosureStatus({ closed: false, gap: 0 });
                 }
            }
        }
    }, [sections, selected, lanes, tableWidth, tableDepth, unit, snapCandidate, previewPiece, lang, toolMode, hoveredJoint, canvasSize, viewTransform, activeBrand]);

    useEffect(() => { const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); renderScene(ctx, canvasSize.width, canvasSize.height, false); }, [renderScene, canvasSize]);
    const scissorCursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>') 16 16, auto`;

    return (
        <div className="h-screen w-full bg-gray-50 font-sans relative overflow-hidden text-gray-800 select-none" onWheel={handleWheel} onContextMenu={(e) => e.preventDefault()}>
            <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} 
                className="absolute inset-0 w-full h-full touch-none z-0" 
                style={{ 
                    cursor: toolMode === 'split' ? scissorCursor : (isPanning ? 'grabbing' : (toolMode === 'pan' ? 'grab' : 'crosshair')),
                    touchAction: 'none', 
                    WebkitTouchCallout: 'none', 
                    WebkitUserSelect: 'none', 
                    userSelect: 'none'
                }} 
                onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} />
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" style={{ display: 'none' }} />
            
            {/* ... (Toasts and Modals remain same) ... */}
            {notification && (
                <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-xl text-sm font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5 z-50 ${notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                    {notification.type === 'error' ? <AlertTriangle size={16}/> : <CheckCircle size={16}/>}
                    {notification.msg}
                </div>
            )}

            {/* Load Confirm Modal */}
            {showLoadConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{t('load_confirm_title')}</h3>
                        <p className="text-gray-600 mb-6 text-sm">{t('load_confirm_msg')}</p>
                        <div className="flex gap-3">
                            <button onClick={() => { setShowLoadConfirm(false); setPendingLoadData(null); }} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">{t('cancel')}</button>
                            <button onClick={() => executeLoad(pendingLoadData)} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">{t('load_confirm_btn')}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Clear Confirm Modal */}
            {showClearConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{t('clear_confirm_title')}</h3>
                        <p className="text-gray-600 mb-6 text-sm">{t('clear_confirm_msg')}</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowClearConfirm(false)} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">{t('cancel')}</button>
                            <button onClick={executeClearAll} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">{t('clear_confirm_btn')}</button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Help Modal */}
            {showHelp && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setShowHelp(false)}>
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{t('help_title')}</h3>
                                <p className="text-xs text-gray-400">{APP_VERSION}</p>
                            </div>
                            <button onClick={() => setShowHelp(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                        </div>
                        <div className="space-y-4 text-sm text-gray-600">
                            <div>
                                <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-1"><MousePointer size={14}/> {t('help_mouse')}</h4>
                                <ul className="list-disc list-inside space-y-1 ml-1">
                                    <li>{t('help_mouse_select')}</li>
                                    <li>{t('help_mouse_pan')}</li>
                                    <li>{t('help_mouse_zoom')}</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-1"><Zap size={14}/> {t('help_features')}</h4>
                                <ul className="list-disc list-inside space-y-1 ml-1">
                                    <li>{t('help_brand')}</li>
                                    <li>{t('help_split')}</li>
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-1"><Info size={14}/> {t('help_specs')}</h4>
                                <ul className="list-disc list-inside space-y-1 ml-1">
                                    <li>{t('help_hairpin')}</li>
                                </ul>
                            </div>
                            <div className="pt-2 border-t mt-2">
                                <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-1"><ShieldCheck size={14}/> {t('help_about')}</h4>
                                <p className="text-xs text-gray-500">{t('help_privacy')}</p>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <button onClick={() => setShowHelp(false)} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">OK</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="absolute top-4 left-4 z-10 flex gap-2 pointer-events-none">
                {showUI && (
                    <div className="pointer-events-auto relative">
                        <button onClick={() => setShowSettings(!showSettings)} className="bg-white p-2 rounded-lg shadow-md border hover:bg-gray-50 text-gray-700 tooltip" title={t('settings')}><Settings size={20} /></button>
                        {/* ... (Settings Menu Same) ... */}
                        {showSettings && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white p-4 rounded-xl shadow-xl border animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase">{t('settings')}</h3>
                                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{APP_VERSION}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-4 border-b pb-4">
                                    <button onClick={handleSaveTrack} className="flex items-center justify-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 p-2 rounded text-xs font-bold border border-blue-200"><Save size={14} /> {t('save_track')}</button>
                                    <button onClick={handleLoadTrackClick} className="flex items-center justify-center gap-1 bg-green-50 text-green-700 hover:bg-green-100 p-2 rounded text-xs font-bold border border-green-200"><FolderOpen size={14} /> {t('load_track')}</button>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div><label className="text-xs text-gray-500 block mb-1">{t('track_name')}</label><input type="text" value={trackName} onChange={e => setTrackName(e.target.value)} placeholder={lang === 'en' ? "Track 01" : "跑道01"} className="w-full border rounded p-1" /></div>
                                    <div><label className="text-xs text-gray-500 block mb-1">{t('language')}</label><div className="flex border rounded overflow-hidden"><button onClick={() => setLang('en')} className={`flex-1 py-1 text-xs ${lang==='en'?'bg-blue-600 text-white':'bg-white hover:bg-gray-50'}`}>English</button><button onClick={() => setLang('zh')} className={`flex-1 py-1 text-xs ${lang==='zh'?'bg-blue-600 text-white':'bg-white hover:bg-gray-50'}`}>繁體中文</button></div></div>
                                    <div className="flex gap-2"><div className="flex-1"><label className="text-xs text-gray-500 block mb-1">{t('unit')}</label><div className="flex border rounded overflow-hidden"><button onClick={() => changeUnit('cm')} className={`flex-1 py-1 text-xs ${unit==='cm'?'bg-gray-200':'bg-white'}`}>cm</button><button onClick={() => changeUnit('in')} className={`flex-1 py-1 text-xs ${unit==='in'?'bg-gray-200':'bg-white'}`}>in</button></div></div></div>
                                    <div className="grid grid-cols-2 gap-2"><div><label className="text-xs text-gray-500 block mb-1">{t('width')}</label><input type="number" value={tableWidth} onChange={e=>setTableWidth(Number(e.target.value))} className="w-full border rounded p-1" /></div><div><label className="text-xs text-gray-500 block mb-1">{t('depth')}</label><input type="number" value={tableDepth} onChange={e=>setTableDepth(Number(e.target.value))} className="w-full border rounded p-1" /></div></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {showUI && (
                    <div className="pointer-events-auto flex bg-white rounded-lg shadow-md border overflow-hidden mr-2">
                        <button onClick={handleUndo} disabled={history.length===0} className="p-2 hover:bg-gray-50 disabled:opacity-50 text-gray-700 border-r" title={t('undo')}><Undo2 size={20}/></button>
                        <button onClick={handleRedo} disabled={future.length===0} className="p-2 hover:bg-gray-50 disabled:opacity-50 text-gray-700 border-r" title={t('redo')}><Redo2 size={20}/></button>
                        <button onClick={clearAll} className="p-2 hover:bg-red-50 text-red-600" title={t('clear_all')}><Eraser size={20}/></button>
                    </div>
                )}
                
                {showUI && (
                    <>
                        <div className="pointer-events-auto bg-white px-3 py-2 rounded-lg shadow-md border border-gray-200 text-sm font-bold text-gray-600 flex items-center gap-2 mr-2"><PenLine size={16} /> {t('total_length')}: {formatLength(trackStats.displayLength)}</div>
                        <div className={`pointer-events-auto flex items-center px-3 rounded-lg shadow-md border text-sm font-bold ${closureStatus.closed ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-500'}`}>{closureStatus.closed ? <><CheckCircle size={16} className="mr-1"/> {t('status_closed')}</> : <><Ruler size={16} className="mr-1"/> {formatLength(closureStatus.gap)} {t('status_open')}</>}</div>
                    </>
                )}
            </div>

            {toolMode === 'split' && <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl animate-pulse pointer-events-none z-50">✂️ {t('split_mode_hint')}</div>}
            
            <div className="absolute top-4 right-4 z-10 flex gap-2 pointer-events-none">
                 {showUI && (
                    <>
                        <button onClick={() => setShowHelp(true)} className="pointer-events-auto p-2 bg-white rounded-lg shadow-md border hover:bg-gray-50 text-gray-700 transition-colors tooltip" title={t('help_title')}><BookOpen size={20} /></button>
                        <button onClick={() => setShowBOM(!showBOM)} className={`pointer-events-auto p-2 rounded-lg shadow-md border transition-colors ${showBOM ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`} title={t('bom')}><List size={20} /></button>
                        <a href="https://ko-fi.com/jaylin86755" target="_blank" rel="noopener noreferrer" className="pointer-events-auto p-2 bg-white rounded-lg shadow-md border hover:bg-gray-50 text-pink-500 transition-colors tooltip flex items-center justify-center" title={t('kofi')}><Coffee size={20} /></a>
                    </>
                 )}
                 <button onClick={() => setShowUI(!showUI)} className={`pointer-events-auto p-2 rounded-lg shadow-md border transition-colors ${!showUI ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`} title={t('toggle_ui')}>{showUI ? <EyeOff size={20} /> : <Eye size={20} />}</button>
            </div>

            {/* ... (BOM Modal Same) ... */}
             {showBOM && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={() => setShowBOM(false)}>
                    <div className="bg-white w-96 max-h-[80vh] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2"><Package size={18}/> {t('bom')}</h3>
                            <div className="flex gap-2"><button onClick={handleExportCSV} className="p-1 hover:bg-gray-100 rounded text-gray-500" title={t('export_csv')}><FileSpreadsheet size={18}/></button><button onClick={handleExportImage} className="p-1 hover:bg-gray-100 rounded text-gray-500" title={t('export_img')}><ImageIcon size={18}/></button><button onClick={() => setShowBOM(false)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button></div>
                        </div>
                        <div className="overflow-y-auto p-0"><table className="w-full text-sm"><thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr><th className="px-4 py-2 text-left">{t('part_name')}</th><th className="px-4 py-2 text-left">{t('brand_col')}</th><th className="px-4 py-2 text-right">{t('qty')}</th></tr></thead><tbody className="divide-y divide-gray-100">{Object.entries(bom).map(([key, count]) => { const [brand, name] = key.split(' - '); return (<tr key={key}><td className="px-4 py-3 text-gray-700">{name}</td><td className="px-4 py-3 text-gray-500 text-xs">{brand}</td><td className="px-4 py-3 text-right font-bold text-blue-600 font-mono">{count}</td></tr>); })}{Object.keys(bom).length === 0 && (<tr><td colSpan="3" className="p-8 text-center text-gray-400 italic">{t('no_parts')}</td></tr>)}</tbody></table></div>
                        <div className="p-3 border-t bg-gray-50 text-right text-xs text-gray-500">{t('total_parts')}: {Object.values(bom).reduce((a,b)=>a+b, 0)}</div>
                    </div>
                </div>
            )}
            
            {/* Parts Library - Only show if showUI is true */}
            {showUI && (
                <div className="absolute right-4 top-20 bottom-20 w-auto z-10 flex flex-col gap-2 pointer-events-none">
                    <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg border border-gray-200 p-2 flex flex-col gap-2 pointer-events-auto overflow-y-auto custom-scrollbar items-center max-h-full" onWheel={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
                        {/* Brand Switcher */}
                        <div className="flex w-full mb-2 bg-gray-100 p-1 rounded-lg">
                            <button onClick={() => { setActiveBrand('AFX'); setSelected(null); }} className={`flex-1 py-1 text-xs font-bold rounded ${activeBrand === 'AFX' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>AFX</button>
                            <button onClick={() => { setActiveBrand('TYCO'); setSelected(null); }} className={`flex-1 py-1 text-xs font-bold rounded ${activeBrand === 'TYCO' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>TYCO</button>
                        </div>

                        <div className="w-full border-b pb-2 mb-1 flex flex-col gap-2">
                            <div className="text-[9px] font-bold text-gray-400 text-center uppercase">{t('parts_special')}</div>
                            {Object.entries(TRACK_DATA[activeBrand].pieces).filter(([k, p]) => ['CX9', 'SQ9', 'SQ15', 'TERM', 'TERM9'].includes(p.id)).map(([key, p]) => (<button key={key} onClick={() => addPiece(key)} onMouseEnter={() => setPreviewPiece({ ...p, dir: 1, brand: activeBrand })} onMouseLeave={() => setPreviewPiece(null)} onTouchStart={(e) => { e.preventDefault(); addPiece(key); }} className={`w-12 h-8 rounded border flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-105 tooltip ${activeBrand === 'AFX' ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-red-50 border-red-200 text-red-800'}`} title={getPieceName(p.id)}>{(p.id.startsWith('TERM') ? <Zap size={14} /> : p.id)}</button>))}
                        </div>
                        <div className="w-full border-b pb-2 mb-1 flex flex-col gap-2">
                            <div className="text-[9px] font-bold text-gray-400 text-center uppercase">{t('parts_straight')}</div>
                            {Object.entries(TRACK_DATA[activeBrand].pieces).filter(([k, p]) => p.type === 'straight' && !['CX9', 'SQ9', 'SQ15', 'X9', 'TERM', 'TERM9'].includes(p.id)).map(([key, p]) => (<button key={key} onClick={() => addPiece(key)} onMouseEnter={() => setPreviewPiece({ ...p, dir: 1, brand: activeBrand })} onMouseLeave={() => setPreviewPiece(null)} onTouchStart={(e) => { e.preventDefault(); addPiece(key); }} className={`w-12 h-8 rounded border flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-105 tooltip ${activeBrand === 'AFX' ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-red-50 border-red-200 text-red-800'}`} title={getPieceName(p.id)}>{p.length}"</button>))}
                        </div>
                        <div className="flex flex-col gap-2 w-full items-center">
                            <div className="text-[9px] font-bold text-gray-400 text-center uppercase">{t('parts_curve')}</div>
                            {Object.entries(TRACK_DATA[activeBrand].pieces).filter(([k, p]) => p.type === 'curve').map(([key, p]) => (<div key={key} className="flex gap-1 items-center bg-gray-50 p-1 rounded border shadow-sm"><span className="text-[10px] font-bold w-4 text-center">{p.radius}"</span><div className="flex flex-col gap-1"><button onClick={() => addPiece(key, -1)} onMouseEnter={() => setPreviewPiece({ ...p, dir: -1, brand: activeBrand })} onMouseLeave={() => setPreviewPiece(null)} onTouchStart={(e) => { e.preventDefault(); addPiece(key, -1); }} className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${activeBrand === 'AFX' ? 'bg-white hover:bg-orange-50 text-orange-600' : 'bg-white hover:bg-orange-50 text-orange-600'}`}><ArrowLeft size={10}/></button><button onClick={() => addPiece(key, 1)} onMouseEnter={() => setPreviewPiece({ ...p, dir: 1, brand: activeBrand })} onMouseLeave={() => setPreviewPiece(null)} onTouchStart={(e) => { e.preventDefault(); addPiece(key, 1); }} className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${activeBrand === 'AFX' ? 'bg-white hover:bg-green-50 text-green-600' : 'bg-white hover:bg-green-50 text-green-600'}`}><ArrowRight size={10}/></button></div></div>))}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Selected Controls - Only show if showUI is true */}
            {showUI && selected && toolMode === 'select' && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 bg-white px-6 py-3 rounded-full shadow-2xl border border-gray-200 flex items-center gap-6 animate-in slide-in-from-bottom-4 fade-in duration-200 pointer-events-auto">
                    <div className="flex gap-2 border-r pr-6"><button onClick={() => rotateSection(-45)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 tooltip" title={t('rotate_left')}><RotateCcw size={20} /></button><button onClick={() => rotateSection(45)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 tooltip" title={t('rotate_right')}><RotateCcw size={20} className="scale-x-[-1]"/></button><button onClick={handleSplitButtonClick} className="p-2 hover:bg-blue-50 text-blue-600 rounded-full tooltip" title={t('split')}><Scissors size={20} /></button></div>
                    <div className="flex gap-2">{sections.find(s=>s.id===selected.sectionId)?.pieces[selected.pieceIndex]?.type === 'curve' && (<button onClick={handleFlip} className="p-2 hover:bg-orange-50 text-orange-600 rounded-full tooltip" title={t('flip')}><ArrowLeft size={20}/></button>)}<button onClick={handleDelete} className="p-2 hover:bg-red-50 text-red-600 rounded-full tooltip" title={t('delete')}><Trash2 size={20}/></button></div>
                </div>
            )}
            
            {/* Empty State - Only show if showUI is true */}
            {showUI && !selected && sections.length === 1 && sections[0].pieces.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"><div className="text-center opacity-40"><MousePointer2 size={48} className="mx-auto mb-2 text-gray-400" /><p className="text-xl font-bold text-gray-500">{t('start_title')}</p><p className="text-sm text-gray-400">{t('start_desc')}</p></div></div>
            )}
        </div>
    );
};

export default App;