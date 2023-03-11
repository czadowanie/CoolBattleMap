import { onMount, onCleanup, createSignal, createEffect } from "solid-js";

import SkyrimMap from "../assets/skyrim_map.jpg"

async function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img")
    img.src = url
    img.onload = () => resolve(img)
    img.onerror = (error) => reject(error)
  })
}

function Map() {
  let canvas = null;

  const [mapImageUrl, _setMapImageUrl] = createSignal(SkyrimMap)
  const [mapImg, setMapImg] = createSignal(null)
  const [width, setWidth] = createSignal(1024)
  const [height, setHeight] = createSignal(1024)

  const [units, _setUnits] = createSignal([
    {
      pos: [300, 200],
      size: [64, 64],
    },
    {
      pos: [800, 800],
      size: [64, 64],
    },
    {
      pos: [1400, 600],
      size: [128, 128],
    },
  ])

  createEffect(() => {
    loadImage(mapImageUrl()).then((img) => {
      setMapImg(img)
      setWidth(img.width)
      setHeight(img.height)
    })
  })


  onMount(() => {
    const ctx = canvas.getContext("2d");
    let frame = requestAnimationFrame(loop);

    function loop(t) {
      frame = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, width(), height())

      if (mapImg.loading) {
        const r = 128 + Math.floor(Math.sin(t / 1000) * 128)
        const b = + Math.floor(Math.cos(t / 1500) * 128)
        const g = 128 + Math.floor(Math.sin(t / 2000) * 128)
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
        ctx.fillRect(0, 0, width(), height())
      } else if (mapImg.error) {
        ctx.fillStyle = `red`
        ctx.fillRect(0, 0, width(), height())
      } else {
        ctx.drawImage(mapImg(), 0, 0)
      }

      units().forEach(unit => {
        ctx.fillStyle = `red`
        ctx.fillRect(unit.pos[0], unit.pos[1], unit.size[0], unit.size[1])
      })
    }

    onCleanup(() => cancelAnimationFrame(frame));
  })

  return <>
    <div class="map">
      <div class="map__view">
        <canvas class="map__canvas" ref={canvas} width={width()} height={height()} />
      </div>
    </div>
  </>
}

export default Map
