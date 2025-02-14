document.addEventListener('DOMContentLoaded', function() {
    let selectedElement = null;
    let offsetX, offsetY;

    // Add Element on Canvas
    document.getElementById("addElement").addEventListener("click", () => {
        let elementType = document.getElementById("elementType").value;
        let elementColor = document.getElementById("elementColor").value;

        let newElement = document.createElement(elementType);
        newElement.classList.add("movable");
        newElement.style.position = "absolute"; // Ensures absolute positioning for layout control
        newElement.style.left = "50px";
        newElement.style.top = "50px";
        newElement.style.backgroundColor = elementColor;

        if (elementType === "button") {
            newElement.textContent = "Click Me";
        } else if (elementType === "input") {
            newElement.placeholder = "Enter text...";
        } else if (elementType === "div") {
            newElement.style.border = "1px solid black";
            newElement.style.padding = "10px";
            newElement.textContent = "Container";
        }

        // Add mouse event for drag functionality
        newElement.addEventListener("mousedown", function(e) {
            selectedElement = newElement;
            offsetX = e.clientX - parseInt(window.getComputedStyle(selectedElement).left);
            offsetY = e.clientY - parseInt(window.getComputedStyle(selectedElement).top);

            document.addEventListener("mousemove", dragElement);
            document.addEventListener("mouseup", () => {
                document.removeEventListener("mousemove", dragElement);
                selectedElement = null;
            });
        });

        document.getElementById("canvas").appendChild(newElement);
    });

    // Function to drag the element
    function dragElement(e) {
        if (selectedElement) {
            selectedElement.style.left = (e.clientX - offsetX) + "px";
            selectedElement.style.top = (e.clientY - offsetY) + "px";
        }
    }

    // Allow the deletion of elements by pressing "Delete" key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Delete") {
            if (selectedElement) {
                selectedElement.remove();
                selectedElement = null;
            }
        }
    });

    // Generate HTML/CSS code when the button is pressed
    document.getElementById("generateCode").addEventListener("click", () => {
        let canvasContent = document.getElementById("canvas").innerHTML;
        document.getElementById("codeOutput").value = generateCode(canvasContent);
    });

    // Function to generate HTML and CSS code
    function generateCode(content) {
        let html = content;
        let css = "";

        // Collect CSS for each element with all inline styles
        let elements = document.querySelectorAll("#canvas > .movable");
        elements.forEach((el, index) => {
            const style = el.style;
            let elementCSS = `position: absolute; left: ${style.left}; top: ${style.top}; background-color: ${style.backgroundColor}; `;

            // Add other styles (e.g., padding, border, text color, etc.)
            elementCSS += style.padding ? `padding: ${style.padding}; ` : '';
            elementCSS += style.border ? `border: ${style.border}; ` : '';
            elementCSS += style.color ? `color: ${style.color}; ` : '';
            elementCSS += style.fontSize ? `font-size: ${style.fontSize}; ` : '';
            elementCSS += style.width ? `width: ${style.width}; ` : '';
            elementCSS += style.height ? `height: ${style.height}; ` : '';

            css += `.element-${index} { ${elementCSS} }\n`;
            html = html.replace(el.outerHTML, `<${el.tagName.toLowerCase()} class="element-${index}" style="${style.cssText}">${el.innerHTML}</${el.tagName.toLowerCase()}>`);
        });

        return `HTML:\n${html}\n\nCSS:\n${css}`;
    }
});
