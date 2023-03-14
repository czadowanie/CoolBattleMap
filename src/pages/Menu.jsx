import Page from "../Router.jsx"

function Menu({ setPage }) {
  //cała strona menu

  function goToMap() {
    setPage(Page.map)
  }

  return <>
    <div class="menu">
      <button class="menu__button" on:click={goToMap}>Land battle</button>
      <button class="menu__button" on:click={goToMap}>Sea battle</button>
      <button class="menu__button" on:click={goToMap}>Sandbox</button>
      <button class="menu__button" on:click={goToMap}>Wargame</button>
    </div>
  </>

}

export default Menu
