import { MazeCell } from "@/components/MazeDisplay";

export interface MazeConfig {
  width: number;
  height: number;
  difficulty: number; // 1-10
}

export function generateMaze(config: MazeConfig): MazeCell[][] {
  const { width, height, difficulty } = config;

  // Initialize maze with all walls
  const maze: MazeCell[][] = Array(height).fill(null).map((_, y) =>
    Array(width).fill(null).map((_, x) => ({
      x,
      y,
      isWall: true,
      isPath: false,
      isStart: false,
      isGoal: false,
    }))
  );

  // Generate maze based on difficulty level with progressive styles
  generateByStyle(maze, width, height, difficulty);

  // Set start position (top-left area)
  const startX = 1;
  const startY = 1;
  maze[startY][startX].isStart = true;
  maze[startY][startX].isPath = true;
  maze[startY][startX].isWall = false;

  // Set goal position (bottom-right area)
  const goalX = width - 2;
  const goalY = height - 2;
  maze[goalY][goalX].isGoal = true;
  maze[goalY][goalX].isPath = true;
  maze[goalY][goalX].isWall = false;

  // Ensure there's a valid path from start to goal
  if (!hasValidPath(maze, startX, startY, goalX, goalY, width, height)) {
    // Create a guaranteed path if none exists
    createGuaranteedPath(maze, startX, startY, goalX, goalY, width, height);
  }

  // Clean up large clumps to prevent confusing blob areas
  cleanUpClumps(maze, width, height);

  return maze;
}

// NEW: Ultra simple path for level 1
function generateSimplestPath(maze: MazeCell[][], width: number, height: number) {
  const startX = 1, startY = 1;
  const goalX = width - 2, goalY = height - 2;

  // Just a straight line across and down - super simple
  for (let x = startX; x <= goalX; x++) {
    maze[startY][x].isPath = true;
    maze[startY][x].isWall = false;
  }
  for (let y = startY; y <= goalY; y++) {
    maze[y][goalX].isPath = true;
    maze[y][goalX].isWall = false;
  }
}

// NEW: Simple linear paths for level 2
function generateLinearPath(maze: MazeCell[][], width: number, height: number) {
  const startX = 1, startY = 1;
  const goalX = width - 2, goalY = height - 2;

  // Create L-shaped path with one alternative route
  // Main path: right then down
  for (let x = startX; x <= goalX; x++) {
    maze[startY][x].isPath = true;
    maze[startY][x].isWall = false;
  }
  for (let y = startY; y <= goalY; y++) {
    maze[y][goalX].isPath = true;
    maze[y][goalX].isWall = false;
  }

  // Alternative path: down then right (creates choice)
  const midX = Math.floor(width / 2);
  for (let y = startY; y <= goalY; y++) {
    maze[y][startX].isPath = true;
    maze[y][startX].isWall = false;
  }
  for (let x = startX; x <= midX; x++) {
    maze[goalY][x].isPath = true;
    maze[goalY][x].isWall = false;
  }
}

// NEW: Branching paths for level 3
function generateBranchingPath(maze: MazeCell[][], width: number, height: number) {
  const startX = 1, startY = 1;
  const goalX = width - 2, goalY = height - 2;
  const midX = Math.floor(width / 2);
  const midY = Math.floor(height / 2);

  // Path 1: Along edges (like linear but complete)
  for (let x = startX; x <= goalX; x++) {
    maze[startY][x].isPath = true;
    maze[startY][x].isWall = false;
  }
  for (let y = startY; y <= goalY; y++) {
    maze[y][goalX].isPath = true;
    maze[y][goalX].isWall = false;
  }

  // Path 2: Through middle (creates branching)
  for (let x = startX; x <= midX; x++) {
    maze[midY][x].isPath = true;
    maze[midY][x].isWall = false;
  }
  for (let y = midY; y <= goalY; y++) {
    maze[y][midX].isPath = true;
    maze[y][midX].isWall = false;
  }

  // Path 3: Bottom route for variety
  for (let y = startY; y <= goalY; y++) {
    maze[y][startX].isPath = true;
    maze[y][startX].isWall = false;
  }
  for (let x = startX; x <= midX; x++) {
    maze[goalY][x].isPath = true;
    maze[goalY][x].isWall = false;
  }
}

// NEW: Spiral path for level 4
function generateSpiralPath(maze: MazeCell[][], width: number, height: number) {
  const startX = 1, startY = 1;
  const goalX = width - 2, goalY = height - 2;

  // Create a simple spiral path - not filling everything
  let currentX = startX;
  let currentY = startY;
  
  // Go right across the top
  while (currentX < goalX) {
    maze[currentY][currentX].isPath = true;
    maze[currentY][currentX].isWall = false;
    currentX++;
  }
  
  // Go down the right side
  while (currentY < goalY) {
    maze[currentY][currentX].isPath = true;
    maze[currentY][currentX].isWall = false;
    currentY++;
  }
  
  // Go left across the bottom
  while (currentX > startX + 2) {
    maze[currentY][currentX].isPath = true;
    maze[currentY][currentX].isWall = false;
    currentX--;
  }
  
  // Go up the left side
  while (currentY > startY + 2) {
    maze[currentY][currentX].isPath = true;
    maze[currentY][currentX].isWall = false;
    currentY--;
  }
  
  // Create inner spiral
  currentX++;
  while (currentX < goalX - 1) {
    maze[currentY][currentX].isPath = true;
    maze[currentY][currentX].isWall = false;
    currentX++;
  }
  
  while (currentY < goalY - 1) {
    maze[currentY][currentX].isPath = true;
    maze[currentY][currentX].isWall = false;
    currentY++;
  }
  
  // Add some connecting paths for variety
  const midY = Math.floor((startY + goalY) / 2);
  for (let x = startX + 2; x < goalX - 1; x++) {
    maze[midY][x].isPath = true;
    maze[midY][x].isWall = false;
  }
}

// NEW: ZigZag path for level 5
function generateZigZagPath(maze: MazeCell[][], width: number, height: number) {
  const startX = 1, startY = 1;
  const goalX = width - 2, goalY = height - 2;

  // Create a zigzag pattern
  let currentX = startX;
  let currentY = startY;
  let goingRight = true;

  while (currentY <= goalY) {
    // Make current cell a path
    maze[currentY][currentX].isPath = true;
    maze[currentY][currentX].isWall = false;

    if (goingRight) {
      if (currentX < goalX) {
        currentX++;
      } else {
        currentY++;
        goingRight = false;
      }
    } else {
      if (currentX > startX) {
        currentX--;
      } else {
        currentY++;
        goingRight = true;
      }
    }
  }

  // Ensure goal is reachable
  maze[goalY][goalX].isPath = true;
  maze[goalY][goalX].isWall = false;
}

// NEW: Progressive maze style generation with faster progression
function generateByStyle(maze: MazeCell[][], width: number, height: number, level: number) {
  if (level === 1) {
    generateSimplestPath(maze, width, height);
  } else if (level === 2) {
    generateLinearPath(maze, width, height);
  } else if (level === 3) {
    generateBranchingPath(maze, width, height);
  } else if (level === 4) {
    generateSpiralPath(maze, width, height);
  } else if (level === 5) {
    generateZigZagPath(maze, width, height);
  } else {
    // Complex mazes with increasing difficulty
    generateMazePath(maze, width, height, Math.min((level - 4) * 0.25, 1.0));
  }
}

function cleanUpClumps(maze: MazeCell[][], width: number, height: number) {
  // Look for 2x2 wall blocks and randomly open one cell
  for (let y = 1; y < height - 2; y++) {
    for (let x = 1; x < width - 2; x++) {
      const isClump = maze[y][x].isWall && 
                     maze[y][x+1].isWall && 
                     maze[y+1][x].isWall && 
                     maze[y+1][x+1].isWall;
      
      if (isClump && Math.random() < 0.3) {
        // Randomly pick one cell to open
        const choice = Math.floor(Math.random() * 4);
        const positions = [[y, x], [y, x+1], [y+1, x], [y+1, x+1]];
        const [py, px] = positions[choice];
        maze[py][px].isWall = false;
        maze[py][px].isPath = true;
      }
    }
  }
}

function hasValidPath(
  maze: MazeCell[][],
  startX: number,
  startY: number,
  goalX: number,
  goalY: number,
  width: number,
  height: number
): boolean {
  const visited = new Set<string>();
  const queue = [{x: startX, y: startY}];
  
  while (queue.length > 0) {
    const {x, y} = queue.shift()!;
    const key = `${x},${y}`;
    
    if (visited.has(key)) continue;
    visited.add(key);
    
    if (x === goalX && y === goalY) return true;
    
    // Check adjacent cells
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      
      if (nx >= 0 && nx < width && ny >= 0 && ny < height && 
          !maze[ny][nx].isWall && !visited.has(`${nx},${ny}`)) {
        queue.push({x: nx, y: ny});
      }
    }
  }
  
  return false;
}

function createGuaranteedPath(
  maze: MazeCell[][],
  startX: number,
  startY: number,
  goalX: number,
  goalY: number,
  width: number,
  height: number
) {
  // Simple path: right then down
  for (let x = startX; x <= goalX; x++) {
    maze[startY][x].isPath = true;
    maze[startY][x].isWall = false;
  }
  for (let y = startY; y <= goalY; y++) {
    maze[y][goalX].isPath = true;
    maze[y][goalX].isWall = false;
  }
}

function getUnvisitedNeighbors(
  x: number,
  y: number,
  maze: MazeCell[][],
  visited: Set<string>,
  width: number,
  height: number
): Array<{x: number, y: number}> {
  const neighbors = [];
  const directions = [[0, 2], [2, 0], [0, -2], [-2, 0]]; // Skip one cell to maintain walls

  for (const [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;

    if (nx >= 1 && nx < width - 1 && ny >= 1 && ny < height - 1 && 
        !visited.has(`${nx},${ny}`)) {
      neighbors.push({x: nx, y: ny});
    }
  }

  return neighbors;
}

function generateMazePath(maze: MazeCell[][], width: number, height: number, complexity: number) {
  const visited = new Set<string>();
  const stack = [{x: 1, y: 1}];
  
  visited.add('1,1');
  maze[1][1].isPath = true;
  maze[1][1].isWall = false;

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(current.x, current.y, maze, visited, width, height);

    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      
      // Carve path to next cell
      const midX = current.x + (next.x - current.x) / 2;
      const midY = current.y + (next.y - current.y) / 2;
      
      maze[midY][midX].isPath = true;
      maze[midY][midX].isWall = false;
      maze[next.y][next.x].isPath = true;
      maze[next.y][next.x].isWall = false;
      
      visited.add(`${next.x},${next.y}`);
      stack.push(next);
    } else {
      stack.pop();
    }
  }

  // Add some dead ends and extra paths based on complexity
  addDeadEnds(maze, width, height, complexity);
  addExtraPaths(maze, width, height, Math.floor(complexity * 10));
}

function addDeadEnds(maze: MazeCell[][], width: number, height: number, complexity: number) {
  const deadEndCount = Math.floor(complexity * 5);
  
  for (let i = 0; i < deadEndCount; i++) {
    const x = 1 + Math.floor(Math.random() * (width - 2));
    const y = 1 + Math.floor(Math.random() * (height - 2));
    
    if (maze[y][x].isWall) {
      maze[y][x].isPath = true;
      maze[y][x].isWall = false;
    }
  }
}

function addExtraPaths(maze: MazeCell[][], width: number, height: number, difficulty: number) {
  const extraPaths = Math.min(difficulty, 8);
  
  for (let i = 0; i < extraPaths; i++) {
    const x = 1 + Math.floor(Math.random() * (width - 2));
    const y = 1 + Math.floor(Math.random() * (height - 2));
    
    if (maze[y][x].isWall) {
      // Check if opening this creates a useful path
      const adjacentPaths = [
        maze[y-1]?.[x]?.isPath,
        maze[y+1]?.[x]?.isPath,
        maze[y]?.[x-1]?.isPath,
        maze[y]?.[x+1]?.isPath
      ].filter(Boolean).length;
      
      if (adjacentPaths >= 1) {
        maze[y][x].isPath = true;
        maze[y][x].isWall = false;
      }
    }
  }
}

function addRandomOpenings(maze: MazeCell[][], width: number, height: number, complexity: number) {
  const openings = Math.floor(complexity * 3);
  
  for (let i = 0; i < openings; i++) {
    const x = 1 + Math.floor(Math.random() * (width - 2));
    const y = 1 + Math.floor(Math.random() * (height - 2));
    
    if (maze[y][x].isWall) {
      maze[y][x].isPath = true;
      maze[y][x].isWall = false;
    }
  }
}

export function getMazeForLevel(level: number): MazeCell[][] {
  const baseSize = 9;
  const maxSize = 17;

  // Create much larger and more complex mazes
  const size = Math.min(baseSize + level, maxSize);

  return generateMaze({
    width: size,
    height: size,
    difficulty: Math.min(level, 10)
  });
}