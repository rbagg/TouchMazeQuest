import { MazeCell, Position } from '../components/MazeDisplay';

export interface MazeConfig {
  width: number;
  height: number;
  difficulty: number; // 1-10
}

export function generateMaze(config: MazeConfig): MazeCell[][] {
  const { width, height, difficulty } = config;
  
  // Initialize maze with all walls
  const maze: MazeCell[][] = [];
  for (let y = 0; y < height; y++) {
    maze[y] = [];
    for (let x = 0; x < width; x++) {
      maze[y][x] = {
        x,
        y,
        isWall: true,
        isPath: false,
        isStart: x === 1 && y === 1,
        isGoal: x === width - 2 && y === height - 2,
        isVisible: true
      };
    }
  }

  // Set borders as walls (always)
  for (let x = 0; x < width; x++) {
    maze[0][x].isWall = true;
    maze[height - 1][x].isWall = true;
  }
  for (let y = 0; y < height; y++) {
    maze[y][0].isWall = true;
    maze[y][width - 1].isWall = true;
  }

  // Generate maze pattern based on difficulty
  generateByStyle(maze, width, height, difficulty);

  // Always ensure there's a guaranteed path from start to goal
  createGuaranteedPath(maze, width, height, { x: 1, y: 1 }, { x: width - 2, y: height - 2 });
  
  // Ensure start and goal are accessible
  maze[1][1].isPath = true;
  maze[1][1].isWall = false;
  maze[height - 2][width - 2].isPath = true;
  maze[height - 2][width - 2].isWall = false;

  return maze;
}

// Generate maze patterns based on level
function generateByStyle(maze: MazeCell[][], width: number, height: number, level: number) {
  if (level === 1) {
    generateStraightLine(maze, width, height);
  } else if (level === 2) {
    generateSimpleL(maze, width, height);
  } else if (level === 3) {
    generateSShape(maze, width, height);
  } else if (level === 4) {
    generateStaircase(maze, width, height);
  } else if (level === 5) {
    generateSpiral(maze, width, height);
  } else if (level === 6) {
    generateTraditionalMaze(maze, width, height);
  } else if (level === 7) {
    generateCirclePattern(maze, width, height);
  } else if (level === 8) {
    generateMultiRoom(maze, width, height);
  } else if (level === 9) {
    generatePlusPattern(maze, width, height);
  } else {
    generateComplexMaze(maze, width, height);
  }
}

// Level 1: Simple straight line
function generateStraightLine(maze: MazeCell[][], width: number, height: number) {
  const midY = Math.floor(height / 2);
  for (let x = 1; x < width - 1; x++) {
    maze[midY][x].isPath = true;
    maze[midY][x].isWall = false;
  }
}

// Level 2: Simple L-shape
function generateSimpleL(maze: MazeCell[][], width: number, height: number) {
  // Horizontal line from start
  for (let x = 1; x < width - 3; x++) {
    maze[1][x].isPath = true;
    maze[1][x].isWall = false;
  }
  
  // Vertical line down
  for (let y = 1; y < height - 1; y++) {
    maze[y][width - 3].isPath = true;
    maze[y][width - 3].isWall = false;
  }
  
  // Final horizontal to goal
  for (let x = width - 3; x < width - 1; x++) {
    maze[height - 2][x].isPath = true;
    maze[height - 2][x].isWall = false;
  }
}

// Level 3: S-shape
function generateSShape(maze: MazeCell[][], width: number, height: number) {
  const midY = Math.floor(height / 2);

  // Top horizontal
  for (let x = 1; x < width - 2; x++) {
    maze[1][x].isPath = true;
    maze[1][x].isWall = false;
  }
  
  // Right vertical down
  for (let y = 1; y <= midY; y++) {
    maze[y][width - 2].isPath = true;
    maze[y][width - 2].isWall = false;
  }
  
  // Middle horizontal left
  for (let x = 2; x < width - 1; x++) {
    maze[midY][x].isPath = true;
    maze[midY][x].isWall = false;
  }
  
  // Left vertical down
  for (let y = midY; y < height - 1; y++) {
    maze[y][2].isPath = true;
    maze[y][2].isWall = false;
  }
  
  // Bottom horizontal right to goal
  for (let x = 2; x < width - 1; x++) {
    maze[height - 2][x].isPath = true;
    maze[height - 2][x].isWall = false;
  }
}

// Level 4: Staircase pattern (fixed for horizontal/vertical only)
function generateStaircase(maze: MazeCell[][], width: number, height: number) {
  let x = 1, y = 1;
  const stepSize = 2;
  
  while (x < width - 2 && y < height - 2) {
    // Horizontal step
    for (let i = 0; i < stepSize && x < width - 2; i++) {
      maze[y][x].isPath = true;
      maze[y][x].isWall = false;
      x++;
    }
    
    // Vertical connector down
    maze[y + 1][x - 1].isPath = true;
    maze[y + 1][x - 1].isWall = false;
    y++;
    
    // Position for next step
    x = x - 1;
  }
  
  // Connect remaining path to goal
  while (x < width - 2) {
    maze[y][x].isPath = true;
    maze[y][x].isWall = false;
    x++;
  }
  
  while (y < height - 2) {
    maze[y][width - 2].isPath = true;
    maze[y][width - 2].isWall = false;
    y++;
  }
}

// Level 5: Spiral pattern
function generateSpiral(maze: MazeCell[][], width: number, height: number) {
  let minX = 1, maxX = width - 2;
  let minY = 1, maxY = height - 2;
  
  while (minX <= maxX && minY <= maxY) {
    // Top row
    for (let x = minX; x <= maxX; x++) {
      maze[minY][x].isPath = true;
      maze[minY][x].isWall = false;
    }
    minY++;
    
    // Right column
    for (let y = minY; y <= maxY; y++) {
      maze[y][maxX].isPath = true;
      maze[y][maxX].isWall = false;
    }
    maxX--;
    
    // Bottom row
    if (minY <= maxY) {
      for (let x = maxX; x >= minX; x--) {
        maze[maxY][x].isPath = true;
        maze[maxY][x].isWall = false;
      }
      maxY--;
    }
    
    // Left column
    if (minX <= maxX) {
      for (let y = maxY; y >= minY; y--) {
        maze[y][minX].isPath = true;
        maze[y][minX].isWall = false;
      }
      minX++;
    }
  }
}

// Level 6: Traditional maze
function generateTraditionalMaze(maze: MazeCell[][], width: number, height: number) {
  generateMazePath(maze, width, height, 0.6);
}

// Level 7: Rectangle loops pattern
function generateCirclePattern(maze: MazeCell[][], width: number, height: number) {
  // Create rectangular loops instead of circles
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);
  
  // Outer rectangle
  for (let x = 2; x < width - 2; x++) {
    maze[2][x].isPath = true;
    maze[2][x].isWall = false;
    maze[height - 3][x].isPath = true;
    maze[height - 3][x].isWall = false;
  }
  
  for (let y = 2; y < height - 2; y++) {
    maze[y][2].isPath = true;
    maze[y][2].isWall = false;
    maze[y][width - 3].isPath = true;
    maze[y][width - 3].isWall = false;
  }
  
  // Inner rectangle
  if (centerX > 3 && centerY > 2) {
    for (let x = centerX - 1; x <= centerX + 1; x++) {
      if (x >= 1 && x < width - 1) {
        maze[centerY - 1][x].isPath = true;
        maze[centerY - 1][x].isWall = false;
        maze[centerY + 1][x].isPath = true;
        maze[centerY + 1][x].isWall = false;
      }
    }
    
    for (let y = centerY - 1; y <= centerY + 1; y++) {
      if (y >= 1 && y < height - 1) {
        maze[y][centerX - 1].isPath = true;
        maze[y][centerX - 1].isWall = false;
        maze[y][centerX + 1].isPath = true;
        maze[y][centerX + 1].isWall = false;
      }
    }
  }
  
  // Connect with straight connectors
  maze[centerY][centerX].isPath = true;
  maze[centerY][centerX].isWall = false;
  
  // Horizontal connectors
  for (let x = 2; x <= centerX - 1; x++) {
    maze[centerY][x].isPath = true;
    maze[centerY][x].isWall = false;
  }
  for (let x = centerX + 1; x < width - 2; x++) {
    maze[centerY][x].isPath = true;
    maze[centerY][x].isWall = false;
  }
}

// Level 8: Multi-room maze
function generateMultiRoom(maze: MazeCell[][], width: number, height: number) {
  const midX = Math.floor(width / 2);
  const midY = Math.floor(height / 2);
  const roomSize = Math.floor(Math.min(width, height) / 3);
  
  // Create 4 rooms
  // Room 1 (top-left)
  for (let x = 1; x < 1 + roomSize; x++) {
    for (let y = 1; y < 1 + roomSize; y++) {
      maze[y][x].isPath = true;
      maze[y][x].isWall = false;
    }
  }
  
  // Room 2 (top-right)
  for (let x = width - 1 - roomSize; x < width - 1; x++) {
    for (let y = 1; y < 1 + roomSize; y++) {
      maze[y][x].isPath = true;
      maze[y][x].isWall = false;
    }
  }
  
  // Room 3 (bottom-left)
  for (let x = 1; x < 1 + roomSize; x++) {
    for (let y = height - 1 - roomSize; y < height - 1; y++) {
      maze[y][x].isPath = true;
      maze[y][x].isWall = false;
    }
  }
  
  // Room 4 (bottom-right)
  for (let x = width - 1 - roomSize; x < width - 1; x++) {
    for (let y = height - 1 - roomSize; y < height - 1; y++) {
      maze[y][x].isPath = true;
      maze[y][x].isWall = false;
    }
  }
  
  // Connect rooms with corridors
  // Horizontal corridor
  for (let x = 1; x < width - 1; x++) {
    maze[midY][x].isPath = true;
    maze[midY][x].isWall = false;
  }
  
  // Vertical corridor
  for (let y = 1; y < height - 1; y++) {
    maze[y][midX].isPath = true;
    maze[y][midX].isWall = false;
  }
}

// Level 9: Plus pattern with multiple paths
function generatePlusPattern(maze: MazeCell[][], width: number, height: number) {
  const midX = Math.floor(width / 2);
  const midY = Math.floor(height / 2);

  // Main cross
  for (let x = 1; x < width - 1; x++) {
    maze[midY][x].isPath = true;
    maze[midY][x].isWall = false;
  }
  
  for (let y = 1; y < height - 1; y++) {
    maze[y][midX].isPath = true;
    maze[y][midX].isWall = false;
  }
  
  // Secondary crosses
  const quarterX = Math.floor(width / 4);
  const quarterY = Math.floor(height / 4);
  const threeQuarterX = Math.floor(3 * width / 4);
  const threeQuarterY = Math.floor(3 * height / 4);
  
  // Smaller crosses in each quadrant
  for (let x = quarterX; x <= threeQuarterX; x++) {
    if (quarterY < height - 1) {
      maze[quarterY][x].isPath = true;
      maze[quarterY][x].isWall = false;
    }
    if (threeQuarterY < height - 1) {
      maze[threeQuarterY][x].isPath = true;
      maze[threeQuarterY][x].isWall = false;
    }
  }
  
  for (let y = quarterY; y <= threeQuarterY; y++) {
    if (quarterX < width - 1) {
      maze[y][quarterX].isPath = true;
      maze[y][quarterX].isWall = false;
    }
    if (threeQuarterX < width - 1) {
      maze[y][threeQuarterX].isPath = true;
      maze[y][threeQuarterX].isWall = false;
    }
  }
}

// Level 10+: Complex maze
function generateComplexMaze(maze: MazeCell[][], width: number, height: number) {
  generateMazePath(maze, width, height, 0.8);
  
  // Add some random openings
  for (let i = 0; i < Math.floor((width * height) / 20); i++) {
    const x = Math.floor(Math.random() * (width - 2)) + 1;
    const y = Math.floor(Math.random() * (height - 2)) + 1;
    maze[y][x].isPath = true;
    maze[y][x].isWall = false;
  }
  
  // Ensure there's always a path from start to goal
  createGuaranteedPath(maze, width, height, { x: 1, y: 1 }, { x: width - 2, y: height - 2 });
}

function generateMazePath(maze: MazeCell[][], width: number, height: number, complexity: number) {
  // Simple recursive backtracker algorithm
  const stack: Position[] = [];
  const visited = new Set<string>();
  
  const start = { x: 1, y: 1 };
  stack.push(start);
  visited.add(`${start.x},${start.y}`);
  
  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(current, visited, width, height);
    
    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      
      // Remove wall between current and next
      const wallX = (current.x + next.x) / 2;
      const wallY = (current.y + next.y) / 2;
      
      maze[current.y][current.x].isPath = true;
      maze[current.y][current.x].isWall = false;
      if (Number.isInteger(wallX) && Number.isInteger(wallY)) {
        maze[wallY][wallX].isPath = true;
        maze[wallY][wallX].isWall = false;
      }
      maze[next.y][next.x].isPath = true;
      maze[next.y][next.x].isWall = false;
      
      visited.add(`${next.x},${next.y}`);
      stack.push(next);
    } else {
      stack.pop();
    }
  }
}

function getUnvisitedNeighbors(pos: Position, visited: Set<string>, width: number, height: number): Position[] {
  const neighbors: Position[] = [];
  const directions = [
    { x: 0, y: -2 }, // Up
    { x: 2, y: 0 },  // Right
    { x: 0, y: 2 },  // Down
    { x: -2, y: 0 }  // Left
  ];
  
  for (const dir of directions) {
    const newX = pos.x + dir.x;
    const newY = pos.y + dir.y;
    
    if (newX >= 1 && newX < width - 1 && newY >= 1 && newY < height - 1) {
      if (!visited.has(`${newX},${newY}`)) {
        neighbors.push({ x: newX, y: newY });
      }
    }
  }
  
  return neighbors;
}

function createGuaranteedPath(maze: MazeCell[][], width: number, height: number, start: Position, goal: Position) {
  // Create a simple L-shaped path from start to goal
  let x = start.x;
  let y = start.y;
  
  // Mark start
  maze[y][x].isPath = true;
  maze[y][x].isWall = false;
  
  // Go right first
  while (x < goal.x) {
    x++;
    maze[y][x].isPath = true;
    maze[y][x].isWall = false;
  }
  
  // Then go down/up
  while (y < goal.y) {
    y++;
    maze[y][x].isPath = true;
    maze[y][x].isWall = false;
  }
  while (y > goal.y) {
    y--;
    maze[y][x].isPath = true;
    maze[y][x].isWall = false;
  }
  
  // Ensure goal is marked
  maze[goal.y][goal.x].isPath = true;
  maze[goal.y][goal.x].isWall = false;
}

export function getMazeForLevel(level: number): MazeCell[][] {
  const config: MazeConfig = {
    width: 10,
    height: 8,
    difficulty: level
  };
  
  return generateMaze(config);
}