let t,e,n=0;function a(a,o){$("#fullPage .container").append('<table id="'+e.indexOf(a)+e.indexOf(o)+'" class="table table-dark table-adjust mt-3"><thead><tr><th scope="col">'+a+'</th><th></th><th scope="col">'+o+'</th></tr></thead><tbody class="lead"></tbody></table>');for(let i=0;i<t.length;i++)for(let l=0;l<t.length;l++)i!=l&&(n++,$("#"+e.indexOf(a)+e.indexOf(o)+" tbody").append('<tr id="battle'+n+'"><td>'+t[i]+'</td><td><span class="'+t[i]+e.indexOf(a)+'"><span class="points"></span></span>vs<span class="'+t[l]+e.indexOf(o)+'"><span class="points"></span></span></td><td>'+t[l]+"</td></tr>"))}function o(t){const e=document.cookie.split("; ");for(let n=0;n<e.length;n++){const[a,o]=e[n].split("=");if(a===t)return o}return null}let i={},l={};function s(t){i={},l={},database.ref("edition/"+t+"/battles").once("value").then((function(t){let e=t.val();for(let t in e){let n=e[t];for(let t in n){let e=n[t].points,a=n[t].beyblade;i[t]?i[t]+=e:i[t]=e,l[a]?l[a]+=e:l[a]=e}}}))}function d(t){const e=$(t),n=$("<option disable>");n.val(""),n.text("Carregando..."),e.append(n);database.ref("edition").on("value",(t=>{e.empty();const n=$("<option>");n.val(""),n.text("Selecione"),e.append(n),t.forEach((t=>{const n=t.key,a=n,o=`${n}ª edição`,i=$("<option>");i.val(a),i.text(o),e.append(i)}))}))}d("#selectionEdition"),d("#manageEdition"),$("#selectionEdition").on("change",(function(){document.cookie="selectedEdition="+$("#selectionEdition").val();let d=database.ref("edition/"+$(this).val()+"/players"),c=database.ref("edition/"+$(this).val()+"/beyblades");function r(t,e){let n,a=t.orderByValue().limitToLast(3),o=1;a.on("value",(function(t){let a=[];t.forEach((function(t){let e=t.key,i=t.val();switch(o){case 3:n="firstColocation";break;case 2:n="secondColocation";break;case 1:n="thirdColocation"}a.push({name:e,points:i,text:n}),o++})),a.sort((function(t,e){return e.points-t.points}));for(let t=0;t<a.length;t++)$(e+" ."+a[t].text+" .placeName").text(a[t].name),$(e+" ."+a[t].text+" .points").text(a[t].points),a[t].points>0?$(e+" ."+a[t].text).parent().show():$(e+" ."+a[t].text).parent().hide(),a[t].points>1?$(e+" ."+a[t].text+" .textPoints").text("pontos"):$(e+" ."+a[t].text+" .textPoints").text("ponto")})),a.on("child_changed",(function(n){r(t,e)}))}promise1=d.once("value"),promise2=c.once("value"),$("#fullPage .container table").remove(),$("#titleEdition").text($(this).val()).parent().fadeIn(),$(".podiums").fadeIn(),r(c,"#podiumBeyblade"),r(d,"#podiumPlayer"),Promise.all([promise1,promise2]).then((function(d){let c=d[0],r=d[1];t=Object.keys(c.val()),e=Object.keys(r.val());for(let t=0;t<e.length;t++)for(let n=t+1;n<e.length;n++)t!=n&&a(e[t],e[n]);n=0,$(document).ready((function(){database.ref("edition/"+$("#selectionEdition").val()+"/battles").once("value").then((function(t){t.forEach((function(t){let n=t.key,a=$("#"+n);database.ref("edition/"+$("#selectionEdition").val()+"/battles/"+n).once("value").then((function(t){let n=t.val(),o=Object.keys(n);for(let t=0;t<o.length;t++){let i=o[t],l=n[i].points,s=n[i].beyblade;$("#"+a.attr("id")+" ."+i+e.indexOf(s)+" .points").val(l).text(l)}}))}))}))})),auth.onAuthStateChanged((function(t){t?($("tbody tr td>span .inputBattles").remove(),$("tbody td .points").hide(),$("tbody tr td>span").append("<input type='text' class='inputBattles'>"),$(document).ready((function(){var t;t="input",database.ref("edition/"+$("#selectionEdition").val()+"/battles").once("value").then((function(n){n.forEach((function(n){let a=n.key,o=$("#"+a);database.ref("edition/"+$("#selectionEdition").val()+"/battles/"+a).once("value").then((function(n){let a=n.val(),i=Object.keys(a);for(let n=0;n<i.length;n++){let l=i[n],s=a[l].points,d=a[l].beyblade;$("#"+o.attr("id")+" ."+l+e.indexOf(d)+" "+t).val(s)}}))}))})),$(".inputBattles").mask("00"),$(".inputBattles").on("blur",(function(){let t=$(this).parent().attr("class"),n=e[t.at(-1)],a=t.slice(0,-1),d=parseInt($(this).val()),c=$(this).parent().parent().parent().attr("id"),r=$("#selectionEdition").val();isNaN(d)&&(database.ref("edition/"+r+"/battles").child(c).child(a).set(null),d=0);let u={beyblade:n,points:d};database.ref("edition/"+$("#selectionEdition").val()+"/battles").child(c).child(a).set(u),s(r),database.ref("edition/"+r+"/battles").once("value").then((function(t){database.ref("edition/"+o("selectedEdition")+"/players").update(i),database.ref("edition/"+o("selectedEdition")+"/beyblades").update(l),$("#selectionEdition").val(r)})).catch((function(t){console.error(t)}))}))}))):($("tbody tr td span .inputBattles").remove(),$("tbody td .points").show())}))})).catch((function(t){console.log(t)})),s($("#selectionEdition").val())}));const c=new firebase.auth.GoogleAuthProvider;$("#googleAuthButton").on("click",(function(){auth.signInWithPopup(c).then((t=>{t.user.uid,$("#authModal").modal("hide"),$("tbody tr td span").append('<input type="text" class="inputBattles" />')})).catch((t=>{console.error(t)}))})),$(".signOutAuth").on("click",(function(){auth.signOut().then((()=>{$("tbody tr td span .inputBattles").remove()})).catch((t=>{console.error(t)}))})),$("#manageEdition").on("change",(function(){function t(t,e){database.ref("edition/"+$("#manageEdition").val()+"/"+t).on("value",(function(t){$("."+e).empty(),t.forEach((function(t){$("."+e).append('<div class="row ms-1 mt-1"><span class="manageInput pt-2">'+t.key+'</span><div class="col"><button type="button" class="btn btn-outline-dark removeLineBtn"><i class="fa-regular fa-trash-can"></i></button></div></div>')})),$("."+e).append('<div class="row mt-2 addBtn"><div class="col"><div class="d-grid gap-2 col-12 mx-auto"><button class="btn btn-outline-dark"><i class="fa-solid fa-plus"></i> Adicionar</button></div></div></div>')}))}null!=$(this).val()&&$("#removeEditionBtn").attr({"data-bs-toggle":"modal","data-bs-target":"#confirmModal"}),t("players","managePlayer"),t("beyblades","manageBeyblades"),$(".manageInfos").fadeIn()})),$(".col-6.border-end").on("click",".addBtn button",(function(){let t=$(this).closest(".row").parent().attr("class");$("."+t).append('<div class="row ms-1 mt-1"><input class="manageInput pt-2 text-center" maxlength="18"></input><div class="col"><button type="button" class="btn btn-outline-dark removeLineBtn"><i class="fa-regular fa-trash-can"></i></button></div></div>'),$(this).remove()})),$(".col-6.border-end").on("blur","input.manageInput",(function(){let t=$(this).val(),e=$(this).closest(".row").parent().data("target-update"),n=$("#manageEdition").val();database.ref("edition/"+$("#manageEdition").val()+"/"+e).once("value",(function(a){var o=[];a.forEach((function(t){o.push(t.key)})),o.push(t);var i=o.reduce((function(t,e){return t[e]="",t}),{});database.ref("edition/"+$("#manageEdition").val()+"/"+e).set(i),$("#manageEdition").val(n)}))})),$(".col-6.border-end").on("click",".removeLineBtn",(function(){let t=$(this).closest(".row").find(".manageInput"),e=$(t).text(),n=$(this).closest(".row").parent().data("target-update"),a=$("#manageEdition").val();database.ref("edition/"+$("#manageEdition").val()+"/"+n+"/"+e).remove((function(t){t||$("#manageEdition").val(a)}))})),$("#removeEditionBtn").on("click",(function(){$(".showEdition").text($("#manageEdition").val()+"ª edição")})),$("#confirmRemove").on("click",(function(){database.ref("/edition/"+$("#manageEdition").val()).remove(),$("#confirmModal").modal("hide"),$("#manageEditionModal").modal("show")})),$("#addEdition").on("click",(function(){database.ref("edition").limitToLast(1).once("child_added",(function(t){const e=t.key,n=parseInt(e)+1;database.ref("edition").child(n).set({battles:"",beyblades:"",players:""})}))})),auth.onAuthStateChanged((t=>{t?($(".dropdownManager").show().addClass("d-inline"),$(".adminButton").hide(),$(".welcome").text("Olá "+auth.currentUser.displayName)):($(".dropdownManager").hide().removeClass("d-inline"),$(".adminButton").show(),$(".welcome").text(""))}));