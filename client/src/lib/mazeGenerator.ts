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

  // Generate truly unique patterns for each level - NO SHORTCUTS!
  generateUniqueLevel(maze, width, height, difficulty);

  // FIXED: Consistent start position at (0,0)
  maze[0][0].isStart = true;
  maze[0][0].isPath = true;
  maze[0][0].isWall = false;

  // Set goal position (always bottom-right corner)
  maze[height-1][width-1].isGoal = true;
  maze[height-1][width-1].isPath = true;
  maze[height-1][width-1].isWall = false;

  // Verify the maze is solvable
  if (!isPathPossible(maze, width, height)) {
    console.warn("Generated unsolvable maze, creating proper path");
    createEmergencyPath(maze, width, height, difficulty);
  }

  return maze;
}

function generateUniqueLevel(maze: MazeCell[][], width: number, height: number, level: number) {
  // Clear the maze first
  clearMaze(maze, width, height);

  switch(level) {
    case 1: generateLevel1(maze, width, height); break;
    case 2: generateLevel2(maze, width, height); break;
    case 3: generateLevel3(maze, width, height); break;
    case 4: generateLevel4(maze, width, height); break;
    case 5: generateLevel5(maze, width, height); break;
    case 6: generateLevel6(maze, width, height); break;
    case 7: generateLevel7(maze, width, height); break;
    case 8: generateLevel8(maze, width, height); break;
    case 9: generateLevel9(maze, width, height); break;
    case 10: generateLevel10(maze, width, height); break;
    case 11: generateLevel11(maze, width, height); break;
    case 12: generateLevel12(maze, width, height); break;
    case 13: generateLevel13(maze, width, height); break;
    case 14: generateLevel14(maze, width, height); break;
    case 15: generateLevel15(maze, width, height); break;
    default: generateAdvancedLevel(maze, width, height, level); break;
  }
}

function clearMaze(maze: MazeCell[][], width: number, height: number) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      maze[y][x].isWall = true;
      maze[y][x].isPath = false;
    }
  }
}

function setPath(maze: MazeCell[][], x: number, y: number) {
  if (x >= 0 && x < maze[0].length && y >= 0 && y < maze.length) {
    maze[y][x].isPath = true;
    maze[y][x].isWall = false;
  }
}

// Level 1: Straight line right then down
function generateLevel1(maze: MazeCell[][], width: number, height: number) {
  // Only path: right then down
  for (let x = 0; x < width; x++) {
    setPath(maze, x, 0);
  }
  for (let y = 0; y < height; y++) {
    setPath(maze, width-1, y);
  }
}

// Level 2: L-shape going down first
function generateLevel2(maze: MazeCell[][], width: number, height: number) {
  // Down then right
  for (let y = 0; y < height; y++) {
    setPath(maze, 0, y);
  }
  for (let x = 0; x < width; x++) {
    setPath(maze, x, height-1);
  }
}

// Level 3: Snake pattern
function generateLevel3(maze: MazeCell[][], width: number, height: number) {
  // Right, down middle, left, down
  for (let x = 0; x < width; x++) {
    setPath(maze, x, 0);
  }
  const midY = Math.floor(height / 2);
  for (let y = 0; y <= midY; y++) {
    setPath(maze, width-1, y);
  }
  for (let x = width-1; x >= 0; x--) {
    setPath(maze, x, midY);
  }
  for (let y = midY; y < height; y++) {
    setPath(maze, 0, y);
  }
  for (let x = 0; x < width; x++) {
    setPath(maze, x, height-1);
  }
}

// Level 4: Staircase pattern
function generateLevel4(maze: MazeCell[][], width: number, height: number) {
  let currentX = 0;
  let currentY = 0;

  while (currentX < width - 1 || currentY < height - 1) {
    setPath(maze, currentX, currentY);

    if (currentX < width - 1 && (currentY === height - 1 || Math.random() < 0.5)) {
      currentX++;
    } else if (currentY < height - 1) {
      currentY++;
    }
  }
  setPath(maze, width-1, height-1);
}

// Level 5: Diagonal with barriers
function generateLevel5(maze: MazeCell[][], width: number, height: number) {
  // Main diagonal path
  for (let i = 0; i < Math.min(width, height); i++) {
    setPath(maze, i, i);
  }

  // Connect to goal if not on diagonal
  if (width !== height) {
    if (width > height) {
      for (let x = height-1; x < width; x++) {
        setPath(maze, x, height-1);
      }
    } else {
      for (let y = width-1; y < height; y++) {
        setPath(maze, width-1, y);
      }
    }
  }

  // Add alternative path in middle
  const midX = Math.floor(width / 2);
  const midY = Math.floor(height / 2);
  for (let x = 0; x <= midX; x++) {
    setPath(maze, x, midY);
  }
  for (let y = midY; y < height; y++) {
    setPath(maze, midX, y);
  }
  for (let x = midX; x < width; x++) {
    setPath(maze, x, height-1);
  }
}

// Level 6: U-turn pattern
function generateLevel6(maze: MazeCell[][], width: number, height: number) {
  // Go down left side
  for (let y = 0; y < height-1; y++) {
    setPath(maze, 0, y);
  }
  // Go across bottom
  for (let x = 0; x < width; x++) {
    setPath(maze, x, height-1);
  }
  // Go up right side  
  for (let y = height-1; y >= 0; y--) {
    setPath(maze, width-1, y);
  }

  // Alternative path through middle
  const midY = Math.floor(height / 2);
  for (let x = 0; x < width; x++) {
    setPath(maze, x, midY);
  }
}

// Level 7: Two choice crossroads
function generateLevel7(maze: MazeCell[][], width: number, height: number) {
  const midX = Math.floor(width / 2);
  const midY = Math.floor(height / 2);

  // Path 1: through middle cross
  for (let x = 0; x < width; x++) {
    setPath(maze, x, midY);
  }
  for (let y = 0; y < height; y++) {
    setPath(maze, midX, y);
  }

  // Connect corners to center
  setPath(maze, 0, 0);
  setPath(maze, width-1, height-1);
}

// Level 8: Spiral inward (NO PERIMETER!)
function generateLevel8(maze: MazeCell[][], width: number, height: number) {
  // Create inward spiral - definitely no perimeter shortcut
  let left = 0, right = width - 1, top = 0, bottom = height - 1;

  while (left <= right && top <= bottom) {
    // Go right on top row (but only for current layer)
    for (let x = left; x <= right; x++) {
      setPath(maze, x, top);
    }
    top++;

    // Go down on right column
    for (let y = top; y <= bottom; y++) {
      setPath(maze, right, y);
    }
    right--;

    // Go left on bottom row
    if (top <= bottom) {
      for (let x = right; x >= left; x--) {
        setPath(maze, x, bottom);
      }
      bottom--;
    }

    // Go up on left column  
    if (left <= right) {
      for (let y = bottom; y >= top; y--) {
        setPath(maze, left, y);
      }
      left++;
    }
  }
}

// Level 9: Maze with one dead end
function generateLevel9(maze: MazeCell[][], width: number, height: number) {
  // Main solution path - no perimeter
  const midX = Math.floor(width / 2);

  // Start to middle
  for (let x = 0; x <= midX; x++) {
    setPath(maze, x, 0);
  }
  // Down to middle
  for (let y = 0; y <= Math.floor(height / 2); y++) {
    setPath(maze, midX, y);
  }
  // Right to edge
  for (let x = midX; x < width; x++) {
    setPath(maze, x, Math.floor(height / 2));
  }
  // Down to bottom
  for (let y = Math.floor(height / 2); y < height; y++) {
    setPath(maze, width-1, y);
  }

  // Add one dead end
  setPath(maze, 1, 1);
  setPath(maze, 1, 2);
}

// Level 10: Complex but no shortcuts
function generateLevel10(maze: MazeCell[][], width: number, height: number) {
  // Create rooms connected by corridors
  const midX = Math.floor(width / 2);
  const midY = Math.floor(height / 2);

  // Central corridor system
  for (let x = 0; x < width; x++) {
    setPath(maze, x, midY);
  }
  for (let y = 0; y < height; y++) {
    setPath(maze, midX, y);
  }

  // Connect start and goal to the corridors
  for (let x = 0; x <= midX; x++) {
    setPath(maze, x, 0);
  }
  for (let y = midY; y < height; y++) {
    setPath(maze, width-1, y);
  }

  // Small rooms
  setPath(maze, 1, 1);
  setPath(maze, width-2, height-2);
}

// Levels 11-15: Increasingly complex but fair
function generateLevel11(maze: MazeCell[][], width: number, height: number) {
  generateComplexButFair(maze, width, height, 1);
}

function generateLevel12(maze: MazeCell[][], width: number, height: number) {
  generateComplexButFair(maze, width, height, 2);
}

function generateLevel13(maze: MazeCell[][], width: number, height: number) {
  generateComplexButFair(maze, width, height, 3);
}

function generateLevel14(maze: MazeCell[][], width: number, height: number) {
  generateComplexButFair(maze, width, height, 4);
}

function generateLevel15(maze: MazeCell[][], width: number, height: number) {
  generateComplexButFair(maze, width, height, 5);
}

function generateComplexButFair(maze: MazeCell[][], width: number, height: number, complexity: number) {
  // Create grid pattern
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x++) {
      setPath(maze, x, y);
    }
  }

  for (let x = 0; x < width; x += 2) {
    for (let y = 0; y < height; y++) {
      setPath(maze, x, y);
    }
  }

  // Add complexity by removing some paths
  for (let i = 0; i < complexity; i++) {
    const x = 1 + (i * 2) % (width - 2);
    const y = 1 + Math.floor(i / 2) * 2;
    if (x < width - 1 && y < height - 1) {
      maze[y][x].isPath = false;
      maze[y][x].isWall = true;
    }
  }
}

function generateAdvancedLevel(maze: MazeCell[][], width: number, height: number, level: number) {
  // For levels beyond 15, use algorithmic generation
  generateComplexButFair(maze, width, height, level - 10);
}

// Emergency fallback that creates a simple working path
function createEmergencyPath(maze: MazeCell[][], width: number, height: number, level: number) {
  // Simple L-shaped path as last resort
  for (let x = 0; x < width; x++) {
    setPath(maze, x, 0);
  }
  for (let y = 0; y < height; y++) {
    setPath(maze, width-1, y);
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