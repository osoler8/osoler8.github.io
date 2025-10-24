class GeometricTransformations {
    constructor() {
        this.canvas = document.getElementById('grid-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 30;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        
        // Current shape and position
        this.currentShape = 'figura-a';
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
        
        // Shape definitions (relative to center)
        this.shapes = {
            'figura-a': [
                { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }
            ],
            'figura-b': [
                { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }
            ],
            'figura-c': [
                { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }
            ],
            'figura-d': [
                { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
                { x: 0, y: 1 }, { x: 1, y: 1 },
                { x: 0, y: 2 }
            ],
            'square': [
                { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }
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
    
    applyTransformation(type) {
        switch(type) {
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
                break;
            case 'reflect-h':
                this.reflectHorizontal();
                break;
        }
        this.redraw();
        this.updateInfo(`Transformació aplicada: ${this.getTransformationName(type)}`);
    }
    
    rotateShape(degrees) {
        this.clearShadow();
        const rotationDirection = document.getElementById('rotation-direction').value;
        const actualDegrees = rotationDirection === 'clockwise' ? -degrees : degrees;
        this.shapeRotation = (this.shapeRotation + actualDegrees) % 360;
        if (this.shapeRotation < 0) {
            this.shapeRotation += 360;
        }
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
        }, 100);
    }

    getTransformationName(type) {
        const rotationDirection = document.getElementById('rotation-direction').value;
        const directionText = rotationDirection === 'clockwise' ? 'horari' : 'antihorari';
        
        const names = {
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
        const gridPos = this.screenToGrid(mouseX, mouseY);
        const transformedShape = this.getTransformedShape();
        
        return transformedShape.some(point => 
            Math.abs(point.x - gridPos.x) < 0.5 && Math.abs(point.y - gridPos.y) < 0.5
        );
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
            
            shape = shape.map(point => ({
                x: Math.round(point.x * cos - point.y * sin),
                y: Math.round(point.x * sin + point.y * cos)
            }));
        }
        
        // Apply reflections
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
        
        transformedShape.forEach(point => {
            const screenPos = this.gridToScreen(point.x, point.y);
            const x = screenPos.x - this.gridSize / 2;
            const y = screenPos.y - this.gridSize / 2;
            
            // Draw filled square
            this.ctx.fillRect(x, y, this.gridSize, this.gridSize);
            this.ctx.strokeRect(x, y, this.gridSize, this.gridSize);
        });
        
        // Draw center point
        const centerScreen = this.gridToScreen(this.shapePosition.x, this.shapePosition.y);
        this.ctx.fillStyle = '#e53e3e';
        this.ctx.beginPath();
        this.ctx.arc(centerScreen.x, centerScreen.y, 4, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawShadowShape() {
        // Calculate shadow position based on reflection type
        let shadowReflectionH = this.shapeReflectionH;
        let shadowReflectionV = this.shapeReflectionV;
        
        if (this.shadowType === 'horizontal') {
            shadowReflectionH = !shadowReflectionH;
        } else if (this.shadowType === 'vertical') {
            shadowReflectionV = !shadowReflectionV;
        }
        
        // Get shadow shape with reflection applied
        const shadowShape = this.getTransformedShape(shadowReflectionH, shadowReflectionV);
        
        // Set shadow style (semi-transparent)
        this.ctx.fillStyle = 'rgba(66, 153, 225, 0.3)';
        this.ctx.strokeStyle = 'rgba(44, 82, 130, 0.5)';
        this.ctx.lineWidth = 1;
        
        shadowShape.forEach(point => {
            const screenPos = this.gridToScreen(point.x, point.y);
            const x = screenPos.x - this.gridSize / 2;
            const y = screenPos.y - this.gridSize / 2;
            
            // Draw shadow square
            this.ctx.fillRect(x, y, this.gridSize, this.gridSize);
            this.ctx.strokeRect(x, y, this.gridSize, this.gridSize);
        });
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
