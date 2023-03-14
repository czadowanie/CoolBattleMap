import { Page } from "../App.jsx"

function Menu({ setPage }) {
  //cała strona menu

  function goToMap() {
    setPage(Page.map)
  }

  return <>
    <div class="menu">
      <input type="button" class="menu__button" value="Land battle" on:click={goToMap}></input>
      <input type="button" class="menu__button" value="Sea battle" on:click={goToMap}></input>
      <input type="button" class="menu__button" value="Sandbox" on:click={goToMap}></input>
      <input type="button" class="menu__button" value="Wargame" on:click={goToMap}></input>
    </div>
  </>

}

export default Menu
