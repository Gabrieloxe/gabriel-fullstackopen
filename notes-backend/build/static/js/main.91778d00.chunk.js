(this.webpackJsonpphonebook=this.webpackJsonpphonebook||[]).push([[0],{22:function(e,n,t){},42:function(e,n,t){"use strict";t.r(n);var c=t(1),r=t.n(c),a=t(17),o=t.n(a),i=(t(8),t(3)),u=(t(22),t(0)),s=function(e){var n=e.person,t=e.deleteContact;return Object(u.jsxs)("li",{children:[n.name," ",n.number,Object(u.jsx)("button",{onClick:function(){return t(n)},children:"Delete"})]})},d=function(e){var n=e.persons,t=e.contactService,c=e.setPersons,r=function(e){window.confirm("Delete ".concat(e.name,"? "))&&(console.log("deleting note id: ".concat(e.id)),t.remove(e.id).then((function(t){var r=n.filter((function(n){return n.id!==e.id}));c(r)})))};return Object(u.jsx)("div",{children:Object(u.jsx)("ul",{children:n.map((function(e){return Object(u.jsx)(s,{person:e,deleteContact:r},e.name)}))})})},l=t(5),j=t(7),b=function(e){var n=e.persons,t=e.setPersons,r=e.contactService,a=e.notify,o=Object(c.useState)({name:"",number:""}),s=Object(i.a)(o,2),d=s[0],b=s[1],f=function(e){var n=e.target.value,t=e.target.name;b(Object(j.a)(Object(j.a)({},d),{},Object(l.a)({},t,n)))};return Object(c.useEffect)((function(){b({name:"",number:""})}),[n]),Object(u.jsxs)("form",{onSubmit:function(e){var c,o;if(e.preventDefault(),n.map((function(e){return e.name})).includes(d.name)){var i=n.find((function(e){return e.name===d.name}));i.number=d.number,c=i,o=i.id,window.confirm("".concat(d.name," is already added to phonebook replace the old number with a new one?"))&&r.update(c,o).then((function(e){var r=n.map((function(n){return n.id!==e.id?n:e}));t(r),a("".concat(c.name," has been updated"))})).catch((function(e){t(n.filter((function(e){return e.id!==o}))),a("Contact '".concat(c.name,"' was already removed from server"),"error")}))}else!function(){var e={name:d.name,number:d.number};r.create(e).then((function(c){t(n.concat(c)),a("".concat(e.name," has been added"))}))}()},children:[Object(u.jsxs)("div",{children:["Name: ",Object(u.jsx)("input",{name:"name",value:d.name,onChange:f})]}),Object(u.jsxs)("div",{children:["Number: ",Object(u.jsx)("input",{name:"number",value:d.number,onChange:f})]}),Object(u.jsx)("div",{children:Object(u.jsx)("button",{type:"submit",children:"add"})})]})},f=function(e){var n=e.notification;return null===n?null:Object(u.jsx)("div",{className:n.type,children:n.message})},m=function(e){var n=e.filterValue,t=e.handleFilterChange;return Object(u.jsxs)("div",{children:["Filter ",Object(u.jsx)("input",{value:n,onChange:t})]})},h=t(4),O=t.n(h),v="/api/persons",p={getAll:function(){return O.a.get(v).then((function(e){return e.data}))},create:function(e){return O.a.post(v,e).then((function(e){return e.data}))},update:function(e,n){return O.a.put("".concat(v,"/").concat(n),e).then((function(e){return e.data}))},remove:function(e){return O.a.delete("".concat(v,"/").concat(e)).then((function(e){return e.data}))}},x=function(){var e=Object(c.useState)([]),n=Object(i.a)(e,2),t=n[0],r=n[1],a=Object(c.useState)(""),o=Object(i.a)(a,2),s=o[0],l=o[1],j=Object(c.useState)(null),h=Object(i.a)(j,2),O=h[0],v=h[1];Object(c.useEffect)((function(){p.getAll().then((function(e){r(e)}))}),[]);var x=t.filter((function(e){return e.name.toLowerCase().includes(s.toLowerCase())}));return Object(u.jsxs)("div",{children:[Object(u.jsx)("h2",{children:"Phonebook"}),Object(u.jsx)(f,{notification:O}),Object(u.jsx)(m,{filterValue:s,handleFilterChange:function(e){l(e.target.value)}}),Object(u.jsx)("h3",{children:"Add a new"}),Object(u.jsx)(b,{persons:t,setPersons:r,notify:function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"success";v({message:e,type:n}),setTimeout((function(){v(null)}),5e3)},notifcation:O,contactService:p}),Object(u.jsx)("h3",{children:"Numbers"}),Object(u.jsx)(d,{persons:x,contactService:p,setPersons:r})]})};o.a.render(Object(u.jsx)(r.a.StrictMode,{children:Object(u.jsx)(x,{})}),document.getElementById("root"))},8:function(e,n,t){}},[[42,1,2]]]);
//# sourceMappingURL=main.91778d00.chunk.js.map