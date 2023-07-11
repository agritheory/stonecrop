(function(p,n){typeof exports=="object"&&typeof module<"u"?n(exports,require("vue")):typeof define=="function"&&define.amd?define(["exports","vue"],n):(p=typeof globalThis<"u"?globalThis:p||self,n(p["@agritheory/aform"]={},p.Vue))})(this,function(p,n){"use strict";const oe={id:"checkbox-container"},le=["id","readonly","required"],ae={id:"custom-checkbox"},re=["for"],se=["innerHTML"],ie=n.defineComponent({__name:"ACheckbox",props:{label:null,value:null,required:{type:Boolean},readOnly:{type:Boolean},uuid:null,validation:{default:()=>({errorMessage:"&nbsp;"})}},emits:["update:value"],setup(e,{emit:t}){const l=e,o=n.computed({get(){return l.value},set(a){t("update:value",a)}});return(a,r)=>(n.openBlock(),n.createElementBlock("div",null,[n.createElementVNode("label",oe,[n.withDirectives(n.createElementVNode("input",{"onUpdate:modelValue":r[0]||(r[0]=s=>n.isRef(o)?o.value=s:null),type:"checkbox",id:e.uuid,class:"checkbox",readonly:e.readOnly,required:e.required},null,8,le),[[n.vModelCheckbox,n.unref(o)]]),n.createElementVNode("span",ae,n.toDisplayString(n.unref(o)),1)]),n.createElementVNode("label",{for:e.uuid,id:"checkbox-label"},n.toDisplayString(e.label),9,re),n.withDirectives(n.createElementVNode("p",{innerHTML:e.validation.errorMessage},null,8,se),[[n.vShow,e.validation.errorMessage]])]))}}),ot="",E=(e,t)=>{const l=e.__vccOpts||e;for(const[o,a]of t)l[o]=a;return l},O=E(ie,[["__scopeId","data-v-743cd4db"]]),ce=n.createElementVNode("div",null,[n.createElementVNode("input",{type:"text"}),n.createElementVNode("input",{type:"text"}),n.createElementVNode("input",{type:"text"})],-1),$=n.defineComponent({__name:"AComboBox",props:["event","cellData","tableID"],setup(e){return(t,l)=>{const o=n.resolveComponent("ATableModal");return n.openBlock(),n.createBlock(o,{event:e.event,cellData:e.cellData,class:"amodal"},{default:n.withCtx(()=>[ce]),_:1},8,["event","cellData"])}}});var v;const L=typeof window<"u",de=e=>typeof e=="string",ue=()=>{};L&&(v=window==null?void 0:window.navigator)!=null&&v.userAgent&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function N(e){return typeof e=="function"?e():n.unref(e)}function pe(e){return e}function fe(e){return n.getCurrentScope()?(n.onScopeDispose(e),!0):!1}function A(e){var t;const l=N(e);return(t=l==null?void 0:l.$el)!=null?t:l}const F=L?window:void 0;function me(...e){let t,l,o,a;if(de(e[0])||Array.isArray(e[0])?([l,o,a]=e,t=F):[t,l,o,a]=e,!t)return ue;Array.isArray(l)||(l=[l]),Array.isArray(o)||(o=[o]);const r=[],s=()=>{r.forEach(f=>f()),r.length=0},i=(f,b,y,u)=>(f.addEventListener(b,y,u),()=>f.removeEventListener(b,y,u)),c=n.watch(()=>[A(t),N(a)],([f,b])=>{s(),f&&r.push(...l.flatMap(y=>o.map(u=>i(f,y,u,b))))},{immediate:!0,flush:"post"}),d=()=>{c(),s()};return fe(d),d}const I=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},V="__vueuse_ssr_handlers__";I[V]=I[V]||{},I[V];function he(e,{window:t=F,scrollTarget:l}={}){const o=n.ref(!1),a=()=>{if(!t)return;const r=t.document,s=A(e);if(!s)o.value=!1;else{const i=s.getBoundingClientRect();o.value=i.top<=(t.innerHeight||r.documentElement.clientHeight)&&i.left<=(t.innerWidth||r.documentElement.clientWidth)&&i.bottom>=0&&i.right>=0}};return n.watch(()=>A(e),()=>a(),{immediate:!0,flush:"post"}),t&&me(l||t,"scroll",a,{capture:!1,passive:!0}),o}var P;(function(e){e.UP="UP",e.RIGHT="RIGHT",e.DOWN="DOWN",e.LEFT="LEFT",e.NONE="NONE"})(P||(P={}));var ye=Object.defineProperty,q=Object.getOwnPropertySymbols,ge=Object.prototype.hasOwnProperty,we=Object.prototype.propertyIsEnumerable,H=(e,t,l)=>t in e?ye(e,t,{enumerable:!0,configurable:!0,writable:!0,value:l}):e[t]=l,be=(e,t)=>{for(var l in t||(t={}))ge.call(t,l)&&H(e,l,t[l]);if(q)for(var l of q(t))we.call(t,l)&&H(e,l,t[l]);return e};be({linear:pe},{easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]});const g=e=>{let t=he(e).value;return t=t&&e.offsetHeight>0,t},w=e=>e.tabIndex>=0,R=e=>{const t=e.target;return S(t)},S=e=>{var t;let l;if(e instanceof HTMLTableCellElement){const o=(t=e.parentElement)==null?void 0:t.previousElementSibling;if(o){const a=Array.from(o.children)[e.cellIndex];a&&(l=a)}}else if(e instanceof HTMLTableRowElement){const o=e.previousElementSibling;o&&(l=o)}return l&&(!w(l)||!g(l))?S(l):l},ke=e=>{var t;const l=e.target;let o;if(l instanceof HTMLTableCellElement){const a=(t=l.parentElement)==null?void 0:t.parentElement;if(a){const r=a.firstElementChild.children[l.cellIndex];r&&(o=r)}}else if(l instanceof HTMLTableRowElement){const a=l.parentElement;if(a){const r=a.firstElementChild;r&&(o=r)}}return o&&(!w(o)||!g(o))?B(o):o},U=e=>{const t=e.target;return B(t)},B=e=>{var t;let l;if(e instanceof HTMLTableCellElement){const o=(t=e.parentElement)==null?void 0:t.nextElementSibling;if(o){const a=Array.from(o.children)[e.cellIndex];a&&(l=a)}}else if(e instanceof HTMLTableRowElement){const o=e.nextElementSibling;o&&(l=o)}return l&&(!w(l)||!g(l))?B(l):l},Ee=e=>{var t;const l=e.target;let o;if(l instanceof HTMLTableCellElement){const a=(t=l.parentElement)==null?void 0:t.parentElement;if(a){const r=a.lastElementChild.children[l.cellIndex];r&&(o=r)}}else if(l instanceof HTMLTableRowElement){const a=l.parentElement;if(a){const r=a.lastElementChild;r&&(o=r)}}return o&&(!w(o)||!g(o))?S(o):o},j=e=>{const t=e.target;return x(t)},x=e=>{var t;let l;if(e.previousElementSibling)l=e.previousElementSibling;else{const o=(t=e.parentElement)==null?void 0:t.previousElementSibling;l=o==null?void 0:o.lastElementChild}return l&&(!w(l)||!g(l))?x(l):l},Q=e=>{const t=e.target;return T(t)},T=e=>{var t;let l;if(e.nextElementSibling)l=e.nextElementSibling;else{const o=(t=e.parentElement)==null?void 0:t.nextElementSibling;l=o==null?void 0:o.firstElementChild}return l&&(!w(l)||!g(l))?T(l):l},Y=e=>{const t=e.target.parentElement.firstElementChild;return t&&(!w(t)||!g(t))?T(t):t},z=e=>{const t=e.target.parentElement.lastElementChild;return t&&(!w(t)||!g(t))?x(t):t},D=["alt","control","shift","meta"],Ce={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right"},W={"keydown.up":e=>{const t=R(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.down":e=>{const t=U(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.left":e=>{const t=j(e);e.preventDefault(),e.stopPropagation(),t&&t.focus()},"keydown.right":e=>{const t=Q(e);e.preventDefault(),e.stopPropagation(),t&&t.focus()},"keydown.control.up":e=>{const t=ke(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.control.down":e=>{const t=Ee(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.control.left":e=>{const t=Y(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.control.right":e=>{const t=z(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.end":e=>{const t=z(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.enter":e=>{if(e.target instanceof HTMLTableCellElement){e.preventDefault(),e.stopPropagation();const t=U(e);t&&t.focus()}},"keydown.shift.enter":e=>{if(e.target instanceof HTMLTableCellElement){e.preventDefault(),e.stopPropagation();const t=R(e);t&&t.focus()}},"keydown.home":e=>{const t=Y(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.tab":e=>{const t=Q(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())},"keydown.shift.tab":e=>{const t=j(e);t&&(e.preventDefault(),e.stopPropagation(),t.focus())}};function _e(e){const t=o=>{let a=null;o.parent&&(typeof o.parent=="string"?a=document.querySelector(o.parent):o.parent instanceof Element?a=o.parent:a=o.parent.value);let r=[];if(o.selectors)if(typeof o.selectors=="string")r=a?Array.from(a.querySelectorAll(o.selectors)):Array.from(document.querySelectorAll(o.selectors));else if(o.selectors instanceof Element)r.push(o.selectors);else if(Array.isArray(o.selectors.value))for(const s of o.selectors.value)s instanceof Element?r.push(s):r.push(s.$el);else r.push(o.selectors.value);else r=Array.from(a.children).filter(s=>w(s)&&g(s));return r},l=o=>a=>{const r=Ce[a.key]||a.key.toLowerCase();if(D.includes(r))return;const s=o.handlers||W;for(const i of Object.keys(s)){const[c,...d]=i.split(".");if(c==="keydown"&&d.includes(r)){const f=s[i],b=d.filter(u=>D.includes(u)),y=D.some(u=>{const _=u.charAt(0).toUpperCase()+u.slice(1);return a.getModifierState(_)});if(b.length>0){if(y){for(const u of D)if(d.includes(u)){const _=u.charAt(0).toUpperCase()+u.slice(1);a.getModifierState(_)&&f(a)}}}else y||f(a)}}};n.onMounted(()=>{for(const o of e){const a=t(o);for(const r of a)r.addEventListener("keydown",l(o))}}),n.onBeforeUnmount(()=>{for(const o of e){const a=t(o);for(const r of a)r.removeEventListener("keydown",l(o))}})}const De=["event","colIndex","rowIndex","tableid"],Ae={colspan:"5"},Ie=["onClick"],Ve=n.defineComponent({__name:"ADate",props:{colIndex:null,rowIndex:null,tableid:null,event:null,indent:null,readonly:{type:Boolean}},setup(e){const t=e,l=n.inject(t.tableid),o=6,a=7,r=new Date,s=n.ref(),i=n.ref(),c=n.ref(),d=n.ref([]);n.onMounted(async()=>{let m=l.cellData(t.colIndex,t.rowIndex);m?(m instanceof Date||(m=new Date(m)),s.value=m,i.value=s.value.getMonth(),c.value=s.value.getFullYear()):(i.value=r.getMonth(),c.value=r.getFullYear()),f(),await n.nextTick();const C=document.getElementsByClassName("selecteddate");if(C.length>0)C[0].focus();else{const h=document.getElementsByClassName("todaysdate");h.length>0&&h[0].focus()}}),n.watch([i,c],()=>{f()});const f=()=>{d.value=[];const m=new Date(c.value,i.value,1),C=m.getDay(),h=m.setDate(m.getDate()-C);for(let k of Array(43).keys())d.value.push(h+k*864e5)},b=()=>{c.value-=1},y=()=>{c.value+=1},u=()=>{i.value==0?(i.value=11,b()):i.value-=1},_=()=>{i.value==11?(i.value=0,y()):i.value+=1},te=m=>{if(i.value===r.getMonth())return r.toDateString()===new Date(m).toDateString()},ne=m=>new Date(m).toDateString()===new Date(s.value).toDateString(),Ze=(m,C)=>{s.value=new Date(d.value[C]),et()},et=()=>{l.setCellData(t.rowIndex,t.colIndex,s.value.getTime())},tt=n.computed(()=>new Date(c.value,i.value,1).toLocaleDateString(void 0,{year:"numeric",month:"long"}));return _e([{parent:"table.adate",selectors:"td",handlers:{...W,"keydown.pageup":u,"keydown.shift.pageup":b,"keydown.pagedown":_,"keydown.shift.pagedown":y}}]),(m,C)=>e.readonly?n.createCommentVNode("",!0):(n.openBlock(),n.createElementBlock("div",{key:0,event:e.event,colIndex:e.colIndex,rowIndex:e.rowIndex,tableid:e.tableid,class:"adate",tabindex:"0",ref:"adatepicker"},[n.createElementVNode("table",null,[n.createElementVNode("tr",null,[n.createElementVNode("td",{onClick:u,tabindex:-1},"<"),n.createElementVNode("th",Ae,n.toDisplayString(n.unref(tt)),1),n.createElementVNode("td",{onClick:_,tabindex:-1},">")]),(n.openBlock(),n.createElementBlock(n.Fragment,null,n.renderList(o,h=>n.createElementVNode("tr",{key:h},[(n.openBlock(),n.createElementBlock(n.Fragment,null,n.renderList(a,k=>n.createElementVNode("td",{key:(h-1)*a+k,contenteditable:!1,spellcheck:!1,tabindex:0,style:n.normalizeStyle({border:ne(d.value[(h-1)*a+k])?"2px solid var(--focus-cell-outline)":"none",borderBottomColor:te(d.value[(h-1)*a+k])?"var(--focus-cell-outline)":"none"}),onClick:n.withModifiers(nt=>Ze(nt,(h-1)*a+k),["prevent","stop"]),class:n.normalizeClass({todaysdate:te(d.value[(h-1)*a+k]),selecteddate:ne(d.value[(h-1)*a+k])})},n.toDisplayString(new Date(d.value[(h-1)*a+k]).getDate()),15,Ie)),64))])),64))])],8,De))}}),at="",K=E(Ve,[["__scopeId","data-v-fcdc102d"]]),Se=n.defineComponent({name:"ADropdown",props:{modelValue:{type:String,required:!1,default:""},label:{type:String,required:!0},value:String,items:{type:Array,required:!1,default:()=>[]},isAsync:{type:Boolean,required:!1,default:!1}},emits:["update:modelValue","filterChanged"],data(){return{results:[],search:this.modelValue,isLoading:!1,arrowCounter:0,isOpen:!1}},watch:{items:function(e,t){this.isLoading=!1,this.results=e}},mounted(){document.addEventListener("click",this.handleClickOutside),this.filterResults()},destroyed(){document.removeEventListener("click",this.handleClickOutside)},methods:{setResult(e){this.search=e,this.closeResults()},filterResults(){this.results=this.items.filter(e=>e.toLowerCase().indexOf(this.search.toLowerCase())>-1)},onChange(){this.isOpen=!0,this.isAsync?(this.isLoading=!0,this.$emit("filterChanged",this.search)):this.filterResults()},handleClickOutside(e){this.$el.contains(e.target)||(this.closeResults(),this.arrowCounter=0)},closeResults(){this.isOpen=!1,this.items.includes(this.search)||(this.search=""),this.$emit("update:modelValue",this.search)},onArrowDown(){this.arrowCounter<this.results.length&&(this.arrowCounter=this.arrowCounter+1)},onArrowUp(){this.arrowCounter>0&&(this.arrowCounter=this.arrowCounter-1)},onEnter(){this.search=this.results[this.arrowCounter],this.closeResults(),this.arrowCounter=0},openWithSearch(){this.search="",this.onChange(),this.$refs.mopInput.focus()}}}),rt="",Be={class:"input-wrapper"},xe={id:"autocomplete-results",class:"autocomplete-results"},Te={key:0,class:"loading autocomplete-result"},Me=["onClick"];function Oe(e,t,l,o,a,r){return n.openBlock(),n.createElementBlock("div",{class:n.normalizeClass(["autocomplete",{isOpen:e.isOpen}])},[n.createElementVNode("div",Be,[n.withDirectives(n.createElementVNode("input",{ref:"mopInput",type:"text",onInput:t[0]||(t[0]=(...s)=>e.onChange&&e.onChange(...s)),onFocus:t[1]||(t[1]=(...s)=>e.onChange&&e.onChange(...s)),"onUpdate:modelValue":t[2]||(t[2]=s=>e.search=s),onKeydown:[t[3]||(t[3]=n.withKeys((...s)=>e.onArrowDown&&e.onArrowDown(...s),["down"])),t[4]||(t[4]=n.withKeys((...s)=>e.onArrowUp&&e.onArrowUp(...s),["up"])),t[5]||(t[5]=n.withKeys((...s)=>e.onEnter&&e.onEnter(...s),["enter"]))]},null,544),[[n.vModelText,e.search]]),n.withDirectives(n.createElementVNode("ul",xe,[e.isLoading?(n.openBlock(),n.createElementBlock("li",Te,"Loading results...")):(n.openBlock(!0),n.createElementBlock(n.Fragment,{key:1},n.renderList(e.results,(s,i)=>(n.openBlock(),n.createElementBlock("li",{key:i,onClick:c=>e.setResult(s),class:n.normalizeClass(["autocomplete-result",{"is-active":i===e.arrowCounter}])},n.toDisplayString(s),11,Me))),128))],512),[[n.vShow,e.isOpen]]),n.createElementVNode("label",null,n.toDisplayString(e.label),1)])],2)}const G=E(Se,[["render",Oe]]),$e=n.defineComponent({__name:"CollapseButton",props:{collapsed:{type:Boolean}},setup(e){return(t,l)=>(n.openBlock(),n.createElementBlock("button",{class:n.normalizeClass(["collapse-button",e.collapsed?"rotated":"unrotated"])},"×",2))}}),st="",ve=E($e,[["__scopeId","data-v-6f1c1b45"]]),Le=n.defineComponent({__name:"AForm",props:{modelValue:null,data:null,readonly:{type:Boolean}},emits:["update:modelValue"],setup(e,{emit:t}){const l=e,o=n.ref(l.data||{}),a=s=>{let i={};for(const[c,d]of Object.entries(s))["component","fieldtype"].includes(c)||(i[c]=d),c==="rows"&&d&&d.length===0&&(i.rows=o.value[s.fieldname]);return i},r=n.computed({get:()=>l.modelValue.map((s,i)=>n.computed({get(){return s.value},set:c=>{l.modelValue[i].value=c,t("update:modelValue",l.modelValue)}})),set:()=>{}});return(s,i)=>(n.openBlock(),n.createElementBlock("form",null,[(n.openBlock(!0),n.createElementBlock(n.Fragment,null,n.renderList(e.modelValue,(c,d)=>(n.openBlock(),n.createBlock(n.resolveDynamicComponent(c.component),n.mergeProps({key:d,schema:c,modelValue:n.unref(r)[d].value,"onUpdate:modelValue":f=>n.unref(r)[d].value=f,data:o.value[c.fieldname],readonly:e.readonly},a(c)),null,16,["schema","modelValue","onUpdate:modelValue","data","readonly"]))),128))]))}}),it="",M=E(Le,[["__scopeId","data-v-74d66cf2"]]),Ne=n.defineComponent({__name:"AFieldset",props:{schema:null,label:null,collapsible:{type:Boolean},data:null},setup(e){const t=e,l=n.ref(t.data||[]);let o=n.ref(!1),a=n.ref(t.collapsible);const r=n.ref(t.schema);function s(i){i.preventDefault(),a.value&&(o.value=!o.value)}return(i,c)=>(n.openBlock(),n.createElementBlock("fieldset",null,[n.createElementVNode("legend",{onClick:s,onSubmit:s},[n.createTextVNode(n.toDisplayString(e.label)+" ",1),n.unref(a)?(n.openBlock(),n.createBlock(ve,{key:0,collapsed:n.unref(o)},null,8,["collapsed"])):n.createCommentVNode("",!0)],32),n.renderSlot(i.$slots,"default",{collapsed:n.unref(o)},()=>[n.withDirectives(n.createVNode(M,{modelValue:r.value,"onUpdate:modelValue":c[0]||(c[0]=d=>r.value=d),data:l.value},null,8,["modelValue","data"]),[[n.vShow,!n.unref(o)]])],!0)]))}}),ct="",J=E(Ne,[["__scopeId","data-v-cad9b578"]]),Fe=["id","disabled","required"],Pe=["for"],qe=["innerHTML"],He=n.defineComponent({__name:"ANumericInput",props:{label:null,modelValue:null,required:{type:Boolean},readonly:{type:Boolean},uuid:null,validation:{default:()=>({errorMessage:"&nbsp;"})}},emits:["update:modelValue"],setup(e,{emit:t}){const l=e,o=n.computed({get:()=>l.modelValue,set:a=>{t("update:modelValue",a)}});return(a,r)=>(n.openBlock(),n.createElementBlock("div",null,[n.withDirectives(n.createElementVNode("input",{"onUpdate:modelValue":r[0]||(r[0]=s=>n.isRef(o)?o.value=s:null),type:"number",id:e.uuid,disabled:e.readonly,required:e.required},null,8,Fe),[[n.vModelText,n.unref(o)]]),n.createElementVNode("label",{for:e.uuid},n.toDisplayString(e.label),9,Pe),n.withDirectives(n.createElementVNode("p",{innerHTML:e.validation.errorMessage},null,8,qe),[[n.vShow,e.validation.errorMessage]])]))}}),dt="",X=E(He,[["__scopeId","data-v-be33e6c4"]]),Z={date:"##/##/####",datetime:"####/##/## ##:##",time:"##:##",fulltime:"##:##:##",phone:"(###) ### - ####",card:"#### #### #### ####"};function Re(e){try{return Function(`"use strict";return (${e})`)()}catch{}}function Ue(e){var l;let t=e.value;if(t){const o=Re(t);if(o){const a=e.instance.locale;t=o(a)}}else{const a=(l=e.instance.schema.fieldtype)==null?void 0:l.toLowerCase();a&&Z[a]&&(t=Z[a])}return t}function je(e,t){t||(t="#");let l=e;const o=[t,"/","-","(",")"," "];for(const a of o)l=l.replaceAll(a,"");return l}function Qe(e,t,l){l||(l="#");let o=t;for(const a of e){const r=o.indexOf(l);if(r!==-1){const s=o.substring(0,r),i=o.substring(r+1);o=s+a+i}}return o.slice(0,t.length)}function Ye(e,t){const l=Ue(t);if(!l)return;const o="#",a=e.value,r=je(a,o);if(r){const s=Qe(r,l,o);t.instance.maskFilled&&(t.instance.maskFilled=!s.includes(o)),e.value=s}else e.value=l}const ze=n.defineComponent({name:"ATextInput",props:{schema:{type:Object,required:!0},label:{type:String,required:!0},modelValue:{type:null},mask:{type:String},required:{type:Boolean},readonly:{type:Boolean},uuid:{type:String},validation:{type:Object,default:()=>({errorMessage:"&nbsp;"})}},setup(e,t){const l=n.ref(!1),o=n.inject("locale","");return{inputText:n.computed({get(){return e.modelValue},set(r){t.emit("update:modelValue",r)}}),locale:o,maskFilled:l}},directives:{mask:Ye}}),ut="",We=["id","disabled","maxlength","required"],Ke=["for"],Ge=["innerHTML"];function Je(e,t,l,o,a,r){const s=n.resolveDirective("mask");return n.openBlock(),n.createElementBlock("div",null,[n.withDirectives(n.createElementVNode("input",{"onUpdate:modelValue":t[0]||(t[0]=i=>e.inputText=i),id:e.uuid,disabled:e.readonly,maxlength:e.mask?e.maskFilled&&e.mask.length:void 0,required:e.required},null,8,We),[[n.vModelText,e.inputText],[s,e.mask]]),n.createElementVNode("label",{for:e.uuid},n.toDisplayString(e.label),9,Ke),n.withDirectives(n.createElementVNode("p",{innerHTML:e.validation.errorMessage},null,8,Ge),[[n.vShow,e.validation.errorMessage]])])}const ee=E(ze,[["render",Je],["__scopeId","data-v-76dba9b8"]]);function Xe(e){e.component("ACheckbox",O),e.component("ACombobox",$),e.component("ADate",K),e.component("ADropdown",G),e.component("AFieldset",J),e.component("AForm",M),e.component("ANumericInput",X),e.component("ATextInput",ee)}p.ACheckbox=O,p.AComboBox=$,p.ADate=K,p.ADropdown=G,p.AFieldset=J,p.AForm=M,p.ANumericInput=X,p.ATextInput=ee,p.install=Xe,Object.defineProperty(p,Symbol.toStringTag,{value:"Module"})});
//# sourceMappingURL=aform.umd.cjs.map
