/**
 * @file ext-layer_view.js
 *
 * @license MIT
 *
 *
 */
const e="layer_view",loadExtensionTranslation=async function(t){let n;const i=t.configObj.pref("lang");try{n=await function __variableDynamicImportRuntime0__(e){return"./locale/en.js"===e?Promise.resolve().then((function(){return r})):new Promise((function(t,r){("function"==typeof queueMicrotask?queueMicrotask:setTimeout)(r.bind(null,new Error("Unknown variable dynamic import: "+e)))}))}(`./locale/${i}.js`)}catch(t){console.warn(`Missing translation (${i}) for ${e} - using 'en'`),n=await Promise.resolve().then((function(){return r}))}t.i18next.addResourceBundle(i,e,n.default)};var t={name:e,async init(t){const r=this,{svgCanvas:n}=r,{$id:i,$click:a}=n;await loadExtensionTranslation(r);const clickLayerView=e=>{i("tool_layerView").pressed=!i("tool_layerView").pressed,updateLayerView()},updateLayerView=e=>{const t=n.getCurrentDrawing(),r=t.getCurrentLayerName();let a=t.getNumLayers();for(;a--;){const e=t.getLayerName(a);e!==r&&i("tool_layerView").pressed?t.setLayerVisibility(e,!1):t.setLayerVisibility(e,!0)}i("layerlist").querySelectorAll("tr.layer").forEach((function(e){const t=e.querySelector("td.layervis"),r=e.classList.contains("layersel")||!i("tool_layerView").pressed?"layervis":"layerinvis layervis";t.setAttribute("class",r)}))};return{name:r.i18next.t(`${e}:name`),layersChanged(){i("tool_layerView").pressed&&updateLayerView(),r.configObj.curConfig.layerView&&(r.configObj.curConfig.layerView=!1,i("tool_layerView").pressed=!0,updateLayerView())},layerVisChanged(){i("tool_layerView").pressed&&(i("tool_layerView").pressed=!i("tool_layerView").pressed)},callback(){const t=document.createElement("template"),r=`${e}:buttons.0.title`,n=`${e}:buttons.0.key`;t.innerHTML=`\n      <se-button id="tool_layerView" title="${r}" shortcut="${n}" src="layer_view.svg"></se-button>`,i("editor_panel").append(t.content.cloneNode(!0)),a(i("tool_layerView"),clickLayerView.bind(this))}}}},r=Object.freeze({__proto__:null,default:{name:"layerview",buttons:[{title:"Enable/Disable Layer View",key:"Ctrl+Shift+L"}]}});export{t as default};
//# sourceMappingURL=ext-layer_view.js.map