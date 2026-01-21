export default function initDebugGrid() {
  let isVisible = false;
  let debugGridElement: HTMLDivElement | null = null;

  const createDebugGrid = () => {
    const root = document.createElement('div');
    root.className = 'debug-grid';

    const container = document.createElement('div');
    container.className = 'debug-grid__container';

    // Create 12 columns (will be responsive via CSS)
    for (let i = 1; i <= 12; i++) {
      const column = document.createElement('div');
      column.className = 'debug-grid__column';
      
      const colNum = document.createElement('span');
      colNum.className = 'debug-grid__col-num';
      colNum.textContent = i.toString();
      
      column.appendChild(colNum);
      container.appendChild(column);
    }

    root.appendChild(container);
    return root;
  };

  const toggleDebugGrid = () => {
    isVisible = !isVisible;

    if (isVisible) {
      if (!debugGridElement) {
        debugGridElement = createDebugGrid();
        document.body.appendChild(debugGridElement);
      }
      debugGridElement.style.display = 'flex';
    } else {
      if (debugGridElement) {
        debugGridElement.style.display = 'none';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'g' && e.ctrlKey) {
      e.preventDefault();
      toggleDebugGrid();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
}
