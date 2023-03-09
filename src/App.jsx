import { createSignal, Switch, Match, For } from "solid-js";

import Map from "./pages/Map"

const Page = {
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

  return <div class="app">
    <div class="header">
      <h1>strategus </h1>
      <PageSelector setPage={setPage} />
    </div>

    <Switch fallback={<div>Router: wrong Page id: "{page()}"</div>}>
      <Match when={page() == Page.menu}>
        menu
      </Match>
      <Match when={page() == Page.map}>
        <Map />
      </Match>
    </Switch>
  </div>
}

export default App;
