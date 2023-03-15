import { createSignal } from 'solid-js';

function DropDown() {
  const [isOpen, setIsOpen] = createSignal(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return <>
    <div class="Dropdown" onClick={handleClose}>
      <button class="Dropdown__dropdown-button" onClick={handleOpen}>
        Unit
      </button>
      <div class={`Dropdown__dropdown-menu ${isOpen() ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div>unit1</div>
        <div>unit2</div>
        <div>unit2</div>
      </div>
    </div>
    </>
}
export default DropDown