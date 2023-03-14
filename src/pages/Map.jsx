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

function Map({}) {
  let canvas = null;
  let viewport = null;

  const [mapImageUrl, _setMapImageUrl] = createSignal(SkyrimMap)
  const [mapImg, setMapImg] = createSignal(null)
  const [width, setWidth] = createSignal(1024)
  const [height, setHeight] = createSignal(1024)
  const [scale, setScale] = createSignal(1.0);

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

  const scaledWidth = () => width() * scale()
  const scaledHeight = () => height() * scale()

  const [viewportWidth, setViewportWidth] = createSignal(0);
  const [viewportHeight, setViewportHeight] = createSignal(0);

  onMount(() => {
    const resizeObserver = new ResizeObserver(() => {
      const rect = viewport.getBoundingClientRect()

      setViewportWidth(rect.width)
      setViewportHeight(rect.height)
    }).observe(viewport)

    onCleanup(() => {
      resizeObserver.disconnect()
    })
  })


  createEffect(() => {
    canvas.width = scaledWidth();
    canvas.height = scaledHeight();

    console.log(scaledWidth(), scaledHeight(), viewportWidth(), viewportHeight())

    if (canvas.width < viewportWidth()) {
      canvas.style.left = `${Math.round((viewportWidth() - canvas.width) / 2.0)}px`
    } else {
      canvas.style.left = `0px`
    }

    if (canvas.height < viewportHeight()) {
      canvas.style.top = `${Math.round((viewportHeight() - canvas.height) / 2.0)}px`
    } else {
      canvas.style.top = `0px`
    }
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
        ctx.fillRect(0, 0, scaledWidth(), scaledHeight())
      } else if (mapImg.error) {
        ctx.fillStyle = `red`
        ctx.fillRect(0, 0, scaledWidth(), scaledHeight())
      } else {
        ctx.drawImage(mapImg(), 0, 0, width(), height(), 0, 0, scaledWidth(), scaledHeight())
      }

      units().forEach(unit => {
        ctx.fillStyle = `red`
        ctx.fillRect(unit.pos[0] * scale(), unit.pos[1] * scale(), unit.size[0] * scale(), unit.size[1] * scale())
      })
    }

    onCleanup(() => cancelAnimationFrame(frame));
  })

  return <>
    <div class="map">
      <div class="map__view" ref={viewport}>
        <canvas class="map__canvas" ref={canvas} width={width()} height={height()} />
      </div>
      <input type="range" min="0.1" max="2.0" step="0.01" value="1.0" on:change={(e) => {
        setScale(e.target.value)
      }} />
    </div>
  </>
}

export default Map
