import { createSignal, Switch, Match, For } from "solid-js";
import Menu from "./pages/Menu"
import Map from "./pages/Map"

export const Page = {
  menu: "menu",
  map: "map",
}

function PageSelector({ setPage }) {
  return <select on:change={(e) => { setPage(e.target.value); console.log(e); }}>
    <For each={Object.values(Page)}>{(pageId) =>
      <option value={pageId}>{pageId}</option>
    }</For>
  </select>
}

function App() {
  const [page, setPage] = createSignal(Page.menu)
  //Przy headerze zrobiłem połowiczny layout
  //Tam gdzie page selector == exit
  return <div class="app">
    <div class="header">
      <h2>Tryb expert</h2>
      <h2>Custom Units</h2>
      <h2>Units</h2>
      <h2>Tu Logo </h2>
      <h2>Commands</h2>
      <h2>Upload map</h2>
      <PageSelector setPage={setPage} />
    </div>

    <Switch fallback={<div>Router: wrong Page id: "{page()}"</div>}>
      <Match when={page() == Page.menu}>
        <Menu setPage={setPage} />
      </Match>
      <Match when={page() == Page.map}>
        <Map />
      </Match>
    </Switch>
  </div>
}

export default App;
