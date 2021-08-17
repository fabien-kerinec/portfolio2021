import '../styles/style.scss'
let loaderElement = document.getElementById('lottie')
let loader = lottie.loadAnimation({
  container: loaderElement, // the dom element that will contain the animation
  renderer: 'svg',
  loop: false,
  autoplay: false,
  name: 'loader',
  path: '../assets/loader.json', // the path to the animation json
})
// loader.goToAndStop(20, true)
let max = 70
let index = 0
let percent = 0
let current = 1
let next = 2
let loaderInterval = setInterval(() => {
  index++
  percent = (index * max) / 100
  loader.goToAndStop(percent, true)
  document.getElementById('percent').innerHTML = index + '%'
  if (index >= 100) {
    clearInterval(loaderInterval)
    loaderElement.classList.add('finished')
    // setTimeout(() => {
    //   document.querySelector("section[data-id='"+current+"']").classList.add("displayup")
    //   setTimeout(() => {
    //     document.querySelector("section[data-id='"+current+"']").classList.add("display")
    //   }, 2000);
    // }, 200);

    setTimeout(() => {
      document.querySelector("section[data-id='"+current+"']").classList.add("displaydown")
      setTimeout(() => {
        document.querySelector("section[data-id='"+current+"']").classList.add("display")
      }, 2000);
    }, 200);
    // nextItem(current, next)
  }
}, 10)

function nextItem (current, next){
  setTimeout(() => {
    document.querySelector("section[data-id='"+current+"']").classList.add("mask", "maskup")
    setTimeout(() => {
      document.querySelector("section[data-id='"+next+"']").classList.add("displayup")
      setTimeout(() => {
      
        document.querySelector("section[data-id='"+next+"']").classList.add("display")
      }, 100);
      document.querySelector("section[data-id='"+current+"']").classList.remove("mask", "maskup", "maskdown", "display", "displayup", "displaydown")
      current = next;
      triggerNavigate = false
    }, 1500);
  }, 0);
}
function prevItem(current, next){
  setTimeout(() => {
    document.querySelector("section[data-id='"+current+"']").classList.add("mask", "maskdown")
    setTimeout(() => {
      document.querySelector("section[data-id='"+next+"']").classList.add("displaydown")
      setTimeout(() => {
        document.querySelector("section[data-id='"+next+"']").classList.add("display")
      }, 100);
      document.querySelector("section[data-id='"+current+"']").classList.remove("mask", "maskup", "maskdown", "display", "displayup", "displaydown")
      current = next;
      triggerNavigate = false
    }, 1500);
  }, 0);
}
const navigateList = document.querySelectorAll(".navigate ul li")
let triggerNavigate = false
navigateList.forEach(item => {
  item.addEventListener("click", function(){
    if(!triggerNavigate){
      triggerNavigate = true
      choose(this.dataset.id) 
    }
  })
});


function choose(number){
  if(parseInt(current) > parseInt(number)){
    prevItem(parseInt(current), parseInt(number))
    current = parseInt(number)
  }else if (parseInt(current) < parseInt(number)){
    nextItem(parseInt(current), parseInt(number))
    current = parseInt(number)
  }else{
    triggerNavigate = false
  }
}