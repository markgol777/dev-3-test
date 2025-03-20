document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const inputText = document.getElementById("inputText");
    const output = document.getElementById("output");
    const displayBtn = document.getElementById("displayBtn");
    const clearBtn = document.getElementById("clearBtn");
    const resetBtn = document.getElementById("resetBtn");

    let selectedLetters = new Set();

    // Event listeners
    displayBtn.addEventListener('click', generateText);
    clearBtn.addEventListener('click', clearOutput);
    resetBtn.addEventListener('click', resetSelection);
    inputText.addEventListener('keypress', event => {
        if (event.key === 'Enter') generateText();
    });

    /**
     * Generates text elements based on input field value
     */
    function generateText() {
        const text = inputText.value.trim();
        if (!text) return;

        output.innerHTML = "";
        selectedLetters.clear();

        text.split("").forEach((char, index) => {
            const span = document.createElement("span");
            span.textContent = char;
            span.classList.add("letter");
            span.setAttribute("draggable", true);
            span.dataset.index = index;

            // Event listeners
            span.addEventListener("click", toggleSelection);
            span.addEventListener("dragstart", dragStart);
            span.addEventListener("dragover", dragOver);
            span.addEventListener("dragenter", dragEnter);
            span.addEventListener("dragleave", dragLeave);
            span.addEventListener("drop", drop);

            output.appendChild(span);
        });
    }

    /**
     * Toggles selection of a letter when Ctrl+click is used
     * @param {Event} event - The click event
     */
    function toggleSelection(event) {
        if (event.ctrlKey) {
            const index = this.dataset.index;
            this.classList.toggle("selected");

            if (selectedLetters.has(index)) {
                selectedLetters.delete(index);
            } else {
                selectedLetters.add(index);
            }
        }
    }

    /**
     * Handles the start of drag operations
     * @param {DragEvent} event - The dragstart event
     */
    function dragStart(event) {
        event.dataTransfer.setData("text/plain", this.dataset.index);
        setTimeout(() => this.classList.add('dragging'), 0);
    }

    /**
     * Handles the dragover event to allow dropping
     * @param {DragEvent} event - The dragover event
     */
    function dragOver(event) {
        event.preventDefault();
    }

    /**
     * Handles the dragenter event to provide visual feedback
     * @param {DragEvent} event - The dragenter event
     */
    function dragEnter(event) {
        event.preventDefault();
        this.classList.add('drag-over');
    }

    /**
     * Handles the dragleave event to remove visual feedback
     */
    function dragLeave() {
        this.classList.remove('drag-over');
    }

    /**
     * Handles the drop event to swap letters
     * @param {DragEvent} event - The drop event
     */
    function drop(event) {
        event.preventDefault();
        this.classList.remove('drag-over');

        const draggedIndex = parseInt(event.dataTransfer.getData("text/plain"));
        const targetIndex = parseInt(this.dataset.index);

        if (draggedIndex !== targetIndex && !isNaN(draggedIndex) && !isNaN(targetIndex)) {
            const letters = document.querySelectorAll(".letter");
            const draggedEl = letters[draggedIndex];
            const targetEl = letters[targetIndex];

            if (draggedEl && targetEl) {
                const temp = draggedEl.textContent;
                draggedEl.textContent = targetEl.textContent;
                targetEl.textContent = temp;
            }
        }

        document.querySelector('.dragging')?.classList.remove('dragging');
    }

    /**
     * Clears the output area and input field
     */
    function clearOutput() {
        output.innerHTML = "";
        selectedLetters.clear();
        inputText.value = "";
        inputText.focus();
    }

    /**
     * Resets all selected letters
     */
    function resetSelection() {
        document.querySelectorAll('.letter.selected').forEach(el => {
            el.classList.remove('selected');
        });
        selectedLetters.clear();
    }
});
