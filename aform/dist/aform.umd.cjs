(function(g,n){typeof exports=="object"&&typeof module<"u"?n(exports,require("vue")):typeof define=="function"&&define.amd?define(["exports","vue"],n):(g=typeof globalThis<"u"?globalThis:g||self,n(g["@agritheory/aform"]={},g.Vue))})(this,function(g,n){"use strict";const be={id:"checkbox-container"},_e=["id","readonly","required"],we={id:"custom-checkbox"},ke=["for"],Ee=["innerHTML"],De=n.defineComponent({__name:"ACheckbox",props:{label:null,value:null,required:{type:Boolean},readOnly:{type:Boolean},uuid:null,validation:{default:()=>({errorMessage:"&nbsp;"})}},emits:["update:value"],setup(e,{emit:t}){const o=e,l=n.computed({get(){return o.value},set(a){t("update:value",a)}});return(a,r)=>(n.openBlock(),n.createElementBlock("div",null,[n.createElementVNode("label",be,[n.withDirectives(n.createElementVNode("input",{"onUpdate:modelValue":r[0]||(r[0]=s=>n.isRef(l)?l.value=s:null),type:"checkbox",id:e.uuid,class:"checkbox",readonly:e.readOnly,required:e.required},null,8,_e),[[n.vModelCheckbox,n.unref(l)]]),n.createElementVNode("span",we,n.toDisplayString(n.unref(l)),1)]),n.createElementVNode("label",{for:e.uuid,id:"checkbox-label"},n.toDisplayString(e.label),9,ke),n.withDirectives(n.createElementVNode("p",{innerHTML:e.validation.errorMessage},null,8,Ee),[[n.vShow,e.validation.errorMessage]])]))}}),Tt="",D=(e,t)=>{const o=e.__vccOpts||e;for(const[l,a]of t)o[l]=a;return o},P=D(De,[["__scopeId","data-v-743cd4db"]]),ve=n.createElementVNode("div",null,[n.createElementVNode("input",{type:"text"}),n.createElementVNode("input",{type:"text"}),n.createElementVNode("input",{type:"text"})],-1),$=n.defineComponent({__name:"AComboBox",props:["event","cellData","tableID"],setup(e){return(t,o)=>{const l=n.resolveComponent("ATableModal");return n.openBlock(),n.createBlock(l,{event:e.event,cellData:e.cellData,class:"amodal"},{default:n.withCtx(()=>[ve]),_:1},8,["event","cellData"])}}}),N={date:"##/##/####",datetime:"####/##/## ##:##",time:"##:##",fulltime:"##:##:##",phone:"(###) ### - ####",card:"#### #### #### ####"};function Ce(e){try{return Function(`"use strict";return (${e})`)()}catch{}}function Ie(e){var o;let t=e.value;if(t){const l=Ce(t);if(l){const a=e.instance.locale;t=l(a)}}else{const a=(o=e.instance.schema.fieldtype)==null?void 0:o.toLowerCase();a&&N[a]&&(t=N[a])}return t}function Ae(e,t){t||(t="#");let o=e;const l=[t,"/","-","(",")"," "];for(const a of l)o=o.replaceAll(a,"");return o}function Oe(e,t,o){o||(o="#");let l=t;for(const a of e){const r=l.indexOf(o);if(r!==-1){const s=l.substring(0,r),i=l.substring(r+1);l=s+a+i}}return l.slice(0,t.length)}function L(e,t){const o=Ie(t);if(!o)return;const l="#",a=e.value,r=Ae(a,l);if(r){const s=Oe(r,o,l);t.instance.maskFilled&&(t.instance.maskFilled=!s.includes(l)),e.value=s}else e.value=o}var F;const q=typeof window<"u",xe=e=>typeof e=="string",Se=()=>{};q&&((F=window==null?void 0:window.navigator)!=null&&F.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function H(e){return typeof e=="function"?e():n.unref(e)}function Te(e){return e}function R(e){return n.getCurrentScope()?(n.onScopeDispose(e),!0):!1}function j(e,t=!0){n.getCurrentInstance()?n.onMounted(e):t?e():n.nextTick(e)}function I(e){var t;const o=H(e);return(t=o==null?void 0:o.$el)!=null?t:o}const Q=q?window:void 0;function U(...e){let t,o,l,a;if(xe(e[0])||Array.isArray(e[0])?([o,l,a]=e,t=Q):[t,o,l,a]=e,!t)return Se;Array.isArray(o)||(o=[o]),Array.isArray(l)||(l=[l]);const r=[],s=()=>{r.forEach(u=>u()),r.length=0},i=(u,p,m,f)=>(u.addEventListener(p,m,f),()=>u.removeEventListener(p,m,f)),c=n.watch(()=>[I(t),H(a)],([u,p])=>{s(),u&&r.push(...o.flatMap(m=>l.map(f=>i(u,m,f,p))))},{immediate:!0,flush:"post"}),d=()=>{c(),s()};return R(d),d}function Me(e,t=!1){const o=n.ref(),l=()=>o.value=!!e();return l(),j(l,t),o}const z=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},W="__vueuse_ssr_handlers__";z[W]=z[W]||{};var Y=Object.getOwnPropertySymbols,Be=Object.prototype.hasOwnProperty,Ve=Object.prototype.propertyIsEnumerable,Pe=(e,t)=>{var o={};for(var l in e)Be.call(e,l)&&t.indexOf(l)<0&&(o[l]=e[l]);if(e!=null&&Y)for(var l of Y(e))t.indexOf(l)<0&&Ve.call(e,l)&&(o[l]=e[l]);return o};function $e(e,t,o={}){const l=o,{window:a=Q}=l,r=Pe(l,["window"]);let s;const i=Me(()=>a&&"ResizeObserver"in a),c=()=>{s&&(s.disconnect(),s=void 0)},d=n.watch(()=>I(e),p=>{c(),i.value&&a&&p&&(s=new ResizeObserver(t),s.observe(p,r))},{immediate:!0,flush:"post"}),u=()=>{c(),d()};return R(u),{isSupported:i,stop:u}}function Ne(e,t={}){const{reset:o=!0,windowResize:l=!0,windowScroll:a=!0,immediate:r=!0}=t,s=n.ref(0),i=n.ref(0),c=n.ref(0),d=n.ref(0),u=n.ref(0),p=n.ref(0),m=n.ref(0),f=n.ref(0);function h(){const v=I(e);if(!v){o&&(s.value=0,i.value=0,c.value=0,d.value=0,u.value=0,p.value=0,m.value=0,f.value=0);return}const _=v.getBoundingClientRect();s.value=_.height,i.value=_.bottom,c.value=_.left,d.value=_.right,u.value=_.top,p.value=_.width,m.value=_.x,f.value=_.y}return $e(e,h),n.watch(()=>I(e),v=>!v&&h()),a&&U("scroll",h,{capture:!0,passive:!0}),l&&U("resize",h,{passive:!0}),j(()=>{r&&h()}),{height:s,bottom:i,left:c,right:d,top:u,width:p,x:m,y:f,update:h}}var G;(function(e){e.UP="UP",e.RIGHT="RIGHT",e.DOWN="DOWN",e.LEFT="LEFT",e.NONE="NONE"})(G||(G={}));var Le=Object.defineProperty,K=Object.getOwnPropertySymbols,Fe=Object.prototype.hasOwnProperty,qe=Object.prototype.propertyIsEnumerable,J=(e,t,o)=>t in e?Le(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,He=(e,t)=>{for(var o in t||(t={}))Fe.call(t,o)&&J(e,o,t[o]);if(K)for(var o of K(t))qe.call(t,o)&&J(e,o,t[o]);return e};He({linear:Te},{easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]});function O(e,t){console.log(e,t);const o=Ne(e.$el);return e.position={top:o.bottom.value,left:o.left.value,width:o.width.value,height:"1.15rem"},{target:e,component:t}}const Re=n.defineComponent({name:"ADate",props:{schema:{type:Object,required:!0},label:{type:String,required:!0},modelValue:{type:null},mask:{type:String},required:{type:Boolean},readonly:{type:Boolean},uuid:{type:String},validation:{type:Object,default:()=>({errorMessage:"&nbsp;"})}},setup(e,t){const o=n.ref(!1),l=n.inject("locale","");return{inputText:n.computed({get(){return e.modelValue},set(r){t.emit("update:modelValue",r)}}),locale:l,maskFilled:o,useAModal:O}},directives:{mask:L},methods:{toggleModal(){O(this,"ADatePicker")}}}),Bt="",je=["id","disabled","maxlength","required"],Qe=["for"];function Ue(e,t,o,l,a,r){const s=n.resolveDirective("mask");return n.openBlock(),n.createElementBlock("div",null,[n.withDirectives(n.createElementVNode("input",{"onUpdate:modelValue":t[0]||(t[0]=i=>e.inputText=i),id:e.uuid,ref:"uuid",disabled:e.readonly,maxlength:e.mask?e.maskFilled&&e.mask.length:void 0,required:e.required,onClick:t[1]||(t[1]=(...i)=>e.toggleModal&&e.toggleModal(...i))},null,8,je),[[n.vModelText,e.inputText],[s,e.mask]]),n.createElementVNode("label",{for:e.uuid},n.toDisplayString(e.label),9,Qe)])}const X=D(Re,[["render",Ue],["__scopeId","data-v-cb714523"]]);var Z;const ee=typeof window<"u",ze=e=>typeof e=="string",We=()=>{};ee&&(Z=window==null?void 0:window.navigator)!=null&&Z.userAgent&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function te(e){return typeof e=="function"?e():n.unref(e)}function Ye(e){return e}function Ge(e){return n.getCurrentScope()?(n.onScopeDispose(e),!0):!1}function x(e){var t;const o=te(e);return(t=o==null?void 0:o.$el)!=null?t:o}const ne=ee?window:void 0;function Ke(...e){let t,o,l,a;if(ze(e[0])||Array.isArray(e[0])?([o,l,a]=e,t=ne):[t,o,l,a]=e,!t)return We;Array.isArray(o)||(o=[o]),Array.isArray(l)||(l=[l]);const r=[],s=()=>{r.forEach(u=>u()),r.length=0},i=(u,p,m,f)=>(u.addEventListener(p,m,f),()=>u.removeEventListener(p,m,f)),c=n.watch(()=>[x(t),te(a)],([u,p])=>{s(),u&&r.push(...o.flatMap(m=>l.map(f=>i(u,m,f,p))))},{immediate:!0,flush:"post"}),d=()=>{c(),s()};return Ge(d),d}const oe=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},le="__vueuse_ssr_handlers__";oe[le]=oe[le]||{};function Je(e,{window:t=ne,scrollTarget:o}={}){const l=n.ref(!1),a=()=>{if(!t)return;const r=t.document,s=x(e);if(!s)l.value=!1;else{const i=s.getBoundingClientRect();l.value=i.top<=(t.innerHeight||r.documentElement.clientHeight)&&i.left<=(t.innerWidth||r.documentElement.clientWidth)&&i.bottom>=0&&i.right>=0}};return n.watch(()=>x(e),()=>a(),{immediate:!0,flush:"post"}),t&&Ke(o||t,"scroll",a,{capture:!1,passive:!0}),l}var ae;(function(e){e.UP="UP",e.RIGHT="RIGHT",e.DOWN="DOWN",e.LEFT="LEFT",e.NONE="NONE"})(ae||(ae={}));var Xe=Object.defineProperty,re=Object.getOwnPropertySymbols,Ze=Object.prototype.hasOwnProperty,et=Object.prototype.propertyIsEnumerable,se=(e,t,o)=>t in e?Xe(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,tt=(e,t)=>{for(var o in t||(t={}))Ze.call(t,o)&&se(e,o,t[o]);if(re)for(var o of re(t))et.call(t,o)&&se(e,o,t[o]);return e};tt({linear:Ye},{easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]});const w=e=>{let t=Je(e).value;return t=t&&e.offsetHeight>0,t},k=e=>e.tabIndex>=0,ie=e=>{const t=e.target;return S(t)},S=e=>{var t;let o;if(e instanceof HTMLTableCellElement){const l=(t=e.parentElement)==null?void 0:t.previousElementSibling;if(l){const a=Array.from(l.children)[e.cellIndex];a&&(o=a)}}else if(e instanceof HTMLTableRowElement){const l=e.previousElementSibling;l&&(o=l)}return o&&(!k(o)||!w(o))?S(o):o},nt=e=>{var t;const o=e.target;let l;if(o instanceof HTMLTableCellElement){const a=(t=o.parentElement)==null?void 0:t.parentElement;if(a){const r=a.firstElementChild.children[o.cellIndex];r&&(l=r)}}else if(o instanceof HTMLTableRowElement){const a=o.parentElement;if(a){const r=a.firstElementChild;r&&(l=r)}}return l&&(!k(l)||!w(l))?T(l):l},ce=e=>{const t=e.target;return T(t)},T=e=>{var t;let o;if(e instanceof HTMLTableCellElement){const l=(t=e.parentElement)==null?void 0:t.nextElementSibling;if(l){const a=Array.from(l.children)[e.cellIndex];a&&(o=a)}}else if(e instanceof HTMLTableRowElement){const l=e.nextElementSibling;l&&(o=l)}return o&&(!k(o)||!w(o))?T(o):o},ot=e=>{var t;const o=e.target;let l;if(o instanceof HTMLTableCellElement){const a=(t=o.parentElement)==null?void 0:t.parentElement;if(a){const r=a.lastElementChild.children[o.cellIndex];r&&(l=r)}}else if(o instanceof HTMLTableRowElement){const a=o.parentElement;if(a){const r=a.lastElementChild;r&&(l=r)}}return l&&(!k(l)||!w(l))?S(l):l},de=e=>{const t=e.target;return M(t)},M=e=>{var t;let o;if(e.previousElementSibling)o=e.previousElementSibling;else{const l=(t=e.parentElement)==null?void 0:t.previousElementSibling;o=l==null?void 0:l.lastElementChild}return o&&(!k(o)||!w(o))?M(o):o},ue=e=>{const t=e.target;return B(t)},B=e=>{var t;let o;if(e.nextElementSibling)o=e.nextElementSibling;else{const l=(t=e.parentElement)==null?void 0:t.nextElementSibling;o=l==null?void 0:l.firstElementChild}return o&&(!k(o)||!w(o))?B(o):o},fe=e=>{const t=e.target.parentElement.firstElementChild;return t&&(!k(t)||!w(t))?B(t):t},pe=e=>{const t=e.target.parentElement.lastElementChild;return t&&(!k(t)||!w(t))?M(t):t},A=["alt","control","shift","meta"],lt={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right"},me={"keydown.up":e=>{const t=ie(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.down":e=>{const t=ce(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.left":e=>{const t=de(e);e.preventDefault(),e.stopPropagation(),t&&t.focus()},"keydown.right":e=>{const t=ue(e);e.preventDefault(),e.stopPropagation(),t&&t.focus()},"keydown.control.up":e=>{const t=nt(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.control.down":e=>{const t=ot(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.control.left":e=>{const t=fe(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.control.right":e=>{const t=pe(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.end":e=>{const t=pe(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.enter":e=>{if(e.target instanceof HTMLTableCellElement){e.preventDefault(),e.stopPropagation();const t=ce(e);t&&t.focus()}},"keydown.shift.enter":e=>{if(e.target instanceof HTMLTableCellElement){e.preventDefault(),e.stopPropagation();const t=ie(e);t&&t.focus()}},"keydown.home":e=>{const t=fe(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.tab":e=>{const t=ue(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.shift.tab":e=>{const t=de(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())}};function at(e){const t=l=>{let a=null;l.parent&&(typeof l.parent=="string"?a=document.querySelector(l.parent):l.parent instanceof Element?a=l.parent:a=l.parent.value);let r=[];if(l.selectors)if(typeof l.selectors=="string")r=a?Array.from(a.querySelectorAll(l.selectors)):Array.from(document.querySelectorAll(l.selectors));else if(l.selectors instanceof Element)r.push(l.selectors);else if(Array.isArray(l.selectors.value))for(const s of l.selectors.value)s instanceof Element?r.push(s):r.push(s.$el);else r.push(l.selectors.value);else r=Array.from(a.children).filter(s=>k(s)&&w(s));return r},o=l=>a=>{const r=lt[a.key]||a.key.toLowerCase();if(A.includes(r))return;const s=l.handlers||me;for(const i of Object.keys(s)){const[c,...d]=i.split(".");if(c==="keydown"&&d.includes(r)){const u=s[i],p=d.filter(f=>A.includes(f)),m=A.some(f=>{const h=f.charAt(0).toUpperCase()+f.slice(1);return a.getModifierState(h)});if(p.length>0){if(m){for(const f of A)if(d.includes(f)){const h=f.charAt(0).toUpperCase()+f.slice(1);a.getModifierState(h)&&u(a)}}}else m||u(a)}}};n.onMounted(()=>{for(const l of e){const a=t(l);for(const r of a)r.addEventListener("keydown",o(l))}}),n.onBeforeUnmount(()=>{for(const l of e){const a=t(l);for(const r of a)r.removeEventListener("keydown",o(l))}})}const rt=["event","colIndex","rowIndex","tableid"],st={colspan:"5"},it=["onClick"],ct=n.defineComponent({__name:"ADatePicker",props:{colIndex:null,rowIndex:null,tableid:null,event:null,indent:null,readonly:{type:Boolean}},setup(e){const t=e,o=n.inject(t.tableid),l=6,a=7,r=new Date,s=n.ref(),i=n.ref(),c=n.ref(),d=n.ref([]);n.onMounted(async()=>{let y=o.cellData(t.colIndex,t.rowIndex);y?(y instanceof Date||(y=new Date(y)),s.value=y,i.value=s.value.getMonth(),c.value=s.value.getFullYear()):(i.value=r.getMonth(),c.value=r.getFullYear()),u(),await n.nextTick();const C=document.getElementsByClassName("selecteddate");if(C.length>0)C[0].focus();else{const b=document.getElementsByClassName("todaysdate");b.length>0&&b[0].focus()}}),n.watch([i,c],()=>{u()});const u=()=>{d.value=[];const y=new Date(c.value,i.value,1),C=y.getDay(),b=y.setDate(y.getDate()-C);for(let E of Array(43).keys())d.value.push(b+E*864e5)},p=()=>{c.value-=1},m=()=>{c.value+=1},f=()=>{i.value==0?(i.value=11,p()):i.value-=1},h=()=>{i.value==11?(i.value=0,m()):i.value+=1},v=y=>{if(i.value===r.getMonth())return r.toDateString()===new Date(y).toDateString()},_=y=>new Date(y).toDateString()===new Date(s.value).toDateString(),At=(y,C)=>{s.value=new Date(d.value[C]),Ot()},Ot=()=>{o.setCellData(t.rowIndex,t.colIndex,s.value.getTime())},xt=n.computed(()=>new Date(c.value,i.value,1).toLocaleDateString(void 0,{year:"numeric",month:"long"}));return at([{parent:"table.adate",selectors:"td",handlers:{...me,"keydown.pageup":f,"keydown.shift.pageup":p,"keydown.pagedown":h,"keydown.shift.pagedown":m}}]),(y,C)=>e.readonly?n.createCommentVNode("",!0):(n.openBlock(),n.createElementBlock("div",{key:0,event:e.event,colIndex:e.colIndex,rowIndex:e.rowIndex,tableid:e.tableid,class:"adate",tabindex:"0",ref:"adatepicker"},[n.createElementVNode("table",null,[n.createElementVNode("tr",null,[n.createElementVNode("td",{onClick:f,tabindex:-1},"<"),n.createElementVNode("th",st,n.toDisplayString(n.unref(xt)),1),n.createElementVNode("td",{onClick:h,tabindex:-1},">")]),(n.openBlock(),n.createElementBlock(n.Fragment,null,n.renderList(l,b=>n.createElementVNode("tr",{key:b},[(n.openBlock(),n.createElementBlock(n.Fragment,null,n.renderList(a,E=>n.createElementVNode("td",{key:(b-1)*a+E,contenteditable:!1,spellcheck:!1,tabindex:0,style:n.normalizeStyle({border:_(d.value[(b-1)*a+E])?"2px solid var(--focus-cell-outline)":"none",borderBottomColor:v(d.value[(b-1)*a+E])?"var(--focus-cell-outline)":"none"}),onClick:n.withModifiers(St=>At(St,(b-1)*a+E),["prevent","stop"]),class:n.normalizeClass({todaysdate:v(d.value[(b-1)*a+E]),selecteddate:_(d.value[(b-1)*a+E])})},n.toDisplayString(new Date(d.value[(b-1)*a+E]).getDate()),15,it)),64))])),64))])],8,rt))}}),Pt="",dt=D(ct,[["__scopeId","data-v-a53b9422"]]),ut=n.defineComponent({__name:"CollapseButton",props:{collapsed:{type:Boolean}},setup(e){return(t,o)=>(n.openBlock(),n.createElementBlock("button",{class:n.normalizeClass(["collapse-button",e.collapsed?"rotated":"unrotated"])},"×",2))}}),$t="",ft=D(ut,[["__scopeId","data-v-6f1c1b45"]]),pt=n.defineComponent({__name:"AForm",props:{modelValue:null,data:null,readonly:{type:Boolean}},emits:["update:modelValue"],setup(e,{emit:t}){const o=e,l=n.ref(o.data||{}),a=s=>{let i={};for(const[c,d]of Object.entries(s))["component","fieldtype"].includes(c)||(i[c]=d),c==="rows"&&d&&d.length===0&&(i.rows=l.value[s.fieldname]);return i},r=n.computed({get:()=>o.modelValue.map((s,i)=>n.computed({get(){return s.value},set:c=>{o.modelValue[i].value=c,t("update:modelValue",o.modelValue)}})),set:()=>{}});return(s,i)=>(n.openBlock(),n.createElementBlock("form",null,[(n.openBlock(!0),n.createElementBlock(n.Fragment,null,n.renderList(e.modelValue,(c,d)=>(n.openBlock(),n.createBlock(n.resolveDynamicComponent(c.component),n.mergeProps({key:d,schema:c,modelValue:n.unref(r)[d].value,"onUpdate:modelValue":u=>n.unref(r)[d].value=u,data:l.value[c.fieldname],readonly:e.readonly},a(c)),null,16,["schema","modelValue","onUpdate:modelValue","data","readonly"]))),128))]))}}),Nt="",V=D(pt,[["__scopeId","data-v-74d66cf2"]]),mt=n.defineComponent({__name:"AFieldset",props:{schema:null,label:null,collapsible:{type:Boolean},data:null},setup(e){const t=e,o=n.ref(t.data||[]);let l=n.ref(!1),a=n.ref(t.collapsible);const r=n.ref(t.schema);function s(i){i.preventDefault(),a.value&&(l.value=!l.value)}return(i,c)=>(n.openBlock(),n.createElementBlock("fieldset",null,[n.createElementVNode("legend",{onClick:s,onSubmit:s},[n.createTextVNode(n.toDisplayString(e.label)+" ",1),n.unref(a)?(n.openBlock(),n.createBlock(ft,{key:0,collapsed:n.unref(l)},null,8,["collapsed"])):n.createCommentVNode("",!0)],32),n.renderSlot(i.$slots,"default",{collapsed:n.unref(l)},()=>[n.withDirectives(n.createVNode(V,{modelValue:r.value,"onUpdate:modelValue":c[0]||(c[0]=d=>r.value=d),data:o.value},null,8,["modelValue","data"]),[[n.vShow,!n.unref(l)]])],!0)]))}}),Lt="",ye=D(mt,[["__scopeId","data-v-cad9b578"]]),yt=n.createElementVNode("p",null,"Hello from the modal!",-1),gt=n.defineComponent({__name:"AModal",props:{target:{default:()=>({position:{top:0,left:0,width:0,height:0}})},component:null},setup(e){const t=e,o=n.ref(!1),{target:l,component:a}=O(t.target,t.component);return(r,s)=>(n.openBlock(),n.createBlock(n.Teleport,{to:"amodal"},[o.value?(n.openBlock(),n.createElementBlock("div",{key:0,class:"amodal",style:n.normalizeStyle({top:n.unref(l).position.top,left:n.unref(l).position.left,width:n.unref(l).position.width,height:n.unref(l).position.height})},[yt,n.createElementVNode("button",{onClick:s[0]||(s[0]=i=>o.value=!1)},"Close")],4)):n.createCommentVNode("",!0)]))}}),Ft="",ht=["id","disabled","required"],bt=["for"],_t=["innerHTML"],wt=n.defineComponent({__name:"ANumericInput",props:{label:null,modelValue:null,required:{type:Boolean},readonly:{type:Boolean},uuid:null,validation:{default:()=>({errorMessage:"&nbsp;"})}},emits:["update:modelValue"],setup(e,{emit:t}){const o=e,l=n.computed({get:()=>o.modelValue,set:a=>{t("update:modelValue",a)}});return(a,r)=>(n.openBlock(),n.createElementBlock("div",null,[n.withDirectives(n.createElementVNode("input",{"onUpdate:modelValue":r[0]||(r[0]=s=>n.isRef(l)?l.value=s:null),type:"number",id:e.uuid,disabled:e.readonly,required:e.required},null,8,ht),[[n.vModelText,n.unref(l)]]),n.createElementVNode("label",{for:e.uuid},n.toDisplayString(e.label),9,bt),n.withDirectives(n.createElementVNode("p",{innerHTML:e.validation.errorMessage},null,8,_t),[[n.vShow,e.validation.errorMessage]])]))}}),qt="",ge=D(wt,[["__scopeId","data-v-be33e6c4"]]),kt=n.defineComponent({name:"ATextInput",props:{schema:{type:Object,required:!0},label:{type:String,required:!0},modelValue:{type:null},mask:{type:String},required:{type:Boolean},readonly:{type:Boolean},uuid:{type:String},validation:{type:Object,default:()=>({errorMessage:"&nbsp;"})}},setup(e,t){const o=n.ref(!1),l=n.inject("locale","");return{inputText:n.computed({get(){return e.modelValue},set(r){t.emit("update:modelValue",r)}}),locale:l,maskFilled:o}},directives:{mask:L}}),Ht="",Et=["id","disabled","maxlength","required"],Dt=["for"],vt=["innerHTML"];function Ct(e,t,o,l,a,r){const s=n.resolveDirective("mask");return n.openBlock(),n.createElementBlock("div",null,[n.withDirectives(n.createElementVNode("input",{"onUpdate:modelValue":t[0]||(t[0]=i=>e.inputText=i),id:e.uuid,disabled:e.readonly,maxlength:e.mask?e.maskFilled&&e.mask.length:void 0,required:e.required},null,8,Et),[[n.vModelText,e.inputText],[s,e.mask]]),n.createElementVNode("label",{for:e.uuid},n.toDisplayString(e.label),9,Dt),n.withDirectives(n.createElementVNode("p",{innerHTML:e.validation.errorMessage},null,8,vt),[[n.vShow,e.validation.errorMessage]])])}const he=D(kt,[["render",Ct],["__scopeId","data-v-76dba9b8"]]);function It(e){e.component("ACheckbox",P),e.component("ACombobox",$),e.component("ADate",X),e.component("ADatePicker",dt),e.component("AFieldset",ye),e.component("AForm",V),e.component("AModal",gt),e.component("ANumericInput",ge),e.component("ATextInput",he)}g.ACheckbox=P,g.AComboBox=$,g.ADate=X,g.AFieldset=ye,g.AForm=V,g.ANumericInput=ge,g.ATextInput=he,g.install=It,Object.defineProperty(g,Symbol.toStringTag,{value:"Module"})});
//# sourceMappingURL=aform.umd.cjs.map
