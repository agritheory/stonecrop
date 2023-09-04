(function(h,n){typeof exports=="object"&&typeof module<"u"?n(exports,require("vue")):typeof define=="function"&&define.amd?define(["exports","vue"],n):(h=typeof globalThis<"u"?globalThis:h||self,n(h["@stonecrop/atable"]={},h.Vue))})(this,function(h,n){"use strict";var N;const H=typeof window<"u",ne=t=>typeof t=="string",oe=()=>{};H&&(N=window==null?void 0:window.navigator)!=null&&N.userAgent&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function L(t){return typeof t=="function"?t():n.unref(t)}function le(t){return t}function re(t){return n.getCurrentScope()?(n.onScopeDispose(t),!0):!1}function C(t){var e;const o=L(t);return(e=o==null?void 0:o.$el)!=null?e:o}const M=H?window:void 0;function ae(...t){let e,o,l,a;if(ne(t[0])||Array.isArray(t[0])?([o,l,a]=t,e=M):[e,o,l,a]=t,!e)return oe;Array.isArray(o)||(o=[o]),Array.isArray(l)||(l=[l]);const r=[],i=()=>{r.forEach(u=>u()),r.length=0},s=(u,c,b,w)=>(u.addEventListener(c,b,w),()=>u.removeEventListener(c,b,w)),d=n.watch(()=>[C(e),L(a)],([u,c])=>{i(),u&&r.push(...o.flatMap(b=>l.map(w=>s(u,b,w,c))))},{immediate:!0,flush:"post"}),f=()=>{d(),i()};return re(f),f}const V=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},j="__vueuse_ssr_handlers__";V[j]=V[j]||{};function ie(t,{window:e=M,scrollTarget:o}={}){const l=n.ref(!1),a=()=>{if(!e)return;const r=e.document,i=C(t);if(!i)l.value=!1;else{const s=i.getBoundingClientRect();l.value=s.top<=(e.innerHeight||r.documentElement.clientHeight)&&s.left<=(e.innerWidth||r.documentElement.clientWidth)&&s.bottom>=0&&s.right>=0}};return n.watch(()=>C(t),()=>a(),{immediate:!0,flush:"post"}),e&&ae(o||e,"scroll",a,{capture:!1,passive:!0}),l}var U;(function(t){t.UP="UP",t.RIGHT="RIGHT",t.DOWN="DOWN",t.LEFT="LEFT",t.NONE="NONE"})(U||(U={}));var se=Object.defineProperty,W=Object.getOwnPropertySymbols,de=Object.prototype.hasOwnProperty,ce=Object.prototype.propertyIsEnumerable,F=(t,e,o)=>e in t?se(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,pe=(t,e)=>{for(var o in e||(e={}))de.call(e,o)&&F(t,o,e[o]);if(W)for(var o of W(e))ce.call(e,o)&&F(t,o,e[o]);return t};pe({linear:le},{easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]});const y=t=>{let e=ie(t).value;return e=e&&t.offsetHeight>0,e},x=t=>t.tabIndex>=0,Q=t=>{const e=t.target;return A(e)},A=t=>{var e;let o;if(t instanceof HTMLTableCellElement){const l=(e=t.parentElement)==null?void 0:e.previousElementSibling;if(l){const a=Array.from(l.children)[t.cellIndex];a&&(o=a)}}else if(t instanceof HTMLTableRowElement){const l=t.previousElementSibling;l&&(o=l)}return o&&(!x(o)||!y(o))?A(o):o},fe=t=>{var e;const o=t.target;let l;if(o instanceof HTMLTableCellElement){const a=(e=o.parentElement)==null?void 0:e.parentElement;if(a){const r=a.firstElementChild.children[o.cellIndex];r&&(l=r)}}else if(o instanceof HTMLTableRowElement){const a=o.parentElement;if(a){const r=a.firstElementChild;r&&(l=r)}}return l&&(!x(l)||!y(l))?S(l):l},z=t=>{const e=t.target;return S(e)},S=t=>{var e;let o;if(t instanceof HTMLTableCellElement){const l=(e=t.parentElement)==null?void 0:e.nextElementSibling;if(l){const a=Array.from(l.children)[t.cellIndex];a&&(o=a)}}else if(t instanceof HTMLTableRowElement){const l=t.nextElementSibling;l&&(o=l)}return o&&(!x(o)||!y(o))?S(o):o},ue=t=>{var e;const o=t.target;let l;if(o instanceof HTMLTableCellElement){const a=(e=o.parentElement)==null?void 0:e.parentElement;if(a){const r=a.lastElementChild.children[o.cellIndex];r&&(l=r)}}else if(o instanceof HTMLTableRowElement){const a=o.parentElement;if(a){const r=a.lastElementChild;r&&(l=r)}}return l&&(!x(l)||!y(l))?A(l):l},q=t=>{const e=t.target;return T(e)},T=t=>{var e;let o;if(t.previousElementSibling)o=t.previousElementSibling;else{const l=(e=t.parentElement)==null?void 0:e.previousElementSibling;o=l==null?void 0:l.lastElementChild}return o&&(!x(o)||!y(o))?T(o):o},G=t=>{const e=t.target;return D(e)},D=t=>{var e;let o;if(t.nextElementSibling)o=t.nextElementSibling;else{const l=(e=t.parentElement)==null?void 0:e.nextElementSibling;o=l==null?void 0:l.firstElementChild}return o&&(!x(o)||!y(o))?D(o):o},J=t=>{const e=t.target.parentElement.firstElementChild;return e&&(!x(e)||!y(e))?D(e):e},X=t=>{const e=t.target.parentElement.lastElementChild;return e&&(!x(e)||!y(e))?T(e):e},E=["alt","control","shift","meta"],me={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right"},Y={"keydown.up":t=>{const e=Q(t);e&&(t.preventDefault(),t.stopPropagation(),e.focus())},"keydown.down":t=>{const e=z(t);e&&(t.preventDefault(),t.stopPropagation(),e.focus())},"keydown.left":t=>{const e=q(t);t.preventDefault(),t.stopPropagation(),e&&e.focus()},"keydown.right":t=>{const e=G(t);t.preventDefault(),t.stopPropagation(),e&&e.focus()},"keydown.control.up":t=>{const e=fe(t);e&&(t.preventDefault(),t.stopPropagation(),e.focus())},"keydown.control.down":t=>{const e=ue(t);e&&(t.preventDefault(),t.stopPropagation(),e.focus())},"keydown.control.left":t=>{const e=J(t);e&&(t.preventDefault(),t.stopPropagation(),e.focus())},"keydown.control.right":t=>{const e=X(t);e&&(t.preventDefault(),t.stopPropagation(),e.focus())},"keydown.end":t=>{const e=X(t);e&&(t.preventDefault(),t.stopPropagation(),e.focus())},"keydown.enter":t=>{if(t.target instanceof HTMLTableCellElement){t.preventDefault(),t.stopPropagation();const e=z(t);e&&e.focus()}},"keydown.shift.enter":t=>{if(t.target instanceof HTMLTableCellElement){t.preventDefault(),t.stopPropagation();const e=Q(t);e&&e.focus()}},"keydown.home":t=>{const e=J(t);e&&(t.preventDefault(),t.stopPropagation(),e.focus())},"keydown.tab":t=>{const e=G(t);e&&(t.preventDefault(),t.stopPropagation(),e.focus())},"keydown.shift.tab":t=>{const e=q(t);e&&(t.preventDefault(),t.stopPropagation(),e.focus())}};function $(t){const e=l=>{let a=null;l.parent&&(typeof l.parent=="string"?a=document.querySelector(l.parent):l.parent instanceof Element?a=l.parent:a=l.parent.value);let r=[];if(l.selectors)if(typeof l.selectors=="string")r=a?Array.from(a.querySelectorAll(l.selectors)):Array.from(document.querySelectorAll(l.selectors));else if(l.selectors instanceof Element)r.push(l.selectors);else if(Array.isArray(l.selectors.value))for(const i of l.selectors.value)i instanceof Element?r.push(i):r.push(i.$el);else r.push(l.selectors.value);else r=Array.from(a.children).filter(i=>x(i)&&y(i));return r},o=l=>a=>{const r=me[a.key]||a.key.toLowerCase();if(E.includes(r))return;const i=l.handlers||Y;for(const s of Object.keys(i)){const[d,...f]=s.split(".");if(d==="keydown"&&f.includes(r)){const u=i[s],c=f.filter(w=>E.includes(w)),b=E.some(w=>{const I=w.charAt(0).toUpperCase()+w.slice(1);return a.getModifierState(I)});if(c.length>0){if(b){for(const w of E)if(f.includes(w)){const I=w.charAt(0).toUpperCase()+w.slice(1);a.getModifierState(I)&&u(a)}}}else b||u(a)}}};n.onMounted(()=>{for(const l of t){const a=e(l);for(const r of a)r.addEventListener("keydown",o(l))}}),n.onBeforeUnmount(()=>{for(const l of t){const a=e(l);for(const r of a)r.removeEventListener("keydown",o(l))}})}const we=["data-colindex","data-rowindex","data-editable","contenteditable","tabindex"],he={key:1},ge=n.defineComponent({__name:"ACell",props:{colIndex:{},rowIndex:{},tableid:{},addNavigation:{type:[Boolean,Object],default:!0},tabIndex:{default:0},clickHandler:{}},setup(t){var I;const e=t,o=n.inject(e.tableid),l=n.ref(null);let a=n.ref(!1);const r=n.computed(()=>{const p=o.cellData(e.colIndex,e.rowIndex);if(o.columns[e.colIndex].format){const g=o.columns[e.colIndex].format;return typeof g=="function"?g(p):typeof g=="string"?Function(`"use strict";return (${g})`)()(p):p}else return p}),i=p=>{if(e.clickHandler){e.clickHandler(p);return}if(o.columns[e.colIndex].mask,o.columns[e.colIndex].modalComponent){const g=l.value.getBoundingClientRect();o.modal.visible=!0,o.modal.colIndex=e.colIndex,o.modal.rowIndex=e.rowIndex,o.modal.parent=l.value,o.modal.top=g.top+g.height,o.modal.left=g.left,o.modal.width=d.value,o.modal.component=o.columns[e.colIndex].modalComponent,o.modal.componentProps=o.columns[e.colIndex].modalComponentProps}};if(e.addNavigation){let p={...Y,"keydown.f2":i,"keydown.alt.up":i,"keydown.alt.down":i,"keydown.alt.left":i,"keydown.alt.right":i};typeof e.addNavigation=="object"&&(p={...p,...e.addNavigation}),$([{selectors:l,handlers:p}])}const s=n.computed(()=>o.columns[e.colIndex].align||"center"),d=n.computed(()=>o.columns[e.colIndex].width||"40ch");let f="";const u=()=>{l.value&&(f=l.value.innerText)},c=()=>{l.value&&l.value.innerHTML!==f&&(f=l.value.innerText,l.value.dispatchEvent(new Event("change")),a.value=!0,o.columns[e.colIndex].format||o.setCellData(e.rowIndex,e.colIndex,f))},b=(p,g)=>g&&p===0&&g>0?`${g}ch`:"inherit",w={textAlign:s.value,width:d.value,backgroundColor:a.value?"var(--cell-modified-color)":"inherit",fontWeight:a.value?"bold":"inherit",paddingLeft:b(e.colIndex,(I=o.display[e.rowIndex])==null?void 0:I.indent)};return(p,g)=>(n.openBlock(),n.createElementBlock("td",{ref_key:"cell",ref:l,"data-colindex":p.colIndex,"data-rowindex":p.rowIndex,"data-editable":n.unref(o).columns[p.colIndex].edit,contenteditable:n.unref(o).columns[p.colIndex].edit,tabindex:p.tabIndex,spellcheck:!1,style:w,onFocus:u,onPaste:c,onBlur:c,onInput:c,onClick:i,onMousedown:i},[n.unref(o).columns[p.colIndex].cellComponent?(n.openBlock(),n.createBlock(n.resolveDynamicComponent(n.unref(o).columns[p.colIndex].cellComponent),n.mergeProps({key:0,value:r.value},n.unref(o).columns[p.colIndex].cellComponentProps),null,16,["value"])):(n.openBlock(),n.createElementBlock("span",he,n.toDisplayString(r.value),1))],40,we))}}),He="",_=(t,e)=>{const o=t.__vccOpts||t;for(const[l,a]of e)o[l]=a;return o},B=_(ge,[["__scopeId","data-v-07dfe445"]]),be=["tabindex"],ye=["tabindex"],xe=["colspan"],_e=n.defineComponent({__name:"AExpansionRow",props:{row:{},rowIndex:{},tableid:{},tabIndex:{default:-1},addNavigation:{}},setup(t){const e=t,o=n.inject(e.tableid),l=n.ref(null),a=n.ref(null),r=()=>o.display[e.rowIndex].expanded?"▼":"►";if(e.addNavigation!==void 0){const i=Object.assign({},e.addNavigation);i["keydown.control.g"]=s=>{s.stopPropagation(),s.preventDefault(),o.toggleRowExpand(e.rowIndex)},$([{selectors:l,handlers:i}])}return(i,s)=>(n.openBlock(),n.createElementBlock(n.Fragment,null,[n.createElementVNode("tr",n.mergeProps(i.$attrs,{ref_key:"rowEl",ref:l,tabindex:i.tabIndex,class:"expandable-row"}),[n.createElementVNode("td",{tabIndex:-1,onClick:s[0]||(s[0]=d=>n.unref(o).toggleRowExpand(i.rowIndex)),class:"row-index"},n.toDisplayString(r()),1),n.renderSlot(i.$slots,"row",{},void 0,!0)],16,be),n.unref(o).display[e.rowIndex].expanded?(n.openBlock(),n.createElementBlock("tr",{key:0,ref_key:"rowExpanded",ref:a,tabindex:i.tabIndex,class:"expanded-row"},[n.createElementVNode("td",{tabIndex:-1,colspan:n.unref(o).columns.length+1,class:"expanded-row-content"},[n.renderSlot(i.$slots,"content",{},void 0,!0)],8,xe)],8,ye)):n.createCommentVNode("",!0)],64))}}),Le="",Z=_(_e,[["__scopeId","data-v-b2e2ed2d"]]),Ie=["tabindex"],Ee={key:0,tabIndex:-1,class:"list-index"},ke=n.defineComponent({__name:"ARow",props:{row:{},rowIndex:{},tableid:{},tabIndex:{default:-1},addNavigation:{}},setup(t){n.useCssVars(d=>({"5b18ee03":n.unref(a)}));const e=t,o=n.inject(e.tableid),l=n.ref(null),a=o.numberedRowWidth.value,r=()=>o.config.view!=="tree"?"":o.display[e.rowIndex].isRoot||o.display[e.rowIndex].isParent?o.display[e.rowIndex].childrenOpen?"-":"+":"",i=()=>o.config.view!=="tree"||o.display[e.rowIndex].isRoot||o.display[e.rowIndex].open,s=d=>{o.toggleRowExpand(d)};return e.addNavigation&&$([{selectors:l,handlers:e.addNavigation}]),(d,f)=>n.withDirectives((n.openBlock(),n.createElementBlock("tr",{ref_key:"rowEl",ref:l,tabindex:d.tabIndex,class:"table-row"},[n.unref(o).config.view==="list"?(n.openBlock(),n.createElementBlock("td",Ee,n.toDisplayString(d.rowIndex+1),1)):n.unref(o).config.view==="tree"?(n.openBlock(),n.createElementBlock("td",{key:1,tabIndex:-1,class:"tree-index",onClick:f[0]||(f[0]=u=>s(d.rowIndex))},n.toDisplayString(r()),1)):n.renderSlot(d.$slots,"indexCell",{key:2},void 0,!0),n.renderSlot(d.$slots,"default",{},void 0,!0)],8,Ie)),[[n.vShow,i()]])}}),Me="",O=_(ke,[["__scopeId","data-v-4c71a067"]]);let k;const Ce=new Uint8Array(16);function Ae(){if(!k&&(k=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!k))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return k(Ce)}const m=[];for(let t=0;t<256;++t)m.push((t+256).toString(16).slice(1));function Se(t,e=0){return m[t[e+0]]+m[t[e+1]]+m[t[e+2]]+m[t[e+3]]+"-"+m[t[e+4]]+m[t[e+5]]+"-"+m[t[e+6]]+m[t[e+7]]+"-"+m[t[e+8]]+m[t[e+9]]+"-"+m[t[e+10]]+m[t[e+11]]+m[t[e+12]]+m[t[e+13]]+m[t[e+14]]+m[t[e+15]]}const K={randomUUID:typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};function v(t,e,o){if(K.randomUUID&&!e&&!t)return K.randomUUID();t=t||{};const l=t.random||(t.rng||Ae)();if(l[6]=l[6]&15|64,l[8]=l[8]&63|128,e){o=o||0;for(let a=0;a<16;++a)e[o+a]=l[a];return e}return Se(l)}class ee{constructor(e,o,l,a,r,i){this.id=e||v(),this.rows=l,this.columns=n.reactive(o),this.config=n.reactive(a),this.table=r||n.reactive(this.createTableObject()),this.display=this.createDisplayObject(i),this.modal=n.reactive({visible:!1})}createTableObject(){const e={};for(const[o,l]of this.columns.entries())for(const[a,r]of this.rows.entries())e[`${o}:${a}`]=r[l.name];return e}createDisplayObject(e){const o=[Object.assign({},{modified:!1})];if(e&&"0:0"in e)return e;const l=new Set;for(let a=this.rows.length-1;a>=0;a--){const r=this.rows[a];r.parent&&l.add(r.parent),o[a]={childrenOpen:!1,expanded:!1,indent:r.indent||null,isParent:l.has(a),isRoot:r.parent===null||r.parent===void 0,modified:!1,open:r.parent===null||r.parent===void 0,parent:r.parent}}return n.reactive(o)}get zeroColumn(){return["list","tree","list-expansion"].includes(this.config.view)}get numberedRowWidth(){return n.computed(()=>String(Math.ceil(this.rows.length/100)+1)+"ch")}cellData(e,o){return this.table[`${e}:${o}`]}setCellData(e,o,l){this.table[`${o}:${e}`]!==l&&(this.display[e].modified=!0),this.table[`${o}:${e}`]=l;const a=this.columns[o];return this.rows[e][a.name]=l,this.table[`${o}:${e}`]}toggleRowExpand(e){if(this.config.view==="tree"){this.display[e].childrenOpen=!this.display[e].childrenOpen;for(let o=this.rows.length-1;o>=0;o--)this.display[o].parent===e&&(this.display[o].open=!this.display[o].open,this.display[o].childrenOpen&&this.toggleRowExpand(o))}else this.config.view==="list-expansion"&&(this.display[e].expanded=!this.display[e].expanded)}}const Te={key:0},De={class:"atable-header-row",tabindex:"-1"},$e={key:0,id:"header-index"},Be=n.defineComponent({__name:"ATableHeader",props:{columns:{},config:{},tableid:{}},setup(t){n.useCssVars(r=>({"12d06943":n.unref(l)}));const e=t,o=n.inject(e.tableid),l=o.numberedRowWidth.value,a=r=>({minWidth:r.width||"40ch",textAlign:r.align||"center",width:o.config.fullWidth?"auto":null});return(r,i)=>r.columns.length?(n.openBlock(),n.createElementBlock("thead",Te,[n.createElementVNode("tr",De,[n.unref(o).zeroColumn?(n.openBlock(),n.createElementBlock("th",$e)):n.createCommentVNode("",!0),(n.openBlock(!0),n.createElementBlock(n.Fragment,null,n.renderList(r.columns,(s,d)=>(n.openBlock(),n.createElementBlock("th",{key:d,tabindex:"-1",style:n.normalizeStyle(a(s))},[n.renderSlot(r.$slots,"default",{},()=>[n.createTextVNode(n.toDisplayString(s.label||String.fromCharCode(d+97).toUpperCase()),1)],!0)],4))),128))])])):n.createCommentVNode("",!0)}}),je="",R=_(Be,[["__scopeId","data-v-16e66636"]]),Oe=n.defineComponent({__name:"ATableModal",props:{colIndex:{},rowIndex:{},tableid:{}},setup(t){const e=t;n.inject(e.tableid);const o=l=>{l.stopPropagation()};return(l,a)=>(n.openBlock(),n.createElementBlock("div",{ref:"amodal",class:"amodal",tabindex:"-1",onClick:o,onInput:o},[n.renderSlot(l.$slots,"default",{},void 0,!0)],544))}}),Ue="",P=_(Oe,[["__scopeId","data-v-10a48b2a"]]),Re=n.defineComponent({__name:"ATable",props:{id:{},modelValue:{},columns:{},rows:{default:()=>[]},config:{default:()=>new Object},tableid:{}},emits:["update:modelValue"],setup(t,{emit:e}){const o=t,l=e;let a=o.modelValue?o.modelValue:o.rows,r=new ee(o.id,o.columns,a,o.config);n.provide(r.id,r),n.watch(()=>r.rows,s=>{l("update:modelValue",s)},{deep:!0});const i=s=>{var d;(d=r.modal.parent)!=null&&d.contains(s.target)||r.modal.visible&&(r.modal.visible=!1)};return window.addEventListener("click",i),window.addEventListener("keydown",s=>{if(s.key==="Escape"&&r.modal.visible){r.modal.visible=!1;const d=r.modal.parent;d&&n.nextTick().then(()=>{const f=d.dataset.rowindex,u=d.dataset.colindex,c=document.querySelectorAll(`[data-rowindex='${f}'][data-colindex='${u}']`);c&&c[0].focus()})}}),(s,d)=>(n.openBlock(),n.createElementBlock("table",{class:"atable",style:n.normalizeStyle({width:n.unref(r).config.fullWidth?"100%":"auto"})},[n.renderSlot(s.$slots,"header",{data:n.unref(r)},()=>[n.createVNode(R,{columns:n.unref(r).columns,config:n.unref(r).config,tableid:n.unref(r).id},null,8,["columns","config","tableid"])],!0),n.createElementVNode("tbody",null,[n.renderSlot(s.$slots,"body",{data:n.unref(r)},()=>[(n.openBlock(!0),n.createElementBlock(n.Fragment,null,n.renderList(n.unref(r).rows,(f,u)=>(n.openBlock(),n.createBlock(O,{key:f.id||n.unref(v)(),row:f,rowIndex:u,tableid:n.unref(r).id},{default:n.withCtx(()=>[(n.openBlock(!0),n.createElementBlock(n.Fragment,null,n.renderList(n.unref(r).columns,(c,b)=>(n.openBlock(),n.createBlock(B,{key:`${b}:${u}`,tableid:n.unref(r).id,col:c,spellcheck:"false",rowIndex:u,colIndex:b+(n.unref(r).zeroColumn?0:-1),component:c.cellComponent,style:n.normalizeStyle({textAlign:(c==null?void 0:c.align)||"center",minWidth:(c==null?void 0:c.width)||"40ch",width:n.unref(r).config.fullWidth?"auto":null})},null,8,["tableid","col","rowIndex","colIndex","component","style"]))),128))]),_:2},1032,["row","rowIndex","tableid"]))),128))],!0)]),n.renderSlot(s.$slots,"footer",{data:n.unref(r)},void 0,!0),n.renderSlot(s.$slots,"modal",{data:n.unref(r)},()=>[n.withDirectives(n.createVNode(P,{colIndex:n.unref(r).modal.colIndex,rowIndex:n.unref(r).modal.rowIndex,tableid:n.unref(r).id,style:n.normalizeStyle({left:n.unref(r).modal.left+"px",top:n.unref(r).modal.top+"px",maxWidth:n.unref(r).modal.width+"px"})},{default:n.withCtx(()=>[(n.openBlock(),n.createBlock(n.resolveDynamicComponent(n.unref(r).modal.component),n.mergeProps({key:`${n.unref(r).modal.rowIndex}:${n.unref(r).modal.colIndex}`,colIndex:n.unref(r).modal.colIndex,rowIndex:n.unref(r).modal.rowIndex,tableid:n.unref(r).id},n.unref(r).modal.componentProps),null,16,["colIndex","rowIndex","tableid"]))]),_:1},8,["colIndex","rowIndex","tableid","style"]),[[n.vShow,n.unref(r).modal.visible]])],!0)],4))}}),We="",te=_(Re,[["__scopeId","data-v-55d8ba05"]]);function Pe(t){t.component("ACell",B),t.component("AExpansionRow",Z),t.component("ARow",O),t.component("ATable",te),t.component("ATableHeader",R),t.component("ATableModal",P)}h.ACell=B,h.AExpansionRow=Z,h.ARow=O,h.ATable=te,h.ATableHeader=R,h.ATableModal=P,h.TableDataStore=ee,h.install=Pe,Object.defineProperty(h,Symbol.toStringTag,{value:"Module"})});
//# sourceMappingURL=atable.umd.cjs.map
