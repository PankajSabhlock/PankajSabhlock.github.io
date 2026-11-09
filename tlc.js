(function(){var al=document.querySelector(".tlc-album");if(!al)return;var track=al.querySelector(".tlc-track"),slides=[].slice.call(track.children),thumbs=[].slice.call(al.querySelectorAll(".tlc-thumb")),count=al.querySelector(".tlc-count"),box=al.querySelector(".tlc-box"),boxImg=box.querySelector("img"),cur=0;
function update(){thumbs.forEach(function(t,i){if(i===cur)t.setAttribute("aria-current","true");else t.removeAttribute("aria-current")});count.textContent=(cur+1)+" / "+slides.length}
function show(i){cur=(i+slides.length)%slides.length;track.scrollTo({left:cur*track.clientWidth});update()}
track.addEventListener("scroll",function(){var n=Math.round(track.scrollLeft/track.clientWidth);if(n!==cur&&n>=0&&n<slides.length){cur=n;update()}});
al.querySelector(".tlc-prev").addEventListener("click",function(){show(cur-1)});
al.querySelector(".tlc-next").addEventListener("click",function(){show(cur+1)});
thumbs.forEach(function(t,i){t.addEventListener("click",function(){show(i)})});
track.addEventListener("keydown",function(e){if(e.key==="ArrowRight"){e.preventDefault();show(cur+1)}else if(e.key==="ArrowLeft"){e.preventDefault();show(cur-1)}});
slides.forEach(function(s){s.querySelector("img").addEventListener("click",function(e){boxImg.src=e.target.src;boxImg.alt=e.target.alt;box.showModal()})});
box.querySelector("button").addEventListener("click",function(){box.close()});
box.addEventListener("click",function(e){if(e.target===box)box.close()});
window.addEventListener("resize",function(){track.scrollTo({left:cur*track.clientWidth,behavior:"instant"})});
update()})();