import { useEffect, useState } from 'react'
import './index.css'
import Lenis from 'lenis'
import img1 from '../public/514059879_746815511202448_1661179964948755407_n.jpg'
import img2 from '../public/518825481_768856555786690_6166892606164211904_n.jpg'
import img3 from '../public/557569804_790599976935905_4130271026108549216_n.jpg'
import img4 from '../public/566501619_1118225166732126_1680308539609821486_n.jpg'
import img5 from '../public/582231618_1363656568018266_5304459334421877410_n.jpg'
import img6 from '../public/582283371_1117006833611356_5211286661123763709_n.jpg'
import img7 from '../public/582302777_1501192357849669_3448160790382806091_n.jpg'
import img8 from '../public/582388509_1896592634542624_621580816781698773_n.jpg'
import img9 from '../public/582433665_1909598866634523_2363400457631566169_n.jpg'
import img10 from '../public/582569878_818345954148921_8862982646823056552_n.jpg'
import img11 from '../public/582999414_858462557132805_7402461263529218196_n.jpg'
import img12 from '../public/584415441_803317029193873_6152769950862550445_n.jpg'

const App = () => {
  const imageList = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    img10,
    img11,
    img12
  ]

  // fixed size used for collision detection (px). Adjust as needed.
  const IMG_SIZE = 150
  const GAP = 10 // minimum gap from edges / between images

  const rectsOverlap = (a, b) => {
    return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom)
  }

  const generateNonOverlappingPositions = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    const placed = []

    for (let i = 0; i < imageList.length; i++) {
      let attempts = 0
      let placedRect = null

      while (attempts < 1000) {
        const left = Math.random() * (w - IMG_SIZE - GAP * 2) + GAP
        const top = Math.random() * (h - IMG_SIZE - GAP * 2) + GAP
        const rect = { left, top, right: left + IMG_SIZE, bottom: top + IMG_SIZE }

        const collide = placed.some(p => rectsOverlap(rect, p))
        if (!collide) {
          placedRect = rect
          break
        }
        attempts++
      }

      // if not found after many attempts, fallback to stacking
      if (!placedRect) {
        const left = GAP + (placed.length * (IMG_SIZE + GAP)) % (w - IMG_SIZE - GAP)
        const top = GAP + Math.floor((placed.length * (IMG_SIZE + GAP)) / (w - IMG_SIZE - GAP)) * (IMG_SIZE + GAP)
        placedRect = { left, top, right: left + IMG_SIZE, bottom: top + IMG_SIZE }
      }

      placed.push(placedRect)
    }

    return placed.map(r => ({ top: Math.round(r.top) + 'px', left: Math.round(r.left) + 'px' }))
  }

  const [positions, setPositions] = useState(() => Array(imageList.length).fill({ top: '0px', left: '0px' }))

  useEffect(() => {
    // init positions after mount (need window dimensions)
    setPositions(generateNonOverlappingPositions())

    const lenis = new Lenis()

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      if (typeof lenis.destroy === 'function') lenis.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleReposition = () => {
    setPositions(generateNonOverlappingPositions())
  }

  return (
    <div className="container" style={{ position: 'relative' }}>
      {imageList.map((src, idx) => (
        <div
          key={idx}
          className={`elem sub-container${idx + 1}`}
          style={{
            position: 'absolute',
            top: positions[idx]?.top,
            left: positions[idx]?.left,
            width: IMG_SIZE + 'px',
            height: IMG_SIZE + 'px',
            overflow: 'hidden'
          }}
        >
          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ))}

      <div className="title">
        <h1>IT'S ME BAE!!</h1>
        <h2>My collections</h2>
        <button onClick={handleReposition} aria-label="Reposition images">Reposition</button>
      </div>
    </div>
  )
}

export default App
