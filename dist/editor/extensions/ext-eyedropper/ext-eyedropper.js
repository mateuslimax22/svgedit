/**
 * @file ext-eyedropper.js
 *
 * @license MIT
 *
 * @copyright 2010 Jeff Schiller
 * @copyright 2021 OptimistikSAS
 *
 */
const e="eyedropper",loadExtensionTranslation=async function(t){let a;const c=t.configObj.pref("lang");try{a=await function __variableDynamicImportRuntime0__(e){switch(e){case"./locale/en.js":return Promise.resolve().then((function(){return o}));case"./locale/fr.js":return Promise.resolve().then((function(){return n}));case"./locale/sv.js":return Promise.resolve().then((function(){return r}));case"./locale/tr.js":return Promise.resolve().then((function(){return s}));case"./locale/uk.js":return Promise.resolve().then((function(){return i}));case"./locale/zh-CN.js":return Promise.resolve().then((function(){return l}));default:return new Promise((function(t,o){("function"==typeof queueMicrotask?queueMicrotask:setTimeout)(o.bind(null,new Error("Unknown variable dynamic import: "+e)))}))}}(`./locale/${c}.js`)}catch(t){console.warn(`Missing translation (${c}) for ${e} - using 'en'`),a=await Promise.resolve().then((function(){return o}))}t.i18next.addResourceBundle(c,e,a.default)};var t={name:e,async init(){const t=this,{svgCanvas:o}=t;await loadExtensionTranslation(t);const{ChangeElementCommand:n}=o.history,r={},{$id:s,$click:i}=o,l=document.createElement("div");l.style.width="14px",l.style.height="14px",l.style.position="absolute",t.workarea.appendChild(l);const styleHelper=()=>{if(o.getMode()===e){l.style.display="block";const e=Number(r.strokeWidth),t="none"!==r.strokeDashArray&&r.strokeDashArray?"dotted":"solid";l.style.background=r.fillPaint??"transparent",l.style.opacity=r.opacity??1,l.style.border=e>0&&r.strokePaint?`2px ${t} ${r.strokePaint}`:"none"}},resetCurrentStyle=()=>{Object.keys(r).forEach((e=>delete r[e]))},getStyle=e=>{let t=null;e.multiselected||!e.elems[0]||["svg","g","use"].includes(e.elems[0].nodeName)||(t=e.elems[0],r.fillPaint=t.getAttribute("fill")||"black",r.fillOpacity=t.getAttribute("fill-opacity")||1,r.strokePaint=t.getAttribute("stroke"),r.strokeOpacity=t.getAttribute("stroke-opacity")||1,r.strokeWidth=t.getAttribute("stroke-width"),r.strokeDashArray=t.getAttribute("stroke-dasharray"),r.strokeLinecap=t.getAttribute("stroke-linecap"),r.strokeLinejoin=t.getAttribute("stroke-linejoin"),r.opacity=t.getAttribute("opacity")||1)};return{name:t.i18next.t(`${e}:name`),callback(){const n=`\n        <se-button id="tool_eyedropper" title="${`${e}:buttons.0.title`}" src="eye_dropper.svg" shortcut=ctrl+I></se-button>\n        `;o.insertChildAtIndex(s("tools_left"),n,12),i(s("tool_eyedropper"),(()=>{this.leftPanel.updateLeftPanel("tool_eyedropper")&&o.setMode(e)})),document.addEventListener("modeChange",(t=>{o.getMode()===e?styleHelper():l.style.display="none",0===o.getSelectedElements().length&&resetCurrentStyle()})),t.workarea.addEventListener("mousemove",(t=>{const n=t.clientX,r=t.clientY;o.getMode()===e&&(l.style.top=r+"px",l.style.left=n+12+"px",styleHelper())})),t.workarea.addEventListener("mouseleave",(e=>{l.style.display="none"})),document.addEventListener("keydown",(n=>{"Escape"===n.key&&o.getMode()===e&&(Object.keys(r).length>0?(resetCurrentStyle(),styleHelper()):t.leftPanel.clickSelect())}))},selectedChanged:getStyle,mouseDown(t){if(o.getMode()===e){const e=t.event,{target:i}=e;if(!["svg","g","use"].includes(i.nodeName)){const e={};if(Object.keys(r).length>0){const change=function(t,o,n){e[o]=t.getAttribute(o),t.setAttribute(o,n)};r.fillPaint&&change(i,"fill",r.fillPaint),r.fillOpacity&&change(i,"fill-opacity",r.fillOpacity),r.strokePaint&&change(i,"stroke",r.strokePaint),r.strokeOpacity&&change(i,"stroke-opacity",r.strokeOpacity),r.strokeWidth&&change(i,"stroke-width",r.strokeWidth),r.opacity&&change(i,"opacity",r.opacity),r.strokeLinecap&&change(i,"stroke-linecap",r.strokeLinecap),r.strokeLinejoin&&change(i,"stroke-linejoin",r.strokeLinejoin),r.strokeDashArray?change(i,"stroke-dasharray",r.strokeDashArray):i.removeAttribute("stroke-dasharray"),s=new n(i,e),o.undoMgr.addCommandToHistory(s)}else getStyle({elems:[i]})}}var s}}}},o=Object.freeze({__proto__:null,default:{name:"eyedropper",buttons:[{title:"Eye Dropper Tool",key:"I"}]}}),n=Object.freeze({__proto__:null,default:{name:"pipette",buttons:[{title:"Outil pipette",key:"I"}]}}),r=Object.freeze({__proto__:null,default:{name:"pipett",buttons:[{title:"pipettverktyg",key:"I"}]}}),s=Object.freeze({__proto__:null,default:{name:"renkseçici",buttons:[{title:"Renk Seçim Aracı",key:"I"}]}}),i=Object.freeze({__proto__:null,default:{name:"eyedropper",buttons:[{title:"Піпетка",key:"I"}]}}),l=Object.freeze({__proto__:null,default:{name:"滴管",buttons:[{title:"滴管工具",key:"I"}]}});export{t as default};
//# sourceMappingURL=ext-eyedropper.js.map