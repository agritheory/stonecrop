(function(e,d){typeof exports=="object"&&typeof module<"u"?module.exports=d(require("vue")):typeof define=="function"&&define.amd?define(["vue"],d):(e=typeof globalThis<"u"?globalThis:e||self,e["@agritheory/beam"]=d(e.Vue))})(this,function(e){"use strict";const d=(t,o)=>{const n=t.__vccOpts||t;for(const[s,c]of o)n[s]=c;return n},S={name:"Navbar",methods:{handlePrimaryAction(){this.$emit("click")}}},M={class:"beam__navbar"},x=e.createElementVNode("span",{class:"home-icon"},"⬣",-1),L=e.createElementVNode("h1",{class:"nav-title"},"TITLE",-1),D={class:"navbar-action-wrapper"};function T(t,o,n,s,c,r){return e.openBlock(),e.createElementBlock("nav",M,[e.renderSlot(t.$slots,"icon",{},()=>[x]),e.renderSlot(t.$slots,"title",{},()=>[L]),e.createElementVNode("div",D,[e.createElementVNode("button",{class:"navbar-action btn",onClick:o[0]||(o[0]=(...a)=>r.handlePrimaryAction&&r.handlePrimaryAction(...a))},[e.renderSlot(t.$slots,"navbaraction",{},()=>[e.createTextVNode("Action")])])])])}const $=d(S,[["render",T]]),A={name:"ListAnchor",props:{to:{type:String,required:!1,default:""}}},P=["href"];function q(t,o,n,s,c,r){return e.openBlock(),e.createElementBlock("a",{href:n.to,class:"beam__listanchor"},[e.renderSlot(t.$slots,"default")],8,P)}const p=d(A,[["render",q]]),F={name:"ItemCount",props:{value:{type:Number,required:!1,default:0},denominator:{type:Number,required:!0},uom:{type:String,required:!1,default:null},editable:{type:Boolean,required:!1,default:!1}},data(){return{count:this.value}},methods:{handleInput(t){t.preventDefault(),t.stopPropagation(),this.count=Number(t.target.innerHTML.replace(/[^0-9]/g,"")),this.$emit("input",this.count)}},computed:{countColor(){return this.count===this.denominator}},watch:{value(){this.count=this.value}}},O={class:"beam__itemcount"},j=["contenteditable"],U={key:0};function H(t,o,n,s,c,r){return e.openBlock(),e.createElementBlock("div",O,[e.createElementVNode("span",{contenteditable:n.editable,class:e.normalizeClass({alert:r.countColor===!1}),onInput:o[0]||(o[0]=a=>r.handleInput(a)),onClick:o[1]||(o[1]=a=>r.handleInput(a))},e.toDisplayString(c.count),43,j),e.createElementVNode("span",null,"/"+e.toDisplayString(n.denominator),1),n.uom?(e.openBlock(),e.createElementBlock("span",U,"  "+e.toDisplayString(n.uom),1)):e.createCommentVNode("",!0)])}const u=d(F,[["render",H]]),Ve="",z={name:"ItemCheck",props:{value:{type:Boolean,required:!1,default:!1}},data(){return{checked:this.value}},methods:{handleInput(t){this.$emit("input",this.checked)}}},W=t=>(e.pushScopeId("data-v-66aa3656"),t=t(),e.popScopeId(),t),Y={class:"container"},G=["checked"],J=W(()=>e.createElementVNode("div",{class:"checkmark",tabindex:"0"},null,-1));function K(t,o,n,s,c,r){return e.openBlock(),e.createElementBlock("label",Y,[e.createElementVNode("input",{type:"checkbox",checked:n.value,onInput:o[0]||(o[0]=(...a)=>r.handleInput&&r.handleInput(...a)),tabindex:"-1"},null,40,G),J])}const f=d(z,[["render",K],["__scopeId","data-v-66aa3656"]]),Q={name:"ListItem",components:{ItemCount:u,ItemCheck:f},props:{item:{type:Object,required:!0}}},R={tabindex:"0",class:"beam__listitem"},X={class:"beam__listtext"};function Z(t,o,n,s,c,r){const a=e.resolveComponent("ItemCount"),l=e.resolveComponent("ItemCheck");return e.openBlock(),e.createElementBlock("li",R,[e.createElementVNode("div",X,[e.createElementVNode("label",null,e.toDisplayString(n.item.label),1),e.createElementVNode("p",null,e.toDisplayString(n.item.description),1)]),n.item.count?(e.openBlock(),e.createBlock(a,{key:0,modelValue:n.item.count.count,"onUpdate:modelValue":o[0]||(o[0]=i=>n.item.count.count=i),denominator:n.item.count.of,uom:n.item.count.uom,editable:!0},null,8,["modelValue","denominator","uom"])):e.createCommentVNode("",!0),n.item.hasOwnProperty("checked")?(e.openBlock(),e.createBlock(l,{key:1,modelValue:n.item.checked,"onUpdate:modelValue":o[1]||(o[1]=i=>n.item.checked=i)},null,8,["modelValue"])):e.createCommentVNode("",!0)])}const _=d(Q,[["render",Z]]),v={name:"ListView",components:{ListItem:_,ListAnchor:p},props:{items:{type:Array,required:!0}},created(){window.addEventListener("scroll",this.handleScroll)},destroyed(){window.removeEventListener("scroll",this.handleScroll)},methods:{handleScroll(){const t=document.documentElement.scrollHeight-window.innerHeight,o=document.documentElement.scrollTop;t-o<=2&&this.$emit("scrollbottom")}}},ee={class:"beam__listview"};function te(t,o,n,s,c,r){const a=e.resolveComponent("ListItem");return e.openBlock(),e.createElementBlock("ul",ee,[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(n.items,(l,i)=>(e.openBlock(),e.createElementBlock("li",{key:i},[l.linkComponent?(e.openBlock(),e.createBlock(e.resolveDynamicComponent(l.linkComponent),{key:0,to:l.route,tabindex:"-1"},{default:e.withCtx(()=>[e.createVNode(a,{item:l},null,8,["item"])]),_:2},1032,["to"])):(e.openBlock(),e.createBlock(a,{key:1,item:l},null,8,["item"]))]))),128))])}const b=d(v,[["render",te]]),oe={name:"ScanInput",data(){return{barcode:""}},methods:{handleScanInput(t){t.target.tagName!=="INPUT"&&(t.key!=="Enter"?this.barcode+=`${t.key}`:(this.$emit("scaninput",this.barcode),this.barcode=""))}},mounted(){document.addEventListener("keypress",t=>{this.handleScanInput(t)})},destroyed(){window.removeEventListener("keypress",t=>{this.handleScanInput(t)})}},ne={id:"scan_input"};function re(t,o,n,s,c,r){return e.openBlock(),e.createElementBlock("div",ne)}const y=d(oe,[["render",re]]),ae={name:"ActionFooter",methods:{handleFooterAction(){this.$emit("click")}}},le={class:"beam__actionfooter"},se={class:"footer-action-wrapper"};function ce(t,o,n,s,c,r){return e.openBlock(),e.createElementBlock("footer",le,[e.createElementVNode("span",se,[e.createElementVNode("button",{class:"footer-action btn btn--dark",onClick:o[0]||(o[0]=(...a)=>r.handleFooterAction&&r.handleFooterAction(...a))},[e.renderSlot(t.$slots,"default")])])])}const g=d(ae,[["render",ce]]),ie={name:"BeamModal",props:["showModal"]},de={class:"beam__modal"};function me(t,o,n,s,c,r){const a=e.resolveComponent("portal");return e.openBlock(),e.createBlock(a,{to:"beam__modal_outlet"},{default:e.withCtx(()=>[e.withDirectives(e.createElementVNode("div",de,[e.createElementVNode("button",{class:"btn",onClick:o[0]||(o[0]=l=>t.$emit("closemodal"))},"Close Modal"),e.renderSlot(t.$slots,"default",{onClosemodal:o[1]||(o[1]=l=>t.$emit("closemodal")),onConfirmmodal:o[2]||(o[2]=l=>t.$emit("confirmmodal"))})],512),[[e.vShow,n.showModal]])]),_:3})}const B=d(ie,[["render",me]]),pe={name:"BeamModalOutlet"};function ue(t,o,n,s,c,r){const a=e.resolveComponent("portal-target");return e.openBlock(),e.createBlock(a,{name:"beam__modal_outlet"})}const C=d(pe,[["render",ue]]),fe={name:"ConfirmDialog",methods:{confirmModal(){this.$emit("confirmmodal")},closeModal(){this.$emit("closemodal")}}},_e={class:"beam__modal-confirm"},he=e.createElementVNode("h2",null,"Would you like to continue?",-1);function ke(t,o,n,s,c,r){return e.openBlock(),e.createElementBlock("div",_e,[he,e.createElementVNode("button",{class:"btn btn--dark",onClick:o[0]||(o[0]=(...a)=>r.confirmModal&&r.confirmModal(...a))},"Yes"),e.createElementVNode("button",{class:"btn btn--dark",onClick:o[1]||(o[1]=(...a)=>r.closeModal&&r.closeModal(...a))},"No")])}const E=d(fe,[["render",ke]]),w=Symbol("wormhole");function N(){const t=e.inject(w);if(!t)throw new Error(`
    [portal-vue]: Necessary Injection not found. Make sur you installed the plugin properly.`);return t}const I=typeof window<"u";function $e(t,o){return t.map((n,s)=>[s,n]).sort(function(n,s){return o(n[1],s[1])||n[0]-s[0]}).map(n=>n[1])}function be(t,o){const n=N();function s(){if(!I)return;const{to:r,name:a,order:l}=t;o.default?n.open({to:r,from:a,order:l,content:o.default}):c()}function c(r){n.close({to:r??t.to,from:t.name})}e.onMounted(()=>{t.disabled||s()}),e.onUpdated(()=>{t.disabled?c():s()}),e.onBeforeUnmount(()=>{c()}),e.watch(()=>t.to,(r,a)=>{t.disabled||(a&&a!==r&&c(a),s())})}const ye=e.defineComponent({compatConfig:{MODE:3},name:"portal",props:{disabled:{type:Boolean},name:{type:[String,Symbol],default:()=>Symbol()},order:{type:Number},slotProps:{type:Object,default:()=>({})},to:{type:String,default:()=>String(Math.round(Math.random()*1e7))}},setup(t,{slots:o}){return be(t,o),()=>t.disabled&&o.default?o.default(t.slotProps):null}}),ge=(t,{slots:o})=>{var n;return(n=o.default)==null?void 0:n.call(o)},Be=e.defineComponent({compatConfig:{MODE:3},name:"portalTarget",props:{multiple:{type:Boolean,default:!1},name:{type:String,required:!0},slotProps:{type:Object,default:()=>({})}},emits:["change"],setup(t,{emit:o,slots:n}){const s=N(),c=e.computed(()=>{const r=s.getContentForTarget(t.name,t.multiple),a=n.wrapper,l=r.map(m=>m.content(t.slotProps)),i=a?l.flatMap(m=>m.length?a(m):[]):l.flat(1);return{vnodes:i,vnodesFn:()=>i}});return e.watch(c,({vnodes:r})=>{const a=r.length>0,l=s.transports.get(t.name),i=l?[...l.keys()]:[];o("change",{hasContent:a,sources:i})},{flush:"post"}),()=>{var r;return c.value.vnodes.length?[e.h("div",{style:"display: none",key:"__portal-vue-hacky-scoped-slot-repair__"}),e.h(ge,c.value.vnodesFn)]:(r=n.default)==null?void 0:r.call(n)}}});function Ce(t=!0){const o=e.reactive(new Map);function n(a){if(!I)return;const{to:l,from:i,content:m,order:h=1/0}=a;if(!l||!i||!m)return;o.has(l)||o.set(l,new Map);const k=o.get(l),Ie={to:l,from:i,content:m,order:h};k.set(i,Ie)}function s(a){const{to:l,from:i}=a;if(!l||!i)return;const m=o.get(l);!m||(m.delete(i),m.size||o.delete(l))}function c(a,l){const i=o.get(a);if(!i)return[];const m=Array.from((i==null?void 0:i.values())||[]);return l?$e(m,(h,k)=>h.order-k.order):[m.pop()]}const r={open:n,close:s,transports:o,getContentForTarget:c};return t?e.readonly(r):r}const Ee=Ce();function we(t,o={}){o.portalName!==!1&&t.component(o.portalName||"Portal",ye),o.portalTargetName!==!1&&t.component(o.portalTargetName||"PortalTarget",Be);const n=o.wormhole??Ee;t.provide(w,n)}const Ne=[$,b,_,p,u,f,y,g,B,E,C],V=function(t,o={}){t.use(we),Ne.forEach(n=>{t.component(n.name,n)})};return typeof window<"u"&&window.Vue&&V(window.Vue),{version:"0.1.0",install:V,Navbar:$,ListView:b,ListItem:_,ListAnchor:p,ItemCount:u,ItemCheck:f,ScanInput:y,ActionFooter:g,BeamModal:B,ConfirmDialog:E,BeamModalOutlet:C}});
