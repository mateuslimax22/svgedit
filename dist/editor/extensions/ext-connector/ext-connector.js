/**
 * @file ext-connector.js
 *
 * @license MIT
 *
 * @copyright 2010 Alexis Deveria
 * @copyright 2023 Optimistik SAS
 *
 */
const e="connector",loadExtensionTranslation=async function(t){let s;const c=t.configObj.pref("lang");try{s=await function __variableDynamicImportRuntime0__(e){switch(e){case"./locale/en.js":return Promise.resolve().then((function(){return n}));case"./locale/fr.js":return Promise.resolve().then((function(){return o}));case"./locale/zh-CN.js":return Promise.resolve().then((function(){return r}));default:return new Promise((function(t,n){("function"==typeof queueMicrotask?queueMicrotask:setTimeout)(n.bind(null,new Error("Unknown variable dynamic import: "+e)))}))}}(`./locale/${c}.js`)}catch(t){console.warn(`Missing translation (${c}) for ${e} - using 'en'`),s=await Promise.resolve().then((function(){return n}))}t.i18next.addResourceBundle(c,e,s.default)};var t={name:e,async init(t){const n=this,{svgCanvas:o}=n,{getElement:r,$id:s,$click:c,addSVGElementsFromJson:l}=o,{svgroot:a,selectorManager:i}=t,u=o.getEditorNS();let d,g,m;await loadExtensionTranslation(n);let f=!1,p=[];const _=o.groupSelectedElements;o.groupSelectedElements=function(){o.removeFromSelection(document.querySelectorAll('[id^="conn_"]'));for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return _.apply(this,t)};const b=o.moveSelectedElements;o.moveSelectedElements=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];const r=b.apply(this,t);return updateConnectors(o.getSelectedElements()),r};const getBBintersect=(e,t,n,o)=>{o&&((n={...n}).width+=o,n.height+=o,n.x-=o/2,n.y-=o/2);const r=n.x+n.width/2,s=n.y+n.height/2,c=e-r,l=t-s;let a;return a=Math.abs(l/c)<n.height/n.width?n.width/2/Math.abs(c):l?n.height/2/Math.abs(l):0,{x:r+c*a,y:s+l*a}},getOffset=(e,t)=>{const n=t.getAttribute("marker-"+e),o=5*t.getAttribute("stroke-width");return n?o:0},showPanel=e=>{let t=s("connector_rules");t||(t=document.createElement("style"),t.setAttribute("id","connector_rules"),document.getElementsByTagName("head")[0].appendChild(t)),t.textContent=e?"#tool_clone, #tool_topath, #tool_angle, #xy_panel { display: none !important; }":"",s("connector_rules")&&(s("connector_rules").style.display=e?"block":"none")},setPoint=(e,t,n,o,r)=>{const s=e.points,c=a.createSVGPoint();if(c.x=n,c.y=o,"end"===t&&(t=s.numberOfItems-1),s.replaceItem(c,t),r){const t=s.getItem(0),n=s.getItem(s.numberOfItems-1);setPoint(e,1,(n.x+t.x)/2,(n.y+t.y)/2)}},findConnectors=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];const t=o.getDataStorage(),n=document.querySelectorAll('[id^="conn_"]');p=[];for(const r of n){let n=!1;const s=[];for(const[e,n]of["start","end"].entries()){let c=t.get(r,`c_${n}`);c?c=document.getElementById(c):(c=document.getElementById(r.attributes["se:connector"].value.split(" ")[e]),t.put(r,`c_${n}`,c.id),t.put(r,`${n}_bb`,o.getStrokedBBox([c]))),s.push(c)}for(let t=0;t<2;t++){const c=s[t],l=o.getParents(c?.parentNode);for(const t of l)if(e.includes(t)){n=!0;break}if(c&&c.parentNode){if(e.includes(c)||n){const e=o.getStrokedBBox([c]);p.push({elem:c,connector:r,is_start:0===t,start_x:e.x,start_y:e.y})}}else r.remove()}}},updateConnectors=e=>{const t=o.getDataStorage();if(findConnectors(e),p.length)for(const e of p){const{elem:n,connector:r,is_start:s,start_x:c,start_y:l}=e,a=s?"start":"end",i=o.getStrokedBBox([n]);i.x=c,i.y=l,t.put(r,`${a}_bb`,i);const u=s?"end":"start",d=t.get(r,`${u}_bb`),g=getBBintersect(d?.x+d?.width/2,d?.y+d?.height/2,i,getOffset(a,r));setPoint(r,s?0:"end",g.x,g.y,!0);const m=getBBintersect(g.x,g.y,t.get(r,`${u}_bb`),getOffset(u,r));setPoint(r,s?"end":0,m.x,m.y,!0)}},reset=()=>{const e=o.getDataStorage();o.getSvgContent().querySelectorAll("*").forEach((t=>{const n=t.getAttributeNS(u,"connector");if(n){const s=n.split(" "),c=o.getStrokedBBox([r(s[0])]),l=o.getStrokedBBox([r(s[1])]);e.put(t,"c_start",s[0]),e.put(t,"c_end",s[1]),e.put(t,"start_bb",c),e.put(t,"end_bb",l),o.getEditorNS(!0)}}))};return reset(),{name:n.i18next.t(`${e}:name`),callback(){const t=document.createElement("template"),n=`${e}:buttons.0.title`;t.innerHTML=`\n         <se-button id="tool_connect" title="${n}" src="conn.svg"></se-button>\n         `,s("tools_left").append(t.content.cloneNode(!0)),c(s("tool_connect"),(()=>{this.leftPanel.updateLeftPanel("tool_connect")&&o.setMode("connector")}))},mouseDown(e){const t=o.getDataStorage(),r=o.getSvgContent(),{event:s,start_x:c,start_y:a}=e,i=o.getMode(),{curConfig:{initStroke:u}}=n.configObj;if("connector"===i){if(f)return;const e=s.target;if(o.getParents(e.parentNode).includes(r)){const n=o.getClosest(e.parentNode,"foreignObject");g=n||e;const r=o.getStrokedBBox([g]),s=r.x+r.width/2,i=r.y+r.height/2;f=!0,d=l({element:"polyline",attr:{id:"conn_"+o.getNextId(),points:`${s},${i} ${s},${i} ${c},${a}`,stroke:`#${u.color}`,"stroke-width":g.stroke_width&&0!==g.stroke_width?g.stroke_width:u.width,fill:"none",opacity:u.opacity,style:"pointer-events:none"}}),t.put(d,"start_bb",r)}return{started:!0}}"select"===i&&findConnectors(e.selectedElements)},mouseMove(e){if(0===p.length)return;o.getDataStorage();o.getZoom();e.mouse_x,e.mouse_y},mouseUp(e){const t=o.getDataStorage(),n=o.getSvgContent(),{event:r}=e;let s=r.target;if("connector"!==o.getMode())return;const c=o.getClosest(s.parentNode,"foreignObject");c&&(s=c);const l=o.getParents(s.parentNode).includes(n);if(s===g)return f=!0,{keep:!0,element:null,started:f};if(!l)return d?.remove(),f=!1,{keep:!1,element:null,started:f};m=s;const a=g?.id||"",p=m?.id||"",_=`${a} ${p}`,b=`${p} ${a}`;if(Array.from(document.querySelectorAll('[id^="conn_"]')).filter((e=>e.getAttributeNS(u,"connector")===_||e.getAttributeNS(u,"connector")===b)).length)return d.remove(),{keep:!1,element:null,started:!1};const h=o.getStrokedBBox([m]),y=getBBintersect(undefined,undefined,h,getOffset("start",d));return setPoint(d,"end",y.x,y.y,!0),t.put(d,"c_start",a),t.put(d,"c_end",p),t.put(d,"end_bb",h),d.setAttributeNS(u,"se:connector",_),d.setAttribute("opacity",1),o.addToSelection([d]),o.moveToBottomSelectedElement(),i.requestSelector(d).showGrips(!1),f=!1,{keep:!0,element:d,started:f}},selectedChanged(e){const t=o.getDataStorage();if(!o.getSvgContent().querySelectorAll('[id^="conn_"]').length)return;"connector"===o.getMode()&&o.setMode("select");const{elems:n}=e;for(const o of n)o&&t.has(o,"c_start")?(i.requestSelector(o).showGrips(!1),showPanel(e.selectedElement&&!e.multiselected)):showPanel(!1);updateConnectors(o.getSelectedElements())},elementChanged(e){const t=o.getDataStorage();let[n]=e.elems;if(!n)return;"svg"===n.tagName&&"svgcontent"===n.id&&reset();const{markerStart:s,markerMid:c,markerEnd:a}=n.attributes;if((s||c||a)&&(d=n,t.put(n,"start_off",Boolean(s)),t.put(n,"end_off",Boolean(a)),"line"===n.tagName&&c)){const{x1:e,x2:t,y1:r,y2:s,id:a}=n.attributes,i=`${(Number(e.value)+Number(t.value))/2},${(Number(r.value)+Number(s.value))/2}`,u=l({element:"polyline",attr:{points:`${e.value},${r.value} ${i} ${t.value},${s.value}`,stroke:n.getAttribute("stroke"),"stroke-width":n.getAttribute("stroke-width"),"marker-mid":c.value,fill:"none",opacity:n.getAttribute("opacity")||1}});n.insertAdjacentElement("afterend",u),n.remove(),o.clearSelection(),u.id=a.value,o.addToSelection([u]),n=u}if(n?.id.startsWith("conn_")){const e=r(t.get(n,"c_start"));updateConnectors([e])}else updateConnectors(o.getSelectedElements())},IDsUpdated(e){const t=[];return e.elems.forEach((function(n){"se:connector"in n.attr&&(n.attr["se:connector"]=n.attr["se:connector"].split(" ").map((function(t){return e.changes[t]})).join(" "),/. ./.test(n.attr["se:connector"])||t.push(n.attr.id))})),{remove:t}},toolButtonStateUpdate(e){const t=document.getElementById("tool_connect");e.nostroke&&!0===t.pressed&&n.clickSelect(),t.disabled=e.nostroke}}}},n=Object.freeze({__proto__:null,default:{name:"Connector",langListTitle:"Connect two objects",langList:[{id:"mode_connect",title:"Connect two objects"}],buttons:[{title:"Connect two objects"}]}}),o=Object.freeze({__proto__:null,default:{name:"Connecteur",langListTitle:"Connecter deux objets",langList:[{id:"mode_connect",title:"Connecter deux objets"}],buttons:[{title:"Connecter deux objets"}]}}),r=Object.freeze({__proto__:null,default:{name:"连接器",langListTitle:"连接两个对象",langList:[{id:"mode_connect",title:"连接两个对象"}],buttons:[{title:"连接两个对象"}]}});export{t as default};
//# sourceMappingURL=ext-connector.js.map