/**
 * UI kit: helper functions to create interactive components consistently styled.
 */
export function createButton(label, onClick, opts = {}) {
  const btn = document.createElement('button');
  btn.className = 'ui-button';
  btn.textContent = label;
  btn.tabIndex = 0;
  btn.addEventListener('click', onClick);
  if (opts.id) btn.id = opts.id;
  if (opts.ariaLabel) btn.setAttribute('aria-label', opts.ariaLabel);
  return btn;
}

export function createToggle(label, initial, onChange) {
  const wrapper = document.createElement('label');
  wrapper.className = 'ui-toggle';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = initial;
  input.addEventListener('change', () => onChange(input.checked));
  const span = document.createElement('span');
  span.textContent = label;
  wrapper.appendChild(input);
  wrapper.appendChild(span);
  return wrapper;
}

export function createModal(content, opts = {}) {
  const overlay = document.createElement('div');
  overlay.className = 'ui-modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.tabIndex = -1;
  const dialog = document.createElement('div');
  dialog.className = 'ui-modal';
  dialog.appendChild(content);
  overlay.appendChild(dialog);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay && opts.closeOnBackdrop !== false) {
      hide();
    }
  });
  function show() {
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('visible'), 0);
  }
  function hide() {
    overlay.classList.remove('visible');
    setTimeout(() => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 300);
  }
  return { overlay, show, hide };
}