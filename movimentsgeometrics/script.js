class GeometricTransformations {
    constructor() {
        this.canvas = document.getElementById('grid-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 30;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        
        // Current shape and position
        this.currentShape = 'triangle-equilater';
        this.shapePosition = { x: 0, y: 0 };
        this.shapeRotation = 0;
        this.shapeReflectionH = false;
        this.shapeReflectionV = false;
        
        // Shadow shape for reflections
        this.showShadow = false;
        this.shadowType = null; // 'horizontal' or 'vertical'
        
        // Mouse interaction
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        
        // Shape definitions (vertices of geometric shapes, relative to center)
        this.shapes = {
            'triangle-equilater': [
                { x: 0, y: -1.5 },          // Top vertex
                { x: -1.299, y: 0.75 },     // Bottom left (√3 ≈ 1.732, so 1.5 * √3/2 ≈ 1.299)
                { x: 1.299, y: 0.75 }       // Bottom right
            ],
            'triangle-rectangle': [
                { x: -1, y: -1 },           // Top left
                { x: 1, y: -1 },            // Top right
                { x: -1, y: 1 }             // Bottom left (right angle)
            ],
            'quadrat': [
                { x: -1, y: -1 },           // Top left
                { x: 1, y: -1 },            // Top right
                { x: 1, y: 1 },             // Bottom right
                { x: -1, y: 1 }             // Bottom left
            ],
            'pentagon': [
                { x: 0, y: -1.5 },          // Top
                { x: 1.427, y: -0.464 },    // Top right
                { x: 0.882, y: 1.214 },     // Bottom right
                { x: -0.882, y: 1.214 },    // Bottom left
                { x: -1.427, y: -0.464 }    // Top left
            ],
            'hexagon': [
                { x: 0, y: -1.5 },          // Top
                { x: 1.299, y: -0.75 },     // Top right
                { x: 1.299, y: 0.75 },      // Bottom right
                { x: 0, y: 1.5 },           // Bottom
                { x: -1.299, y: 0.75 },     // Bottom left
                { x: -1.299, y: -0.75 }     // Top left
            ]
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.drawGrid();
        this.drawShape();
        this.updateInfo();
    }
    
    setupEventListeners() {
        // Shape selection buttons
        document.querySelectorAll('.shape-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentShape = e.target.dataset.shape;
                this.resetShape();
            });
        });
        
        // Transform buttons
        document.querySelectorAll('.transform-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const transform = e.target.dataset.transform;
                this.applyTransformation(transform);
            });
        });
        
        // Reset button
        document.querySelector('.reset-btn').addEventListener('click', () => {
            this.resetShape();
        });
        
        // Initial position button
        document.querySelector('.initial-position-btn').addEventListener('click', () => {
            this.setInitialPosition();
        });
        

        
        // Canvas mouse events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        this.canvas.addEventListener('mouseleave', () => this.handleMouseUp());
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', () => this.handleMouseUp());
    }
    

    
    resetShape() {
        this.clearShadow();
        this.shapePosition = { x: 0, y: 0 };
        this.shapeRotation = 0;
        this.shapeReflectionH = false;
        this.shapeReflectionV = false;
        this.redraw();
        this.updateInfo('Reiniciat');
    }
    
    setInitialPosition() {
        this.clearShadow();
        this.shapePosition = { x: 0, y: 0 };
        this.shapeRotation = 0;
        this.shapeReflectionH = false;
        this.shapeReflectionV = false;
        this.redraw();
        this.updateInfo('Posició i orientació inicials');
    }
    
    applyTransformation(type) {
        switch(type) {
            case 'rotate-45':
                this.rotateShape(45);
                break;
            case 'rotate-90':
                this.rotateShape(90);
                break;
            case 'rotate-180':
                this.rotateShape(180);
                break;
            case 'rotate-270':
                this.rotateShape(270);
                break;
            case 'rotate-360':
                this.rotateShape(360);
                break;
            case 'translate':
                this.translateShape();
                break;
            case 'reflect-v':
                this.reflectVertical();
                return; // Exit early for reflections as they handle their own redraw
            case 'reflect-h':
                this.reflectHorizontal();
                return; // Exit early for reflections as they handle their own redraw
        }
        this.redraw();
        this.updateInfo(`Transformació aplicada: ${this.getTransformationName(type)}`);
    }
    

    
    rotateShape(degrees) {
        this.clearShadow();
        const rotationDirection = document.getElementById('rotation-direction').value;
        const actualDegrees = rotationDirection === 'clockwise' ? -degrees : degrees;
        
        // Add the rotation and normalize to 0-360 range
        this.shapeRotation = (this.shapeRotation + actualDegrees) % 360;
        if (this.shapeRotation < 0) {
            this.shapeRotation += 360;
        }
        
        // Round to avoid floating point precision errors
        this.shapeRotation = Math.round(this.shapeRotation * 100) / 100;
    }

    translateShape() {
        this.clearShadow();
        // Simple translation by fixed amounts
        const dx = 2;
        const dy = 1;
        
        // Calculate new position with boundaries
        const newX = this.shapePosition.x + dx;
        const newY = this.shapePosition.y + dy;
        
        // Check boundaries for the shape
        const transformedShape = this.getTransformedShape();
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        
        transformedShape.forEach(point => {
            minX = Math.min(minX, point.x + dx);
            maxX = Math.max(maxX, point.x + dx);
            minY = Math.min(minY, point.y + dy);
            maxY = Math.max(maxY, point.y + dy);
        });
        
        // Apply boundaries (-10 to 10)
        if (minX >= -10 && maxX <= 10 && minY >= -10 && maxY <= 10) {
            this.shapePosition.x = newX;
            this.shapePosition.y = newY;
        }
    }

    reflectVertical() {
        // Show shadow before applying transformation
        this.showShadow = true;
        this.shadowType = 'vertical';
        this.redraw();
        
        // Apply transformation after a brief delay
        setTimeout(() => {
            this.shapeReflectionV = !this.shapeReflectionV;
            this.redraw();
            this.updateInfo(`Transformació aplicada: ${this.getTransformationName('reflect-v')}`);
        }, 100);
    }

    reflectHorizontal() {
        // Show shadow before applying transformation
        this.showShadow = true;
        this.shadowType = 'horizontal';
        this.redraw();
        
        // Apply transformation after a brief delay
        setTimeout(() => {
            this.shapeReflectionH = !this.shapeReflectionH;
            this.redraw();
            this.updateInfo(`Transformació aplicada: ${this.getTransformationName('reflect-h')}`);
        }, 100);
    }

    getTransformationName(type) {
        const rotationDirection = document.getElementById('rotation-direction').value;
        const directionText = rotationDirection === 'clockwise' ? 'horari' : 'antihorari';
        
        const names = {
            'rotate-45': `Gir 45° ${directionText}`,
            'rotate-90': `Gir 90° ${directionText}`,
            'rotate-180': `Gir 180° ${directionText}`,
            'rotate-270': `Gir 270° ${directionText}`,
            'rotate-360': `Gir 360° ${directionText}`,
            'translate': 'Translació',
            'reflect-v': 'Reflexió vertical',
            'reflect-h': 'Reflexió horitzontal'
        };
        return names[type] || type;
    }
    
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    getTouchPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top
        };
    }
    
    screenToGrid(screenX, screenY) {
        const gridX = Math.round((screenX - this.centerX) / this.gridSize);
        const gridY = Math.round((this.centerY - screenY) / this.gridSize);
        return { x: gridX, y: gridY };
    }
    
    gridToScreen(gridX, gridY) {
        const screenX = this.centerX + gridX * this.gridSize;
        const screenY = this.centerY - gridY * this.gridSize;
        return { x: screenX, y: screenY };
    }
    
    isPointInShape(mouseX, mouseY) {
        const transformedShape = this.getTransformedShape();
        
        // Convert mouse position to grid coordinates (but keep as float for precision)
        const testX = (mouseX - this.centerX) / this.gridSize;
        const testY = (this.centerY - mouseY) / this.gridSize;
        
        // Ray casting algorithm (point-in-polygon test)
        let inside = false;
        const vertices = transformedShape;
        
        for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
            const xi = vertices[i].x;
            const yi = vertices[i].y;
            const xj = vertices[j].x;
            const yj = vertices[j].y;
            
            if (((yi > testY) !== (yj > testY)) && 
                (testX < (xj - xi) * (testY - yi) / (yj - yi) + xi)) {
                inside = !inside;
            }
        }
        
        return inside;
    }
    
    handleMouseDown(e) {
        const mousePos = this.getMousePos(e);
        if (this.isPointInShape(mousePos.x, mousePos.y)) {
            this.isDragging = true;
            const gridPos = this.screenToGrid(mousePos.x, mousePos.y);
            this.dragOffset = {
                x: gridPos.x - this.shapePosition.x,
                y: gridPos.y - this.shapePosition.y
            };
            this.canvas.style.cursor = 'grabbing';
        }
    }
    
    handleMouseMove(e) {
        const mousePos = this.getMousePos(e);
        
        if (this.isDragging) {
            const gridPos = this.screenToGrid(mousePos.x, mousePos.y);
            this.shapePosition = {
                x: gridPos.x - this.dragOffset.x,
                y: gridPos.y - this.dragOffset.y
            };
            this.redraw();
            this.updateInfo('Arrossegant');
        } else {
            // Change cursor when hovering over shape
            if (this.isPointInShape(mousePos.x, mousePos.y)) {
                this.canvas.style.cursor = 'grab';
            } else {
                this.canvas.style.cursor = 'crosshair';
            }
        }
    }
    
    handleMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.canvas.style.cursor = 'crosshair';
            this.updateInfo('Moviment manual');
        }
    }
    
    handleTouchStart(e) {
        e.preventDefault();
        const touchPos = this.getTouchPos(e);
        this.handleMouseDown({ clientX: touchPos.x, clientY: touchPos.y });
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        const touchPos = this.getTouchPos(e);
        this.handleMouseMove({ clientX: touchPos.x, clientY: touchPos.y });
    }
    
    getTransformedShape(reflectionH = this.shapeReflectionH, reflectionV = this.shapeReflectionV) {
        let shape = [...this.shapes[this.currentShape]];
        
        // Apply rotation
        if (this.shapeRotation !== 0) {
            const angle = (this.shapeRotation * Math.PI) / 180;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            
            shape = shape.map(point => {
                const newX = point.x * cos - point.y * sin;
                const newY = point.x * sin + point.y * cos;
                
                // Round to avoid floating point precision errors
                return {
                    x: Math.round(newX * 1000) / 1000,
                    y: Math.round(newY * 1000) / 1000
                };
            });
        }
        
        // Apply reflections relative to shape center
        if (reflectionH) {
            shape = shape.map(point => ({ x: -point.x, y: point.y }));
        }
        
        if (reflectionV) {
            shape = shape.map(point => ({ x: point.x, y: -point.y }));
        }
        
        // Apply translation
        shape = shape.map(point => ({
            x: point.x + this.shapePosition.x,
            y: point.y + this.shapePosition.y
        }));
        
        return shape;
    }
    
    drawGrid() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set grid style
        this.ctx.strokeStyle = '#e2e8f0';
        this.ctx.lineWidth = 1;
        
        // Draw vertical lines
        for (let x = 0; x <= this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        // Draw axes
        this.ctx.strokeStyle = '#4a5568';
        this.ctx.lineWidth = 2;
        
        // X-axis
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.centerY);
        this.ctx.lineTo(this.canvas.width, this.centerY);
        this.ctx.stroke();
        
        // Y-axis
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, 0);
        this.ctx.lineTo(this.centerX, this.canvas.height);
        this.ctx.stroke();
        
        // Draw axis labels
        this.ctx.fillStyle = '#718096';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        
        // X-axis numbers - only draw numbers that fit within canvas
        const maxXUnits = Math.floor(this.centerX / this.gridSize);
        for (let i = -maxXUnits; i <= maxXUnits; i++) {
            if (i !== 0) {
                const x = this.centerX + i * this.gridSize;
                if (x >= 0 && x <= this.canvas.width) {
                    this.ctx.fillText(i.toString(), x, this.centerY + 15);
                }
            }
        }
        
        // Y-axis numbers - only draw numbers that fit within canvas
        this.ctx.textAlign = 'right';
        const maxYUnits = Math.floor(this.centerY / this.gridSize);
        for (let i = -maxYUnits; i <= maxYUnits; i++) {
            if (i !== 0) {
                const y = this.centerY - i * this.gridSize;
                if (y >= 0 && y <= this.canvas.height) {
                    this.ctx.fillText(i.toString(), this.centerX - 8, y + 4);
                }
            }
        }
        
        // Origin
        this.ctx.textAlign = 'right';
        this.ctx.fillText('0', this.centerX - 8, this.centerY + 15);
        

    }
    

    
    drawShape() {
        const transformedShape = this.getTransformedShape();
        
        // Draw shadow if needed
        if (this.showShadow) {
            this.drawShadowShape();
        }
        
        // Set shape style
        this.ctx.fillStyle = '#4299e1';
        this.ctx.strokeStyle = '#2c5282';
        this.ctx.lineWidth = 2;
        
        // Draw polygon
        if (transformedShape.length > 0) {
            this.ctx.beginPath();
            
            // Move to first vertex
            const firstPoint = this.gridToScreen(transformedShape[0].x, transformedShape[0].y);
            this.ctx.moveTo(firstPoint.x, firstPoint.y);
            
            // Draw lines to all other vertices
            for (let i = 1; i < transformedShape.length; i++) {
                const point = this.gridToScreen(transformedShape[i].x, transformedShape[i].y);
                this.ctx.lineTo(point.x, point.y);
            }
            
            // Close the polygon
            this.ctx.closePath();
            
            // Fill and stroke the polygon
            this.ctx.fill();
            this.ctx.stroke();
        }
        
        // Draw center point
        const centerScreen = this.gridToScreen(this.shapePosition.x, this.shapePosition.y);
        this.ctx.fillStyle = '#e53e3e';
        this.ctx.beginPath();
        this.ctx.arc(centerScreen.x, centerScreen.y, 4, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawShadowShape() {
        // Get the current transformed shape (with rotation and translation)
        let originalShape = this.getTransformedShape(false, false); // No reflections applied
        
        // Create the mathematically correct reflection
        let reflectedShape;
        
        if (this.shadowType === 'horizontal') {
            // Horizontal reflection: reflect across the Y-axis (x = 0)
            // Each point (x, y) becomes (-x, y)
            reflectedShape = originalShape.map(point => ({
                x: -point.x,
                y: point.y
            }));
        } else if (this.shadowType === 'vertical') {
            // Vertical reflection: reflect across the X-axis (y = 0)
            // Each point (x, y) becomes (x, -y)
            reflectedShape = originalShape.map(point => ({
                x: point.x,
                y: -point.y
            }));
        } else {
            return; // No reflection type set
        }
        
        // Set reflection style (semi-transparent with different color to distinguish)
        this.ctx.fillStyle = 'rgba(255, 100, 100, 0.5)'; // Light red for reflection
        this.ctx.strokeStyle = 'rgba(200, 50, 50, 0.8)'; // Darker red border
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]); // Dashed line for reflection
        
        // Draw reflected polygon
        if (reflectedShape.length > 0) {
            this.ctx.beginPath();
            
            // Move to first vertex
            const firstPoint = this.gridToScreen(reflectedShape[0].x, reflectedShape[0].y);
            this.ctx.moveTo(firstPoint.x, firstPoint.y);
            
            // Draw lines to all other vertices
            for (let i = 1; i < reflectedShape.length; i++) {
                const point = this.gridToScreen(reflectedShape[i].x, reflectedShape[i].y);
                this.ctx.lineTo(point.x, point.y);
            }
            
            // Close the polygon
            this.ctx.closePath();
            
            // Fill and stroke the reflected polygon
            this.ctx.fill();
            this.ctx.stroke();
        }
        
        // Reset line dash for normal drawing
        this.ctx.setLineDash([]);
    }

    clearShadow() {
        this.showShadow = false;
        this.shadowType = null;
    }
    
    redraw() {
        this.drawGrid();
        this.drawShape();
        this.updateInfo();
    }
    
    updateInfo(lastTransform = null) {
        if (lastTransform) {
            document.getElementById('last-transform').textContent = lastTransform;
        }
        document.getElementById('current-position').textContent = 
            `(${this.shapePosition.x}, ${this.shapePosition.y})`;
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GeometricTransformations();
});