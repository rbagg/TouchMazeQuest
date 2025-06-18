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

  // Set start position (always top-left corner for consistency)
  maze[0][0].isStart = true;
  maze[0][0].isPath = true;
  maze[0][0].isWall = false;

  // Set goal position (always bottom-right corner)
  maze[height-1][width-1].isGoal = true;
  maze[height-1][width-1].isPath = true;
  maze[height-1][width-1].isWall = false;

  // CRITICAL: Always ensure there's a solvable path
  ensurePathExists(maze, width, height);

  // Verify the maze is solvable before returning
  if (!isPathPossible(maze, width, height)) {
    console.warn("Generated unsolvable maze, creating fallback path");
    createFallbackPath(maze, width, height);
  }

  return maze;
}

function generateToddlerFriendlyMaze(maze: MazeCell[][], width: number, height: number, level: number) {
  if (level <= 2) {
    // Level 1-2: Simple straight paths
    generateStraightPath(maze, width, height);
  } else if (level <= 4) {
    // Level 3-4: L-shaped paths with one turn
    generateLShapedPath(maze, width, height);
  } else if (level <= 6) {
    // Level 5-6: Zigzag paths
    generateZigzagPath(maze, width, height);
  } else if (level <= 8) {
    // Level 7-8: Simple branching (2 obvious choices)
    generateSimpleBranching(maze, width, height);
  } else if (level <= 10) {
    // Level 9-10: Room-based design (FIXED VERSION)
    generateConnectedRooms(maze, width, height);
  } else {
    // Level 11+: More complex but still manageable
    generateIntermediateMaze(maze, width, height);
  }
}

// Level 1-2: Super simple straight paths
function generateStraightPath(maze: MazeCell[][], width: number, height: number) {
  // Create a guaranteed path along the perimeter
  // Top row
  for (let x = 0; x < width; x++) {
    maze[0][x].isPath = true;
    maze[0][x].isWall = false;
  }

  // Right column 
  for (let y = 0; y < height; y++) {
    maze[y][width-1].isPath = true;
    maze[y][width-1].isWall = false;
  }

  // Add optional middle path for variety
  if (width >= 4 && height >= 4) {
    const midY = Math.floor(height / 2);
    for (let x = 0; x < width; x++) {
      maze[midY][x].isPath = true;
      maze[midY][x].isWall = false;
    }
  }
}

// Level 3-4: L-shaped paths with clear turns
function generateLShapedPath(maze: MazeCell[][], width: number, height: number) {
  // Create guaranteed L-shaped path
  // Horizontal part (top row)
  for (let x = 0; x < width; x++) {
    maze[0][x].isPath = true;
    maze[0][x].isWall = false;
  }

  // Vertical part (right column)
  for (let y = 0; y < height; y++) {
    maze[y][width-1].isPath = true;
    maze[y][width-1].isWall = false;
  }

  // Add alternative L-path for choice
  // Vertical part (left column) 
  for (let y = 0; y < height; y++) {
    maze[y][0].isPath = true;
    maze[y][0].isWall = false;
  }

  // Horizontal part (bottom row)
  for (let x = 0; x < width; x++) {
    maze[height-1][x].isPath = true;
    maze[height-1][x].isWall = false;
  }
}

// Level 5-6: Fun zigzag patterns
function generateZigzagPath(maze: MazeCell[][], width: number, height: number) {
  // Create zigzag pattern that definitely connects start to goal
  let currentX = 0;
  let goingRight = true;

  for (let y = 0; y < height; y++) {
    // Create horizontal line for current row
    if (goingRight) {
      for (let x = 0; x < width; x++) {
        maze[y][x].isPath = true;
        maze[y][x].isWall = false;
      }
      currentX = width - 1;
    } else {
      for (let x = width - 1; x >= 0; x--) {
        maze[y][x].isPath = true;
        maze[y][x].isWall = false;
      }
      currentX = 0;
    }

    goingRight = !goingRight;
  }
}

// Level 7-8: Simple branching with clear choices
function generateSimpleBranching(maze: MazeCell[][], width: number, height: number) {
  // Create multiple clear paths from start to goal

  // Path 1: Along perimeter (guaranteed route)
  // Top edge
  for (let x = 0; x < width; x++) {
    maze[0][x].isPath = true;
    maze[0][x].isWall = false;
  }
  // Right edge
  for (let y = 0; y < height; y++) {
    maze[y][width-1].isPath = true;
    maze[y][width-1].isWall = false;
  }

  // Path 2: Through middle (alternative route)
  const midX = Math.floor(width / 2);
  const midY = Math.floor(height / 2);

  // Vertical center line
  for (let y = 0; y < height; y++) {
    maze[y][midX].isPath = true;
    maze[y][midX].isWall = false;
  }

  // Horizontal center line  
  for (let x = 0; x < width; x++) {
    maze[midY][x].isPath = true;
    maze[midY][x].isWall = false;
  }

  // Connect paths
  for (let x = 0; x <= midX; x++) {
    maze[0][x].isPath = true;
    maze[0][x].isWall = false;
  }
  for (let x = midX; x < width; x++) {
    maze[height-1][x].isPath = true;
    maze[height-1][x].isWall = false;
  }
}

// Level 9-10: FIXED Room-based design that ensures connectivity
function generateConnectedRooms(maze: MazeCell[][], width: number, height: number) {
  // Start with guaranteed path around perimeter
  // Top edge
  for (let x = 0; x < width; x++) {
    maze[0][x].isPath = true;
    maze[0][x].isWall = false;
  }
  // Right edge
  for (let y = 0; y < height; y++) {
    maze[y][width-1].isPath = true;
    maze[y][width-1].isWall = false;
  }
  // Bottom edge
  for (let x = 0; x < width; x++) {
    maze[height-1][x].isPath = true;
    maze[height-1][x].isWall = false;
  }
  // Left edge
  for (let y = 0; y < height; y++) {
    maze[y][0].isPath = true;
    maze[y][0].isWall = false;
  }

  // Create room areas (but keep them connected)
  const roomSize = 2;

  // Create internal room patterns while maintaining connectivity
  for (let roomY = 1; roomY < height - 1; roomY += roomSize) {
    for (let roomX = 1; roomX < width - 1; roomX += roomSize) {
      // Create small room areas
      for (let y = roomY; y < Math.min(roomY + roomSize - 1, height - 1); y++) {
        for (let x = roomX; x < Math.min(roomX + roomSize - 1, width - 1); x++) {
          maze[y][x].isPath = true;
          maze[y][x].isWall = false;
        }
      }
    }
  }

  // Ensure center pathways remain open
  const midX = Math.floor(width / 2);
  const midY = Math.floor(height / 2);

  // Cross pattern through middle
  for (let x = 0; x < width; x++) {
    maze[midY][x].isPath = true;
    maze[midY][x].isWall = false;
  }
  for (let y = 0; y < height; y++) {
    maze[y][midX].isPath = true;
    maze[y][midX].isWall = false;
  }
}

// Level 11+: More complex but still manageable
function generateIntermediateMaze(maze: MazeCell[][], width: number, height: number) {
  // Create a network with guaranteed connectivity

  // Base path network
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x++) {
      maze[y][x].isPath = true;
      maze[y][x].isWall = false;
    }
  }

  for (let x = 0; x < width; x += 2) {
    for (let y = 0; y < height; y++) {
      maze[y][x].isPath = true;
      maze[y][x].isWall = false;
    }
  }

  // Add some variety while keeping connectivity
  for (let y = 1; y < height; y += 3) {
    for (let x = 1; x < width; x += 3) {
      if (x < width - 1 && y < height - 1) {
        maze[y][x].isPath = true;
        maze[y][x].isWall = false;
      }
    }
  }
}

// CRITICAL: Ensure there's always a path from start to goal
function ensurePathExists(maze: MazeCell[][], width: number, height: number) {
  // Create guaranteed path along perimeter as backup
  // Top row (start is at 0,0)
  for (let x = 0; x < width; x++) {
    maze[0][x].isPath = true;
    maze[0][x].isWall = false;
  }

  // Right column (connects to goal at width-1, height-1)
  for (let y = 0; y < height; y++) {
    maze[y][width-1].isPath = true;
    maze[y][width-1].isWall = false;
  }
}

// Check if a path exists using breadth-first search
function isPathPossible(maze: MazeCell[][], width: number, height: number): boolean {
  const visited = Array(height).fill(null).map(() => Array(width).fill(false));
  const queue: { x: number, y: number }[] = [{ x: 0, y: 0 }];
  visited[0][0] = true;

  const directions = [
    { dx: 0, dy: -1 }, // Up
    { dx: 1, dy: 0 },  // Right
    { dx: 0, dy: 1 },  // Down
    { dx: -1, dy: 0 }  // Left
  ];

  while (queue.length > 0) {
    const current = queue.shift()!;

    // Check if we reached the goal
    if (current.x === width - 1 && current.y === height - 1) {
      return true;
    }

    // Explore neighbors
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

  return false; // No path found
}

// Create a simple fallback path if somehow no path exists
function createFallbackPath(maze: MazeCell[][], width: number, height: number) {
  // Create simple L-shaped path as absolute fallback
  // Horizontal from start
  for (let x = 0; x < width; x++) {
    maze[0][x].isPath = true;
    maze[0][x].isWall = false;
  }

  // Vertical to goal
  for (let y = 0; y < height; y++) {
    maze[y][width-1].isPath = true;
    maze[y][width-1].isWall = false;
  }
}

export function getMazeForLevel(level: number): MazeCell[][] {
  // Keep mazes small and manageable for toddlers
  let size: number;

  if (level <= 2) {
    size = 3; // Very small for first levels
  } else if (level <= 4) {
    size = 4; 
  } else if (level <= 6) {
    size = 5;
  } else if (level <= 8) {
    size = 6;
  } else {
    size = Math.min(7, 4 + Math.floor(level / 3)); // Max 7x7 for phone screens
  }

  return generateMaze({
    width: size,
    height: size,
    difficulty: level
  });
}