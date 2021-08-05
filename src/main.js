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
let loaderInterval = setInterval(() => {
  index++
  percent = (index * max) / 100
  loader.goToAndStop(percent, true)
  document.getElementById('percent').innerHTML = index + '%'
  if (index >= 100) {
    clearInterval(loaderInterval)
    loaderElement.classList.add('finished')
  }
}, 10)
