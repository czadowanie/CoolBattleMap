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

class Vec2 {
  x;
  y;

  constructor(x, y) {
    this.x = x
    this.y = y
  }

  muls(rhs) {
    return new Vec2(this.x * rhs, this.y * rhs)
  }

  mulv(rhs) {
    return new Vec2(this.x * rhs.x, this.y * rhs.y)
  }

  subv(rhs) {
    return new Vec2(this.x - rhs.x, this.y - rhs.y)
  }

  divs(rhs) {
    return new Vec2(this.x / rhs, this.y / rhs)
  }
}

class Rect {
  pos;
  size;

  constructor(pos, size) {
    this.pos = pos;
    this.size = size;
  }
}

class Unit {
  pos;
  sizeScale;
  color;

  constructor(pos, sizeScale, color) {
    this.pos = pos
    this.sizeScale = sizeScale
    this.color = color
  }

  rect(base, scale) {
    const size = this.sizeScale.muls(base * scale)
    const pos = this.pos.muls(scale).subv(size.divs(2.0))
    return new Rect(pos, size)
  }
}

function Map({ }) {
  let canvas = null;
  let viewport = null;

  const [mapImageUrl, _setMapImageUrl] = createSignal(SkyrimMap)
  const [mapImg, setMapImg] = createSignal(null)
  const [width, setWidth] = createSignal(1024)
  const [height, setHeight] = createSignal(1024)

  const [scale, setScale] = createSignal(1.0);
  const [base, setBase] = createSignal(32.0);

  const [units, _setUnits] = createSignal([
    new Unit(new Vec2(300, 200), new Vec2(1, 1), "#f26"),
    new Unit(new Vec2(800, 800), new Vec2(2, 1), "#6f2"),
    new Unit(new Vec2(1400, 600), new Vec2(1, 2), "#62f"),
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
    new ResizeObserver(() => {
      const rect = viewport.getBoundingClientRect()
      setViewportWidth(rect.width)
      setViewportHeight(rect.height)
    }).observe(viewport)
  })


  createEffect(() => {
    canvas.width = scaledWidth();
    canvas.height = scaledHeight();

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

      if (mapImg() == null) {
        const r = 128 + Math.floor(Math.sin(t / 1000) * 128)
        const b = + Math.floor(Math.cos(t / 1500) * 128)
        const g = 128 + Math.floor(Math.sin(t / 2000) * 128)

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
        ctx.fillRect(0, 0, scaledWidth(), scaledHeight())
      } else {
        ctx.drawImage(mapImg(), 0, 0, width(), height(), 0, 0, scaledWidth(), scaledHeight())
      }

      units().forEach(unit => {
        const rect = unit.rect(base(), scale())

        ctx.fillStyle = unit.color
        ctx.fillRect(rect.pos.x, rect.pos.y, rect.size.x, rect.size.y)
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
      <input type="range" min="16" max="128" step="8" value="32" on:change={(e) => {
        setBase(e.target.value)
      }} />
    </div>
  </>
}

export default Map
