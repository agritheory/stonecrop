(function(m,n){typeof exports=="object"&&typeof module<"u"?n(exports,require("vue")):typeof define=="function"&&define.amd?define(["exports","vue"],n):(m=typeof globalThis<"u"?globalThis:m||self,n(m["@stonecrop/aform"]={},m.Vue))})(this,function(m,n){"use strict";const ne={id:"checkbox-container"},oe=["id","readonly","required"],le={id:"custom-checkbox"},ae=["for"],re=["innerHTML"],se=n.defineComponent({__name:"ACheckbox",props:{label:{},value:{},required:{type:Boolean},readOnly:{type:Boolean},uuid:{},validation:{default:()=>({errorMessage:"&nbsp;"})}},emits:["update:value"],setup(e,{emit:t}){const l=e,o=t,r=n.computed({get(){return l.value},set(a){o("update:value",a)}});return(a,s)=>(n.openBlock(),n.createElementBlock("div",null,[n.createElementVNode("label",ne,[n.withDirectives(n.createElementVNode("input",{"onUpdate:modelValue":s[0]||(s[0]=i=>r.value=i),type:"checkbox",id:a.uuid,class:"checkbox",readonly:a.readOnly,required:a.required},null,8,oe),[[n.vModelCheckbox,r.value]]),n.createElementVNode("span",le,n.toDisplayString(r.value),1)]),n.createElementVNode("label",{for:a.uuid,id:"checkbox-label"},n.toDisplayString(a.label),9,ae),n.withDirectives(n.createElementVNode("p",{innerHTML:a.validation.errorMessage},null,8,re),[[n.vShow,a.validation.errorMessage]])]))}}),E=(e,t)=>{const l=e.__vccOpts||e;for(const[o,r]of t)l[o]=r;return l},$=E(se,[["__scopeId","data-v-743cd4db"]]),ie=n.createElementVNode("div",null,[n.createElementVNode("input",{type:"text"}),n.createElementVNode("input",{type:"text"}),n.createElementVNode("input",{type:"text"})],-1),O=n.defineComponent({__name:"AComboBox",props:["event","cellData","tableID"],setup(e){return(t,l)=>{const o=n.resolveComponent("ATableModal");return n.openBlock(),n.createBlock(o,{event:e.event,cellData:e.cellData,class:"amodal"},{default:n.withCtx(()=>[ie]),_:1},8,["event","cellData"])}}});var v;const L=typeof window<"u",ce=e=>typeof e=="string",de=()=>{};L&&(v=window==null?void 0:window.navigator)!=null&&v.userAgent&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function N(e){return typeof e=="function"?e():n.unref(e)}function ue(e){return e}function pe(e){return n.getCurrentScope()?(n.onScopeDispose(e),!0):!1}function I(e){var t;const l=N(e);return(t=l==null?void 0:l.$el)!=null?t:l}const F=L?window:void 0;function fe(...e){let t,l,o,r;if(ce(e[0])||Array.isArray(e[0])?([l,o,r]=e,t=F):[t,l,o,r]=e,!t)return de;Array.isArray(l)||(l=[l]),Array.isArray(o)||(o=[o]);const a=[],s=()=>{a.forEach(d=>d()),a.length=0},i=(d,y,g,f)=>(d.addEventListener(y,g,f),()=>d.removeEventListener(y,g,f)),p=n.watch(()=>[I(t),N(r)],([d,y])=>{s(),d&&a.push(...l.flatMap(g=>o.map(f=>i(d,g,f,y))))},{immediate:!0,flush:"post"}),c=()=>{p(),s()};return pe(c),c}const P=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},q="__vueuse_ssr_handlers__";P[q]=P[q]||{};function me(e,{window:t=F,scrollTarget:l}={}){const o=n.ref(!1),r=()=>{if(!t)return;const a=t.document,s=I(e);if(!s)o.value=!1;else{const i=s.getBoundingClientRect();o.value=i.top<=(t.innerHeight||a.documentElement.clientHeight)&&i.left<=(t.innerWidth||a.documentElement.clientWidth)&&i.bottom>=0&&i.right>=0}};return n.watch(()=>I(e),()=>r(),{immediate:!0,flush:"post"}),t&&fe(l||t,"scroll",r,{capture:!1,passive:!0}),o}var x;(function(e){e.UP="UP",e.RIGHT="RIGHT",e.DOWN="DOWN",e.LEFT="LEFT",e.NONE="NONE"})(x||(x={}));var he=Object.defineProperty,H=Object.getOwnPropertySymbols,ye=Object.prototype.hasOwnProperty,ge=Object.prototype.propertyIsEnumerable,R=(e,t,l)=>t in e?he(e,t,{enumerable:!0,configurable:!0,writable:!0,value:l}):e[t]=l,we=(e,t)=>{for(var l in t||(t={}))ye.call(t,l)&&R(e,l,t[l]);if(H)for(var l of H(t))ge.call(t,l)&&R(e,l,t[l]);return e};we({linear:ue},{easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]});const w=e=>{let t=me(e).value;return t=t&&e.offsetHeight>0,t},b=e=>e.tabIndex>=0,U=e=>{const t=e.target;return S(t)},S=e=>{var t;let l;if(e instanceof HTMLTableCellElement){const o=(t=e.parentElement)==null?void 0:t.previousElementSibling;if(o){const r=Array.from(o.children)[e.cellIndex];r&&(l=r)}}else if(e instanceof HTMLTableRowElement){const o=e.previousElementSibling;o&&(l=o)}return l&&(!b(l)||!w(l))?S(l):l},be=e=>{var t;const l=e.target;let o;if(l instanceof HTMLTableCellElement){const r=(t=l.parentElement)==null?void 0:t.parentElement;if(r){const a=r.firstElementChild.children[l.cellIndex];a&&(o=a)}}else if(l instanceof HTMLTableRowElement){const r=l.parentElement;if(r){const a=r.firstElementChild;a&&(o=a)}}return o&&(!b(o)||!w(o))?B(o):o},j=e=>{const t=e.target;return B(t)},B=e=>{var t;let l;if(e instanceof HTMLTableCellElement){const o=(t=e.parentElement)==null?void 0:t.nextElementSibling;if(o){const r=Array.from(o.children)[e.cellIndex];r&&(l=r)}}else if(e instanceof HTMLTableRowElement){const o=e.nextElementSibling;o&&(l=o)}return l&&(!b(l)||!w(l))?B(l):l},ke=e=>{var t;const l=e.target;let o;if(l instanceof HTMLTableCellElement){const r=(t=l.parentElement)==null?void 0:t.parentElement;if(r){const a=r.lastElementChild.children[l.cellIndex];a&&(o=a)}}else if(l instanceof HTMLTableRowElement){const r=l.parentElement;if(r){const a=r.lastElementChild;a&&(o=a)}}return o&&(!b(o)||!w(o))?S(o):o},Q=e=>{const t=e.target;return _(t)},_=e=>{var t;let l;if(e.previousElementSibling)l=e.previousElementSibling;else{const o=(t=e.parentElement)==null?void 0:t.previousElementSibling;l=o==null?void 0:o.lastElementChild}return l&&(!b(l)||!w(l))?_(l):l},Y=e=>{const t=e.target;return M(t)},M=e=>{var t;let l;if(e.nextElementSibling)l=e.nextElementSibling;else{const o=(t=e.parentElement)==null?void 0:t.nextElementSibling;l=o==null?void 0:o.firstElementChild}return l&&(!b(l)||!w(l))?M(l):l},z=e=>{const t=e.target.parentElement.firstElementChild;return t&&(!b(t)||!w(t))?M(t):t},W=e=>{const t=e.target.parentElement.lastElementChild;return t&&(!b(t)||!w(t))?_(t):t},V=["alt","control","shift","meta"],Ee={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right"},K={"keydown.up":e=>{const t=U(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.down":e=>{const t=j(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.left":e=>{const t=Q(e);e.preventDefault(),e.stopPropagation(),t&&t.focus()},"keydown.right":e=>{const t=Y(e);e.preventDefault(),e.stopPropagation(),t&&t.focus()},"keydown.control.up":e=>{const t=be(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.control.down":e=>{const t=ke(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.control.left":e=>{const t=z(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.control.right":e=>{const t=W(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.end":e=>{const t=W(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.enter":e=>{if(e.target instanceof HTMLTableCellElement){e.preventDefault(),e.stopPropagation();const t=j(e);t&&t.focus()}},"keydown.shift.enter":e=>{if(e.target instanceof HTMLTableCellElement){e.preventDefault(),e.stopPropagation();const t=U(e);t&&t.focus()}},"keydown.home":e=>{const t=z(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.tab":e=>{const t=Y(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.shift.tab":e=>{const t=Q(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())}};function Ce(e){const t=o=>{let r=null;o.parent&&(typeof o.parent=="string"?r=document.querySelector(o.parent):o.parent instanceof Element?r=o.parent:r=o.parent.value);let a=[];if(o.selectors)if(typeof o.selectors=="string")a=r?Array.from(r.querySelectorAll(o.selectors)):Array.from(document.querySelectorAll(o.selectors));else if(o.selectors instanceof Element)a.push(o.selectors);else if(Array.isArray(o.selectors.value))for(const s of o.selectors.value)s instanceof Element?a.push(s):a.push(s.$el);else a.push(o.selectors.value);else a=Array.from(r.children).filter(s=>b(s)&&w(s));return a},l=o=>r=>{const a=Ee[r.key]||r.key.toLowerCase();if(V.includes(a))return;const s=o.handlers||K;for(const i of Object.keys(s)){const[p,...c]=i.split(".");if(p==="keydown"&&c.includes(a)){const d=s[i],y=c.filter(f=>V.includes(f)),g=V.some(f=>{const A=f.charAt(0).toUpperCase()+f.slice(1);return r.getModifierState(A)});if(y.length>0){if(g){for(const f of V)if(c.includes(f)){const A=f.charAt(0).toUpperCase()+f.slice(1);r.getModifierState(A)&&d(r)}}}else g||d(r)}}};n.onMounted(()=>{for(const o of e){const r=t(o);for(const a of r)a.addEventListener("keydown",l(o))}}),n.onBeforeUnmount(()=>{for(const o of e){const r=t(o);for(const a of r)a.removeEventListener("keydown",l(o))}})}const De=["event","colIndex","rowIndex","tableid"],Ae={colspan:"5"},Ve=["onClick"],Ie=6,C=7,G=E(n.defineComponent({__name:"ADate",props:{colIndex:{},rowIndex:{},tableid:{},event:{},indent:{},readonly:{type:Boolean}},setup(e){const t=e,l=n.inject(t.tableid),o=new Date,r=n.ref(),a=n.ref(),s=n.ref(),i=n.ref([]);n.onMounted(async()=>{let u=l.cellData(t.colIndex,t.rowIndex);u?(u instanceof Date||(u=new Date(u)),r.value=u,a.value=r.value.getMonth(),s.value=r.value.getFullYear()):(a.value=o.getMonth(),s.value=o.getFullYear()),p(),await n.nextTick();const D=document.getElementsByClassName("selecteddate");if(D.length>0)D[0].focus();else{const h=document.getElementsByClassName("todaysdate");h.length>0&&h[0].focus()}}),n.watch([a,s],()=>{p()});const p=()=>{i.value=[];const u=new Date(s.value,a.value,1),D=u.getDay(),h=u.setDate(u.getDate()-D);for(let k of Array(43).keys())i.value.push(h+k*864e5)},c=()=>{s.value-=1},d=()=>{s.value+=1},y=()=>{a.value==0?(a.value=11,c()):a.value-=1},g=()=>{a.value==11?(a.value=0,d()):a.value+=1},f=u=>{if(a.value===o.getMonth())return o.toDateString()===new Date(u).toDateString()},A=u=>new Date(u).toDateString()===new Date(r.value).toDateString(),We=(u,D)=>{r.value=new Date(i.value[D]),Ke()},Ke=()=>{l.setCellData(t.rowIndex,t.colIndex,r.value.getTime())},Ge=n.computed(()=>new Date(s.value,a.value,1).toLocaleDateString(void 0,{year:"numeric",month:"long"}));return Ce([{parent:"table.adate",selectors:"td",handlers:{...K,"keydown.pageup":y,"keydown.shift.pageup":c,"keydown.pagedown":g,"keydown.shift.pagedown":d}}]),(u,D)=>u.readonly?n.createCommentVNode("",!0):(n.openBlock(),n.createElementBlock("div",{key:0,event:u.event,colIndex:u.colIndex,rowIndex:u.rowIndex,tableid:u.tableid,class:"adate",tabindex:"0",ref:"adatepicker"},[n.createElementVNode("table",null,[n.createElementVNode("tr",null,[n.createElementVNode("td",{onClick:y,tabindex:-1},"<"),n.createElementVNode("th",Ae,n.toDisplayString(Ge.value),1),n.createElementVNode("td",{onClick:g,tabindex:-1},">")]),(n.openBlock(),n.createElementBlock(n.Fragment,null,n.renderList(Ie,h=>n.createElementVNode("tr",{key:h},[(n.openBlock(),n.createElementBlock(n.Fragment,null,n.renderList(C,k=>n.createElementVNode("td",{key:(h-1)*C+k,contenteditable:!1,spellcheck:!1,tabindex:0,style:n.normalizeStyle({border:A(i.value[(h-1)*C+k])?"2px solid var(--focus-cell-outline)":"none",borderBottomColor:f(i.value[(h-1)*C+k])?"var(--focus-cell-outline)":"none"}),onClick:n.withModifiers(Je=>We(Je,(h-1)*C+k),["prevent","stop"]),class:n.normalizeClass({todaysdate:f(i.value[(h-1)*C+k]),selecteddate:A(i.value[(h-1)*C+k])})},n.toDisplayString(new Date(i.value[(h-1)*C+k]).getDate()),15,Ve)),64))])),64))])],8,De))}}),[["__scopeId","data-v-169f1184"]]),Se=n.defineComponent({name:"ADropdown",props:{modelValue:{type:String,required:!1,default:""},label:{type:String,required:!0},value:String,items:{type:Array,required:!1,default:()=>[]},isAsync:{type:Boolean,required:!1,default:!1}},emits:["update:modelValue","filterChanged"],data(){return{results:[],search:this.modelValue,isLoading:!1,arrowCounter:0,isOpen:!1}},watch:{items:function(e,t){this.isLoading=!1,this.results=e}},mounted(){document.addEventListener("click",this.handleClickOutside),this.filterResults()},destroyed(){document.removeEventListener("click",this.handleClickOutside)},methods:{setResult(e){this.search=e,this.closeResults()},filterResults(){this.results=this.items.filter(e=>e.toLowerCase().indexOf(this.search.toLowerCase())>-1)},onChange(){this.isOpen=!0,this.isAsync?(this.isLoading=!0,this.$emit("filterChanged",this.search)):this.filterResults()},handleClickOutside(e){this.$el.contains(e.target)||(this.closeResults(),this.arrowCounter=0)},closeResults(){this.isOpen=!1,this.items.includes(this.search)||(this.search=""),this.$emit("update:modelValue",this.search)},onArrowDown(){this.arrowCounter<this.results.length&&(this.arrowCounter=this.arrowCounter+1)},onArrowUp(){this.arrowCounter>0&&(this.arrowCounter=this.arrowCounter-1)},onEnter(){this.search=this.results[this.arrowCounter],this.closeResults(),this.arrowCounter=0},openWithSearch(){this.search="",this.onChange(),this.$refs.mopInput.focus()}}}),Be={class:"input-wrapper"},_e={id:"autocomplete-results",class:"autocomplete-results"},Me={key:0,class:"loading autocomplete-result"},Te=["onClick"];function $e(e,t,l,o,r,a){return n.openBlock(),n.createElementBlock("div",{class:n.normalizeClass(["autocomplete",{isOpen:e.isOpen}])},[n.createElementVNode("div",Be,[n.withDirectives(n.createElementVNode("input",{ref:"mopInput",type:"text",onInput:t[0]||(t[0]=(...s)=>e.onChange&&e.onChange(...s)),onFocus:t[1]||(t[1]=(...s)=>e.onChange&&e.onChange(...s)),"onUpdate:modelValue":t[2]||(t[2]=s=>e.search=s),onKeydown:[t[3]||(t[3]=n.withKeys((...s)=>e.onArrowDown&&e.onArrowDown(...s),["down"])),t[4]||(t[4]=n.withKeys((...s)=>e.onArrowUp&&e.onArrowUp(...s),["up"])),t[5]||(t[5]=n.withKeys((...s)=>e.onEnter&&e.onEnter(...s),["enter"]))]},null,544),[[n.vModelText,e.search]]),n.withDirectives(n.createElementVNode("ul",_e,[e.isLoading?(n.openBlock(),n.createElementBlock("li",Me,"Loading results...")):(n.openBlock(!0),n.createElementBlock(n.Fragment,{key:1},n.renderList(e.results,(s,i)=>(n.openBlock(),n.createElementBlock("li",{key:i,onClick:p=>e.setResult(s),class:n.normalizeClass(["autocomplete-result",{"is-active":i===e.arrowCounter}])},n.toDisplayString(s),11,Te))),128))],512),[[n.vShow,e.isOpen]]),n.createElementVNode("label",null,n.toDisplayString(e.label),1)])],2)}const J=E(Se,[["render",$e]]),Oe=E(n.defineComponent({__name:"CollapseButton",props:{collapsed:{type:Boolean}},setup(e){return(t,l)=>(n.openBlock(),n.createElementBlock("button",{class:n.normalizeClass(["collapse-button",t.collapsed?"rotated":"unrotated"])},"×",2))}}),[["__scopeId","data-v-6f1c1b45"]]),T=E(n.defineComponent({__name:"AForm",props:{modelValue:{},data:{},readonly:{type:Boolean}},emits:["update:modelValue"],setup(e,{emit:t}){const l=e,o=t,r=n.ref(l.data||{}),a=i=>{let p={};for(const[c,d]of Object.entries(i))["component","fieldtype"].includes(c)||(p[c]=d),c==="rows"&&d&&d.length===0&&(p.rows=r.value[i.fieldname]);return p},s=n.computed({get:()=>l.modelValue.map((i,p)=>n.computed({get(){return i.value},set:c=>{l.modelValue[p].value=c,o("update:modelValue",l.modelValue)}})),set:()=>{}});return(i,p)=>(n.openBlock(),n.createElementBlock("form",null,[(n.openBlock(!0),n.createElementBlock(n.Fragment,null,n.renderList(i.modelValue,(c,d)=>(n.openBlock(),n.createBlock(n.resolveDynamicComponent(c.component),n.mergeProps({key:d,schema:c,modelValue:s.value[d].value,"onUpdate:modelValue":y=>s.value[d].value=y,data:r.value[c.fieldname],readonly:i.readonly},a(c)),null,16,["schema","modelValue","onUpdate:modelValue","data","readonly"]))),128))]))}}),[["__scopeId","data-v-82492bb4"]]),X=E(n.defineComponent({__name:"AFieldset",props:{schema:{},label:{},collapsible:{type:Boolean},data:{}},setup(e){const t=e,l=n.ref(t.data||[]);let o=n.ref(!1),r=n.ref(t.collapsible);const a=n.ref(t.schema);function s(i){i.preventDefault(),r.value&&(o.value=!o.value)}return(i,p)=>(n.openBlock(),n.createElementBlock("fieldset",null,[n.createElementVNode("legend",{onClick:s,onSubmit:s},[n.createTextVNode(n.toDisplayString(i.label)+" ",1),n.unref(r)?(n.openBlock(),n.createBlock(Oe,{key:0,collapsed:n.unref(o)},null,8,["collapsed"])):n.createCommentVNode("",!0)],32),n.renderSlot(i.$slots,"default",{collapsed:n.unref(o)},()=>[n.withDirectives(n.createVNode(T,{modelValue:a.value,"onUpdate:modelValue":p[0]||(p[0]=c=>a.value=c),data:l.value},null,8,["modelValue","data"]),[[n.vShow,!n.unref(o)]])],!0)]))}}),[["__scopeId","data-v-cad9b578"]]),ve=["id","disabled","required"],Le=["for"],Ne=["innerHTML"],Z=E(n.defineComponent({__name:"ANumericInput",props:{label:{},modelValue:{},required:{type:Boolean},readonly:{type:Boolean},uuid:{},validation:{default:()=>({errorMessage:"&nbsp;"})}},emits:["update:modelValue"],setup(e,{emit:t}){const l=e,o=t,r=n.computed({get:()=>l.modelValue,set:a=>{o("update:modelValue",a)}});return(a,s)=>(n.openBlock(),n.createElementBlock("div",null,[n.withDirectives(n.createElementVNode("input",{"onUpdate:modelValue":s[0]||(s[0]=i=>r.value=i),type:"number",id:a.uuid,disabled:a.readonly,required:a.required},null,8,ve),[[n.vModelText,r.value]]),n.createElementVNode("label",{for:a.uuid},n.toDisplayString(a.label),9,Le),n.withDirectives(n.createElementVNode("p",{innerHTML:a.validation.errorMessage},null,8,Ne),[[n.vShow,a.validation.errorMessage]])]))}}),[["__scopeId","data-v-be33e6c4"]]),ee={date:"##/##/####",datetime:"####/##/## ##:##",time:"##:##",fulltime:"##:##:##",phone:"(###) ### - ####",card:"#### #### #### ####"};function Fe(e){try{return Function(`"use strict";return (${e})`)()}catch{}}function Pe(e){var l;let t=e.value;if(t){const o=Fe(t);if(o){const r=e.instance.locale;t=o(r)}}else{const r=(l=e.instance.schema.fieldtype)==null?void 0:l.toLowerCase();r&&ee[r]&&(t=ee[r])}return t}function qe(e,t){t||(t="#");let l=e;const o=[t,"/","-","(",")"," "];for(const r of o)l=l.replaceAll(r,"");return l}function xe(e,t,l){l||(l="#");let o=t;for(const r of e){const a=o.indexOf(l);if(a!==-1){const s=o.substring(0,a),i=o.substring(a+1);o=s+r+i}}return o.slice(0,t.length)}function He(e,t){const l=Pe(t);if(!l)return;const o="#",r=e.value,a=qe(r,o);if(a){const s=xe(a,l,o);t.instance.maskFilled&&(t.instance.maskFilled=!s.includes(o)),e.value=s}else e.value=l}const Re=n.defineComponent({name:"ATextInput",props:{schema:{type:Object,required:!0},label:{type:String,required:!0},modelValue:{type:null},mask:{type:String},required:{type:Boolean},readonly:{type:Boolean},uuid:{type:String},validation:{type:Object,default:()=>({errorMessage:"&nbsp;"})}},setup(e,t){const l=n.ref(!1),o=n.inject("locale","");return{inputText:n.computed({get(){return e.modelValue},set(a){t.emit("update:modelValue",a)}}),locale:o,maskFilled:l}},directives:{mask:He}}),Ue=["id","disabled","maxlength","required"],je=["for"],Qe=["innerHTML"];function Ye(e,t,l,o,r,a){const s=n.resolveDirective("mask");return n.openBlock(),n.createElementBlock("div",null,[n.withDirectives(n.createElementVNode("input",{"onUpdate:modelValue":t[0]||(t[0]=i=>e.inputText=i),id:e.uuid,disabled:e.readonly,maxlength:e.mask?e.maskFilled&&e.mask.length:void 0,required:e.required},null,8,Ue),[[n.vModelText,e.inputText],[s,e.mask]]),n.createElementVNode("label",{for:e.uuid},n.toDisplayString(e.label),9,je),n.withDirectives(n.createElementVNode("p",{innerHTML:e.validation.errorMessage},null,8,Qe),[[n.vShow,e.validation.errorMessage]])])}const te=E(Re,[["render",Ye],["__scopeId","data-v-76dba9b8"]]);function ze(e){e.component("ACheckbox",$),e.component("ACombobox",O),e.component("ADate",G),e.component("ADropdown",J),e.component("AFieldset",X),e.component("AForm",T),e.component("ANumericInput",Z),e.component("ATextInput",te)}m.ACheckbox=$,m.AComboBox=O,m.ADate=G,m.ADropdown=J,m.AFieldset=X,m.AForm=T,m.ANumericInput=Z,m.ATextInput=te,m.install=ze,Object.defineProperty(m,Symbol.toStringTag,{value:"Module"})});
//# sourceMappingURL=aform.umd.cjs.map
