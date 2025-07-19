// Enhanced Gray House Game with Multi-Floor Navigation
class EnhancedGrayHouseGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1000;
        this.canvas.height = 700;
        
        // Game state
        this.isRunning = false;
        this.keys = {};
        this.currentFloor = 'fl3'; // Start on first floor
        this.showFloorMenu = false;
        
        // Player properties
        this.player = {
            x: 500,
            y: 350,
            size: 8,
            speed: 3,
            color: '#c9a96e'
        };
        
        // Floor definitions based on the original map
        this.floors = {
            'fl1': {
                name: 'Третий Этаж (3rd Floor)',
                image: 'images/f3.PNG',
                areas: [
                    { name: 'Западный Коридор', x: 50, y: 400, width: 300, height: 50 },
                    { name: 'Восточный Коридор', x: 650, y: 400, width: 200, height: 50 },
                    { name: 'Холл', x: 350, y: 300, width: 150, height: 200 },
                    { name: 'Библиотека', x: 50, y: 300, width: 80, height: 80 },
                    { name: 'Буфет', x: 150, y: 300, width: 80, height: 80 },
                    { name: 'Чердак', x: 250, y: 150, width: 80, height: 80 }
                ]
            },
            'fl2': {
                name: 'Второй Этаж (2nd Floor)',
                image: 'images/f2.PNG',
                areas: [
                    { name: 'Спальня 1', x: 360, y: 350, width: 85, height: 80 },
                    { name: 'Спальня 2', x: 270, y: 350, width: 85, height: 80 },
                    { name: 'Спальня 3', x: 183, y: 350, width: 80, height: 80 },
                    { name: 'Спальня 4', x: 90, y: 350, width: 85, height: 80 },
                    { name: 'Спальня 5', x: 10, y: 350, width: 80, height: 80 },
                    { name: 'Столовая', x: 770, y: 350, width: 160, height: 80 },
                    { name: 'Перекресток', x: 445, y: 220, width: 235, height: 80 },
                    { name: 'Класс 1', x: 330, y: 220, width: 75, height: 80 },
                    { name: 'Класс 2', x: 250, y: 255, width: 80, height: 40 },
                    { name: 'Класс 3', x: 250, y: 220, width: 80, height: 40 }
                ]
            },
            'fl3': {
                name: 'Первый Этаж (1st Floor)',
                image: 'images/f1.PNG',
                areas: [
                    { name: 'Холл', x: 330, y: 80, width: 235, height: 240 },
                    { name: 'Спортзал', x: 10, y: 220, width: 90, height: 92 },
                    { name: 'Бассейн', x: 105, y: 220, width: 80, height: 92 },
                    { name: 'Актовый Зал', x: 255, y: 220, width: 75, height: 92 },
                    { name: 'Унитазы', x: 565, y: 220, width: 71, height: 92 },
                    { name: 'Двор', x: 10, y: 320, width: 980, height: 370 },
                    { name: 'Могильник', x: 515, y: 320, width: 270, height: 145 }
                ]
            },
            'fl4': {
                name: 'Подвал (Basement)',
                image: 'images/downstairs.png',
                areas: [
                    { name: 'Большой Коридор', x: 20, y: 210, width: 970, height: 280 },
                    { name: 'Сердце', x: 25, y: 213, width: 110, height: 67 },
                    { name: 'Рентген', x: 830, y: 210, width: 160, height: 98 },
                    { name: 'Холодильник', x: 690, y: 210, width: 150, height: 98 },
                    { name: 'Склад Медико', x: 590, y: 371, width: 245, height: 112 }
                ]
            },
            'fl5': {
                name: 'Могильник: 1 этаж',
                image: 'images/hospital1.png',
                areas: [
                    { name: 'Процедурная', x: 340, y: 210, width: 520, height: 91 },
                    { name: 'Костелянша', x: 60, y: 379, width: 150, height: 112 },
                    { name: 'Перевязочная', x: 210, y: 379, width: 170, height: 112 },
                    { name: 'Кабинет ЛОРа', x: 380, y: 379, width: 150, height: 112 },
                    { name: 'Кабинет ЛФК', x: 530, y: 379, width: 185, height: 112 }
                ]
            },
            'fl6': {
                name: 'Могильник: 2 этаж',
                image: 'images/hospital2.png',
                areas: [
                    { name: 'Электро', x: 250, y: 147, width: 190, height: 126 },
                    { name: 'Манипуляционная', x: 440, y: 147, width: 175, height: 126 },
                    { name: 'Палата 1', x: 615, y: 147, width: 150, height: 126 },
                    { name: 'Палата 2', x: 760, y: 147, width: 150, height: 126 },
                    { name: 'Операционная', x: 85, y: 378, width: 360, height: 164 },
                    { name: 'Стерилизационная', x: 445, y: 378, width: 170, height: 164 },
                    { name: 'Палата 3', x: 615, y: 378, width: 150, height: 164 },
                    { name: 'Палата 4', x: 765, y: 378, width: 150, height: 164 }
                ]
            }
        };
        
        // UI state
        this.message = '';
        this.messageTimer = 0;
        this.hoveredArea = null;
        
        this.setupEventListeners();
        this.loadFloorImages();
    }
    
    loadFloorImages() {
        this.floorImages = {};
        Object.keys(this.floors).forEach(floorId => {
            const img = new Image();
            img.onload = () => {
                this.floorImages[floorId] = img;
            };
            img.src = this.floors[floorId].image;
        });
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Prevent default arrow key behavior
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
            
            // Toggle floor menu with M key
            if (e.code === 'KeyM') {
                this.showFloorMenu = !this.showFloorMenu;
            }
            
            // Floor selection with number keys
            if (e.code >= 'Digit1' && e.code <= 'Digit6') {
                const floorIndex = parseInt(e.code.replace('Digit', ''));
                const floorIds = Object.keys(this.floors);
                if (floorIndex <= floorIds.length) {
                    this.switchFloor(floorIds[floorIndex - 1]);
                    this.showFloorMenu = false;
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Mouse controls
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            this.checkAreaHover(mouseX, mouseY);
        });
        
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            this.handleClick(clickX, clickY);
        });
    }
    
    switchFloor(floorId) {
        if (this.floors[floorId]) {
            this.currentFloor = floorId;
            // Reset player position when switching floors
            this.player.x = 500;
            this.player.y = 350;
            this.showMessage(`Switched to ${this.floors[floorId].name}`, 120);
        }
    }
    
    checkAreaHover(mouseX, mouseY) {
        const currentFloorData = this.floors[this.currentFloor];
        this.hoveredArea = null;
        
        for (let area of currentFloorData.areas) {
            if (mouseX >= area.x && mouseX <= area.x + area.width &&
                mouseY >= area.y && mouseY <= area.y + area.height) {
                this.hoveredArea = area;
                break;
            }
        }
    }
    
    handleClick(x, y) {
        // Check if clicked on floor menu
        if (this.showFloorMenu) {
            const menuStartY = 100;
            const itemHeight = 40;
            const floorIds = Object.keys(this.floors);
            
            for (let i = 0; i < floorIds.length; i++) {
                const itemY = menuStartY + i * itemHeight;
                if (x >= 50 && x <= 400 && y >= itemY && y <= itemY + itemHeight) {
                    this.switchFloor(floorIds[i]);
                    this.showFloorMenu = false;
                    return;
                }
            }
        }
        
        // Check if clicked on an area
        if (this.hoveredArea) {
            this.showMessage(`Entering ${this.hoveredArea.name}... (Feature coming soon!)`, 120);
        }
    }
    
    start() {
        this.isRunning = true;
        this.gameLoop();
    }
    
    stop() {
        this.isRunning = false;
    }
    
    gameLoop() {
        if (!this.isRunning) return;
        
        this.update();
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Update player position based on input
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
            this.player.x = Math.max(this.player.size, this.player.x - this.player.speed);
        }
        if (this.keys['ArrowRight'] || this.keys['KeyD']) {
            this.player.x = Math.min(this.canvas.width - this.player.size, this.player.x + this.player.speed);
        }
        if (this.keys['ArrowUp'] || this.keys['KeyW']) {
            this.player.y = Math.max(this.player.size, this.player.y - this.player.speed);
        }
        if (this.keys['ArrowDown'] || this.keys['KeyS']) {
            this.player.y = Math.min(this.canvas.height - this.player.size, this.player.y + this.player.speed);
        }
        
        // Check area interactions
        this.checkAreaInteractions();
        
        // Update message timer
        if (this.messageTimer > 0) {
            this.messageTimer--;
        }
        
        // Handle ESC key to exit
        if (this.keys['Escape']) {
            this.exitGame();
        }
    }
    
    checkAreaInteractions() {
        const currentFloorData = this.floors[this.currentFloor];
        
        for (let area of currentFloorData.areas) {
            const centerX = area.x + area.width / 2;
            const centerY = area.y + area.height / 2;
            const distance = Math.sqrt(
                Math.pow(this.player.x - centerX, 2) + 
                Math.pow(this.player.y - centerY, 2)
            );
            
            if (distance < 50) {
                this.showMessage(`Press SPACE to enter ${area.name}`, 60);
                
                if (this.keys['Space']) {
                    this.enterArea(area.name);
                }
                break;
            }
        }
    }
    
    enterArea(areaName) {
        this.showMessage(`Entering ${areaName}... (Feature coming soon!)`, 120);
        
        // Add some visual feedback
        this.player.color = '#FFD700';
        setTimeout(() => {
            this.player.color = '#c9a96e';
        }, 500);
    }
    
    showMessage(text, duration = 60) {
        this.message = text;
        this.messageTimer = duration;
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#0d0d0d';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw floor map
        this.drawFloorMap();
        
        // Draw interactive areas
        this.drawAreas();
        
        // Draw player
        this.drawPlayer();
        
        // Draw UI
        this.drawUI();
        
        // Draw floor menu if active
        if (this.showFloorMenu) {
            this.drawFloorMenu();
        }
    }
    
    drawFloorMap() {
        const floorImage = this.floorImages[this.currentFloor];
        if (floorImage) {
            // Draw the floor map image scaled to fit canvas
            this.ctx.drawImage(floorImage, 0, 0, this.canvas.width, this.canvas.height);
            
            // Add dark overlay for better visibility
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    drawAreas() {
        const currentFloorData = this.floors[this.currentFloor];
        
        for (let area of currentFloorData.areas) {
            // Draw area outline
            this.ctx.strokeStyle = this.hoveredArea === area ? '#FFD700' : 'rgba(201, 169, 110, 0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(area.x, area.y, area.width, area.height);
            
            // Draw area fill
            this.ctx.fillStyle = this.hoveredArea === area ? 
                'rgba(255, 215, 0, 0.2)' : 'rgba(201, 169, 110, 0.1)';
            this.ctx.fillRect(area.x, area.y, area.width, area.height);
            
            // Draw area label
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                area.name, 
                area.x + area.width / 2, 
                area.y + area.height / 2
            );
        }
    }
    
    drawPlayer() {
        // Draw player shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.beginPath();
        this.ctx.arc(this.player.x, this.player.y + 2, this.player.size - 1, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw player
        this.ctx.fillStyle = this.player.color;
        this.ctx.beginPath();
        this.ctx.arc(this.player.x, this.player.y, this.player.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw player outline
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw direction indicator
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(this.player.x + 2, this.player.y - 2, 1, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawUI() {
        // Draw controls panel
        this.ctx.fillStyle = 'rgba(26, 26, 26, 0.9)';
        this.ctx.fillRect(10, 10, 250, 120);
        
        this.ctx.fillStyle = '#c9a96e';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Controls:', 20, 30);
        this.ctx.fillText('Arrow Keys / WASD: Move', 20, 50);
        this.ctx.fillText('Space: Interact with areas', 20, 70);
        this.ctx.fillText('M: Toggle floor menu', 20, 90);
        this.ctx.fillText('1-6: Quick floor switch', 20, 110);
        
        // Draw current floor indicator
        this.ctx.fillStyle = 'rgba(26, 26, 26, 0.9)';
        this.ctx.fillRect(this.canvas.width - 250, 10, 240, 50);
        
        this.ctx.fillStyle = '#c9a96e';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`Current Floor: ${this.floors[this.currentFloor].name}`, 
                         this.canvas.width - 20, 35);
        
        // Draw message
        if (this.messageTimer > 0) {
            this.ctx.fillStyle = 'rgba(26, 26, 26, 0.9)';
            this.ctx.fillRect(this.canvas.width / 2 - 200, this.canvas.height - 80, 400, 50);
            
            this.ctx.fillStyle = '#c9a96e';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.message, this.canvas.width / 2, this.canvas.height - 50);
        }
        
        // Draw exit button
        this.ctx.fillStyle = 'rgba(139, 0, 0, 0.8)';
        this.ctx.fillRect(this.canvas.width - 100, this.canvas.height - 50, 90, 40);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Exit (ESC)', this.canvas.width - 55, this.canvas.height - 25);
    }
    
    drawFloorMenu() {
        // Draw menu background
        this.ctx.fillStyle = 'rgba(26, 26, 26, 0.95)';
        this.ctx.fillRect(50, 50, 400, 350);
        
        this.ctx.strokeStyle = '#c9a96e';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(50, 50, 400, 350);
        
        // Draw menu title
        this.ctx.fillStyle = '#c9a96e';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Select Floor', 250, 80);
        
        // Draw floor options
        const floorIds = Object.keys(this.floors);
        const menuStartY = 100;
        const itemHeight = 40;
        
        floorIds.forEach((floorId, index) => {
            const itemY = menuStartY + index * itemHeight;
            const isCurrentFloor = floorId === this.currentFloor;
            
            // Draw item background
            this.ctx.fillStyle = isCurrentFloor ? 'rgba(201, 169, 110, 0.3)' : 'rgba(45, 45, 45, 0.5)';
            this.ctx.fillRect(60, itemY, 380, itemHeight - 5);
            
            // Draw item text
            this.ctx.fillStyle = isCurrentFloor ? '#FFD700' : '#e0e0e0';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`${index + 1}. ${this.floors[floorId].name}`, 70, itemY + 25);
        });
        
        // Draw instructions
        this.ctx.fillStyle = '#b0b0b0';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Click on a floor or press number keys (1-6)', 250, 380);
        this.ctx.fillText('Press M to close menu', 250, 395);
    }
    
    exitGame() {
        this.stop();
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.style.display = 'none';
        }
        document.body.style.overflow = 'auto';
    }
}

// Global enhanced game instance
let enhancedGrayHouseGame = null;

// Function to start the enhanced game
function startEnhancedGrayHouseGame() {
    // Create game container if it doesn't exist
    let gameContainer = document.querySelector('.enhanced-game-container');
    
    if (!gameContainer) {
        gameContainer = document.createElement('div');
        gameContainer.className = 'enhanced-game-container';
        gameContainer.innerHTML = `
            <div class="enhanced-game-overlay">
                <div class="enhanced-game-header">
                    <h2>The Gray House - Enhanced Floor Explorer</h2>
                    <button class="close-enhanced-game" onclick="closeEnhancedGame()">×</button>
                </div>
                <canvas id="enhancedGameCanvas"></canvas>
                <div class="enhanced-game-footer">
                    <p>Explore all floors of the Gray House. Use M to open floor menu, arrow keys to move, and Space to interact.</p>
                </div>
            </div>
        `;
        document.body.appendChild(gameContainer);
        
        // Add enhanced game styles
        const gameStyle = document.createElement('style');
        gameStyle.textContent = `
            .enhanced-game-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 3000;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(5px);
            }
            
            .enhanced-game-overlay {
                background: linear-gradient(135deg, #2d2d2d, #1a1a1a);
                border: 2px solid #c9a96e;
                border-radius: 10px;
                padding: 20px;
                text-align: center;
                max-width: 95%;
                max-height: 95%;
            }
            
            .enhanced-game-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .enhanced-game-header h2 {
                color: #c9a96e;
                font-family: 'Oswald', sans-serif;
                margin: 0;
            }
            
            .close-enhanced-game {
                background: none;
                border: none;
                color: #c9a96e;
                font-size: 24px;
                cursor: pointer;
                padding: 5px 10px;
            }
            
            .close-enhanced-game:hover {
                color: #d4b876;
            }
            
            #enhancedGameCanvas {
                border: 2px solid #444;
                border-radius: 5px;
                background: #0d0d0d;
                cursor: crosshair;
            }
            
            .enhanced-game-footer {
                margin-top: 15px;
                color: #b0b0b0;
                font-style: italic;
            }
        `;
        document.head.appendChild(gameStyle);
    }
    
    gameContainer.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Initialize enhanced game
    if (!enhancedGrayHouseGame) {
        enhancedGrayHouseGame = new EnhancedGrayHouseGame('enhancedGameCanvas');
    }
    
    enhancedGrayHouseGame.start();
}

// Function to close the enhanced game
function closeEnhancedGame() {
    if (enhancedGrayHouseGame) {
        enhancedGrayHouseGame.stop();
    }
    
    const gameContainer = document.querySelector('.enhanced-game-container');
    if (gameContainer) {
        gameContainer.style.display = 'none';
    }
    
    document.body.style.overflow = 'auto';
}