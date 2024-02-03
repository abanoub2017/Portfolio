import{o as l,c as d,a as e,t as v,r as h,w as D,b as w,v as b,F as _,d as y,e as $,f as F,_ as m,g as c,h as E,i as T,j as H,k as C,p as N,l as q}from"./index-deb3f8dd.js";const B={id:"toast-bottom-left",class:"fixed bottom-5 right-5 flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800",role:"alert"},P=e("div",{class:"inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200"},[e("svg",{"aria-hidden":"true",class:"w-5 h-5 text-blue-600 dark:text-blue-500",focusable:"false","data-prefix":"fas","data-icon":"paper-plane",role:"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512"},[e("path",{fill:"currentColor",d:"M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z"})]),e("span",{class:"sr-only"},"Fire icon")],-1),O={class:"ml-3 text-sm font-normal"},z=e("span",{class:"sr-only"},"Close",-1),U=e("svg",{"aria-hidden":"true",class:"w-5 h-5",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg"},[e("path",{"fill-rule":"evenodd",d:"M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z","clip-rule":"evenodd"})],-1),J=[z,U],W={__name:"AbToast",props:{message:{type:String,default:"Message sent successfully"}},emits:["closeToast"],setup(s,{emit:t}){return(a,r)=>(l(),d("div",B,[P,e("div",O,v(s.message),1),e("button",{type:"button",onClick:r[0]||(r[0]=o=>a.$emit("closeToast")),class:"ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700","data-dismiss-target":"#toast-default","aria-label":"Close"},J)]))}},f={_origin:"https://api.emailjs.com"},R=(s,t="https://api.emailjs.com")=>{f._userID=s,f._origin=t},S=(s,t,a)=>{if(!s)throw"The public key is required. Visit https://dashboard.emailjs.com/admin/account";if(!t)throw"The service ID is required. Visit https://dashboard.emailjs.com/admin";if(!a)throw"The template ID is required. Visit https://dashboard.emailjs.com/admin/templates";return!0};class k{constructor(t){this.status=t?t.status:0,this.text=t?t.responseText:"Network Error"}}const A=(s,t,a={})=>new Promise((r,o)=>{const n=new XMLHttpRequest;n.addEventListener("load",({target:i})=>{const p=new k(i);p.status===200||p.text==="OK"?r(p):o(p)}),n.addEventListener("error",({target:i})=>{o(new k(i))}),n.open("POST",f._origin+s,!0),Object.keys(a).forEach(i=>{n.setRequestHeader(i,a[i])}),n.send(t)}),G=(s,t,a,r)=>{const o=r||f._userID;return S(o,s,t),A("/api/v1.0/email/send",JSON.stringify({lib_version:"3.10.0",user_id:o,service_id:s,template_id:t,template_params:a}),{"Content-type":"application/json"})},Z=s=>{let t;if(typeof s=="string"?t=document.querySelector(s):t=s,!t||t.nodeName!=="FORM")throw"The 3rd parameter is expected to be the HTML form element or the style selector of form";return t},X=(s,t,a,r)=>{const o=r||f._userID,n=Z(a);S(o,s,t);const i=new FormData(n);return i.append("lib_version","3.10.0"),i.append("service_id",s),i.append("template_id",t),i.append("user_id",o),A("/api/v1.0/email/send-form",i)},K={init:R,send:G,sendForm:X},Q={id:"contact",class:"dark:bg-slate-900"},Y={class:"container mx-auto"},ee=e("div",{class:"flex flex-col gap-3 items-center"},[e("h1",{class:"text-indigo-600 font-bold"},"CONTACT"),e("h1",{class:"text-3xl dark:text-white"},"Have a Question?"),e("p",{class:"w-1/2 text-center text-gray-400"}," Do you have an idea? Let's discuss it and see what we can do together. ")],-1),te=["onSubmit"],se=["disabled"],ae=e("svg",{"aria-hidden":"true",class:"w-8 h-8 m-auto text-gray-200 animate-spin dark:text-gray-600 fill-blue-600",viewBox:"0 0 100 101",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[e("path",{d:"M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z",fill:"currentColor"}),e("path",{d:"M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z",fill:"currentFill"})],-1),ne={__name:"AContact",setup(s){const t=h(null),a=h(""),r=h(""),o=h(""),n=h(!1),i=h(!1),p="service_h0symdr",I="template_mfzvaqf",j="48F8J9YCdoTb1s9A-",M=()=>{n.value=!0,K.sendForm(p,I,t.value,j).then(x=>{n.value=!1,a.value="",r.value="",o.value="",i.value=!0},x=>{n.value=!1,console.log("FAILED...",x.text)})},L=()=>{i.value=!1};return(x,u)=>{const V=W;return l(),d("div",Q,[e("div",Y,[ee,e("form",{ref_key:"form",ref:t,onSubmit:D(M,["prevent"]),class:"mt-5 p-8 flex flex-col gap-5 items-center"},[w(e("input",{class:"p-2 w-full md:w-1/2 ring-1 ring-indigo-300 rounded-sm dark:bg-slate-800 dark:ring-0 dark:text-white",type:"text",placeholder:"Name Surname",name:"from_name","onUpdate:modelValue":u[0]||(u[0]=g=>r.value=g),required:""},null,512),[[b,r.value]]),w(e("input",{class:"p-2 w-full md:w-1/2 ring-1 ring-indigo-300 rounded-sm dark:bg-slate-800 dark:ring-0 dark:text-white",type:"email",placeholder:"Email",name:"user_email","onUpdate:modelValue":u[1]||(u[1]=g=>a.value=g),required:""},null,512),[[b,a.value]]),w(e("textarea",{class:"p-2 w-full md:w-1/2 ring-1 ring-indigo-300 rounded-sm dark:bg-slate-800 dark:ring-0 dark:text-white",cols:"30",rows:"10",placeholder:"Message...",name:"message","onUpdate:modelValue":u[2]||(u[2]=g=>o.value=g),required:""},null,512),[[b,o.value]]),e("button",{type:"submit",value:"Send",disabled:n.value,class:"w-1/2 bg-indigo-600 text-white font-medium px-3 py-2 text-center rounded-md cursor-pointer"},[n.value?(l(),d(_,{key:0},[ae,y(" Processing... ")],64)):(l(),d(_,{key:1},[y(" Submit ")],64))],8,se)],40,te),i.value?(l(),$(V,{key:0,onCloseToast:u[3]||(u[3]=g=>L()),message:"Message sent successfully"})):F("",!0)])])}}},oe={},re={class:"bg-gradient-to-r from-gray-100 animate-pulse"};function ie(s,t){return l(),d("div",re,"   ")}const le=m(oe,[["render",ie]]),de={},ce={target:"_blank",class:"w-full md:w-5/12 lg:w-1/5 mb-12 shadow-xl rounded-lg my-3 md:my-10 m-1 transition-all hover:scale-110"};function pe(s,t){const a=le;return l(),d("div",ce,[c(a,{class:"h-[150px]"}),c(a)])}const ue=m(de,[["render",pe]]),he=["href"],me=["src"],ge={class:"dark:text-white text-center capitalize py-3"},_e={__name:"AbCard",props:{link:{type:String},img:{type:String}},setup(s){return(t,a)=>{const r=ue;return s.img?(l(),d("a",{key:0,href:s.link,target:"_blank",class:"w-full md:w-5/12 lg:w-1/5 mb-12 shadow-xl rounded-lg my-3 md:my-10 m-1 transition-all hover:scale-110"},[e("img",{src:s.img,class:"object-cover h-full"},null,8,me),e("p",ge,[E(t.$slots,"content")])],8,he)):(l(),d(_,{key:1},T(8,o=>c(r)),64))}}},fe={id:"works",class:"py-40 dark:bg-slate-900"},xe={class:"container mx-auto"},we=e("div",{class:"flex flex-col gap-3 items-center"},[e("h1",{class:"text-indigo-600 font-bold"},"PORTFOLIO"),e("h1",{class:"text-3xl dark:text-white"},"Works & Projects"),e("p",{class:"w-1/2 text-center text-gray-400"}," I help designers, small agencies and businesses bring their ideas to life. Powered by Figma, VS Code and coffee, I turn your requirements into a well-designed websites ")],-1),be={class:"p-5 sm:p-0 flex flex-wrap justify-between"},ye={__name:"AWorks",setup(s){const t=h([{link:"https://www.mcdougallinsurance.com/",img:"https://abanoubgeorge.info/img/work/Mc.png",content:"mcdougallinsurance"},{link:"https://dgsmithinsurance.com/",img:"https://abanoubgeorge.info/img/work/Dg.png",content:"dgsmithinsurance"},{link:"https://platform.we.care/",img:"https://abanoubgeorge.info/img/work/weCare.png",content:"We Care"},{link:"https://www.ccvinsurance.com/",img:"https://abanoubgeorge.info/img/work/CCV.png",content:"ccvinsurance"},{link:"https://www.rogersinsurance.ca/",img:"https://abanoubgeorge.info/img/work/rog.png",content:"rogersinsurance"},{link:"https://sharpinsurance.ca/",img:"https://abanoubgeorge.info/img/work/sharp.png",content:"sharpinsurance"},{link:"https://trudocgroup.com",img:"https://abanoubgeorge.info/img/work/trudoc.png",content:"trudocgroup"},{link:"https://sobekit.co.za/",img:"https://abanoubgeorge.info/img/work/sobek.png",content:"sobekit"}]);return(a,r)=>{const o=_e;return l(),d("div",fe,[e("div",xe,[we,e("div",be,[(l(!0),d(_,null,T(t.value,n=>(l(),$(o,{link:n.link,img:n.img},{content:H(()=>[y(v(n.content),1)]),_:2},1032,["link","img"]))),256))])])])}}},ve=""+new URL("dots-f74d8592.png",import.meta.url).href,ke=""+new URL("soft-skills-f611af4b.png",import.meta.url).href,$e={},Te={id:"skills",class:"px-5 dark:bg-slate-900"},Ce=C('<div class="container mx-auto py-10 flex flex-col-reverse lg:flex-row items-center gap-20"><div class="relative hidden md:block"><img class="h-1/4 absolute top-0 left-0 -z-10" src="'+ve+'" alt=""><div class="h-full rounded-full overflow-hidden"><img src="'+ke+'" alt=""></div></div><div class="my-auto gap-3"><h1 class="text-indigo-600 font-bold">Areas of Expertise</h1><p class="text-gray-400"> As a web developer and graphic designer Take a look at some of my key skills below: </p><div class="flex justify-start flex-wrap gap-4 my-3 w-full md:w-3/4"><span class="bg-[#fc657e] text-white rounded-xl cursor-pointer shadow-sm p-2 hover:shadow-lg transition-all">HTMl</span><span class="bg-[#fc657e] text-white rounded-xl cursor-pointer shadow-sm p-2 hover:shadow-lg transition-all">CSS3</span><span class="bg-[#fc657e] text-white rounded-xl cursor-pointer shadow-sm p-2 hover:shadow-lg transition-all">SASS</span><span class="bg-[#70d6f9] text-white rounded-xl cursor-pointer shadow-sm p-2 hover:shadow-lg transition-all">Bootstrap/4/5</span><span class="bg-[#fc657e] text-white rounded-xl cursor-pointer shadow-sm p-2 hover:shadow-lg transition-all">Javascript</span><span class="bg-[#fc657e] text-white rounded-xl cursor-pointer shadow-sm p-2 hover:shadow-lg transition-all">Jquery</span><span class="bg-[#f5c84c] text-white rounded-xl cursor-pointer shadow-sm p-2 hover:shadow-lg transition-all">Git</span><span class="bg-[#f5c84c] text-white rounded-xl cursor-pointer shadow-sm p-2 hover:shadow-lg transition-all">GitHub</span><span class="bg-[#87d147] text-white rounded-xl cursor-pointer shadow-sm p-2 hover:shadow-lg transition-all">Vue.js</span><span class="bg-[#87d147] text-white rounded-xl cursor-pointer shadow-sm p-2 hover:shadow-lg transition-all">Nuxt.js</span><span class="bg-[#fc657e] text-white rounded-xl cursor-pointer shadow-sm p-2 hover:shadow-lg transition-all">Angular.js</span><span class="bg-[#fc657e] text-white rounded-xl cursor-pointer shadow-sm p-2 hover:shadow-lg transition-all">Figma Desgin</span><span class="bg-[#fc657e] text-white rounded-xl cursor-pointer shadow-sm p-2 hover:shadow-lg transition-all">XD</span></div></div></div>',1),Se=[Ce];function Ae(s,t){return l(),d("div",Te,Se)}const Ie=m($e,[["render",Ae]]),je={},Me={id:"about",class:"px-5 dark:bg-slate-900"},Le=C('<div class="container mx-auto py-20 w-full md:w-[70%] m-auto"><div class="my-auto flex flex-col gap-3"><h1 class="text-indigo-600 font-bold">ABOUT ME</h1><h1 class="text-3xl font-medium dark:text-white">Better Design, Better Experience</h1><p class="text-gray-500 text-base"> I&#39;m Abanoub, a skilled front-end developer with over four years of experience creating user-friendly and responsive websites. My passion for design and user experience drives me to create visually appealing websites that are easy to navigate and engage with. With expertise in programming languages such as HTML5, CSS3, Vue.js, PHP, Nuxt.js, and Angular.js, I can develop new user-facing features, optimize web pages for maximum speed and scalability, and maintain brand consistency throughout the design. I have experience working with Agile management and using project management tools like Jira and Trello. If you have a project you&#39;d like to discuss, feel free to reach out to me directly at <ul class="flex justify-start flex-wrap gap-5 dark:text-white"><li><span class="font-bold"> Phone Number : </span> 01015631474</li><li><span class="font-bold"> Email : </span> abanoubgeorge136@gmail.com</li><li><span class="font-bold"> GitHub : </span> <a href="https://github.com/abanoub2017" class="text-blue-500" target="_blank" rel="noopener noreferrer">GitHub</a></li><li><span class="font-bold"> LinkedIn : </span> <a href="https://www.linkedin.com/in/abanoub-george-9235b1160/" class="text-blue-500" target="_blank" rel="noopener noreferrer">LinkedIn</a></li></ul><span class="text-gray-500"> Thank you for taking the time to learn more about me and my work. I look forward to hearing from you soon.</span></p></div></div>',1),Ve=[Le];function De(s,t){return l(),d("div",Me,Ve)}const Fe=m(je,[["render",De]]),Ee={},He={class:"hidden lg:flex flex-col gap-5 rounded-md shadow-lg absolute top-0 bottom-0 m-auto right-10 bg-white dark:bg-slate-900 dark:shadow-slate-800 p-6 h-fit w-1/3"},Ne=e("h1",{class:"text-4xl font-bold text-indigo-900"},"Hi, I'm Abanoub",-1),qe=e("p",{class:"text-gray-400"}," with over 5 years of experience on web design and development. I have a strong ability to work in a team environment or independently, and can handle multiple tasks under pressure. My expertise includes developing new user-facing features, optimizing web pages for maximum speed and scalability ",-1),Be=e("a",{class:"bg-indigo-600 text-white text-xl px-3 py-2 rounded-md font-semibold w-fit",href:"#contact"},"Hire Me",-1),Pe=[Ne,qe,Be];function Oe(s,t){return l(),d("div",He,Pe)}const ze=m(Ee,[["render",Oe]]);const Ue={name:"typeWiriter",data:()=>({typeValue:"",typeStatus:!1,displayTextArray:["Developer","Blogger","Designer","Freelancer"],typingSpeed:100,erasingSpeed:100,newTextDelay:2e3,displayTextArrayIndex:0,charIndex:0}),created(){setTimeout(this.typeText,this.newTextDelay+200)},methods:{typeText(){this.charIndex<this.displayTextArray[this.displayTextArrayIndex].length?(this.typeStatus||(this.typeStatus=!0),this.typeValue+=this.displayTextArray[this.displayTextArrayIndex].charAt(this.charIndex),this.charIndex+=1,setTimeout(this.typeText,this.typingSpeed)):(this.typeStatus=!1,setTimeout(this.eraseText,this.newTextDelay))},eraseText(){this.charIndex>0?(this.typeStatus||(this.typeStatus=!0),this.typeValue=this.displayTextArray[this.displayTextArrayIndex].substring(0,this.charIndex-1),this.charIndex-=1,setTimeout(this.eraseText,this.erasingSpeed)):(this.typeStatus=!1,this.displayTextArrayIndex+=1,this.displayTextArrayIndex>=this.displayTextArray.length&&(this.displayTextArrayIndex=0),setTimeout(this.typeText,this.typingSpeed+1e3))}}},Je=s=>(N("data-v-b966d4b0"),s=s(),q(),s),We={class:"absolute top-1/3 left-5 text-xl sm:left-10 sm:text-4xl md:left-1/4 md:text-6xl lg:left-5 xl:left-48 xl:text-7xl font-bold"},Re=Je(()=>e("span",{class:"text-gray-600"},"Front End ",-1)),Ge={class:"typed-text text-red-500"};function Ze(s,t,a,r,o,n){return l(),d("div",We,[Re,e("p",Ge,v(s.typeValue),1)])}const Xe=m(Ue,[["render",Ze],["__scopeId","data-v-b966d4b0"]]),Ke=""+new URL("man2-14bfcc8a.png",import.meta.url).href,Qe={},Ye={id:"home",class:"h-[50vh] lg:h-screen bg-gradient-to-t from-indigo-200 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden"},et=e("img",{class:"absolute bottom-0 right-0 lg:left-0 mx-auto h-5/6 object-cover",src:Ke,alt:""},null,-1),tt=e("div",{class:"hidden lg:block absolute -bottom-1/4 right-0 left-0 mx-auto w-big h-big bg-indigo-900 rounded-full -z-10"},null,-1);function st(s,t){const a=Xe,r=ze,o=Fe,n=Ie,i=ye,p=ne;return l(),d(_,null,[e("div",Ye,[et,tt,c(a),c(r)]),c(o),c(n),c(i),c(p)],64)}const nt=m(Qe,[["render",st]]);export{nt as default};
