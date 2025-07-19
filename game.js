// Simple 2D Hallway Game for The Gray House
class GrayHouseGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // Game state
        this.isRunning = false;
        this.keys = {};
        
        // Player properties
        this.player = {
            x: 50,
            y: this.canvas.height / 2,
            size: 8,
            speed: 3,
            color: '#c9a96e'
        };
        
        // Hallway properties
        this.hallway = {
            width: this.canvas.width,
            height: 200,
            wallThickness: 20,
            y: (this.canvas.height - 200) / 2
        };
        
        // Doors and interactive elements
        this.doors = [
            { x: 200, y: this.hallway.y, width: 15, height: 60, color: '#8B4513', label: 'Dormitory' },
            { x: 400, y: this.hallway.y, width: 15, height: 60, color: '#654321', label: 'Attic' },
            { x: 600, y: this.hallway.y, width: 15, height: 60, color: '#4A4A4A', label: 'Sepulcher' },
            { x: 200, y: this.hallway.y + this.hallway.height - 60, width: 15, height: 60, color: '#2F4F2F', label: 'Common Room' },
            { x: 400, y: this.hallway.y + this.hallway.height - 60, width: 15, height: 60, color: '#483D8B', label: 'Library' },
            { x: 600, y: this.hallway.y + this.hallway.height - 60, width: 15, height: 60, color: '#8B0000', label: 'Counselor Office' }
        ];
        
        // Lighting effects
        this.lights = [
            { x: 150, y: this.hallway.y + this.hallway.height / 2, radius: 80, intensity: 0.3 },
            { x: 350, y: this.hallway.y + this.hallway.height / 2, radius: 80, intensity: 0.3 },
            { x: 550, y: this.hallway.y + this.hallway.height / 2, radius: 80, intensity: 0.3 },
            { x: 750, y: this.hallway.y + this.hallway.height / 2, radius: 80, intensity: 0.3 }
        ];
        
        // Game messages
        this.message = '';
        this.messageTimer = 0;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Prevent default arrow key behavior
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Canvas click for interaction
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            this.handleClick(clickX, clickY);
        });
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
            this.player.y = Math.max(this.hallway.y + this.hallway.wallThickness + this.player.size, 
                                   this.player.y - this.player.speed);
        }
        if (this.keys['ArrowDown'] || this.keys['KeyS']) {
            this.player.y = Math.min(this.hallway.y + this.hallway.height - this.hallway.wallThickness - this.player.size, 
                                   this.player.y + this.player.speed);
        }
        
        // Check door interactions
        this.checkDoorInteractions();
        
        // Update message timer
        if (this.messageTimer > 0) {
            this.messageTimer--;
        }
    }
    
    checkDoorInteractions() {
        for (let door of this.doors) {
            const distance = Math.sqrt(
                Math.pow(this.player.x - (door.x + door.width / 2), 2) + 
                Math.pow(this.player.y - (door.y + door.height / 2), 2)
            );
            
            if (distance < 30) {
                this.showMessage(`Press SPACE to enter ${door.label}`, 60);
                
                if (this.keys['Space']) {
                    this.enterRoom(door.label);
                }
                break;
            }
        }
    }
    
    enterRoom(roomName) {
        this.showMessage(`Entering ${roomName}... (Feature coming soon!)`, 120);
        
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
    
    handleClick(x, y) {
        // Check if clicked on a door
        for (let door of this.doors) {
            if (x >= door.x && x <= door.x + door.width && 
                y >= door.y && y <= door.y + door.height) {
                this.enterRoom(door.label);
                break;
            }
        }
    }
    
    render() {
        // Clear canvas with dark background
        this.ctx.fillStyle = '#0d0d0d';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw lighting effects first
        this.drawLighting();
        
        // Draw hallway walls
        this.drawHallway();
        
        // Draw doors
        this.drawDoors();
        
        // Draw player
        this.drawPlayer();
        
        // Draw UI
        this.drawUI();
    }
    
    drawLighting() {
        for (let light of this.lights) {
            const gradient = this.ctx.createRadialGradient(
                light.x, light.y, 0,
                light.x, light.y, light.radius
            );
            gradient.addColorStop(0, `rgba(201, 169, 110, ${light.intensity})`);
            gradient.addColorStop(1, 'rgba(201, 169, 110, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(
                light.x - light.radius, light.y - light.radius,
                light.radius * 2, light.radius * 2
            );
        }
    }
    
    drawHallway() {
        // Draw floor
        this.ctx.fillStyle = '#2d2d2d';
        this.ctx.fillRect(0, this.hallway.y + this.hallway.wallThickness, 
                         this.canvas.width, this.hallway.height - this.hallway.wallThickness * 2);
        
        // Draw top wall
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, this.hallway.y, this.canvas.width, this.hallway.wallThickness);
        
        // Draw bottom wall
        this.ctx.fillRect(0, this.hallway.y + this.hallway.height - this.hallway.wallThickness, 
                         this.canvas.width, this.hallway.wallThickness);
        
        // Draw wall details (brick pattern)
        this.ctx.strokeStyle = '#444';
        this.ctx.lineWidth = 1;
        
        // Horizontal lines
        for (let y = this.hallway.y; y <= this.hallway.y + this.hallway.wallThickness; y += 5) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        for (let y = this.hallway.y + this.hallway.height - this.hallway.wallThickness; 
             y <= this.hallway.y + this.hallway.height; y += 5) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        // Vertical lines
        for (let x = 0; x <= this.canvas.width; x += 20) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.hallway.y);
            this.ctx.lineTo(x, this.hallway.y + this.hallway.wallThickness);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.hallway.y + this.hallway.height - this.hallway.wallThickness);
            this.ctx.lineTo(x, this.hallway.y + this.hallway.height);
            this.ctx.stroke();
        }
    }
    
    drawDoors() {
        for (let door of this.doors) {
            // Draw door
            this.ctx.fillStyle = door.color;
            this.ctx.fillRect(door.x, door.y, door.width, door.height);
            
            // Draw door frame
            this.ctx.strokeStyle = '#c9a96e';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(door.x, door.y, door.width, door.height);
            
            // Draw door handle
            this.ctx.fillStyle = '#c9a96e';
            this.ctx.beginPath();
            this.ctx.arc(door.x + door.width - 4, door.y + door.height / 2, 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw door label
            this.ctx.fillStyle = '#e0e0e0';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            
            const labelX = door.x + door.width / 2;
            const labelY = door.y - 5;
            this.ctx.fillText(door.label, labelX, labelY);
        }
    }
    
    drawPlayer() {
        // Draw player shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
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
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Draw direction indicator
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(this.player.x + 2, this.player.y - 2, 1, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawUI() {
        // Draw controls
        this.ctx.fillStyle = 'rgba(26, 26, 26, 0.8)';
        this.ctx.fillRect(10, 10, 200, 80);
        
        this.ctx.fillStyle = '#c9a96e';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Controls:', 20, 30);
        this.ctx.fillText('Arrow Keys / WASD: Move', 20, 50);
        this.ctx.fillText('Space: Interact with doors', 20, 70);
        
        // Draw message
        if (this.messageTimer > 0) {
            this.ctx.fillStyle = 'rgba(26, 26, 26, 0.9)';
            this.ctx.fillRect(this.canvas.width / 2 - 150, this.canvas.height - 60, 300, 40);
            
            this.ctx.fillStyle = '#c9a96e';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.message, this.canvas.width / 2, this.canvas.height - 35);
        }
        
        // Draw exit button
        this.ctx.fillStyle = 'rgba(139, 0, 0, 0.8)';
        this.ctx.fillRect(this.canvas.width - 80, 10, 70, 30);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Exit (ESC)', this.canvas.width - 45, 30);
        
        // Handle ESC key to exit
        if (this.keys['Escape']) {
            this.exitGame();
        }
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

// Global game instance
let grayHouseGame = null;

// Function to start the game
function startGrayHouseGame() {
    // Create game container if it doesn't exist
    let gameContainer = document.querySelector('.game-container');
    
    if (!gameContainer) {
        gameContainer = document.createElement('div');
        gameContainer.className = 'game-container';
        gameContainer.innerHTML = `
            <div class="game-overlay">
                <div class="game-header">
                    <h2>The Gray House - Hallway Explorer</h2>
                    <button class="close-game" onclick="closeGame()">×</button>
                </div>
                <canvas id="gameCanvas"></canvas>
                <div class="game-footer">
                    <p>Navigate the mysterious hallways of the Gray House. Approach doors to interact with them.</p>
                </div>
            </div>
        `;
        document.body.appendChild(gameContainer);
        
        // Add game styles
        const gameStyle = document.createElement('style');
        gameStyle.textContent = `
            .game-container {
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
            
            .game-overlay {
                background: linear-gradient(135deg, #2d2d2d, #1a1a1a);
                border: 2px solid #c9a96e;
                border-radius: 10px;
                padding: 20px;
                text-align: center;
                max-width: 90%;
                max-height: 90%;
            }
            
            .game-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .game-header h2 {
                color: #c9a96e;
                font-family: 'Oswald', sans-serif;
                margin: 0;
            }
            
            .close-game {
                background: none;
                border: none;
                color: #c9a96e;
                font-size: 24px;
                cursor: pointer;
                padding: 5px 10px;
            }
            
            .close-game:hover {
                color: #d4b876;
            }
            
            #gameCanvas {
                border: 2px solid #444;
                border-radius: 5px;
                background: #0d0d0d;
            }
            
            .game-footer {
                margin-top: 15px;
                color: #b0b0b0;
                font-style: italic;
            }
        `;
        document.head.appendChild(gameStyle);
    }
    
    gameContainer.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Initialize game
    if (!grayHouseGame) {
        grayHouseGame = new GrayHouseGame('gameCanvas');
    }
    
    grayHouseGame.start();
}

// Function to close the game
function closeGame() {
    if (grayHouseGame) {
        grayHouseGame.stop();
    }
    
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
        gameContainer.style.display = 'none';
    }
    
    document.body.style.overflow = 'auto';
}