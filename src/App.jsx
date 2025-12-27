import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
    ArrowLeft, ArrowRight, RotateCcw, Trash2, Plus, 
    Undo2, Redo2, CheckCircle, AlertTriangle,
    Scissors, MousePointer2, Eraser, Magnet,
    Settings, List, X, Box, Package, Layout, Shuffle,
    Minimize2, Download, Image as ImageIcon, FileSpreadsheet,
    Zap, PenLine, Globe, MousePointer, Save, FolderOpen, Info, BookOpen,
    Eye, EyeOff, Coffee, ShieldCheck, FilePlus, Maximize, Minimize,
    Palette, Ruler, Copy, Focus, ArrowLeftRight
} from 'lucide-react';

const APP_VERSION = "v5.0.0 (Slot Car Planner)";

// ==========================================
// 1. GLOBAL CONSTANTS & HELPERS (Outside Component)
// ==========================================
const LANE_COLOR_SETS=[['#ef4444','#3b82f6'],['#f97316','#22c55e'],['#eab308','#a855f7'],['#ec4899','#ffffff']];
const I18N={
    en:{
        settings:"Settings",track_name:"Track Name",language:"Language",lanes:"Lanes",unit:"Unit",width:"Width",depth:"Depth",history:"History",undo:"Undo",redo:"Redo",clear_all:"Clear All",clear_confirm_title:"Clear All?",clear_confirm_msg:"Remove all?",clear_confirm_btn:"Clear",status_closed:"Closed",status_open:"Gap",total_length:"Length",bom:"BOM",export_csv:"Export CSV",export_img:"Export Image",parts_library:"Library",parts_special:"Special",parts_straight:"Straight",parts_curve:"Curve",qty:"Qty",part_name:"Part",brand_col:"Brand",total_parts:"Total",no_parts:"No parts",start_title:"Start Designing",start_desc:"Select a brand",rotate_left:"L",rotate_right:"R",split:"Split",select:"Select",delete:"Delete",copy:"Copy",hint:"Hint",csv_header_part:"Part",csv_header_qty:"Qty",img_title:"Track Design",img_dim:"Dim",img_area:"Area",
        split_mode_hint:"Click joint to split",
        split_phase2_hint:"Select 2nd cut point",
        split_exit_hint:"Click empty space to exit",
        save_track:"Save",load_track:"Load",save_btn:"Save",load_btn:"Load",import_btn:"Import",load_confirm_title:"Overwrite?",load_confirm_msg:"Replace?",load_confirm_btn:"Yes",cancel:"Cancel",file_error:"Invalid file",load_success:"Loaded",import_success:"Imported",clear_success:"Cleared",help_title:"Manual",help_mouse:"Controls",help_mouse_pan:"Mid Drag: Pan",help_mouse_zoom:"Scroll: Zoom",help_mouse_select:"Click: Select",help_mouse_group:"Dbl Click: Select Section",help_features:"Features",help_brand:"Multi-Brand",help_split:"Split Tool",help_about:"About",help_privacy:"Local execution",toggle_ui:"UI",kofi:"Donate",change_color:"Colors",lane_colors_title:"Lane Colors (1-8)", fit_view: "Fit View", flip: "Flip", 'S15':'15" Straight','S9':'9" Straight','S6':'6" Straight','S3':'3" Straight','TERM':'15" Terminal','TERM9':'9" Terminal','CX9':'9" Crisscross','SQ9':'9" Squeeze','SQ15':'15" Squeeze','X9':'9" Intersection','C3':'Hairpin 9"x6"','C6':'6" Curve (1/8)','C6_90':'6" Curve (1/4)','C9':'9" Curve (1/4)','C9_45':'9" Curve (1/8)','C12':'12" Curve (1/8)','C15':'15" Curve (1/8)','C18':'18" Curve (1/8)'
    },
    zh:{
        settings:"設定",track_name:"跑道名稱",language:"語言",lanes:"車道",unit:"單位",width:"寬度",depth:"深度",history:"歷史",undo:"復原",redo:"重做",clear_all:"清除",clear_confirm_title:"清除全部？",clear_confirm_msg:"移除所有軌道。",clear_confirm_btn:"清除",status_closed:"閉合",status_open:"未閉合",total_length:"總長",bom:"清單",export_csv:"匯出CSV",export_img:"匯出圖片",parts_library:"零件庫",parts_special:"特殊",parts_straight:"直線",parts_curve:"彎道",qty:"數量",part_name:"名稱",brand_col:"品牌",total_parts:"總計",no_parts:"無零件",start_title:"開始設計",start_desc:"選擇品牌開始",rotate_left:"左旋",rotate_right:"右旋",split:"剪刀",select:"選取",delete:"刪除",copy:"複製",hint:"提示",csv_header_part:"名稱",csv_header_qty:"數量",img_title:"設計圖",img_dim:"尺寸",img_area:"佔地",
        split_mode_hint:"點擊連接點切割",
        split_phase2_hint:"請選擇第二個切割點",
        split_exit_hint:"點擊空白處退出",
        save_track:"儲存",load_track:"讀取",save_btn:"儲存",load_btn:"讀取",import_btn:"匯入",load_confirm_title:"覆蓋？",load_confirm_msg:"取代目前設計？",load_confirm_btn:"確定",cancel:"取消",file_error:"檔案無效",load_success:"成功",import_success:"成功",clear_success:"已清除",help_title:"說明",help_mouse:"操作",help_mouse_pan:"中鍵/雙指：移動",help_mouse_zoom:"滾輪/雙指：縮放",help_mouse_select:"左鍵：選取",help_mouse_group:"長按：選取整段",help_features:"功能",help_brand:"多品牌支援",help_split:"雙擊分離",help_about:"關於",help_privacy:"本機執行",toggle_ui:"介面",kofi:"贊助",change_color:"換色",lane_colors_title:"車道顏色設定 (1-8)", fit_view: "全覽", flip: "翻轉", 'S15':'15" 直線','S9':'9" 直線','S6':'6" 直線','S3':'3" 直線','TERM':'15" 電源軌','TERM9':'9" 電源軌','CX9':'9" 變換車道','SQ9':'9" 擠壓軌','SQ15':'15" 擠壓軌','X9':'9" 交叉軌','C3':'髮夾彎','C6':'6" 彎道 (1/8)','C6_90':'6" 彎道 (1/4)','C9':'9" 彎道 (1/4)','C9_45':'9" 彎道 (1/8)','C12':'12" 彎道 (1/8)','C15':'15" 彎道 (1/8)','C18':'18" 彎道 (1/8)'
    }
};
const TRACK_DATA={AFX:{name:"Tomy AFX",color:"#2563eb",trackColor:"#334155",laneSpacing:1.5,trackWidth:3,pieces:{straight_15:{id:'S15',length:15,type:'straight'},straight_9:{id:'S9',length:9,type:'straight'},straight_6:{id:'S6',length:6,type:'straight'},straight_3:{id:'S3',length:3,type:'straight'},terminal:{id:'TERM',length:15,type:'straight',isTerminal:true},crisscross:{id:'CX9',length:9,type:'straight',isLaneChanger:true},squeeze:{id:'SQ9',length:9,type:'straight',isSqueeze:true},curve_3:{id:'C3',radius:1.5,degree:180,type:'curve',isHairpin:true,straightLength:6},curve_6:{id:'C6',radius:6,degree:45,type:'curve'},curve_9:{id:'C9',radius:9,degree:90,type:'curve'},curve_9_45:{id:'C9_45',radius:9,degree:45,type:'curve'},curve_12:{id:'C12',radius:12,degree:45,type:'curve'},curve_15:{id:'C15',radius:15,degree:45,type:'curve'},curve_18:{id:'C18',radius:18,degree:45,type:'curve'}}},TYCO:{name:"Tyco / Mattel",color:"#dc2626",trackColor:"#94a3b8",laneSpacing:1.5,trackWidth:3,pieces:{straight_15:{id:'S15',length:15,type:'straight'},straight_9:{id:'S9',length:9,type:'straight'},straight_6:{id:'S6',length:6,type:'straight'},straight_3:{id:'S3',length:3,type:'straight'},terminal:{id:'TERM9',length:9,type:'straight',isTerminal:true},crisscross:{id:'CX9',length:9,type:'straight',isLaneChanger:true},squeeze:{id:'SQ15',length:15,type:'straight',isSqueeze:true},curve_6_90:{id:'C6_90',radius:6,degree:90,type:'curve'},curve_9:{id:'C9',radius:9,degree:90,type:'curve'},curve_9_45:{id:'C9_45',radius:9,degree:45,type:'curve'},curve_12:{id:'C12',radius:12,degree:45,type:'curve'}}}};

const toRad = (deg) => deg * Math.PI / 180;
const cmToInch = (cm) => cm / 2.54;
const stringToColor = (str) => {
    if (!str) return null;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + "00000".substring(0, 6 - c.length) + c;
};
const scissorCursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>') 16 16, auto`;

const computePieceGeo = (p, x, y, h) => {
    const len = Number(p.length) || 0;
    const r = Number(p.radius) || 0;
    const deg = Number(p.degree) || 0;
    const sl = Number(p.straightLength) || 0;
    const dir = Number(p.dir) || 1;

    if (p.isHairpin) {
        x += Math.cos(toRad(h)) * sl; y += Math.sin(toRad(h)) * sl;
        const cA = h + (dir * 90);
        const eA = cA + 180 + deg * dir;
        const cx = x + Math.cos(toRad(cA)) * r; const cy = y + Math.sin(toRad(cA)) * r;
        const ex = cx + Math.cos(toRad(eA)) * r; ey = cy + Math.sin(toRad(eA)) * r;
        h += deg * dir;
        const endX = ex + Math.cos(toRad(h)) * sl; 
        const endY = ey + Math.sin(toRad(h)) * sl;
        return { x: endX, y: endY, heading: h };
    } else if (p.type === 'straight') {
        const endX = x + Math.cos(toRad(h)) * len; 
        const endY = y + Math.sin(toRad(h)) * len;
        return { x: endX, y: endY, heading: h };
    } else {
        const cA = h + (dir * 90);
        const eA = cA + 180 + deg * dir;
        const cx = x + Math.cos(toRad(cA)) * r; const cy = y + Math.sin(toRad(cA)) * r;
        const endX = cx + Math.cos(toRad(eA)) * r; 
        const endY = cy + Math.sin(toRad(eA)) * r;
        const endH = h + deg * dir;
        return { x: endX, y: endY, heading: endH };
    }
};

const calculateSectionGeometry = (pieces, startX, startY, startHeading, limitIndex) => {
    let x = startX, y = startY, h = startHeading;
    const limit = limitIndex !== undefined ? limitIndex : pieces.length;
    for (let i = 0; i < limit; i++) {
        const res = computePieceGeo(pieces[i], x, y, h);
        x = res.x; y = res.y; h = res.heading;
    }
    return { x, y, heading: h, type: limit === 0 ? 'start' : 'end' };
};

const calculateSectionEndpoints = (sec) => {
    const end = calculateSectionGeometry(sec.pieces, sec.x, sec.y, sec.heading);
    return { start: { x: sec.x, y: sec.y, heading: sec.heading, type: 'start' }, end: { ...end, type: 'end' } };
};

const calculateRelativeTransform = (pieces, limitIndex) => calculateSectionGeometry(pieces, 0, 0, 0, limitIndex);

const reversePieces = (pieces) => {
    return pieces.slice().reverse().map(p => {
        if (p.type === 'curve' || p.isHairpin) return { ...p, dir: -p.dir };
        return p;
    });
};

const checkGroupConsistency = (sections) => {
    const groups = {};
    const sectionMap = {};

    sections.forEach(s => {
        sectionMap[s.id] = s;
        if (s.groupId) {
            if (!groups[s.groupId]) groups[s.groupId] = [];
            groups[s.groupId].push(s);
        }
    });

    const newSections = [...sections];
    let changed = false;

    Object.keys(groups).forEach(groupId => {
        const members = groups[groupId];
        if (members.length < 2) {
             if (members.length === 1) {
                 const idx = newSections.findIndex(s => s.id === members[0].id);
                 if (idx !== -1) {
                     newSections[idx] = { ...newSections[idx], groupId: null };
                     changed = true;
                 }
             }
             return;
        }

        const adj = new Map(); 
        members.forEach(m => adj.set(m.id, new Set()));

        for (let i = 0; i < members.length; i++) {
            for (let j = i + 1; j < members.length; j++) {
                const s1 = members[i];
                const s2 = members[j];
                
                const m1Geo = calculateSectionGeometry(s1.pieces, s1.x, s1.y, s1.heading, 1);
                const m2Geo = calculateSectionGeometry(s2.pieces, s2.x, s2.y, s2.heading, 1);
                
                const dist = Math.hypot(m1Geo.x - m2Geo.x, m1Geo.y - m2Geo.y);
                if (dist < 0.5) { 
                    adj.get(s1.id).add(s2.id);
                    adj.get(s2.id).add(s1.id);
                }
            }
        }

        const visited = new Set();
        const components = [];

        members.forEach(startNode => {
            if (!visited.has(startNode.id)) {
                const component = [];
                const queue = [startNode.id];
                visited.add(startNode.id);
                
                while(queue.length > 0) {
                    const currId = queue.shift();
                    component.push(currId);
                    const neighbors = adj.get(currId);
                    if (neighbors) {
                        neighbors.forEach(nId => {
                            if (!visited.has(nId)) {
                                visited.add(nId);
                                queue.push(nId);
                            }
                        });
                    }
                }
                components.push(component);
            }
        });

        if (components.length > 1) {
            changed = true;
            components.forEach((compIds, idx) => {
                const newGroupId = idx === 0 ? groupId : `group_${Date.now()}_${idx}`;
                const finalGroupId = compIds.length > 1 ? newGroupId : null;

                compIds.forEach(sId => {
                    const sIdx = newSections.findIndex(s => s.id === sId);
                    if (sIdx !== -1) {
                        newSections[sIdx] = { ...newSections[sIdx], groupId: finalGroupId };
                    }
                });
            });
        } else if (components.length === 1 && components[0].length < 2) {
             const sId = components[0][0];
             const sIdx = newSections.findIndex(s => s.id === sId);
             if (sIdx !== -1) {
                 newSections[sIdx] = { ...newSections[sIdx], groupId: null };
                 changed = true;
             }
        }
    });

    return changed ? newSections : sections;
};

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

const App = () => {
    // --- State ---
    const [lang, setLang] = useState('en'); 
    const [trackName, setTrackName] = useState('Track 01');
    const [lanes, setLanes] = useState(2);
    const [unit, setUnit] = useState('cm');
    const [tableWidth, setTableWidth] = useState(244);
    const [tableDepth, setTableDepth] = useState(122);
    const [activeBrand, setActiveBrand] = useState('AFX');
    const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [viewTransform, setViewTransform] = useState({ x: 0, y: 0, k: 1 });
    const [showUI, setShowUI] = useState(true);

    // FIX: Initialize with center coordinates based on default table size (244x122 cm)
    // 244 cm / 2.54 = ~96 inch, / 2 = 48 inch
    // 122 cm / 2.54 = ~48 inch, / 2 = 24 inch
    const [sections, setSections] = useState([{ 
        id: 'main', 
        x: (244 / 2.54) / 2, 
        y: (122 / 2.54) / 2, 
        heading: 0, 
        pieces: [], 
        colorSet: 0, 
        groupId: null 
    }]);
    
    const [history, setHistory] = useState([]);
    const [future, setFuture] = useState([]);
    const [selected, setSelected] = useState(null); 
    
    const [showBOM, setShowBOM] = useState(false);
    const [showSettings, setShowSettings] = useState(true); 
    const [showHelp, setShowHelp] = useState(false); 
    const [closureStatus, setClosureStatus] = useState({ closed: false, gap: 0 });
    const [previewPiece, setPreviewPiece] = useState(null);
    const [trackStats, setTrackStats] = useState({ displayLength: 0, maxLength: 0, width: 0, height: 0 });
    const [toolMode, setToolMode] = useState('select');
    const [hoveredJoint, setHoveredJoint] = useState(null);
    const [laneColors, setLaneColors] = useState(['#FF0000', '#3884FF', '#FE822A', '#22C55E', '#FEC10B', '#B060FF', '#FE5DAD', '#FFFFFF']);
    
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [sectionStartPos, setSectionStartPos] = useState({ x: 0, y: 0 });
    const [snapCandidate, setSnapCandidate] = useState(null); 
    
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const touchStartDist = useRef(0);
    const touchStartScale = useRef(1);
    const touchStartPan = useRef({ x: 0, y: 0 });
    const touchStartView = useRef({ x: 0, y: 0 });

    // Scissor Logic State for Closed Loops
    const [pendingSplit, setPendingSplit] = useState(null); 

    const longPressTimer = useRef(null);
    const mouseDownScreen = useRef({ x: 0, y: 0 });
    const groupDragData = useRef(null); 
    const scaleRef = useRef(10);
    const viewParamsRef = useRef({ startX: 0, startY: 0, scale: 10, tablePxW: 0, tablePxH: 0 }); 
    const trackBoundsRef = useRef({ minX: 0, maxX: 0, minY: 0, maxY: 0 });
    const hitRegionsRef = useRef([]);
    const jointsRef = useRef([]);
    
    const fileInputRef = useRef(null);
    const importInputRef = useRef(null);
    const canvasRef = useRef(null);

    const [showLoadConfirm, setShowLoadConfirm] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [pendingLoadData, setPendingLoadData] = useState(null);
    const [notification, setNotification] = useState(null);

    // --- Helper Functions ---
    const t = (key) => {
        if (!key || typeof key !== 'string') return '';
        if (!I18N[lang]) return String(key);
        const val = I18N[lang][key];
        return (val !== undefined && val !== null) ? String(val) : String(key);
    };
    
    const getPieceName = (id) => t(id);

    // MOVED: getPieceLength helper for reuse
    const getPieceLength = (p) => {
        if (Number(p.radius) > 0) {
            const r = Number(p.radius);
            const deg = Number(p.degree) || 0;
            let l = (2 * Math.PI * r * (deg / 360));
            if (p.isHairpin) {
                l += (Number(p.straightLength) * 2 || 0);
            }
            return l;
        }
        return Number(p.length) || 0;
    };

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
        return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
    };

    const pushHistory = (newSections) => { setHistory(prev => [...prev, sections]); setFuture([]); setSections(newSections); };

    // --- Effects ---
    useEffect(() => {
        const handleResize = () => setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // FIX: Ensure selection is valid when sections change
    useEffect(() => {
        if (selected) {
            const sec = sections.find(s => s.id === selected.sectionId);
            if (!sec) {
                setSelected(null);
            } else {
                 if (selected.pieceIndex >= sec.pieces.length || (sec.pieces[selected.pieceIndex] && sec.pieces[selected.pieceIndex].uid !== selected.pieceUid)) {
                     setSelected(null);
                 } else if (sec.pieces[selected.pieceIndex]) {
                     const piece = sec.pieces[selected.pieceIndex];
                     if (piece.brand && piece.brand !== activeBrand) setActiveBrand(piece.brand);
                 }
            }
        }
    }, [sections]);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // View Protection
    useEffect(() => {
        if (!Number.isFinite(viewTransform.x) || !Number.isFinite(viewTransform.y) || !Number.isFinite(viewTransform.k) || viewTransform.k <= 0) {
            setViewTransform({ x: 0, y: 0, k: 1 });
        }
    }, [viewTransform]);

    // ** ROBUST STATS & CLOSURE LOGIC **
    useEffect(() => {
        // 1. Calculate Lengths per Group/Section
        const groupLengths = {};
        
        // Helper to get group ID (fallback to section ID if no group)
        const getGid = (s) => s.groupId || s.id;

        // Pass 1: Calculate lengths
        sections.forEach(s => {
            let sLen = 0;
            s.pieces.forEach(p => sLen += getPieceLength(p));
            
            const gid = getGid(s);
            if (!groupLengths[gid]) groupLengths[gid] = 0;
            groupLengths[gid] += sLen;
        });

        // Pass 2: Determine target group for display
        let targetGid = null;
        if (selected) {
            const selSec = sections.find(s => s.id === selected.sectionId);
            if (selSec) targetGid = getGid(selSec);
        }

        // If no selection, find largest group by length
        if (!targetGid) {
            let maxL = -1;
            Object.keys(groupLengths).forEach(gid => {
                if (groupLengths[gid] > maxL) {
                    maxL = groupLengths[gid];
                    targetGid = gid;
                }
            });
        }

        let isClosed = false;
        let activeGap = 0;
        const finalDisplayLength = targetGid ? groupLengths[targetGid] : 0;
        
        // Gap/Closure Check (Legacy logic based on simple section endpoints)
        // Ideally needs graph traversal for multi-section groups, keeping simple for now
        let closureSec = null;
        if (selected) {
            closureSec = sections.find(s => s.id === selected.sectionId);
        } else {
             let maxPieces = -1;
             sections.forEach(s => {
                 if (s.pieces.length > maxPieces) {
                     maxPieces = s.pieces.length;
                     closureSec = s;
                 }
             });
        }
        
        if (closureSec && closureSec.pieces.length > 0) {
            const ends = calculateSectionEndpoints(closureSec);
            const dist = Math.hypot(ends.end.x - ends.start.x, ends.end.y - ends.start.y);
            activeGap = dist;
            if (dist < 0.5) isClosed = true;
        }

        setTrackStats(prev => ({ 
            ...prev, 
            displayLength: finalDisplayLength, 
            maxLength: Math.max(...Object.values(groupLengths), 0) 
        }));
        
        setClosureStatus({ closed: isClosed, gap: activeGap });

    }, [sections, selected]);


    const formatLength = (valInches) => {
        const num = Number(valInches);
        if (isNaN(num)) return "0.0" + (unit === 'cm' ? " cm" : '"'); 
        if (unit === 'cm') return (num * 2.54).toFixed(1) + " cm";
        return num.toFixed(1) + '"';
    };

    const changeUnit = (newUnit) => {
        if (unit === newUnit) return;
        if (newUnit === 'in') {
            setTableWidth(prev => parseFloat((prev / 2.54).toFixed(1)));
            setTableDepth(prev => parseFloat((prev / 2.54).toFixed(1)));
        } else {
            setTableWidth(prev => parseFloat((prev * 2.54).toFixed(1)));
            setTableDepth(prev => parseFloat((prev * 2.54).toFixed(1)));
        }
        setUnit(newUnit);
    };

    const handleLaneColorChange = (index, color) => {
        const newColors = [...laneColors];
        newColors[index] = color;
        setLaneColors(newColors);
    };

    const bom = useMemo(() => {
        const counts = {}; 
        sections.forEach(s => s.pieces.forEach(p => {
            if (p && p.id) { 
                const qty = (lanes === 4 && p.type === 'straight') ? 2 : 1;
                const name = getPieceName(p.id);
                const brandName = p.brand || 'AFX'; 
                const key = `${brandName} - ${name}`;
                counts[key] = (counts[key] || 0) + qty;
            }
        }));
        return counts;
    }, [sections, lanes, lang]);

    useEffect(() => {
        if (trackName === 'Track 01' && lang === 'zh') setTrackName('跑道01');
        if (trackName === '跑道01' && lang === 'en') setTrackName('Track 01');
    }, [lang]);

    // -------------------------------------------------------------------------
    // --- 3. RENDER SCENE (Priority Level 1) ---
    // -------------------------------------------------------------------------
    const renderScene = useCallback((ctx, width, height, isExport = false) => {
        let baseSlotOffsets = lanes === 4 ? [-2.25, -0.75, 0.75, 2.25] : [-0.75, 0.75];
        let currentLaneOffsets = [...baseSlotOffsets]; 
        let minTx = Infinity, maxTx = -Infinity, minTy = Infinity, maxTy = -Infinity;
        
        ctx.clearRect(0, 0, width, height);

        // Render Guard
        let safeW = tableWidth;
        let safeD = tableDepth;
        if (!Number.isFinite(safeW) || safeW <= 0) safeW = 244;
        if (!Number.isFinite(safeD) || safeD <= 0) safeD = 122;

        const tableWInch = unit === 'cm' ? cmToInch(safeW) : safeW; 
        const tableDInch = unit === 'cm' ? cmToInch(safeD) : safeD;
        
        const marginPx = isExport ? 60 : 60; 
        const scaleX = (width - marginPx * 2) / tableWInch; 
        const scaleY = (height - marginPx * 2) / tableDInch;
        let baseScale = Math.min(scaleX, scaleY);
        
        // Safety check for scale
        if (!Number.isFinite(baseScale) || baseScale <= 0) baseScale = 1;
        
        if (!isExport) scaleRef.current = baseScale;
        
        const currentK = (viewTransform && Number.isFinite(viewTransform.k)) ? viewTransform.k : 1;
        const effectiveScale = isExport ? baseScale : (baseScale * currentK);
        
        let offsetX = isExport ? (width - tableWInch * effectiveScale) / 2 : ((width - tableWInch * baseScale) / 2 + viewTransform.x);
        let offsetY = isExport ? (height - tableDInch * effectiveScale) / 2 : ((height - tableDInch * baseScale) / 2 + viewTransform.y);

        if (!Number.isFinite(offsetX)) offsetX = 0;
        if (!Number.isFinite(offsetY)) offsetY = 0;
        
        const worldToScreen = (wx, wy) => {
             return {
                 x: offsetX + wx * effectiveScale,
                 y: offsetY + wy * effectiveScale
             };
        };

        if (!isExport) { 
            viewParamsRef.current = { startX: offsetX, startY: offsetY, scale: effectiveScale, tablePxW: tableWInch*effectiveScale, tablePxH: tableDInch*effectiveScale }; 
        }
        
        ctx.fillStyle = '#f8fafc'; 
        ctx.fillRect(offsetX, offsetY, tableWInch*effectiveScale, tableDInch*effectiveScale);
        ctx.strokeStyle = '#cbd5e1'; 
        ctx.lineWidth = 2 * (isExport ? 1 : currentK); 
        ctx.strokeRect(offsetX, offsetY, tableWInch*effectiveScale, tableDInch*effectiveScale);
        
        if (!isExport) { 
            ctx.fillStyle = '#94a3b8'; 
            ctx.font = '12px sans-serif'; 
            ctx.fillText(`${t('width')}: ${safeW} x ${t('depth')}: ${safeD} ${unit}`, offsetX + 10, offsetY - 10); 
            hitRegionsRef.current = []; 
            jointsRef.current = []; 
        }

        const bodyWidth = (lanes === 4 ? 6 : 3) * effectiveScale; 
        const laneWidth = 2 * (effectiveScale / 12);

        if (!isExport && previewPiece && !isDragging) {
            let targetSec = sections[sections.length - 1];
            if (selected) targetSec = sections.find(s => s.id === selected.sectionId) || targetSec;
            let startPt, startHeading;
            if (!targetSec) { startPt = worldToScreen(0, 0); startHeading = 0; } else {
                const pts = calculateSectionEndpoints(targetSec);
                const isPrepend = selected !== null && !selected.isWholeSection && (selected.pieceIndex < targetSec.pieces.length / 2);
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
                 const slPx = previewPiece.straightLength * effectiveScale; const rPx = previewPiece.radius * effectiveScale;
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
                const len = previewPiece.length * effectiveScale;
                const endX = startPt.x + Math.cos(toRad(startHeading)) * len; const endY = startPt.y + Math.sin(toRad(startHeading)) * len;
                ctx.moveTo(startPt.x, startPt.y); ctx.lineTo(endX, endY);
            } else {
                const r = previewPiece.radius * effectiveScale; const rPx = r; const dir = previewPiece.dir;
                const cAngle = startHeading + (dir * 90); const cAngRad = toRad(cAngle);
                const cxScreen = startPt.x + Math.cos(cAngRad) * rPx; const cyScreen = startPt.y + Math.sin(cAngRad) * rPx;
                const sAng = toRad(cAngle + 180); const sweep = toRad(previewPiece.degree); const eAng = sAng + sweep * dir;
                ctx.arc(cxScreen, cyScreen, rPx, sAng, eAng, dir === -1);
            }
            ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1.0;
        }

        sections.forEach((sec, secIdx) => {
            let curX = sec.x; let curY = sec.y; let heading = sec.heading; 
            const secBrand = sec.pieces[0]?.brand || 'AFX'; const secColor = TRACK_DATA[secBrand].trackColor || '#334155';
            
            const setIdx = sec.colorSet || 0;
            const c1 = laneColors[setIdx * 2] || '#ffffff';
            const c2 = laneColors[setIdx * 2 + 1] || '#ffffff';
            const currentPair = [c1, c2];
            currentLaneOffsets = [...baseSlotOffsets]; 

            sec.pieces.forEach((p, idx) => {
                const isSelected = selected !== null && !isExport && selected.pieceUid === p.uid;
                const isSectionSelected = selected !== null && !isExport && selected.isWholeSection && selected.sectionId === sec.id;
                const highlight = isSelected || isSectionSelected;
                
                let hitData = { uid: p.uid, sectionId: sec.id, index: idx };
                ctx.lineCap = 'butt'; ctx.lineWidth = bodyWidth; ctx.strokeStyle = highlight ? '#fbbf24' : secColor;
                const scale = effectiveScale;
                
                try {
                    // Geometry Drawing ...
                    if (p.isHairpin) {
                        const sl = p.straightLength; const r = p.radius; const dir = p.dir;
                        // FIX: rPx defined BEFORE usage
                        const rPx = r * scale; 
                        
                        ctx.beginPath();
                        let endX = curX + Math.cos(toRad(heading)) * sl; let endY = curY + Math.sin(toRad(heading)) * sl;
                        let p1 = worldToScreen(curX, curY); let p2 = worldToScreen(endX, endY);
                        ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
                        curX = endX; curY = endY;
                        const cAngle = heading + (dir * 90); const cxScreen = p2.x + Math.cos(toRad(cAngle)) * rPx; const cyScreen = p2.y + Math.sin(toRad(cAngle)) * rPx;
                        const sAng = toRad(cAngle + 180); const eAng = sAng + toRad(p.degree * dir);
                        
                        ctx.arc(cxScreen, cyScreen, rPx, sAng, eAng, dir === -1);
                        if (!isExport) { hitData.type = 'arc'; hitData.cx = cxScreen; hitData.cy = cyScreen; hitData.r = rPx; hitData.sAng = sAng; hitData.sweep = toRad(p.degree); hitData.dir = dir; }
                        const endAngTotal = heading + (dir * 90) + 180 + (p.degree * dir);
                        const cxWorld = curX + Math.cos(toRad(cAngle)) * r; const cyWorld = curY + Math.sin(toRad(cAngle)) * r;
                        curX = cxWorld + Math.cos(toRad(endAngTotal)) * r; curY = cyWorld + Math.sin(toRad(endAngTotal)) * r;
                        const savedStartHeading = heading;
                        heading += p.degree * dir;
                        endX = curX + Math.cos(toRad(heading)) * sl; endY = curY + Math.sin(toRad(heading)) * sl;
                        let p3 = worldToScreen(curX, curY); let p4 = worldToScreen(endX, endY);
                        ctx.moveTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y);
                        ctx.stroke();
                        if (highlight) { ctx.lineWidth = bodyWidth + 4; ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)'; ctx.stroke(); }
                        if (!isExport) hitRegionsRef.current.push(hitData);
                        curX = endX; curY = endY;
                        
                        // Lanes
                        ctx.lineWidth = laneWidth * (isExport ? 1 : currentK); 
                        currentLaneOffsets.forEach((offset, i) => {
                            ctx.strokeStyle = currentPair[i % 2]; ctx.beginPath(); 
                            const offsetPx = offset * scale;
                            const nx1 = -Math.sin(toRad(savedStartHeading)); const ny1 = Math.cos(toRad(savedStartHeading));
                            const ls1 = p1.x + nx1 * offsetPx; const ls1y = p1.y + ny1 * offsetPx; 
                            const le1 = p2.x + nx1 * offsetPx; const le1y = p2.y + ny1 * offsetPx;
                            ctx.moveTo(ls1, ls1y); ctx.lineTo(le1, le1y);
                            const rAdj = Math.max(0, p.radius - (offset * dir)) * scale; 
                            ctx.arc(cxScreen, cyScreen, rAdj, sAng, eAng, dir === -1);
                            const nx2 = -Math.sin(toRad(heading)); const ny2 = Math.cos(toRad(heading));
                            const le2 = p4.x + nx2 * offsetPx; const le2y = p4.y + ny2 * offsetPx;
                            ctx.lineTo(le2, le2y); ctx.stroke();
                        });

                    } else if (p.type === 'straight') {
                        const len = p.length; const endX = curX + Math.cos(toRad(heading)) * len; const endY = curY + Math.sin(toRad(heading)) * len;
                        const startPt = worldToScreen(curX, curY); const endPt = worldToScreen(endX, endY);
                        ctx.beginPath(); ctx.moveTo(startPt.x, startPt.y); ctx.lineTo(endPt.x, endPt.y); ctx.stroke();
                        if (highlight) { ctx.lineWidth = bodyWidth + 4; ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)'; ctx.stroke(); }
                        if (!isExport) { hitData.type = 'line'; hitData.x1 = startPt.x; hitData.y1 = startPt.y; hitData.x2 = endPt.x; hitData.y2 = endPt.y; hitRegionsRef.current.push(hitData); }
                        
                        ctx.lineWidth = laneWidth; 
                        let nextLaneOffsets = [...currentLaneOffsets]; if (p.isLaneChanger) nextLaneOffsets.reverse();
                        currentLaneOffsets.forEach((startOffset, i) => {
                            const endOffset = nextLaneOffsets[i]; 
                            ctx.strokeStyle = currentPair[i % 2]; 
                            ctx.beginPath();
                            const startOffsetPx = startOffset * scale; const endOffsetPx = endOffset * scale;
                            const hRad = toRad(heading); const nx = -Math.sin(hRad); const ny = Math.cos(hRad);
                            const sx = startPt.x + nx * startOffsetPx; const sy = startPt.y + ny * startOffsetPx; 
                            const ex = endPt.x + nx * endOffsetPx; const ey = endPt.y + ny * endOffsetPx;
                            if (p.isSqueeze) {
                                const forwardX = Math.cos(hRad); const forwardY = Math.sin(hRad); const midOffsetPx = startOffset * scale * 0.3; // Approx
                                const lenPx = p.length * scale;
                                const cp1x = startPt.x + forwardX * (lenPx * 0.33) + nx * midOffsetPx; const cp1y = startPt.y + forwardY * (lenPx * 0.33) + ny * midOffsetPx;
                                const cp2x = startPt.x + forwardX * (lenPx * 0.66) + nx * midOffsetPx; const cp2y = startPt.y + forwardY * (lenPx * 0.66) + ny * midOffsetPx;
                                ctx.moveTo(sx, sy); ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, ex, ey);
                            } else { ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); }
                            ctx.stroke();
                        });
                        currentLaneOffsets = nextLaneOffsets;
                        curX = endX; curY = endY;
                    } else {
                        const r = p.radius; const dir = p.dir; 
                        const cA = heading + (dir * 90);
                        const cx = curX + Math.cos(toRad(cA)) * r; const cy = curY + Math.sin(toRad(cA)) * r;
                        curX = cx + Math.cos(toRad(cA + 180 + p.degree*dir)) * r; 
                        curY = cy + Math.sin(toRad(cA + 180 + p.degree*dir)) * r;
                        heading += p.degree * dir; 
                        const centerPt = worldToScreen(cx, cy); const rPx = r * scale;
                        const sAng = toRad(cA + 180); const eAng = sAng + toRad(p.degree * dir);
                        ctx.beginPath(); ctx.arc(centerPt.x, centerPt.y, rPx, sAng, eAng, dir === -1); ctx.stroke();
                        if (highlight) { ctx.lineWidth = bodyWidth + 4; ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)'; ctx.stroke(); }
                        if (!isExport) { hitData.type = 'arc'; hitData.cx = centerPt.x; hitData.cy = centerPt.y; hitData.r = rPx; hitData.sAng = sAng; hitData.sweep = toRad(p.degree); hitData.dir = dir; hitRegionsRef.current.push(hitData); }
                        
                        ctx.lineWidth = laneWidth;
                        currentLaneOffsets.forEach((startOffset, i) => {
                            ctx.strokeStyle = currentPair[i % 2]; ctx.beginPath();
                            const rAdj = Math.max(0, p.radius - (startOffset * dir)) * scale;
                            ctx.arc(centerPt.x, centerPt.y, rAdj, sAng, eAng, dir === -1); ctx.stroke();
                        });
                    }
                    
                    if (!isExport && idx < sec.pieces.length - 1) jointsRef.current.push({ x: worldToScreen(curX, curY).x, y: worldToScreen(curX, curY).y, sectionId: sec.id, pieceIndex: idx, heading });
                    
                    if (!isExport && idx === sec.pieces.length - 1) jointsRef.current.push({ x: worldToScreen(curX, curY).x, y: worldToScreen(curX, curY).y, sectionId: sec.id, pieceIndex: idx, heading });

                    if (p.type === 'straight' && p.isTerminal) { // Removed isSqueeze check
                        const prevX = curX - Math.cos(toRad(heading)) * (p.length/2); const prevY = curY - Math.sin(toRad(heading)) * (p.length/2);
                        const pt = worldToScreen(prevX, prevY);
                        ctx.save(); ctx.translate(pt.x, pt.y); ctx.rotate(toRad(heading));
                        // Background (Base)
                        ctx.fillStyle = sec.groupId ? stringToColor(sec.groupId) : '#334155';
                        ctx.fillRect(-4, -bodyWidth/2, 8, bodyWidth);

                        // White Squares
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(-4, 0, 4, bodyWidth/2);
                        ctx.fillRect(0, -bodyWidth/2, 4, bodyWidth/2);

                        // Black Squares
                        ctx.fillStyle = '#000000';
                        ctx.fillRect(-4, -bodyWidth/2, 4, bodyWidth/2);
                        ctx.fillRect(0, 0, 4, bodyWidth/2);
                        ctx.restore();
                    }
                    
                } catch (e) {
                    console.error("Render error for piece:", p, e);
                }
            });
            
            minTx = Math.min(minTx, curX); maxTx = Math.max(maxTx, curX); 
            minTy = Math.min(minTy, curY); maxTy = Math.max(maxTy, curY);
        });

        if (!isExport && (toolMode === 'split')) {
             jointsRef.current.forEach(joint => { 
                ctx.beginPath(); 
                ctx.arc(joint.x, joint.y, 10, 0, Math.PI*2); // Increased radius to 10 for better touch target
                
                // Highlight pending first cut in yellow
                if (pendingSplit && pendingSplit.sectionId === joint.sectionId && pendingSplit.pieceIndex === joint.pieceIndex) {
                    ctx.fillStyle = '#EAB308'; // Yellow
                } else {
                    ctx.fillStyle = 'rgba(239, 68, 68, 0.5)'; // Red
                }
                ctx.fill(); 
             });
             if (hoveredJoint && toolMode === 'split') {
                const { x, y } = hoveredJoint; 
                ctx.save(); ctx.translate(x, y); 
                ctx.fillStyle = (pendingSplit && pendingSplit.sectionId === hoveredJoint.sectionId && pendingSplit.pieceIndex === hoveredJoint.pieceIndex) ? '#EAB308' : '#ef4444'; 
                ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = 'white'; ctx.font = '16px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('✂️', 0, 0);
                ctx.restore();
            }
        }
        
        if (!isExport) {
            // Update Bounds (Length/Gap calculated in useEffect now)
            if (Number.isFinite(minTx) && Number.isFinite(maxTx) && Number.isFinite(minTy) && Number.isFinite(maxTy)) {
                trackBoundsRef.current = { minX: minTx, maxX: maxTx, minY: minTy, maxY: maxTy };
            }

            if (snapCandidate) { 
                const isSide = snapCandidate.type === 'side';
                const snapPt = isSide ? snapCandidate.snapLocation : snapCandidate.targetPoint;
                const pt = worldToScreen(snapPt.x, snapPt.y); 
                ctx.beginPath(); 
                ctx.arc(pt.x, pt.y, 15, 0, Math.PI*2); 
                ctx.fillStyle = isSide ? 'rgba(249, 115, 22, 0.5)' : 'rgba(34, 197, 94, 0.5)'; 
                ctx.fill(); 
                ctx.strokeStyle = isSide ? '#ea580c' : '#16a34a'; 
                ctx.lineWidth = 2; 
                ctx.stroke(); 
            }
        }
    }, [sections, selected, lanes, tableWidth, tableDepth, unit, snapCandidate, previewPiece, lang, toolMode, hoveredJoint, canvasSize, viewTransform, activeBrand, laneColors, pendingSplit]);

    useEffect(() => { const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); renderScene(ctx, canvasSize.width, canvasSize.height, false); }, [renderScene, canvasSize]);

    // -------------------------------------------------------------------------
    // --- 4. VIEW & FILE HANDLERS (Priority Level 2 & 3) ---
    // -------------------------------------------------------------------------

    const fitViewToTracks = (tracksToFit = sections, customSettings = null) => {
        if (!tracksToFit || tracksToFit.length === 0) return;

        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        let hasTracks = false;

        tracksToFit.forEach(sec => {
            let x = sec.x, y = sec.y, h = sec.heading;
            minX = Math.min(minX, x); maxX = Math.max(maxX, x);
            minY = Math.min(minY, y); maxY = Math.max(maxY, y);
            hasTracks = true;
            
            sec.pieces.forEach(p => {
                    const res = computePieceGeo(p, x, y, h);
                    x = res.x; y = res.y; h = res.heading;
                    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
                    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
            });
        });

        if (hasTracks && Number.isFinite(minX)) {
            const padding = 10;
            minX -= padding; maxX += padding;
            minY -= padding; maxY += padding;

            const contentW = maxX - minX;
            const contentH = maxY - minY;
            
            if (contentW > 0 && contentH > 0) {
                const cW = canvasSize.width;
                const cH = canvasSize.height;
                
                let safeW = customSettings ? customSettings.tableWidth : tableWidth;
                let safeD = customSettings ? customSettings.tableDepth : tableDepth;
                let safeUnit = customSettings ? customSettings.unit : unit;
                
                if (!Number.isFinite(safeW) || safeW <= 0) safeW = 244;
                if (!Number.isFinite(safeD) || safeD <= 0) safeD = 122;

                const tableWInch = safeUnit === 'cm' ? cmToInch(safeW) : safeW; 
                const tableDInch = safeUnit === 'cm' ? cmToInch(safeD) : safeD;
                
                const marginPx = 60; 
                let baseScale = Math.min((cW - marginPx * 2) / tableWInch, (cH - marginPx * 2) / tableDInch);
                if (!Number.isFinite(baseScale) || baseScale <= 0) baseScale = 10;

                const fitScaleX = (cW - 100) / (contentW * baseScale);
                const fitScaleY = (cH - 100) / (contentH * baseScale);
                const targetK = Math.min(fitScaleX, fitScaleY, 5);
                
                const cx = (minX + maxX) / 2;
                const cy = (minY + maxY) / 2;
                
                const effectiveScale = baseScale * targetK;
                const newViewX = (tableWInch * baseScale * targetK) / 2 - cx * effectiveScale;
                const newViewY = (tableDInch * baseScale * targetK) / 2 - cy * effectiveScale;
                
                // Simplified centering approach logic
                const finalScale = baseScale * targetK;
                const vx = (tableWInch / 2 - cx) * finalScale;
                const vy = (tableDInch / 2 - cy) * finalScale;
                
                setViewTransform({ x: vx, y: vy, k: targetK });
            }
        }
    };
    
    const handleFitView = () => {
        fitViewToTracks(sections);
    };

    const handleUndo = () => { if (history.length === 0) return; const prev = history[history.length - 1]; setFuture(curr => [sections, ...curr]); setSections(prev); setHistory(curr => curr.slice(0, -1)); setSelected(null); };
    const handleRedo = () => { if (future.length === 0) return; const next = future[0]; setHistory(curr => [...curr, sections]); setSections(next); setFuture(curr => curr.slice(1)); setSelected(null); };

    const executeClearAll = () => {
        pushHistory(sections); setSelected(null); setToolMode('select'); setPendingSplit(null);
        
        // FIX: Reset to current table center
        const cx = (unit === 'cm' ? tableWidth / 2.54 : tableWidth) / 2;
        const cy = (unit === 'cm' ? tableDepth / 2.54 : tableDepth) / 2;

        setSections([{ id: 'main', x: cx, y: cy, heading: 0, pieces: [], colorSet: 0, groupId: null }]);
        setFuture([]); setShowClearConfirm(false); setNotification({ msg: t('clear_success'), type: 'success' });
    };

    const clearAll = () => setShowClearConfirm(true);

    const handleSaveTrack = () => {
        const trackData = {
            formatVersion: 2,
            appVersion: APP_VERSION,
            timestamp: new Date().toISOString(),
            settings: { trackName, lanes, unit, tableWidth, tableDepth, lang, laneColors },
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

    const handleLoadTrackClick = () => { if (fileInputRef.current) fileInputRef.current.click(); };
    const handleImportTrackClick = () => { if (importInputRef.current) importInputRef.current.click(); };

    const executeLoad = (json) => {
        const s = json.settings || {}; 
        if (s.trackName) setTrackName(s.trackName);
        if (s.lanes) setLanes(s.lanes);
        if (s.unit) setUnit(s.unit);
        if (s.tableWidth) setTableWidth(s.tableWidth);
        if (s.tableDepth) setTableDepth(s.tableDepth);
        if (s.laneColors) setLaneColors(s.laneColors);
        
        const sectionsData = json.data?.sections || json.sections;

        if (sectionsData && Array.isArray(sectionsData)) {
            pushHistory(sections); 
            setSelected(null);
            setToolMode('select');
            
            const loadedSections = sectionsData.map(sec => {
                const hydratedPieces = sec.pieces.map(p => {
                    const brand = p.brand || 'AFX';
                    let brandData = TRACK_DATA[brand];
                    if (!brandData) brandData = TRACK_DATA['AFX'];

                    let baseData = Object.values(brandData.pieces).find(bp => bp.id === p.id);
                    
                    if (!baseData) {
                        if (p.type === 'curve' || (p.id && p.id.includes('C'))) {
                             baseData = TRACK_DATA['AFX'].pieces.curve_9;
                        } else {
                             baseData = TRACK_DATA['AFX'].pieces.straight_15;
                        }
                    }

                    return { 
                        ...baseData, 
                        ...p,        
                        length: typeof p.length === 'number' ? p.length : baseData.length,
                        radius: typeof p.radius === 'number' ? p.radius : baseData.radius,
                        degree: typeof p.degree === 'number' ? p.degree : baseData.degree,
                        uid: p.uid || Date.now() + Math.random(),
                        dir: p.dir !== undefined ? Number(p.dir) : (baseData.dir || 1),
                        brand: brand
                    };
                });

                return { 
                    ...sec, 
                    pieces: hydratedPieces,
                    x: parseFloat(sec.x) || 0,
                    y: parseFloat(sec.y) || 0,
                    heading: parseFloat(sec.heading) || 0,
                    groupId: null 
                };
            });
            
            setSections(loadedSections);
            setFuture([]); 
            
            // PRIORITY FIX: Use saved view if available, otherwise fit view.
            if (json.view && Number.isFinite(json.view.x) && Number.isFinite(json.view.y) && Number.isFinite(json.view.k)) {
                setViewTransform(json.view);
            } else {
                setTimeout(() => {
                    fitViewToTracks(loadedSections, s);
                }, 50);
            }

            setNotification({ msg: t('load_success'), type: 'success' });
        } else {
            setNotification({ msg: t('file_error'), type: 'error' });
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
                if (!json.formatVersion && !json.sections) { setNotification({ msg: t('file_error'), type: 'error' }); return; }
                const isEmpty = sections.length === 1 && sections[0].pieces.length === 0;
                if (!isEmpty) { setPendingLoadData(json); setShowLoadConfirm(true); } else { executeLoad(json); }
            } catch (err) { setNotification({ msg: t('file_error'), type: 'error' }); }
        };
        reader.readAsText(file);
    };

    const handleImportFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target.result);
                const sectionsData = json.data?.sections || json.sections || [];
                const newSections = sectionsData.map((sec, i) => ({ ...sec, id: `import_${Date.now()}_${i}`, groupId: null }));
                pushHistory(sections); setSections([...sections, ...newSections]);
                setNotification({ msg: t('import_success'), type: 'success' });
            } catch (err) { setNotification({ msg: t('file_error'), type: 'error' }); }
        };
        reader.readAsText(file);
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

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 0 && /MacIntel/.test(navigator.userAgent));

        tempCanvas.toBlob(async (blob) => {
             if (!blob) return;
             if (isMobile && navigator.canShare && navigator.canShare({ files: [new File([blob], fileName, { type: 'image/png' })] })) {
                 const file = new File([blob], fileName, { type: 'image/png' });
                 try {
                     await navigator.share({ files: [file], title: 'Slot Car Track' });
                 } catch (err) { console.error("Share failed", err); }
             } else {
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

    // -------------------------------------------------------------------------
    // --- 6. LOGIC HANDLERS (Priority Level 4: Add/Remove/Split/Rotate) ---
    // -------------------------------------------------------------------------

    const performSplit = (sectionId, pieceIndex, selectSide = 'after') => {
        const secIndex = sections.findIndex(s => s.id === sectionId);
        if (secIndex === -1) return;
        const section = sections[secIndex];
        if (pieceIndex >= section.pieces.length - 1) return;
        const piecesBefore = section.pieces.slice(0, pieceIndex + 1);
        const piecesAfter = section.pieces.slice(pieceIndex + 1);
        const dummy = { ...section, pieces: piecesBefore };
        const end = calculateSectionEndpoints(dummy).end;
        let cx = end.x + Math.cos(toRad(end.heading)) * 2; 
        let cy = end.y + Math.sin(toRad(end.heading)) * 2;
        const newSection1 = { ...section, pieces: piecesBefore, groupId: null };
        const newSection2 = { id: `sec_${Date.now()}_${Math.random()}`, x: cx, y: cy, heading: end.heading, pieces: piecesAfter, colorSet: section.colorSet, groupId: null };
        return { newSection1, newSection2, originalIndex: secIndex };
    };

    // ISOLATION LOGIC HELPER
    const performIsolate = (hitSec, hitIndex) => {
        const pieces = hitSec.pieces;
        const pIdx = hitIndex;
        
        // 1. Calculate positions for all potential segments
        // Target Piece Start
        const targetRel = calculateRelativeTransform(pieces, pIdx); // Relative to section start
        // To find absolute start of target piece:
        // We need geometry of pieces[0...pIdx-1]
        
        const prePieces = pieces.slice(0, pIdx);
        const preGeo = calculateSectionGeometry(prePieces, hitSec.x, hitSec.y, hitSec.heading);
        
        // Target absolute start is preGeo (end of prePieces)
        const targetStartX = prePieces.length > 0 ? preGeo.x : hitSec.x;
        const targetStartY = prePieces.length > 0 ? preGeo.y : hitSec.y;
        const targetStartH = prePieces.length > 0 ? preGeo.heading : hitSec.heading;

        // Post Piece Start
        // Calculate geometry including target piece
        const targetPiece = pieces[pIdx];
        const targetEndGeo = computePieceGeo(targetPiece, targetStartX, targetStartY, targetStartH);
        
        const sectionsToAdd = [];
        
        // A. Pre Section (if exists)
        if (pIdx > 0) {
            sectionsToAdd.push({
                ...hitSec,
                id: `sec_${Date.now()}_pre`,
                pieces: pieces.slice(0, pIdx),
                groupId: null
            });
        }
        
        // B. Target Section (Always exists, offset it)
        sectionsToAdd.push({
            id: `sec_${Date.now()}_target`,
            x: targetStartX + 2, // Offset X
            y: targetStartY + 2, // Offset Y
            heading: targetStartH,
            pieces: [targetPiece],
            colorSet: hitSec.colorSet,
            groupId: null
        });

        // C. Post Section (if exists)
        if (pIdx < pieces.length - 1) {
            sectionsToAdd.push({
                id: `sec_${Date.now()}_post`,
                x: targetEndGeo.x,
                y: targetEndGeo.y,
                heading: targetEndGeo.heading,
                pieces: pieces.slice(pIdx + 1),
                colorSet: hitSec.colorSet,
                groupId: null
            });
        }
        
        return {
             newSections: sectionsToAdd,
             originalIndex: sections.findIndex(s => s.id === hitSec.id),
             targetId: sectionsToAdd.find(s => s.id.includes('target')).id
        };
    };

    const addPiece = (pieceKey, turnDirection = 1) => {
        const pieceData = TRACK_DATA[activeBrand].pieces[pieceKey];
        if (toolMode !== 'select') setToolMode('select');
        const newPiece = { ...pieceData, brand: activeBrand, dir: turnDirection, uid: Date.now() + Math.random() };
        const newSections = [...sections];
        let targetSectionIndex = sections.length - 1;
        if (selected !== null) targetSectionIndex = sections.findIndex(s => s.id === selected.sectionId);
        let canConnect = true;
        if (targetSectionIndex !== -1 && newSections[targetSectionIndex].pieces.length > 0) {
             const existingBrand = newSections[targetSectionIndex].pieces[0].brand || 'AFX';
             if (existingBrand !== activeBrand) canConnect = false;
        }
        if (targetSectionIndex === -1 || newSections.length === 0 || !canConnect) {
            newSections.push({ id: `sec_${Date.now()}`, x: 0, y: 0, heading: 0, pieces: [newPiece], colorSet: 0, groupId: null });
            targetSectionIndex = newSections.length - 1;
            pushHistory(newSections);
            setSelected({ sectionId: newSections[targetSectionIndex].id, pieceIndex: 0, pieceUid: newPiece.uid });
        } else {
            const section = { ...newSections[targetSectionIndex] };
            const isCloserToStart = selected !== null && !selected.isWholeSection && (selected.pieceIndex < section.pieces.length / 2);
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
    
    const handleDelete = () => {
        if (selected === null) return;
        if (selected.isWholeSection) {
             const newSections = sections.filter(s => s.id !== selected.sectionId);
             pushHistory(newSections);
             setSelected(null);
             return;
        }
        const secIndex = sections.findIndex(s => s.id === selected.sectionId);
        if (secIndex === -1) return;
        const section = sections[secIndex];
        const idx = selected.pieceIndex;
        const piecesBefore = section.pieces.slice(0, idx);
        const piecesAfter = section.pieces.slice(idx + 1);
        const newSectionsList = [...sections];
        const afterStartGeo = calculateSectionGeometry(section.pieces, section.x, section.y, section.heading, idx + 1);

        if (piecesBefore.length === 0 && piecesAfter.length === 0) {
            newSectionsList.splice(secIndex, 1);
        } else if (piecesBefore.length > 0 && piecesAfter.length === 0) {
            newSectionsList[secIndex] = { ...section, pieces: piecesBefore, groupId: null };
        } else if (piecesBefore.length === 0 && piecesAfter.length > 0) {
            newSectionsList[secIndex] = { ...section, pieces: piecesAfter, x: afterStartGeo.x, y: afterStartGeo.y, heading: afterStartGeo.heading, groupId: null };
        } else {
            const sectionBefore = { ...section, pieces: piecesBefore, groupId: null };
            const sectionAfter = { id: `sec_${Date.now()}`, x: afterStartGeo.x, y: afterStartGeo.y, heading: afterStartGeo.heading, pieces: piecesAfter, colorSet: section.colorSet, groupId: null };
            newSectionsList.splice(secIndex, 1, sectionBefore, sectionAfter);
        }
        const finalSections = checkGroupConsistency(newSectionsList);
        pushHistory(finalSections);
        setSelected(null);
    };

    const handleDuplicate = () => {
        if (selected === null) return;
        const sourceSec = sections.find(s => s.id === selected.sectionId);
        if (!sourceSec) return;
        let newSection;
        const offset = 2; 
        if (selected.isWholeSection) {
            const newPieces = sourceSec.pieces.map(p => ({ ...p, uid: Date.now() + Math.random() }));
            newSection = { ...sourceSec, id: `sec_${Date.now()}_copy`, x: sourceSec.x + offset, y: sourceSec.y + offset, pieces: newPieces, groupId: null };
        } else {
            const sourcePiece = sourceSec.pieces[selected.pieceIndex];
            const newPiece = { ...sourcePiece, uid: Date.now() + Math.random() };
            const relGeo = calculateRelativeTransform(sourceSec.pieces, selected.pieceIndex);
            const rad = toRad(sourceSec.heading);
            const absX = sourceSec.x + (relGeo.x * Math.cos(rad) - relGeo.y * Math.sin(rad));
            const absY = sourceSec.y + (relGeo.x * Math.sin(rad) + relGeo.y * Math.cos(rad));
            const absHeading = sourceSec.heading + relGeo.heading;
            newSection = { id: `sec_${Date.now()}_copy`, x: absX + offset, y: absY + offset, heading: absHeading, pieces: [newPiece], colorSet: sourceSec.colorSet, groupId: null };
        }
        const newSectionsList = [...sections, newSection];
        pushHistory(newSectionsList);
        setSelected({ sectionId: newSection.id, pieceIndex: 0, pieceUid: newSection.pieces[0].uid, isWholeSection: selected.isWholeSection });
    };

    const rotateSection = (angle) => {
        if (selected === null) return;
        const rad = toRad(angle);
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const targetSec = sections.find(s => s.id === selected.sectionId);
        if (!targetSec) return;

        if (targetSec.groupId) {
            const pivotX = targetSec.x;
            const pivotY = targetSec.y;
            const newSections = sections.map(sec => {
                if (sec.groupId === targetSec.groupId) {
                    const dx = sec.x - pivotX;
                    const dy = sec.y - pivotY;
                    const newX = pivotX + (dx * cos - dy * sin);
                    const newY = pivotY + (dx * sin + dy * cos);
                    return { ...sec, x: newX, y: newY, heading: sec.heading + angle };
                }
                return sec;
            });
            pushHistory(newSections);
        } else {
            const newSections = sections.map(sec => sec.id === selected.sectionId ? { ...sec, heading: sec.heading + angle } : sec);
            pushHistory(newSections);
        }
    };

    const cycleColor = () => {
        if (selected === null) return;
        const targetSec = sections.find(s => s.id === selected.sectionId);
        const nextColorSet = (targetSec.colorSet + 1) % 4;
        const newSections = sections.map(sec => { if (sec.id === targetSec.id) return { ...sec, colorSet: nextColorSet }; return sec; });
        pushHistory(newSections);
    };

    // New handleFlip function with END ANCHOR logic
    const handleFlip = () => {
        if (selected === null) return;
        const secIndex = sections.findIndex(s => s.id === selected.sectionId);
        if (secIndex === -1) return;
        
        const section = sections[secIndex];
        const pIdx = selected.pieceIndex;
        const piece = section.pieces[pIdx];

        if (!piece || (piece.type !== 'curve' && !piece.isHairpin)) return;

        const newDir = -piece.dir;
        const newPieces = [...section.pieces];
        newPieces[pIdx] = { ...piece, dir: newDir };
        
        let newSection = { ...section, pieces: newPieces };

        // FIX: If flipping the first piece (index 0) and there are more pieces attached,
        // we must anchor the END of piece 0 so the rest of the track doesn't move.
        if (pIdx === 0 && section.pieces.length > 1) {
            // 1. Calculate Anchor (The joint between Piece 0 and Piece 1) BEFORE flip
            // This is the end of Piece 0.
            // We use calculateSectionGeometry with limitIndex=1 (calculates up to end of piece 0)
            const anchorGeo = calculateSectionGeometry(section.pieces, section.x, section.y, section.heading, 1);
            
            // 2. Calculate New Heading
            // New End Heading (at Anchor) must equal Old End Heading (anchorGeo.heading)
            // EndH = StartH + Sweep
            // So: NewStartH = EndH - NewSweep
            const newSweep = newPieces[0].degree * newPieces[0].dir;
            const newStartHeading = anchorGeo.heading - newSweep;

            // 3. Calculate New Start X, Y
            // We need to back-trace from Anchor to Start using the NEW geometry.
            // Let's compute the NEW piece geometry assuming it starts at 0,0,0
            const relGeo = computePieceGeo(newPieces[0], 0, 0, 0); 
            // relGeo.x, relGeo.y is the vector from Start to End (if StartHeading was 0)
            
            // We need to rotate this vector by the NewStartHeading
            const rad = toRad(newStartHeading);
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            
            // Vector from NewStart to Anchor
            const vecX = relGeo.x * cos - relGeo.y * sin;
            const vecY = relGeo.x * sin + relGeo.y * cos;
            
            // NewStart = Anchor - Vector
            const newStartX = anchorGeo.x - vecX;
            const newStartY = anchorGeo.y - vecY;

            newSection = { ...newSection, x: newStartX, y: newStartY, heading: newStartHeading };
        }

        const newSections = [...sections];
        newSections[secIndex] = newSection;
        
        pushHistory(newSections);
    };

    const handleSplitButtonClick = () => { setToolMode('split'); setSelected(null); setPendingSplit(null); };

    // -------------------------------------------------------------------------
    // --- 7. INTERACTION HANDLERS (Priority Level 5: Mouse, Touch, Wheel) ---
    // -------------------------------------------------------------------------

    const getHitPiece = (pos) => {
        let hit = null;
        const currentScale = scaleRef.current * viewTransform.k;
        const trackHalfWidth = 1.5 * currentScale;
        let minD = Math.max(5, trackHalfWidth); 

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
                    const tol = 0.01; 
                    if (region.dir === 1) { if (angle >= -tol && angle <= region.sweep + tol) d = Math.abs(dist - region.r); }
                    else { if (angle >= -region.sweep - tol && angle <= tol) d = Math.abs(dist - region.r); }
                }
            }
            if (d < minD) { minD = d; hit = region; }
        }
        return hit;
    };

    const handleMouseUp = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }

        if (isDragging) {
            if (snapCandidate) {
                if (snapCandidate.type === 'side') {
                    const draggingSecIdx = sections.findIndex(s => s.id === selected.sectionId);
                    const targetSecIdx = sections.findIndex(s => s.id === snapCandidate.targetSectionId);
                    
                    const draggingSec = sections[draggingSecIdx];
                    const targetSec = sections[targetSecIdx];

                    let newGroupId = draggingSec.groupId || targetSec.groupId || `group_${Date.now()}`;
                    
                    const newSecList = sections.map((s, idx) => {
                        if (idx === draggingSecIdx) {
                            // GROUP SIDE SNAP FIX: Apply delta to all group members
                            const dx = snapCandidate.placement.x - draggingSec.x;
                            const dy = snapCandidate.placement.y - draggingSec.y;
                            const dHeading = snapCandidate.placement.heading - draggingSec.heading;

                            // Let's re-calculate delta based on the LEADER (draggingSec).
                            return { 
                                     ...s, 
                                     x: snapCandidate.placement.x, 
                                     y: snapCandidate.placement.y, 
                                     heading: snapCandidate.placement.heading,
                                     groupId: newGroupId
                             };
                        }
                        
                        if (idx === targetSecIdx) {
                            return { ...s, groupId: newGroupId };
                        }
                        
                        // Sync other group members of dragging group
                        if (draggingSec.groupId && s.groupId === draggingSec.groupId) {
                            const dx = snapCandidate.placement.x - draggingSec.x;
                            const dy = snapCandidate.placement.y - draggingSec.y;
                            const dHeading = snapCandidate.placement.heading - draggingSec.heading;
                            
                            return { 
                                ...s, 
                                x: s.x + dx,
                                y: s.y + dy,
                                heading: s.heading + dHeading,
                                groupId: newGroupId 
                            };
                        }

                        if (targetSec.groupId && s.groupId === targetSec.groupId) return { ...s, groupId: newGroupId };

                        return s;
                    });
                    pushHistory(newSecList);
                } else {
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
                            const finalSec = { ...targetSec, pieces: mergedPieces, ...(isDragFirst ? { x: finalX, y: finalY, heading: finalHeading } : { x: targetSec.x, y: targetSec.y, heading: targetSec.heading }), groupId: null, colorSet: targetSec.colorSet };
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
                }
            } else { 
                pushHistory(sections); 
            }
            setIsDragging(false); setSnapCandidate(null);
            groupDragData.current = null;
        }
        setIsPanning(false);
    };

    const handleMouseDown = (e) => {
        const pos = getCanvasCoordinates(e);
        if (e.button === 1 || toolMode === 'pan') { setIsPanning(true); setPanStart(pos); return; }
        
        // Right Click to exit split mode
        if (toolMode === 'split' && e.button === 2) {
            e.preventDefault();
            setToolMode('select');
            setPendingSplit(null);
            return;
        }

        if (toolMode === 'split') {
            let bestJoint = null; let minJointDist = 45; // Increased tolerance for iPad
            jointsRef.current.forEach(joint => {
                const dist = Math.sqrt(Math.pow(pos.x - joint.x, 2) + Math.pow(pos.y - joint.y, 2));
                if (dist < minJointDist) { minJointDist = dist; bestJoint = joint; }
            });
            if (bestJoint) {
                // GUARD: Prevent splitting same point twice in a closed loop
                if (pendingSplit && pendingSplit.sectionId === bestJoint.sectionId && pendingSplit.pieceIndex === bestJoint.pieceIndex) {
                    return;
                }

                const targetSec = sections.find(s => s.id === bestJoint.sectionId);
                if (targetSec) {
                    const endpoints = calculateSectionEndpoints(targetSec);
                    const dist = Math.hypot(endpoints.start.x - endpoints.end.x, endpoints.start.y - endpoints.end.y);
                    const isClosed = dist < 0.5;

                    if (isClosed) {
                        if (!pendingSplit) {
                            // First cut of closed loop
                            setPendingSplit({ sectionId: bestJoint.sectionId, pieceIndex: bestJoint.pieceIndex });
                        } else if (pendingSplit.sectionId === bestJoint.sectionId) {
                            // Second cut of closed loop
                            // Perform 2-point split: essentially unroll and split
                            const pieces = targetSec.pieces;
                            const idxA = Math.min(pendingSplit.pieceIndex, bestJoint.pieceIndex);
                            const idxB = Math.max(pendingSplit.pieceIndex, bestJoint.pieceIndex);
                            
                            // Segment 1: pieces between idxA+1 and idxB (inclusive)
                            const pieces1 = pieces.slice(idxA + 1, idxB + 1);
                            
                            // Segment 2: The rest, wrapped around.
                            // Part A: pieces from idxB+1 to end
                            // Part B: pieces from 0 to idxA
                            const pieces2 = [...pieces.slice(idxB + 1), ...pieces.slice(0, idxA + 1)];
                            
                            // Calculate Lengths for comparison
                            let len1 = 0; pieces1.forEach(p => len1 += getPieceLength(p));
                            let len2 = 0; pieces2.forEach(p => len2 += getPieceLength(p));

                            // Geometry for Segment 1 starts after piece at idxA
                            const startGeo1 = calculateSectionGeometry(pieces, targetSec.x, targetSec.y, targetSec.heading, idxA + 1);
                            
                            // Geometry for Segment 2 starts after piece at idxB
                            const startGeo2 = calculateSectionGeometry(pieces, targetSec.x, targetSec.y, targetSec.heading, idxB + 1);

                            // Displacement offset for visual feedback
                            const offset = 2; 

                            // Determine which section to offset based on length
                            // If len1 is shorter, offset sec1. Else offset sec2.
                            const moveSec1 = len1 < len2;

                            const newSec1 = { 
                                id: `sec_${Date.now()}_1`, 
                                x: moveSec1 ? startGeo1.x + offset : startGeo1.x, 
                                y: moveSec1 ? startGeo1.y + offset : startGeo1.y, 
                                heading: startGeo1.heading, 
                                pieces: pieces1, 
                                colorSet: targetSec.colorSet, 
                                groupId: null 
                            };

                            const newSec2 = { 
                                id: `sec_${Date.now()}_2`, 
                                x: !moveSec1 ? startGeo2.x + offset : startGeo2.x, 
                                y: !moveSec1 ? startGeo2.y + offset : startGeo2.y, 
                                heading: startGeo2.heading, 
                                pieces: pieces2, 
                                colorSet: targetSec.colorSet, 
                                groupId: null 
                            };
                            
                            const newSections = sections.filter(s => s.id !== targetSec.id);
                            if(pieces1.length > 0) newSections.push(newSec1);
                            if(pieces2.length > 0) newSections.push(newSec2);
                            
                            pushHistory(newSections);
                            setPendingSplit(null);
                            setToolMode('select');
                        } else {
                            // Clicked different closed section, reset pending
                            setPendingSplit({ sectionId: bestJoint.sectionId, pieceIndex: bestJoint.pieceIndex });
                        }
                    } else {
                        // Open track - standard split
                        const res = performSplit(bestJoint.sectionId, bestJoint.pieceIndex); 
                        const newSections = [...sections];
                        newSections.splice(res.originalIndex, 1, res.newSection1, res.newSection2);
                        pushHistory(newSections);
                        // Stay in split mode for open tracks
                    }
                }
                return; 
            }
            
            // NEW: Exit if no joint found (clicked empty space)
            setToolMode('select');
            setPendingSplit(null);
            return;
        }
        
        const hit = getHitPiece(pos);

        if (hit) {
            const isSameSection = selected !== null && selected.isWholeSection && selected.sectionId === hit.sectionId;
            setSelected({ sectionId: hit.sectionId, pieceIndex: hit.index, pieceUid: hit.uid, isWholeSection: isSameSection });
            setIsDragging(true); setDragStart(pos);
            
            const secRef = sections.find(s => s.id === hit.sectionId);
            if (secRef) {
                setSectionStartPos({ x: secRef.x, y: secRef.y });
                
                if (secRef.groupId) {
                    const groupMembers = sections.filter(s => s.groupId === secRef.groupId);
                    const groupData = {};
                    groupMembers.forEach(m => {
                        groupData[m.id] = { startX: m.x, startY: m.y };
                    });
                    groupDragData.current = groupData;
                } else {
                    groupDragData.current = null;
                }
            }

            if (e.clientX !== undefined) {
                mouseDownScreen.current = { x: e.clientX, y: e.clientY };
            } else if (e.touches && e.touches[0]) {
                mouseDownScreen.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
            
            longPressTimer.current = setTimeout(() => {
                setSelected(prev => {
                    if (prev && prev.sectionId === hit.sectionId) {
                        return { ...prev, isWholeSection: true };
                    }
                    return prev;
                });
            }, 600);
        } else { setSelected(null); }
    };
    
    const handleDoubleClick = (e) => {
        const pos = getCanvasCoordinates(e);
        const hit = getHitPiece(pos);
        
        if (hit) {
            const hitSec = sections.find(s => s.id === hit.sectionId);
            const clickedPiece = hitSec.pieces[hit.index];
            
            // Side Detach Logic
            if (hitSec.groupId && clickedPiece.isTerminal) {
                const newSections = sections.map(s => {
                    if (s.id === hitSec.id) {
                        // Detach and nudge slightly to show visual feedback
                        return { ...s, groupId: null, x: s.x + 0.5, y: s.y + 0.5 };
                    }
                    return s;
                });
                const refinedSections = checkGroupConsistency(newSections);
                pushHistory(refinedSections);
                setSelected({ sectionId: hitSec.id, pieceIndex: hit.index, pieceUid: clickedPiece.uid });
                return;
            }

            // ISOLATION LOGIC (3-Way Split)
            const isoRes = performIsolate(hitSec, hit.index);
            
            const newSections = [...sections];
            // Replace original with new fragments
            newSections.splice(isoRes.originalIndex, 1, ...isoRes.newSections);
            
            pushHistory(newSections);
            setSelected({ sectionId: isoRes.targetId, pieceIndex: 0, pieceUid: clickedPiece.uid });
        }
    };

    const handleMouseMove = (e) => {
        if (longPressTimer.current) {
            let cx, cy;
            if (e.touches && e.touches[0]) { cx = e.touches[0].clientX; cy = e.touches[0].clientY; }
            else { cx = e.clientX; cy = e.clientY; }
            
            const dist = Math.hypot(cx - mouseDownScreen.current.x, cy - mouseDownScreen.current.y);
            if (dist > 10) {
                clearTimeout(longPressTimer.current);
                longPressTimer.current = null;
            }
        }

        const pos = getCanvasCoordinates(e);
        if (isPanning) {
            const dx = (pos.x - panStart.x);
            const dy = (pos.y - panStart.y);
            setViewTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
            setPanStart(pos);
            return;
        }
        
        if (toolMode === 'split') {
            let bestJoint = null; let minJointDist = 45; // Increased tolerance
            jointsRef.current.forEach(joint => {
                const dist = Math.sqrt(Math.pow(pos.x - joint.x, 2) + Math.pow(pos.y - joint.y, 2));
                if (dist < minJointDist) { minJointDist = dist; bestJoint = joint; }
            });
            setHoveredJoint(bestJoint); 
            return;
        }
        
        if (!isDragging || !selected) return;
        const scale = scaleRef.current;
        const dxInch = (pos.x - dragStart.x) / (scale * viewTransform.k); 
        const dyInch = (pos.y - dragStart.y) / (scale * viewTransform.k);
        const draggingSection = sections.find(s => s.id === selected.sectionId);
        if (!draggingSection) return;
        
        const currentGroupData = groupDragData.current;

        // GROUP SNAP LOGIC: Check all members of the drag group
        let activeDragSections = [];
        if (draggingSection.groupId && currentGroupData) {
             activeDragSections = sections.filter(s => s.groupId === draggingSection.groupId).map(s => {
                 const init = currentGroupData[s.id];
                 if (!init) return null;
                 return { ...s, x: init.startX + dxInch, y: init.startY + dyInch }; // Projected position
             }).filter(s => s !== null);
        } else {
             const newX = sectionStartPos.x + dxInch; 
             const newY = sectionStartPos.y + dyInch;
             activeDragSections = [{ ...draggingSection, x: newX, y: newY }];
        }
        
        // 2. Collect Terminals from ALL active drag sections
        const allDragTerminals = [];
        activeDragSections.forEach(sec => {
            sec.pieces.forEach((p, idx) => {
                if (p.isTerminal) {
                    allDragTerminals.push({ piece: p, index: idx, section: sec });
                }
            });
        });

        // 3. Update Visuals (State)
        if (draggingSection.groupId && currentGroupData) {
             setSections(prev => prev.map(sec => {
                 if (sec.groupId === draggingSection.groupId && currentGroupData[sec.id]) {
                       const init = currentGroupData[sec.id];
                       return { ...sec, x: init.startX + dxInch, y: init.startY + dyInch };
                 }
                 return sec;
             }));
        } else {
             const newX = sectionStartPos.x + dxInch; 
             const newY = sectionStartPos.y + dyInch;
             setSections(prev => prev.map(sec => { if (sec.id === selected.sectionId) return { ...sec, x: newX, y: newY }; return sec; }));
        }

        // 4. Check Snaps
        let bestSnap = null; 
        let minSnapDist = 1.0;

        // Standard End-to-End Snap Logic
        const leader = activeDragSections.find(s => s.id === draggingSection.id) || activeDragSections[0];
        
        if (leader) {
             const dragPoints = calculateSectionEndpoints(leader);
             const dragSnapPoints = [dragPoints.start, dragPoints.end];

             sections.forEach(targetSec => {
                // Skip if target is part of the dragging group
                if (activeDragSections.some(s => s.id === targetSec.id)) return;

                const targetPoints = calculateSectionEndpoints(targetSec);
                const targetSnapPoints = [targetPoints.start, targetPoints.end];

                dragSnapPoints.forEach(dragPt => {
                    targetSnapPoints.forEach(targetPt => {
                        const dist = Math.sqrt(Math.pow(dragPt.x - targetPt.x, 2) + Math.pow(dragPt.y - targetPt.y, 2));
                        if (dist < minSnapDist) { 
                            minSnapDist = dist; 
                            bestSnap = { 
                                targetSectionId: targetSec.id, 
                                targetEnd: targetPt.type, 
                                sourceEnd: dragPt.type, 
                                targetPoint: targetPt, 
                                sourcePoint: dragPt 
                            }; 
                        }
                    });
                });
             });
        }

        // Terminal Side Snap Logic
        if (allDragTerminals.length > 0) {
             allDragTerminals.forEach(({ piece: dPiece, index: dIdx, section: dSec }) => {
                // Calculate dRel, dSecRad relative to the PROJECTED section dSec
                const dRel = calculateRelativeTransform(dSec.pieces, dIdx);
                const dSecRad = toRad(dSec.heading);
                const dOffX = dRel.x * Math.cos(dSecRad) - dRel.y * Math.sin(dSecRad);
                const dOffY = dRel.x * Math.sin(dSecRad) + dRel.y * Math.cos(dSecRad);
                
                const dAbsHeading = dSec.heading + dRel.heading;
                const dStartX = dSec.x + dOffX; 
                const dStartY = dSec.y + dOffY;
                const dMidX = dStartX + Math.cos(toRad(dAbsHeading)) * (dPiece.length/2);
                const dMidY = dStartY + Math.sin(toRad(dAbsHeading)) * (dPiece.length/2);

                sections.forEach(targetSec => {
                    // Skip self and own group members
                    if (activeDragSections.some(s => s.id === targetSec.id)) return;

                    targetSec.pieces.forEach((tPiece, tIdx) => {
                        if (!tPiece.isTerminal) return;
                        
                        const tRel = calculateRelativeTransform(targetSec.pieces, tIdx);
                        const tSecRad = toRad(targetSec.heading);
                        const tOffX = tRel.x * Math.cos(tSecRad) - tRel.y * Math.sin(tSecRad);
                        const tOffY = tRel.x * Math.sin(tSecRad) + tRel.y * Math.cos(tSecRad);
                        const tAbsHeading = targetSec.heading + tRel.heading;
                        const tStartX = targetSec.x + tOffX;
                        const tStartY = targetSec.y + tOffY;
                        const tMidX = tStartX + Math.cos(toRad(tAbsHeading)) * (tPiece.length/2);
                        const tMidY = tStartY + Math.sin(toRad(tAbsHeading)) * (tPiece.length/2);
                        
                        const trackWidth = TRACK_DATA[tPiece.brand || activeBrand].trackWidth || 3;
                        const leftX = tMidX + Math.cos(toRad(tAbsHeading) - Math.PI/2) * trackWidth;
                        const leftY = tMidY + Math.sin(toRad(tAbsHeading) - Math.PI/2) * trackWidth;
                        const rightX = tMidX + Math.cos(toRad(tAbsHeading) + Math.PI/2) * trackWidth;
                        const rightY = tMidY + Math.sin(toRad(tAbsHeading) + Math.PI/2) * trackWidth;
                        
                        [ {x: leftX, y: leftY}, {x: rightX, y: rightY} ].forEach(pt => {
                            const dist = Math.sqrt(Math.pow(dMidX - pt.x, 2) + Math.pow(dMidY - pt.y, 2));
                            if (dist < minSnapDist) {
                                // BRAND CHECK: Prevent snapping different brands laterally
                                const dragBrand = dPiece.brand || activeBrand;
                                const targetBrand = tPiece.brand || (targetSec.pieces[0] ? targetSec.pieces[0].brand : 'AFX');
                                
                                if (dragBrand === targetBrand) {
                                    minSnapDist = dist;
                                    
                                    const parallelHeading = tAbsHeading - dRel.heading;
                                    const antiHeading = parallelHeading + 180;
                                    
                                    const normCurrent = (dSec.heading % 360 + 360) % 360;
                                    const normParallel = (parallelHeading % 360 + 360) % 360;
                                    const normAnti = (antiHeading % 360 + 360) % 360;
                                    
                                    const diffParallel = Math.min(Math.abs(normCurrent - normParallel), 360 - Math.abs(normCurrent - normParallel));
                                    const diffAnti = Math.min(Math.abs(normCurrent - normAnti), 360 - Math.abs(normCurrent - normAnti));
                                    
                                    const bestHeading = diffParallel <= diffAnti ? parallelHeading : antiHeading;
                                    const bestRad = toRad(bestHeading);
                                    
                                    // REVERSE CALCULATION:
                                    // We found the target pos for MEMBER (dSec).
                                    // We need to set 'placement' for LEADER (draggingSection).
                                    
                                    // 1. Calculate where Member needs to be
                                    const finalOffX = dRel.x * Math.cos(bestRad) - dRel.y * Math.sin(bestRad);
                                    const finalOffY = dRel.x * Math.sin(bestRad) + dRel.y * Math.cos(bestRad);
                                    const pieceAbsHeading = bestHeading + dRel.heading;
                                    const pieceAbsRad = toRad(pieceAbsHeading);
                                    const dMidX_Offset = Math.cos(pieceAbsRad) * (dPiece.length/2);
                                    const dMidY_Offset = Math.sin(pieceAbsRad) * (dPiece.length/2);
                                    const memberTargetX = pt.x - dMidX_Offset - finalOffX;
                                    const memberTargetY = pt.y - dMidY_Offset - finalOffY;

                                    // 2. Calculate offset from current projected pos
                                    const deltaX = memberTargetX - dSec.x;
                                    const deltaY = memberTargetY - dSec.y;
                                    
                                    // 3. Apply offset to Leader's projected pos
                                    // Leader is activeDragSections[0] usually, or find by id
                                    const leaderProjected = activeDragSections.find(s => s.id === draggingSection.id);
                                    const leaderTargetX = leaderProjected.x + deltaX;
                                    const leaderTargetY = leaderProjected.y + deltaY;

                                    bestSnap = { 
                                        type: 'side', 
                                        targetSectionId: targetSec.id,
                                        snapLocation: { x: pt.x, y: pt.y }, 
                                        placement: { x: leaderTargetX, y: leaderTargetY, heading: bestHeading } 
                                    };
                                }
                            }
                        });
                    });
                });
             });
        }
        
        setSnapCandidate(bestSnap);
    };

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
            
            if (longPressTimer.current) {
                clearTimeout(longPressTimer.current);
                longPressTimer.current = null;
            }
        } else if (e.touches.length === 1) {
             // FIX: Prevent double-firing on iPad (touch + simulated mouse)
             // Also prevents scrolling while interacting
             e.preventDefault();
             handleMouseDown(e.touches[0]);
        }
    };

    const handleTouchMove = (e) => {
          if (e.touches.length === 2) {
            e.preventDefault();
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
            const scaleFactor = dist / touchStartDist.current;
            const newScale = Math.min(Math.max(0.1, touchStartScale.current * scaleFactor), 5);
            const cx = (t1.clientX + t2.clientX) / 2;
            const cy = (t1.clientY + t2.clientY) / 2;
            const dx = cx - touchStartPan.current.x;
            const dy = cy - touchStartPan.current.y;
            setViewTransform(prev => ({ ...prev, k: newScale, x: touchStartView.current.x + dx, y: touchStartView.current.y + dy }));
         } else if (e.touches.length === 1) {
             // Pass through preventDefault if handled by move logic
             // handleMouseMove(e.touches[0]);
             // e.preventDefault(); // Usually handled inside logic if dragging
             handleMouseMove(e.touches[0]);
         }
    };
    
    const handleTouchEnd = (e) => {
        handleMouseUp();
    };

    const handleWheel = useCallback((e) => {
        e.preventDefault(); 
        const scaleAmount = -e.deltaY * 0.001;
        const newScale = Math.min(Math.max(0.1, viewTransform.k * (1 + scaleAmount)), 5);
        setViewTransform(prev => ({ ...prev, k: newScale }));
    }, [viewTransform]);

    return (
        <div className="h-screen w-full bg-gray-50 font-sans relative overflow-hidden text-gray-800 select-none" onWheel={handleWheel} onContextMenu={(e) => { e.preventDefault(); if(toolMode==='split') { setToolMode('select'); setPendingSplit(null); } }}>
            <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} 
                className="absolute inset-0 w-full h-full touch-none z-0" 
                style={{ 
                    cursor: toolMode === 'split' ? scissorCursor : (toolMode === 'flip' ? 'alias' : (toolMode === 'grouping' ? 'copy' : (isPanning ? 'grabbing' : (toolMode === 'pan' ? 'grab' : 'crosshair')))),
                    touchAction: 'none', 
                    WebkitTouchCallout: 'none', 
                    WebkitUserSelect: 'none', 
                    userSelect: 'none'
                }} 
                onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
                onDoubleClick={handleDoubleClick}
                onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} />
            
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" style={{ display: 'none' }} />
            <input type="file" ref={importInputRef} onChange={handleImportFileChange} accept=".json" style={{ display: 'none' }} />
            
            {/* Split Mode Hint Overlay */}
            {toolMode === 'split' && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-top-2">
                    <div className="bg-black/75 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm flex items-center gap-2 shadow-lg border border-white/10">
                        <Scissors size={16} className="text-yellow-400" />
                        <span className="font-bold">{pendingSplit ? t('split_phase2_hint') : t('split_mode_hint')}</span>
                        <span className="opacity-50 mx-1">|</span>
                        <span className="text-gray-300 text-xs">{t('split_exit_hint')}</span>
                    </div>
                </div>
            )}

            {/* Notification Toast */}
            {notification !== null && (
                <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-xl text-sm font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5 z-50 ${notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                    {notification.type === 'error' ? <AlertTriangle size={16}/> : <CheckCircle size={16}/>}
                    {String(notification.msg)}
                </div>
            )}

            {/* Top Left UI */}
            <div className="absolute top-4 left-4 z-10 flex gap-2 pointer-events-none">
                {showUI && (
                    <div className="pointer-events-auto relative">
                        <button onClick={() => setShowSettings(!showSettings)} className="bg-white p-2 rounded-lg shadow-md border hover:bg-gray-50 text-gray-700 tooltip" title={t('settings')}><Settings size={20} /></button>
                        {showSettings && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white p-4 rounded-xl shadow-xl border animate-in fade-in slide-in-from-top-2 duration-200">
                                {/* Settings Content */}
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase">{t('settings')}</h3>
                                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{APP_VERSION}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mb-4 border-b pb-4">
                                    <button onClick={handleSaveTrack} className="flex items-center justify-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 p-2 rounded text-xs font-bold border border-blue-200"><Save size={14} /> {t('save_btn')}</button>
                                    <button onClick={handleLoadTrackClick} className="flex items-center justify-center gap-1 bg-green-50 text-green-700 hover:bg-green-100 p-2 rounded text-xs font-bold border border-green-200"><FolderOpen size={14} /> {t('load_btn')}</button>
                                    <button onClick={handleImportTrackClick} className="flex items-center justify-center gap-1 bg-orange-50 text-orange-700 hover:bg-orange-100 p-2 rounded text-xs font-bold border border-orange-200"><FilePlus size={14} /> {t('import_btn')}</button>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div><label className="text-xs text-gray-500 block mb-1">{t('track_name')}</label><input type="text" value={trackName} onChange={e => setTrackName(e.target.value)} placeholder={lang === 'en' ? "Track 01" : "跑道01"} className="w-full border rounded p-1" /></div>
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">{t('language')}</label>
                                        <div className="flex border rounded overflow-hidden">
                                            <button onClick={() => setLang('en')} className={`flex-1 py-1 text-xs ${lang==='en'?'bg-blue-600 text-white':'bg-white hover:bg-gray-50'}`}>English</button>
                                            <button onClick={() => setLang('zh')} className={`flex-1 py-1 text-xs ${lang==='zh'?'bg-blue-600 text-white':'bg-white hover:bg-gray-50'}`}>繁體中文</button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">{t('unit')}</label>
                                        <div className="flex border rounded overflow-hidden">
                                            <button onClick={() => changeUnit('cm')} className={`flex-1 py-1 text-xs ${unit==='cm'?'bg-blue-600 text-white':'bg-white hover:bg-gray-50'}`}>cm</button>
                                            <button onClick={() => changeUnit('in')} className={`flex-1 py-1 text-xs ${unit==='in'?'bg-blue-600 text-white':'bg-white hover:bg-gray-50'}`}>in</button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div><label className="text-xs text-gray-500 block mb-1">{t('width')}</label><input type="number" value={tableWidth} onChange={e=>setTableWidth(Number(e.target.value))} className="w-full border rounded p-1" /></div>
                                        <div><label className="text-xs text-gray-500 block mb-1">{t('depth')}</label><input type="number" value={tableDepth} onChange={e=>setTableDepth(Number(e.target.value))} className="w-full border rounded p-1" /></div>
                                    </div>
                                    <div className="pt-2 border-t mt-2">
                                        <label className="text-xs text-gray-500 block mb-1">{t('lane_colors_title')}</label>
                                        <div className="grid grid-cols-4 gap-1">
                                            {laneColors.map((color, idx) => (
                                                <input key={idx} type="color" value={color} onChange={(e) => handleLaneColorChange(idx, e.target.value)} className="w-full h-6 border-none cursor-pointer rounded p-0 overflow-hidden" title={`Lane ${idx+1}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {showUI && (
                    <div className="pointer-events-auto flex bg-white rounded-lg shadow-md border overflow-hidden mr-2">
                        <button onClick={handleUndo} disabled={history.length===0} className="p-2 hover:bg-gray-50 disabled:opacity-50 text-gray-700 border-r" title={t('undo')}><Undo2 size={20}/></button>
                        <button onClick={handleRedo} disabled={future.length===0} className="p-2 hover:bg-gray-50 disabled:opacity-50 text-gray-700 border-r" title={t('redo')}><Redo2 size={20}/></button>
                        <button onClick={executeClearAll} className="p-2 hover:bg-red-50 text-red-600" title={t('clear_all')}><Eraser size={20}/></button>
                    </div>
                )}
                
                {showUI && (
                    <>
                        <div className="pointer-events-auto bg-white px-3 py-2 rounded-lg shadow-md border border-gray-200 text-sm font-bold text-gray-600 flex items-center gap-2 mr-2"><PenLine size={16} /> {t('total_length')}: {formatLength(trackStats.displayLength)}</div>
                        <div className={`pointer-events-auto flex items-center px-3 rounded-lg shadow-md border text-sm font-bold ${closureStatus.closed ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-500'}`}>{closureStatus.closed ? <><CheckCircle size={16} className="mr-1"/> {t('status_closed')}</> : <><Ruler size={16} className="mr-1"/> {formatLength(closureStatus.gap)} {t('status_open')}</>}</div>
                    </>
                )}
            </div>

            {/* Top Right UI */}
            <div className="absolute top-4 right-4 z-10 flex gap-2 pointer-events-none">
                {showUI && (
                <>
                    <button onClick={handleFitView} className="pointer-events-auto p-2 bg-white rounded-lg shadow-md border hover:bg-gray-50 text-gray-700 transition-colors tooltip" title={t('fit_view')}><Focus size={20} /></button>
                    <button onClick={() => setShowHelp(true)} className="pointer-events-auto p-2 bg-white rounded-lg shadow-md border hover:bg-gray-50 text-gray-700 transition-colors tooltip" title={t('help_title')}><BookOpen size={20} /></button>
                    <button onClick={() => setShowBOM(!showBOM)} className={`pointer-events-auto p-2 rounded-lg shadow-md border transition-colors ${showBOM ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`} title={t('bom')}><List size={20} /></button>
                    <a href="https://ko-fi.com/jaylin86755" target="_blank" rel="noopener noreferrer" className="pointer-events-auto p-2 bg-white rounded-lg shadow-md border hover:bg-gray-50 text-pink-500 transition-colors tooltip flex items-center justify-center" title={t('kofi')}><Coffee size={20} /></a>
                </>
                )}
                <button onClick={() => setShowUI(!showUI)} className={`pointer-events-auto p-2 rounded-lg shadow-md border transition-colors ${!showUI ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`} title={t('toggle_ui')}>{showUI ? <EyeOff size={20} /> : <Eye size={20} />}</button>
            </div>

            {/* Parts Library */}
            {showUI && (
                <div className="absolute right-4 top-20 bottom-20 w-auto z-10 flex flex-col gap-2 pointer-events-none">
                    <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg border border-gray-200 p-2 flex flex-col gap-2 pointer-events-auto overflow-y-auto custom-scrollbar items-center max-h-full" onWheel={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
                        {/* Brand Switcher */}
                        <div className="flex w-full mb-2 bg-gray-100 p-1 rounded-lg shrink-0">
                            <button onClick={() => { setActiveBrand('AFX'); setSelected(null); }} className={`flex-1 py-1 text-xs font-bold rounded ${activeBrand === 'AFX' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>AFX</button>
                            <button onClick={() => { setActiveBrand('TYCO'); setSelected(null); }} className={`flex-1 py-1 text-xs font-bold rounded ${activeBrand === 'TYCO' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>TYCO</button>
                        </div>

                        <div className="w-full border-b pb-2 mb-1 flex flex-col gap-2 shrink-0">
                            <div className="text-[9px] font-bold text-gray-400 text-center uppercase">{t('parts_special')}</div>
                            {Object.entries(TRACK_DATA[activeBrand].pieces).filter(([k, p]) => ['CX9', 'SQ9', 'SQ15', 'TERM', 'TERM9'].includes(p.id)).map(([key, p]) => (<button key={key} onClick={() => addPiece(key)} onMouseEnter={() => setPreviewPiece({ ...p, dir: 1, brand: activeBrand })} onMouseLeave={() => setPreviewPiece(null)} className={`w-12 h-8 rounded border flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-105 tooltip ${activeBrand === 'AFX' ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-red-50 border-red-200 text-red-800'}`} title={getPieceName(p.id)}>{(p.id.startsWith('TERM') ? <Zap size={14} /> : p.id)}</button>))}
                        </div>
                        <div className="w-full border-b pb-2 mb-1 flex flex-col gap-2 shrink-0">
                            <div className="text-[9px] font-bold text-gray-400 text-center uppercase">{t('parts_straight')}</div>
                            {Object.entries(TRACK_DATA[activeBrand].pieces).filter(([k, p]) => p.type === 'straight' && !['CX9', 'SQ9', 'SQ15', 'X9', 'TERM', 'TERM9'].includes(p.id)).map(([key, p]) => (<button key={key} onClick={() => addPiece(key)} onMouseEnter={() => setPreviewPiece({ ...p, dir: 1, brand: activeBrand })} onMouseLeave={() => setPreviewPiece(null)} className={`w-12 h-8 rounded border flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-105 tooltip ${activeBrand === 'AFX' ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-red-50 border-red-200 text-red-800'}`} title={getPieceName(p.id)}>{p.length}"</button>))}
                        </div>
                        <div className="flex flex-col gap-2 w-full items-center shrink-0">
                            <div className="text-[9px] font-bold text-gray-400 text-center uppercase">{t('parts_curve')}</div>
                            {Object.entries(TRACK_DATA[activeBrand].pieces).filter(([k, p]) => p.type === 'curve').map(([key, p]) => (
                                <div key={key} className="flex gap-1 items-center bg-gray-50 p-1 rounded border shadow-sm">
                                    <div className="flex flex-col items-center justify-center w-8">
                                        <span className="text-[10px] font-bold leading-tight">{p.radius}"</span>
                                        <span className="text-[9px] text-gray-500 leading-tight scale-90">{Math.round(360/p.degree) === 360/p.degree ? `1/${360/p.degree}` : `${p.degree}°`}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <button onClick={() => addPiece(key, -1)} onMouseEnter={() => setPreviewPiece({ ...p, dir: -1, brand: activeBrand })} onMouseLeave={() => setPreviewPiece(null)} className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${activeBrand === 'AFX' ? 'bg-white hover:bg-orange-50 text-orange-600' : 'bg-white hover:bg-orange-50 text-orange-600'}`}><ArrowLeft size={10}/></button>
                                        <button onClick={() => addPiece(key, 1)} onMouseEnter={() => setPreviewPiece({ ...p, dir: 1, brand: activeBrand })} onMouseLeave={() => setPreviewPiece(null)} className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${activeBrand === 'AFX' ? 'bg-white hover:bg-green-50 text-green-600' : 'bg-white hover:bg-green-50 text-green-600'}`}><ArrowRight size={10}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Controls */}
            {showUI && selected !== null && toolMode === 'select' && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 bg-white px-6 py-3 rounded-full shadow-2xl border border-gray-200 flex items-center gap-6 animate-in slide-in-from-bottom-4 fade-in duration-200 pointer-events-auto">
                    <div className="flex gap-2 border-r pr-6">
                        <button onClick={() => rotateSection(-22.5)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 tooltip" title={t('rotate_left')}><RotateCcw size={20} /></button>
                        <button onClick={() => rotateSection(22.5)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 tooltip" title={t('rotate_right')}><RotateCcw size={20} className="scale-x-[-1]"/></button>
                        <button onClick={handleSplitButtonClick} className="p-2 hover:bg-blue-50 text-blue-600 rounded-full tooltip" title={t('split')}><Scissors size={20} /></button>
                        {(() => {
                            const selSec = sections.find(s => s.id === selected.sectionId);
                            if (!selSec) return null;
                            const selPiece = selSec.pieces[selected.pieceIndex];
                            const isCurve = selPiece && (selPiece.type === 'curve' || selPiece.isHairpin);
                            if (!isCurve) return null;

                            // RESTRICTION: Only allow flip if piece is START or END of section
                            const isEnd = selected.pieceIndex === 0 || selected.pieceIndex === selSec.pieces.length - 1;
                            if (!isEnd) return null;

                            // RESTRICTION: Section must NOT be closed (Loop)
                            const ends = calculateSectionEndpoints(selSec);
                            const dist = Math.hypot(ends.end.x - ends.start.x, ends.end.y - ends.start.y);
                            const isClosed = dist < 0.5;
                            if (isClosed) return null;

                            return (
                                <button onClick={handleFlip} className="p-2 hover:bg-gray-100 text-gray-600 rounded-full tooltip" title={t('flip')}><ArrowLeftRight size={20} /></button>
                            );
                        })()}
                    </div>
                    
                    <div className="flex gap-2">
                        <button onClick={cycleColor} className="p-2 hover:bg-gray-100 text-purple-500 rounded-full tooltip" title={t('change_color')}><Palette size={20} /></button>
                        <button onClick={handleDuplicate} className="p-2 hover:bg-green-50 text-green-600 rounded-full tooltip" title={t('copy')}><Copy size={20} /></button>
                        <button onClick={handleDelete} className="p-2 hover:bg-red-50 text-red-600 rounded-full tooltip" title={t('delete')}><Trash2 size={20}/></button>
                    </div>
                </div>
            )}

            {/* Modals */}
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
                                    <li>{t('help_mouse_group')}</li>
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

            {/* Empty State */}
            {showUI && !selected && sections.length === 1 && sections[0].pieces.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"><div className="text-center opacity-40"><MousePointer2 size={48} className="mx-auto mb-2 text-gray-400" /><p className="text-xl font-bold text-gray-500">{t('start_title')}</p><p className="text-sm text-gray-400">{t('start_desc')}</p></div></div>
            )}
        </div>
    );
};

export default App;