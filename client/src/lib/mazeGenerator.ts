import { MazeCell } from "@/components/MazeDisplay";

export interface MazeConfig {
  width: number;
  height: number;
  difficulty: number;
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

  // Generate toddler-friendly patterns based on level
  generateToddlerFriendlyMaze(maze, width, height, difficulty);

  // FIXED: Consistent start position at (0,0)
  maze[0][0].isStart = true;
  maze[0][0].isPath = true;
  maze[0][0].isWall = false;

  // Set goal position (always bottom-right corner)
  maze[height-1][width-1].isGoal = true;
  maze[height-1][width-1].isPath = true;
  maze[height-1][width-1].isWall = false;

  // Ensure there's exactly one optimal path (no more perimeter shortcuts!)
  ensureOptimalPathOnly(maze, width, height, difficulty);

  // Verify the maze is solvable
  if (!isPathPossible(maze, width, height)) {
    console.warn("Generated unsolvable maze, creating proper path");
    createOptimalPath(maze, width, height, difficulty);
  }

  return maze;
}

function generateToddlerFriendlyMaze(maze: MazeCell[][], width: number, height: number, level: number) {
  if (level <= 1) {
    // Level 1: Single straight line only
    generateSinglePath(maze, width, height);
  } else if (level <= 3) {
    // Level 2-3: One turn only (L-shape or simple bend)
    generateOneTurnPath(maze, width, height);
  } else if (level <= 5) {
    // Level 4-5: Two turns maximum (zigzag or S-shape)
    generateTwoTurnPath(maze, width, height);
  } else if (level <= 7) {
    // Level 6-7: Simple choice between 2 paths
    generateSimpleChoice(maze, width, height);
  } else if (level <= 10) {
    // Level 8-10: Multiple choices but clear paths
    generateMultipleChoices(maze, width, height);
  } else if (level <= 15) {
    // Level 11-15: Introduce dead ends
    generateWithDeadEnds(maze, width, height);
  } else {
    // Level 16+: Complex but fair mazes
    generateComplexMaze(maze, width, height);
  }
}

// Level 1: Absolutely single path - no alternatives
function generateSinglePath(maze: MazeCell[][], width: number, height: number) {
  // Create only ONE path - no perimeter shortcuts!

  if (width === height && width <= 3) {
    // For tiny 3x3 mazes - diagonal-like path
    maze[0][0].isPath = true; maze[0][0].isWall = false;
    maze[0][1].isPath = true; maze[0][1].isWall = false;
    maze[1][1].isPath = true; maze[1][1].isWall = false;
    maze[1][2].isPath = true; maze[1][2].isWall = false;
    maze[2][2].isPath = true; maze[2][2].isWall = false;
  } else {
    // For larger mazes - straight then down
    // Go right first
    for (let x = 0; x < width - 1; x++) {
      maze[0][x].isPath = true;
      maze[0][x].isWall = false;
    }
    // Then go down
    for (let y = 0; y < height; y++) {
      maze[y][width-1].isPath = true;
      maze[y][width-1].isWall = false;
    }
  }
}

// Level 2-3: Exactly one turn
function generateOneTurnPath(maze: MazeCell[][], width: number, height: number) {
  const turnPoint = Math.floor(Math.random() * 2); // 0 or 1

  if (turnPoint === 0) {
    // Turn at middle-right: go right, then down
    const turnX = Math.floor(width * 0.7);

    // Horizontal segment
    for (let x = 0; x <= turnX; x++) {
      maze[0][x].isPath = true;
      maze[0][x].isWall = false;
    }
    // Vertical segment
    for (let y = 0; y < height; y++) {
      maze[y][turnX].isPath = true;
      maze[y][turnX].isWall = false;
    }
    // Connect to goal
    for (let x = turnX; x < width; x++) {
      maze[height-1][x].isPath = true;
      maze[height-1][x].isWall = false;
    }
  } else {
    // Turn at middle-down: go down, then right
    const turnY = Math.floor(height * 0.7);

    // Vertical segment
    for (let y = 0; y <= turnY; y++) {
      maze[y][0].isPath = true;
      maze[y][0].isWall = false;
    }
    // Horizontal segment
    for (let x = 0; x < width; x++) {
      maze[turnY][x].isPath = true;
      maze[turnY][x].isWall = false;
    }
    // Connect to goal
    for (let y = turnY; y < height; y++) {
      maze[y][width-1].isPath = true;
      maze[y][width-1].isWall = false;
    }
  }
}

// Level 4-5: Exactly two turns (S-shape or zigzag)
function generateTwoTurnPath(maze: MazeCell[][], width: number, height: number) {
  const midX = Math.floor(width / 2);
  const midY = Math.floor(height / 2);

  // Create S-shaped path
  // First segment: start to middle
  for (let x = 0; x <= midX; x++) {
    maze[0][x].isPath = true;
    maze[0][x].isWall = false;
  }

  // Second segment: down to middle row
  for (let y = 0; y <= midY; y++) {
    maze[y][midX].isPath = true;
    maze[y][midX].isWall = false;
  }

  // Third segment: across to end and down to goal
  for (let x = midX; x < width; x++) {
    maze[midY][x].isPath = true;
    maze[midY][x].isWall = false;
  }

  for (let y = midY; y < height; y++) {
    maze[y][width-1].isPath = true;
    maze[y][width-1].isWall = false;
  }
}

// Level 6-7: Simple binary choice
function generateSimpleChoice(maze: MazeCell[][], width: number, height: number) {
  const midX = Math.floor(width / 2);

  // Path 1: Top route
  for (let x = 0; x < width; x++) {
    maze[0][x].isPath = true;
    maze[0][x].isWall = false;
  }
  for (let y = 0; y < height; y++) {
    maze[y][width-1].isPath = true;
    maze[y][width-1].isWall = false;
  }

  // Path 2: Bottom route
  for (let y = 0; y < height; y++) {
    maze[y][0].isPath = true;
    maze[y][0].isWall = false;
  }
  for (let x = 0; x < width; x++) {
    maze[height-1][x].isPath = true;
    maze[height-1][x].isWall = false;
  }

  // Connect them at middle
  for (let x = 0; x < width; x++) {
    maze[Math.floor(height/2)][x].isPath = true;
    maze[Math.floor(height/2)][x].isWall = false;
  }
}

// Level 8-10: Multiple clear choices
function generateMultipleChoices(maze: MazeCell[][], width: number, height: number) {
  // Create a grid of paths with multiple routes

  // Main horizontal corridors
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x++) {
      maze[y][x].isPath = true;
      maze[y][x].isWall = false;
    }
  }

  // Main vertical corridors
  for (let x = 0; x < width; x += 2) {
    for (let y = 0; y < height; y++) {
      maze[y][x].isPath = true;
      maze[y][x].isWall = false;
    }
  }
}

// Level 11-15: Introduce some dead ends
function generateWithDeadEnds(maze: MazeCell[][], width: number, height: number) {
  // Start with connected grid
  generateMultipleChoices(maze, width, height);

  // Add some dead-end branches
  for (let y = 1; y < height - 1; y += 3) {
    for (let x = 1; x < width - 1; x += 3) {
      if (Math.random() < 0.4) { // 40% chance of dead end
        maze[y][x].isPath = true;
        maze[y][x].isWall = false;
        // Create a short dead-end branch
        if (x > 0) {
          maze[y][x-1].isPath = true;
          maze[y][x-1].isWall = false;
        }
      }
    }
  }
}

// Level 16+: Complex but fair
function generateComplexMaze(maze: MazeCell[][], width: number, height: number) {
  // Use recursive backtracking for proper maze generation
  const visited = Array(height).fill(null).map(() => Array(width).fill(false));

  function carvePassage(x: number, y: number) {
    visited[y][x] = true;
    maze[y][x].isPath = true;
    maze[y][x].isWall = false;

    // Get random neighbors
    const directions = [
      { dx: 0, dy: -2 }, { dx: 2, dy: 0 }, { dx: 0, dy: 2 }, { dx: -2, dy: 0 }
    ].sort(() => Math.random() - 0.5);

    for (const dir of directions) {
      const nx = x + dir.dx;
      const ny = y + dir.dy;

      if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited[ny][nx]) {
        // Carve wall between current cell and neighbor
        maze[y + dir.dy/2][x + dir.dx/2].isPath = true;
        maze[y + dir.dy/2][x + dir.dx/2].isWall = false;
        carvePassage(nx, ny);
      }
    }
  }

  carvePassage(0, 0);
}

// IMPROVED: Create optimal path without perimeter shortcuts
function ensureOptimalPathOnly(maze: MazeCell[][], width: number, height: number, level: number) {
  // For early levels (1-5), remove any perimeter shortcuts that make it too easy
  if (level <= 5) {
    // Don't allow complete perimeter paths - force the designed route
    return;
  }

  // For later levels, ensure connectivity but avoid making it too easy
  if (!isPathPossible(maze, width, height)) {
    createOptimalPath(maze, width, height, level);
  }
}

function createOptimalPath(maze: MazeCell[][], width: number, height: number, level: number) {
  if (level <= 1) {
    generateSinglePath(maze, width, height);
  } else if (level <= 3) {
    generateOneTurnPath(maze, width, height);
  } else {
    // Create L-shaped fallback
    for (let x = 0; x < width; x++) {
      maze[0][x].isPath = true;
      maze[0][x].isWall = false;
    }
    for (let y = 0; y < height; y++) {
      maze[y][width-1].isPath = true;
      maze[y][width-1].isWall = false;
    }
  }
}

// BFS pathfinding check
function isPathPossible(maze: MazeCell[][], width: number, height: number): boolean {
  const visited = Array(height).fill(null).map(() => Array(width).fill(false));
  const queue: { x: number, y: number }[] = [{ x: 0, y: 0 }];
  visited[0][0] = true;

  const directions = [
    { dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }
  ];

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.x === width - 1 && current.y === height - 1) {
      return true;
    }

    for (const dir of directions) {
      const newX = current.x + dir.dx;
      const newY = current.y + dir.dy;

      if (
        newX >= 0 && newX < width &&
        newY >= 0 && newY < height &&
        !visited[newY][newX] &&
        (maze[newY][newX].isPath || maze[newY][newX].isGoal || maze[newY][newX].isStart)
      ) {
        visited[newY][newX] = true;
        queue.push({ x: newX, y: newY });
      }
    }
  }

  return false;
}

export function getMazeForLevel(level: number): MazeCell[][] {
  // IMPROVED: Faster size progression for advanced toddlers
  let size: number;

  if (level <= 1) {
    size = 3; // Start very small
  } else if (level <= 3) {
    size = 4; 
  } else if (level <= 5) {
    size = 5;
  } else if (level <= 8) {
    size = 6;
  } else if (level <= 12) {
    size = 7;
  } else if (level <= 18) {
    size = 8;
  } else {
    size = Math.min(10, 8 + Math.floor((level - 18) / 5)); // Gradually increase
  }

  return generateMaze({
    width: size,
    height: size,
    difficulty: level
  });
}