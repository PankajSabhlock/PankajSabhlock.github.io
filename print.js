(function(){
var opened=[];
function openAll(){opened=[];document.querySelectorAll('details:not([open])').forEach(function(d){d.setAttribute('open','');opened.push(d);});document.querySelectorAll('.rv').forEach(function(e){e.classList.add('in');});}
function restore(){opened.forEach(function(d){d.removeAttribute('open');});opened=[];}
window.addEventListener('beforeprint',openAll);window.addEventListener('afterprint',restore);
var b=document.querySelector('.print-btn');if(b){b.addEventListener('click',function(){window.print();});}
})();
