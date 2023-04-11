(function(m,n){typeof exports=="object"&&typeof module<"u"?n(exports,require("vue")):typeof define=="function"&&define.amd?define(["exports","vue"],n):(m=typeof globalThis<"u"?globalThis:m||self,n(m["@agritheory/atable"]={},m.Vue))})(this,function(m,n){"use strict";var L;const V=typeof window<"u",ne=t=>typeof t=="string",oe=()=>{};V&&(L=window==null?void 0:window.navigator)!=null&&L.userAgent&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function M(t){return typeof t=="function"?t():n.unref(t)}function le(t){return t}function re(t){return n.getCurrentScope()?(n.onScopeDispose(t),!0):!1}function C(t){var e;const o=M(t);return(e=o==null?void 0:o.$el)!=null?e:o}const j=V?window:void 0;function ae(...t){let e,o,l,r;if(ne(t[0])||Array.isArray(t[0])?([o,l,r]=t,e=j):[e,o,l,r]=t,!e)return oe;Array.isArray(o)||(o=[o]),Array.isArray(l)||(l=[l]);const a=[],i=()=>{a.forEach(d=>d()),a.length=0},s=(d,w,x,u)=>(d.addEventListener(w,x,u),()=>d.removeEventListener(w,x,u)),c=n.watch(()=>[C(e),M(r)],([d,w])=>{i(),d&&a.push(...o.flatMap(x=>l.map(u=>s(d,x,u,w))))},{immediate:!0,flush:"post"}),f=()=>{c(),i()};return re(f),f}const A=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},S="__vueuse_ssr_handlers__";A[S]=A[S]||{},A[S];function ie(t,{window:e=j,scrollTarget:o}={}){const l=n.ref(!1),r=()=>{if(!e)return;const a=e.document,i=C(t);if(!i)l.value=!1;else{const s=i.getBoundingClientRect();l.value=s.top<=(e.innerHeight||a.documentElement.clientHeight)&&s.left<=(e.innerWidth||a.documentElement.clientWidth)&&s.bottom>=0&&s.right>=0}};return n.watch(()=>C(t),()=>r(),{immediate:!0,flush:"post"}),e&&ae(o||e,"scroll",r,{capture:!1,passive:!0}),l}var U;(function(t){t.UP="UP",t.RIGHT="RIGHT",t.DOWN="DOWN",t.LEFT="LEFT",t.NONE="NONE"})(U||(U={}));var se=Object.defineProperty,W=Object.getOwnPropertySymbols,de=Object.prototype.hasOwnProperty,ce=Object.prototype.propertyIsEnumerable,F=(t,e,o)=>e in t?se(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,fe=(t,e)=>{for(var o in e||(e={}))de.call(e,o)&&F(t,o,e[o]);if(W)for(var o of W(e))ce.call(e,o)&&F(t,o,e[o]);return t};fe({linear:le},{easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]});const b=t=>{let e=ie(t).value;return e=e&&t.offsetHeight>0,e},y=t=>t.tabIndex>=0,Q=t=>{const e=t.target;return T(e)},T=t=>{var e;let o;if(t instanceof HTMLTableCellElement){const l=(e=t.parentElement)==null?void 0:e.previousElementSibling;if(l){const r=Array.from(l.children)[t.cellIndex];r&&(o=r)}}else if(t instanceof HTMLTableRowElement){const l=t.previousElementSibling;l&&(o=l)}return o&&(!y(o)||!b(o))?T(o):o},pe=t=>{var e;const o=t.target;let l;if(o instanceof HTMLTableCellElement){const r=(e=o.parentElement)==null?void 0:e.parentElement;if(r){const a=r.firstElementChild.children[o.cellIndex];a&&(l=a)}}else if(o instanceof HTMLTableRowElement){const r=o.parentElement;if(r){const a=r.firstElementChild;a&&(l=a)}}return l&&(!y(l)||!b(l))?D(l):l},z=t=>{const e=t.target;return D(e)},D=t=>{var e;let o;if(t instanceof HTMLTableCellElement){const l=(e=t.parentElement)==null?void 0:e.nextElementSibling;if(l){const r=Array.from(l.children)[t.cellIndex];r&&(o=r)}}else if(t instanceof HTMLTableRowElement){const l=t.nextElementSibling;l&&(o=l)}return o&&(!y(o)||!b(o))?D(o):o},ue=t=>{var e;const o=t.target;let l;if(o instanceof HTMLTableCellElement){const r=(e=o.parentElement)==null?void 0:e.parentElement;if(r){const a=r.lastElementChild.children[o.cellIndex];a&&(l=a)}}else if(o instanceof HTMLTableRowElement){const r=o.parentElement;if(r){const a=r.lastElementChild;a&&(l=a)}}return l&&(!y(l)||!b(l))?T(l):l},q=t=>{const e=t.target;return $(e)},$=t=>{var e;let o;if(t.previousElementSibling)o=t.previousElementSibling;else{const l=(e=t.parentElement)==null?void 0:e.previousElementSibling;o=l==null?void 0:l.lastElementChild}return o&&(!y(o)||!b(o))?$(o):o},G=t=>{const e=t.target;return B(e)},B=t=>{var e;let o;if(t.nextElementSibling)o=t.nextElementSibling;else{const l=(e=t.parentElement)==null?void 0:e.nextElementSibling;o=l==null?void 0:l.firstElementChild}return o&&(!y(o)||!b(o))?B(o):o},J=t=>{const e=t.target.parentElement.firstElementChild;return e&&(!y(e)||!b(e))?B(e):e},X=t=>{const e=t.target.parentElement.lastElementChild;return e&&(!y(e)||!b(e))?$(e):e},k=["alt","control","shift","meta"],me={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right"},Y={"keydown.up":t=>{const e=Q(t);e&&(t.preventDefault(),t.stopPropagation(),e.focus())},"keydown.down":t=>{const e=z(t);e&&(t.preventDefault(),t.stopPropagation(),e.focus())},"keydown.left":t=>{const e=q(t);t.preventDefault(),t.stopPropagation(),e&&e.focus()},"keydown.right":t=>{const e=G(t);t.preventDefault(),t.stopPropagation(),e&&e.focus()},"keydown.control.up":t=>{const e=pe(t);e&&(t.preventDefault(),t.stopPropagation(),e.focus())},"keydown.control.down":t=>{const e=ue(t);e&&(t.preventDefault(),t.stopPropagation(),e.focus())},"keydown.control.left":t=>{const e=J(t);e&&(t.preventDefault(),t.stopPropagation(),e.focus())},"keydown.control.right":t=>{const e=X(t);e&&(t.preventDefault(),t.stopPropagation(),e.focus())},"keydown.end":t=>{const e=X(t);e&&(t.preventDefault(),t.stopPropagation(),e.focus())},"keydown.enter":t=>{if(t.target instanceof HTMLTableCellElement){t.preventDefault(),t.stopPropagation();const e=z(t);e&&e.focus()}},"keydown.shift.enter":t=>{if(t.target instanceof HTMLTableCellElement){t.preventDefault(),t.stopPropagation();const e=Q(t);e&&e.focus()}},"keydown.home":t=>{const e=J(t);e&&(t.preventDefault(),t.stopPropagation(),e.focus())},"keydown.tab":t=>{const e=G(t);e&&(t.preventDefault(),t.stopPropagation(),e.focus())},"keydown.shift.tab":t=>{const e=q(t);e&&(t.preventDefault(),t.stopPropagation(),e.focus())}};function O(t){const e=l=>{let r=null;l.parent&&(typeof l.parent=="string"?r=document.querySelector(l.parent):l.parent instanceof Element?r=l.parent:r=l.parent.value);let a=[];if(l.selectors)if(typeof l.selectors=="string")a=r?Array.from(r.querySelectorAll(l.selectors)):Array.from(document.querySelectorAll(l.selectors));else if(l.selectors instanceof Element)a.push(l.selectors);else if(Array.isArray(l.selectors.value))for(const i of l.selectors.value)i instanceof Element?a.push(i):a.push(i.$el);else a.push(l.selectors.value);else a=Array.from(r.children).filter(i=>y(i)&&b(i));return a},o=l=>r=>{const a=me[r.key]||r.key.toLowerCase();if(k.includes(a))return;const i=l.handlers||Y;for(const s of Object.keys(i)){const[c,...f]=s.split(".");if(c==="keydown"&&f.includes(a)){const d=i[s],w=f.filter(u=>k.includes(u)),x=k.some(u=>{const E=u.charAt(0).toUpperCase()+u.slice(1);return r.getModifierState(E)});if(w.length>0){if(x){for(const u of k)if(f.includes(u)){const E=u.charAt(0).toUpperCase()+u.slice(1);r.getModifierState(E)&&d(r)}}}else x||d(r)}}};n.onMounted(()=>{for(const l of t){const r=e(l);for(const a of r)a.addEventListener("keydown",o(l))}}),n.onBeforeUnmount(()=>{for(const l of t){const r=e(l);for(const a of r)a.removeEventListener("keydown",o(l))}})}const we=["data-colindex","data-rowindex","data-editable","contenteditable","tabindex"],he={key:1},ge=n.defineComponent({__name:"ACell",props:{colIndex:null,rowIndex:null,tableid:null,addNavigation:{type:[Boolean,Object],default:!0},tabIndex:{default:0},clickHandler:null},setup(t){var E;const e=t,o=n.inject(e.tableid),l=n.ref(null);let r=n.ref(!1);const a=n.computed(()=>{const h=o.cellData(e.colIndex,e.rowIndex);if(o.columns[e.colIndex].format){const g=o.columns[e.colIndex].format;return typeof g=="function"?g(h):typeof g=="string"?Function(`"use strict";return (${g})`)()(h):h}else return h}),i=h=>{if(e.clickHandler){e.clickHandler(h);return}if(o.columns[e.colIndex].mask,o.columns[e.colIndex].modalComponent){const g=l.value.getBoundingClientRect();o.modal.visible=!0,o.modal.colIndex=e.colIndex,o.modal.rowIndex=e.rowIndex,o.modal.parent=l.value,o.modal.top=g.top+g.height,o.modal.left=g.left,o.modal.width=c.value,o.modal.component=o.columns[e.colIndex].modalComponent,o.modal.componentProps=o.columns[e.colIndex].modalComponentProps}};if(e.addNavigation){let h={...Y,"keydown.f2":i,"keydown.alt.up":i,"keydown.alt.down":i,"keydown.alt.left":i,"keydown.alt.right":i};typeof e.addNavigation=="object"&&(h={...h,...e.addNavigation}),O([{selectors:l,handlers:h}])}const s=n.computed(()=>o.columns[e.colIndex].align||"center"),c=n.computed(()=>o.columns[e.colIndex].width||"40ch");let f="";const d=()=>{l.value&&(f=l.value.innerText)},w=()=>{l.value&&l.value.innerHTML!==f&&(f=l.value.innerText,l.value.dispatchEvent(new Event("change")),r.value=!0,o.columns[e.colIndex].format||o.setCellData(e.rowIndex,e.colIndex,f))},x=(h,g)=>g&&h===0&&g>0?`${g}ch`:"inherit",u={textAlign:s.value,width:c.value,backgroundColor:r.value?"var(--cell-modified-color)":"inherit",fontWeight:r.value?"bold":"inherit",paddingLeft:x(e.colIndex,(E=o.display[e.rowIndex])==null?void 0:E.indent)};return(h,g)=>(n.openBlock(),n.createElementBlock("td",{ref_key:"cell",ref:l,"data-colindex":t.colIndex,"data-rowindex":t.rowIndex,"data-editable":n.unref(o).columns[t.colIndex].edit,contenteditable:n.unref(o).columns[t.colIndex].edit,tabindex:t.tabIndex,spellcheck:!1,style:u,onFocus:d,onPaste:w,onBlur:w,onInput:w,onClick:i,onMousedown:i},[n.unref(o).columns[t.colIndex].cellComponent?(n.openBlock(),n.createBlock(n.resolveDynamicComponent(n.unref(o).columns[t.colIndex].cellComponent),n.mergeProps({key:0,value:n.unref(a)},n.unref(o).columns[t.colIndex].cellComponentProps),null,16,["value"])):(n.openBlock(),n.createElementBlock("span",he,n.toDisplayString(n.unref(a)),1))],40,we))}}),He="",I=(t,e)=>{const o=t.__vccOpts||t;for(const[l,r]of e)o[l]=r;return o},R=I(ge,[["__scopeId","data-v-1738c6fc"]]),be=["tabindex"],ye=["tabindex"],xe=["colspan"],Ie=n.defineComponent({__name:"AExpansionRow",props:{row:null,rowIndex:null,tableid:null,tabIndex:{default:-1},addNavigation:null},setup(t){const e=t,o=n.inject(e.tableid),l=n.ref(null),r=n.ref(null),a=()=>o.display[e.rowIndex].expanded?"▼":"►";if(e.addNavigation!==void 0){const i=Object.assign({},e.addNavigation);i["keydown.control.g"]=s=>{s.stopPropagation(),s.preventDefault(),o.toggleRowExpand(e.rowIndex)},O([{selectors:l,handlers:i}])}return(i,s)=>(n.openBlock(),n.createElementBlock(n.Fragment,null,[n.createElementVNode("tr",n.mergeProps(i.$attrs,{ref_key:"rowEl",ref:l,tabindex:t.tabIndex,class:"expandable-row"}),[n.createElementVNode("td",{tabIndex:-1,onClick:s[0]||(s[0]=c=>n.unref(o).toggleRowExpand(t.rowIndex)),class:"row-index"},n.toDisplayString(a()),1),n.renderSlot(i.$slots,"row",{},void 0,!0)],16,be),n.unref(o).display[e.rowIndex].expanded?(n.openBlock(),n.createElementBlock("tr",{key:0,ref_key:"rowExpanded",ref:r,tabindex:t.tabIndex,class:"expanded-row"},[n.createElementVNode("td",{tabIndex:-1,colspan:n.unref(o).columns.length+1,class:"expanded-row-content"},[n.renderSlot(i.$slots,"content",{},void 0,!0)],8,xe)],8,ye)):n.createCommentVNode("",!0)],64))}}),Le="",Z=I(Ie,[["__scopeId","data-v-2bb821ae"]]),Ee=["tabindex"],ke={key:0,tabIndex:-1,class:"list-index"},_e=n.defineComponent({__name:"ARow",props:{row:null,rowIndex:null,tableid:null,tabIndex:{default:-1},addNavigation:null},setup(t){const e=t;n.useCssVars(c=>({"6b10edcf":n.unref(r)}));const o=n.inject(e.tableid),l=n.ref(null),r=o.numberedRowWidth.value,a=()=>o.config.view!=="tree"?"":o.display[e.rowIndex].isRoot||o.display[e.rowIndex].isParent?o.display[e.rowIndex].childrenOpen?"-":"+":"",i=()=>o.config.view!=="tree"||o.display[e.rowIndex].isRoot||o.display[e.rowIndex].open,s=c=>{o.toggleRowExpand(c)};return e.addNavigation&&O([{selectors:l,handlers:e.addNavigation}]),(c,f)=>n.withDirectives((n.openBlock(),n.createElementBlock("tr",{ref_key:"rowEl",ref:l,tabindex:t.tabIndex,class:"table-row"},[n.unref(o).config.view==="list"?(n.openBlock(),n.createElementBlock("td",ke,n.toDisplayString(t.rowIndex+1),1)):n.unref(o).config.view==="tree"?(n.openBlock(),n.createElementBlock("td",{key:1,tabIndex:-1,class:"tree-index",onClick:f[0]||(f[0]=d=>s(t.rowIndex))},n.toDisplayString(a()),1)):n.renderSlot(c.$slots,"indexCell",{key:2},void 0,!0),n.renderSlot(c.$slots,"default",{},void 0,!0)],8,Ee)),[[n.vShow,i()]])}}),Ve="",P=I(_e,[["__scopeId","data-v-c758303d"]]);let _;const Ce=new Uint8Array(16);function Ae(){if(!_&&(_=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!_))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return _(Ce)}const p=[];for(let t=0;t<256;++t)p.push((t+256).toString(16).slice(1));function Se(t,e=0){return(p[t[e+0]]+p[t[e+1]]+p[t[e+2]]+p[t[e+3]]+"-"+p[t[e+4]]+p[t[e+5]]+"-"+p[t[e+6]]+p[t[e+7]]+"-"+p[t[e+8]]+p[t[e+9]]+"-"+p[t[e+10]]+p[t[e+11]]+p[t[e+12]]+p[t[e+13]]+p[t[e+14]]+p[t[e+15]]).toLowerCase()}const K={randomUUID:typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};function v(t,e,o){if(K.randomUUID&&!e&&!t)return K.randomUUID();t=t||{};const l=t.random||(t.rng||Ae)();if(l[6]=l[6]&15|64,l[8]=l[8]&63|128,e){o=o||0;for(let r=0;r<16;++r)e[o+r]=l[r];return e}return Se(l)}class ee{constructor(e,o,l,r,a,i){this.id=e||v(),this.rows=l,this.columns=n.reactive(o),this.config=n.reactive(r),this.table=a||n.reactive(this.createTableObject()),this.display=this.createDisplayObject(i),this.modal=n.reactive({visible:!1})}createTableObject(){const e={};for(const[o,l]of this.columns.entries())for(const[r,a]of this.rows.entries())e[`${o}:${r}`]=a[l.name];return e}createDisplayObject(e){const o=[Object.assign({},{modified:!1})];if(e&&"0:0"in e)return e;const l=new Set;for(let r=this.rows.length-1;r>=0;r--){const a=this.rows[r];a.parent&&l.add(a.parent),o[r]={childrenOpen:!1,expanded:!1,indent:a.indent||null,isParent:l.has(r),isRoot:a.parent===null||a.parent===void 0,modified:!1,open:a.parent===null||a.parent===void 0,parent:a.parent}}return n.reactive(o)}get zeroColumn(){return["list","tree","list-expansion"].includes(this.config.view)}get numberedRowWidth(){return n.computed(()=>String(Math.ceil(this.rows.length/100)+1)+"ch")}cellData(e,o){return this.table[`${e}:${o}`]}setCellData(e,o,l){this.table[`${o}:${e}`]!==l&&(this.display[e].modified=!0),this.table[`${o}:${e}`]=l;let r=this.columns[o];return this.rows[e][r.name]=l,this.table[`${o}:${e}`]}toggleRowExpand(e){if(this.config.view==="tree"){this.display[e].childrenOpen=!this.display[e].childrenOpen;for(let o=this.rows.length-1;o>=0;o--)this.display[o].parent===e&&(this.display[o].open=!this.display[o].open,this.display[o].childrenOpen&&this.toggleRowExpand(o))}else this.config.view==="list-expansion"&&(this.display[e].expanded=!this.display[e].expanded)}}const Te={key:0},De={class:"atable-header-row",tabindex:"-1"},$e={key:0,id:"header-index"},Be=n.defineComponent({__name:"ATableHeader",props:{columns:null,config:null,tableid:null},setup(t){const e=t;n.useCssVars(a=>({"1cb0fcc9":n.unref(l)}));const o=n.inject(e.tableid),l=o.numberedRowWidth.value,r=a=>({minWidth:a.width||"40ch",textAlign:a.align||"center",width:o.config.fullWidth?"auto":null});return(a,i)=>t.columns.length?(n.openBlock(),n.createElementBlock("thead",Te,[n.createElementVNode("tr",De,[n.unref(o).zeroColumn?(n.openBlock(),n.createElementBlock("th",$e)):n.createCommentVNode("",!0),(n.openBlock(!0),n.createElementBlock(n.Fragment,null,n.renderList(t.columns,(s,c)=>(n.openBlock(),n.createElementBlock("th",{key:c,tabindex:"-1",style:n.normalizeStyle(r(s))},[n.renderSlot(a.$slots,"default",{},()=>[n.createTextVNode(n.toDisplayString(s.label||String.fromCharCode(c+97).toUpperCase()),1)],!0)],4))),128))])])):n.createCommentVNode("",!0)}}),je="",N=I(Be,[["__scopeId","data-v-8a8d9cee"]]),Oe=n.defineComponent({__name:"ATableModal",props:{colIndex:null,rowIndex:null,tableid:null},setup(t){const e=t;n.inject(e.tableid);const o=l=>{l.stopPropagation()};return(l,r)=>(n.openBlock(),n.createElementBlock("div",{ref:"amodal",class:"amodal",tabindex:"-1",onClick:o,onInput:o},[n.renderSlot(l.$slots,"default",{},void 0,!0)],544))}}),Ue="",H=I(Oe,[["__scopeId","data-v-8ac70767"]]),Re=n.defineComponent({__name:"ATable",props:{id:null,modelValue:null,columns:null,rows:{default:()=>[]},config:{default:()=>new Object},tableid:null},emits:["update:modelValue"],setup(t,{emit:e}){const o=t;let l=o.modelValue?o.modelValue:o.rows,r=new ee(o.id,o.columns,l,o.config);n.provide(r.id,r),n.watch(()=>r.rows,(i,s)=>{e("update:modelValue",i)},{deep:!0});const a=i=>{var s;(s=r.modal.parent)!=null&&s.contains(i.target)||r.modal.visible&&(r.modal.visible=!1)};return window.addEventListener("click",a),window.addEventListener("keydown",i=>{if(i.key==="Escape"&&r.modal.visible){r.modal.visible=!1;const s=r.modal.parent;s&&n.nextTick().then(()=>{const c=s.dataset.rowindex,f=s.dataset.colindex,d=document.querySelectorAll(`[data-rowindex='${c}'][data-colindex='${f}']`);d&&d[0].focus()})}}),(i,s)=>(n.openBlock(),n.createElementBlock("table",{class:"atable",style:n.normalizeStyle({width:n.unref(r).config.fullWidth?"100%":"auto"})},[n.renderSlot(i.$slots,"header",{data:n.unref(r)},()=>[n.createVNode(N,{columns:n.unref(r).columns,config:n.unref(r).config,tableid:n.unref(r).id},null,8,["columns","config","tableid"])],!0),n.createElementVNode("tbody",null,[n.renderSlot(i.$slots,"body",{data:n.unref(r)},()=>[(n.openBlock(!0),n.createElementBlock(n.Fragment,null,n.renderList(n.unref(r).rows,(c,f)=>(n.openBlock(),n.createBlock(P,{key:c.id||n.unref(v)(),row:c,rowIndex:f,tableid:n.unref(r).id},{default:n.withCtx(()=>[(n.openBlock(!0),n.createElementBlock(n.Fragment,null,n.renderList(n.unref(r).columns,(d,w)=>(n.openBlock(),n.createBlock(R,{key:`${w}:${f}`,tableid:n.unref(r).id,col:d,spellcheck:"false",rowIndex:f,colIndex:w+(n.unref(r).zeroColumn?0:-1),component:d.cellComponent,style:n.normalizeStyle({textAlign:(d==null?void 0:d.align)||"center",minWidth:(d==null?void 0:d.width)||"40ch",width:n.unref(r).config.fullWidth?"auto":null})},null,8,["tableid","col","rowIndex","colIndex","component","style"]))),128))]),_:2},1032,["row","rowIndex","tableid"]))),128))],!0)]),n.renderSlot(i.$slots,"footer",{data:n.unref(r)},void 0,!0),n.renderSlot(i.$slots,"modal",{data:n.unref(r)},()=>[n.withDirectives(n.createVNode(H,{colIndex:n.unref(r).modal.colIndex,rowIndex:n.unref(r).modal.rowIndex,tableid:n.unref(r).id,style:n.normalizeStyle({left:n.unref(r).modal.left+"px",top:n.unref(r).modal.top+"px",maxWidth:n.unref(r).modal.width+"px"})},{default:n.withCtx(()=>[(n.openBlock(),n.createBlock(n.resolveDynamicComponent(n.unref(r).modal.component),n.mergeProps({key:`${n.unref(r).modal.rowIndex}:${n.unref(r).modal.colIndex}`,colIndex:n.unref(r).modal.colIndex,rowIndex:n.unref(r).modal.rowIndex,tableid:n.unref(r).id},n.unref(r).modal.componentProps),null,16,["colIndex","rowIndex","tableid"]))]),_:1},8,["colIndex","rowIndex","tableid","style"]),[[n.vShow,n.unref(r).modal.visible]])],!0)],4))}}),We="",te=I(Re,[["__scopeId","data-v-9137b4c3"]]);function Pe(t){t.component("ACell",R),t.component("AExpansionRow",Z),t.component("ARow",P),t.component("ATable",te),t.component("ATableHeader",N),t.component("ATableModal",H)}m.ACell=R,m.AExpansionRow=Z,m.ARow=P,m.ATable=te,m.ATableHeader=N,m.ATableModal=H,m.TableDataStore=ee,m.install=Pe,Object.defineProperty(m,Symbol.toStringTag,{value:"Module"})});
//# sourceMappingURL=atable.umd.cjs.map