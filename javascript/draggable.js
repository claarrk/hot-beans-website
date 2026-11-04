// Makes every .card on the application page moveable.
//
// - Drag a card by its .card-head (mouse, pen or touch).
// - Or focus the head and use the arrow keys (Shift = bigger steps).
// - Positions are stored as translate() offsets, so the cards keep their
//   place in the normal grid layout and the form still reads in order.
// - Offsets are saved in localStorage and restored on the next visit.
// - "Reset layout" puts every card back where it started.

(() => {
  const STORAGE_KEY = "hotbeans:card-offsets";
  const KEY_STEP = 10;
  const KEY_STEP_BIG = 50;

  const board = document.getElementById("board");
  if (!board) return;

  const cards = Array.from(board.querySelectorAll(".card"));
  let offsets = load();
  let topCard = null;

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(offsets));
    } catch {
      /* storage unavailable (private mode etc.) — layout just won't persist */
    }
  }

  function apply(card) {
    const { x = 0, y = 0 } = offsets[card.id] || {};
    card.style.transform = x || y ? `translate(${x}px, ${y}px)` : "";
    card.classList.toggle("is-moved", Boolean(x || y));
  }

  function bringToFront(card) {
    if (topCard && topCard !== card) topCard.style.zIndex = "";
    card.style.zIndex = "5";
    topCard = card;
  }

  // Keep the card fully inside the board horizontally (so the page never
  // scrolls sideways) and never above the top of the board.
  function clamp(card, x, y) {
    const boardRect = board.getBoundingClientRect();
    const { x: curX = 0, y: curY = 0 } = offsets[card.id] || {};
    const rect = card.getBoundingClientRect();
    const homeLeft = rect.left - curX;
    const homeTop = rect.top - curY;

    const minX = boardRect.left - homeLeft;
    const maxX = boardRect.right - homeLeft - rect.width;
    const minY = boardRect.top - homeTop;

    return {
      x: Math.round(Math.min(Math.max(x, minX), maxX)),
      y: Math.round(Math.max(y, minY)),
    };
  }

  function setOffset(card, x, y) {
    const next = clamp(card, x, y);
    if (next.x === 0 && next.y === 0) delete offsets[card.id];
    else offsets[card.id] = next;
    apply(card);
  }

  cards.forEach((card) => {
    const head = card.querySelector(".card-head");
    if (!head) return;

    apply(card);

    head.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();

      const start = offsets[card.id] || { x: 0, y: 0 };
      const originX = e.clientX;
      const originY = e.clientY;

      head.setPointerCapture(e.pointerId);
      card.classList.add("is-dragging");
      bringToFront(card);

      const onMove = (ev) => {
        setOffset(card, start.x + ev.clientX - originX, start.y + ev.clientY - originY);
      };
      const onUp = () => {
        card.classList.remove("is-dragging");
        head.removeEventListener("pointermove", onMove);
        head.removeEventListener("pointerup", onUp);
        head.removeEventListener("pointercancel", onUp);
        save();
      };

      head.addEventListener("pointermove", onMove);
      head.addEventListener("pointerup", onUp);
      head.addEventListener("pointercancel", onUp);
    });

    head.addEventListener("keydown", (e) => {
      const step = e.shiftKey ? KEY_STEP_BIG : KEY_STEP;
      const move = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
      }[e.key];
      if (!move) return;

      e.preventDefault();
      const { x = 0, y = 0 } = offsets[card.id] || {};
      bringToFront(card);
      setOffset(card, x + move[0], y + move[1]);
      save();
    });
  });

  const reset = document.getElementById("reset-layout");
  if (reset) {
    reset.addEventListener("click", () => {
      offsets = {};
      save();
      cards.forEach((card) => {
        card.style.zIndex = "";
        apply(card);
      });
      topCard = null;
    });
  }
})();
