import '../styles/style.scss'
let loaderElement = document.getElementById('lottie')
let loader = lottie.loadAnimation({
  container: loaderElement, // the dom element that will contain the animation
  renderer: 'svg',
  loop: false,
  autoplay: false,
  name: 'loader',
  path: '/loader.json', // the path to the animation json
})
// loader.goToAndStop(20, true)
let max = 70
let index = 0
let percent = 0
let current = 0
let next = 2

function nextItem(current, next) {
  setTimeout(() => {
    document
      .querySelector("section[data-id='" + current + "']")
      .classList.add('mask', 'maskup')
    setTimeout(() => {
      document
        .querySelector("section[data-id='" + next + "']")
        .classList.add('displayup')
      setTimeout(() => {
        document
          .querySelector("section[data-id='" + next + "']")
          .classList.add('display')
      }, 100)
      document
        .querySelector("section[data-id='" + current + "']")
        .classList.remove(
          'mask',
          'maskup',
          'maskdown',
          'display',
          'displayup',
          'displaydown'
        )
      current = next
      triggerNavigate = false
    }, 1000)
  }, 0)
}
function prevItem(current, next) {
  setTimeout(() => {
    document
      .querySelector("section[data-id='" + current + "']")
      .classList.add('mask', 'maskdown')
    setTimeout(() => {
      document
        .querySelector("section[data-id='" + next + "']")
        .classList.add('displaydown')
      setTimeout(() => {
        document
          .querySelector("section[data-id='" + next + "']")
          .classList.add('display')
      }, 100)
      document
        .querySelector("section[data-id='" + current + "']")
        .classList.remove(
          'mask',
          'maskup',
          'maskdown',
          'display',
          'displayup',
          'displaydown'
        )
      current = next
      triggerNavigate = false
    }, 1000)
  }, 0)
}
const navigateList = document.querySelectorAll('.navigate ul li')
let triggerNavigate = false
navigateList.forEach((item) => {
  item.addEventListener('click', function () {
    if (!triggerNavigate) {
      triggerNavigate = true
      choose(this.dataset.id)
    }
  })
})

function choose(number) {
  if (parseInt(current) > parseInt(number)) {
    prevItem(parseInt(current), parseInt(number))
    current = parseInt(number)
  } else if (parseInt(current) < parseInt(number)) {
    nextItem(parseInt(current), parseInt(number))
    current = parseInt(number)
  } else {
    triggerNavigate = false
  }
}

const displacementSlider = function (opts) {
  let vertex = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `

  let fragment = `
        
        varying vec2 vUv;

        uniform sampler2D currentImage;
        uniform sampler2D nextImage;

        uniform float dispFactor;

        void main() {

            vec2 uv = vUv;
            vec4 _currentImage;
            vec4 _nextImage;
            float intensity = 0.3;

            vec4 orig1 = texture2D(currentImage, uv);
            vec4 orig2 = texture2D(nextImage, uv);
            
            _currentImage = texture2D(currentImage, vec2(uv.x, uv.y + dispFactor * (orig2 * intensity)));

            _nextImage = texture2D(nextImage, vec2(uv.x, uv.y + (1.0 - dispFactor) * (orig1 * intensity)));

            vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);

            gl_FragColor = finalTexture;

        }
    `
  let images = opts.images,
    image,
    sliderImages = []
  console.log(images)
  let canvasWidth = images[0].clientWidth
  let canvasHeight = images[0].clientHeight
  console.log(canvasWidth, canvasHeight)
  let parent = opts.parent
  let renderWidth = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  )
  let renderHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  )

  let renderW, renderH

  if (renderWidth > canvasWidth) {
    renderW = renderWidth
  } else {
    renderW = canvasWidth
  }

  renderH = canvasHeight

  let renderer = new THREE.WebGLRenderer({
    antialias: false,
  })

  renderer.setPixelRatio(window.devicePixelRatio)
  // renderer.setClearColor(0x23272a, 1.0)
  renderer.setClearColor(0xffffff, 1.0)
  renderer.setSize(renderW, renderH)
  parent.appendChild(renderer.domElement)

  let loader = new THREE.TextureLoader()
  loader.crossOrigin = 'anonymous'
  console.log(images)
  images.forEach((img) => {
    image = loader.load(img.getAttribute('src') + '?v=' + Date.now())
    image.magFilter = image.minFilter = THREE.LinearFilter
    image.anisotropy = renderer.capabilities.getMaxAnisotropy()
    sliderImages.push(image)
  })

  let scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)
  let camera = new THREE.OrthographicCamera(
    renderWidth / -2,
    renderWidth / 2,
    renderHeight / 2,
    renderHeight / -2,
    1,
    1000
  )

  camera.position.z = 1

  let mat = new THREE.ShaderMaterial({
    uniforms: {
      dispFactor: { type: 'f', value: 0.0 },
      currentImage: { type: 't', value: sliderImages[0] },
      nextImage: { type: 't', value: sliderImages[1] },
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    opacity: 1.0,
  })

  let geometry = new THREE.PlaneBufferGeometry(
    parent.offsetWidth,
    parent.offsetHeight,
    1
  )

  let object = new THREE.Mesh(geometry, mat)
  object.position.set(0, 0, 0)
  scene.add(object)

  let addEvents = function () {
    let pagButtons = Array.from(
      document.getElementById('navig').querySelectorAll('li')
    )
    let isAnimating = false

    pagButtons.forEach((el) => {
      el.addEventListener('click', function () {
        if (!isAnimating) {
          console.log('click')

          isAnimating = true

          document
            .getElementById('navig')
            .querySelectorAll('.active')[0].className = ''
          this.className = 'active'

          let slideId = parseInt(this.dataset.id)

          mat.uniforms.nextImage.value = sliderImages[slideId]
          mat.uniforms.nextImage.needsUpdate = true

          TweenLite.to(mat.uniforms.dispFactor, 1, {
            value: 1,
            ease: 'Expo.easeInOut',
            onComplete: function () {
              mat.uniforms.currentImage.value = sliderImages[slideId]
              mat.uniforms.currentImage.needsUpdate = true
              mat.uniforms.dispFactor.value = 0.0
              isAnimating = false
            },
          })
        }
      })
    })
  }

  addEvents()

  window.addEventListener('resize', function (e) {
    renderer.setSize(renderW, renderH)
  })

  let animate = function () {
    requestAnimationFrame(animate)

    renderer.render(scene, camera)
  }
  animate()
}
var imgLoad, imageCount, loadedImageCount
window.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM entièrement chargé et analysé')
  imgLoad = imagesLoaded(document.querySelectorAll('img'))
  imageCount = document.querySelectorAll('img').length
  loadedImageCount = 0
  updateProgress(0)
  imgLoad.on('progress', onProgress)
  imgLoad.on('done', doneLoad)
})

// imgLoad.on( 'always', onAlways );

function resetProgress() {
  loadedImageCount = 0
}
function updateProgress(value) {
  percent = (value * 100) / imageCount
  loader.goToAndStop(percent, true)
}

function onProgress(imgLoad, image) {
  console.log('progress')

  // update progress element
  loadedImageCount++
  updateProgress(loadedImageCount)
}
function doneLoad(instance) {
  setTimeout(() => {
    console.log('done')
    loaderElement.classList.add('finished')
    document.body.classList.remove('loading')
    console.log(document.querySelector('body'))
    const el = document.querySelector('#imgitem')
    const imgs = Array.from(el.querySelectorAll('img'))
    let scenes = []
    const contentList = document.querySelectorAll('section .right .content')
    if (contentList.length > 0) {
      contentList.forEach((content, index) => {
        scenes[index] = new Parallax(content)
      })
    }
    setTimeout(() => {
      document.querySelector('.main').classList.add('display')
      document.querySelector('.navigate').classList.add('display')
      document
        .querySelector("section[data-id='" + current + "']")
        .classList.add('displaydown')
      setTimeout(() => {
        document
          .querySelector("section[data-id='" + current + "']")
          .classList.add('display')
        document.querySelector('.about').classList.add('display')
      }, 750)
    }, 200)
    new displacementSlider({
      parent: el,
      images: imgs,
    })
  }, 1000)
}

document.querySelector('.about').addEventListener('click', () => {
  console.log(current)
  let itemToMask = document.querySelector("section[data-id='" + current + "']")

  if (itemToMask.classList.contains('displayup')) {
    itemToMask.classList.add('mask', 'maskup')
    setTimeout(() => {
      document
        .querySelector("section[data-id='" + current + "']")
        .classList.remove(
          'mask',
          'maskup',
          'maskdown',
          'display',
          'displayup',
          'displaydown'
        )
    }, 750)
  } else {
    itemToMask.classList.add('mask', 'maskdown')
    setTimeout(() => {
      document
        .querySelector("section[data-id='" + current + "']")
        .classList.remove(
          'mask',
          'maskup',
          'maskdown',
          'display',
          'displayup',
          'displaydown'
        )
    }, 750)
  }

  document.querySelector('.navigate').classList.remove('display')
  document.querySelector('.main').classList.remove('display')
})
