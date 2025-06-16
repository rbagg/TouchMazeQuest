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

// NEW: Progressive maze style generation
function generateByStyle(maze: MazeCell[][], width: number, height: number, level: number) {
  if (level <= 3) {
    generateLinearPath(maze, width, height);
  } else if (level <= 6) {
    generateBranchingPath(maze, width, height);
  } else if (level <= 9) {
    generateSpiralPath(maze, width, height);
  } else {
    // Keep existing complex generation for higher levels
    generateMazePath(maze, width, height, Math.min(level * 0.3, 1.0));
  }
}

// NEW: Simple linear paths for levels 1-3
function generateLinearPath(maze: MazeCell[][], width: number, height: number) {
  const startX = 1, startY = 1;
  const goalX = width - 2, goalY = height - 2;

  // Create simple L-shaped path with slight variation
  // Horizontal path across top
  for (let x = startX; x <= goalX; x++) {
    maze[startY][x].isPath = true;
    maze[startY][x].isWall = false;
  }

  // Vertical path down right side
  for (let y = startY; y <= goalY; y++) {
    maze[y][goalX].isPath = true;
    maze[y][goalX].isWall = false;
  }

  // Add a small alternative path for variety (if there's room)
  if (width > 5 && height > 5) {
    const midY = Math.floor(height / 2);
    for (let x = startX; x <= Math.floor(width / 2); x++) {
      maze[midY][x].isPath = true;
      maze[midY][x].isWall = false;
    }
    for (let y = midY; y <= goalY; y++) {
      maze[y][Math.floor(width / 2)].isPath = true;
      maze[y][Math.floor(width / 2)].isWall = false;
    }
  }
}

// NEW: Branching paths for levels 4-6
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

  // Path 2: Through middle
  for (let x = startX; x <= midX; x++) {
    maze[midY][x].isPath = true;
    maze[midY][x].isWall = false;
  }
  for (let y = midY; y <= goalY; y++) {
    maze[y][midX].isPath = true;
    maze[y][midX].isWall = false;
  }
  for (let x = midX; x <= goalX; x++) {
    maze[goalY][x].isPath = true;
    maze[goalY][x].isWall = false;
  }

  // Path 3: Alternative route if there's space
  if (width > 7) {
    const quarterX = Math.floor(width / 4);
    for (let y = startY; y <= goalY; y++) {
      maze[y][quarterX].isPath = true;
      maze[y][quarterX].isWall = false;
    }
    for (let x = quarterX; x <= goalX; x++) {
      maze[Math.floor(height * 3/4)][x].isPath = true;
      maze[Math.floor(height * 3/4)][x].isWall = false;
    }
  }
}

// NEW: Spiral paths for levels 7-9
function generateSpiralPath(maze: MazeCell[][], width: number, height: number) {
  let x = 1, y = 1;
  let dx = 1, dy = 0;
  let steps = 1, stepCount = 0, direction = 0;
  let totalSteps = 0;
  const maxSteps = width * height; // Safety limit

  while (x >= 1 && x < width-1 && y >= 1 && y < height-1 && totalSteps < maxSteps) {
    maze[y][x].isPath = true;
    maze[y][x].isWall = false;

    x += dx;
    y += dy;
    stepCount++;
    totalSteps++;

    if (stepCount === steps) {
      stepCount = 0;
      direction = (direction + 1) % 4;

      // Change direction: right -> down -> left -> up
      if (direction === 0) { dx = 1; dy = 0; }
      else if (direction === 1) { dx = 0; dy = 1; }
      else if (direction === 2) { dx = -1; dy = 0; }
      else { dx = 0; dy = -1; }

      // Increase steps every two direction changes
      if (direction % 2 === 0) steps++;
    }
  }

  // Ensure we can reach the goal by adding a direct connection if needed
  const goalX = width - 2, goalY = height - 2;
  if (!maze[goalY][goalX].isPath) {
    // Add a simple connection to goal
    for (let i = Math.max(1, goalX - 2); i <= goalX; i++) {
      maze[goalY][i].isPath = true;
      maze[goalY][i].isWall = false;
    }
    for (let i = Math.max(1, goalY - 2); i <= goalY; i++) {
      maze[i][goalX].isPath = true;
      maze[i][goalX].isWall = false;
    }
  }
}

// NEW: Function to clean up large clumps
function cleanUpClumps(maze: MazeCell[][], width: number, height: number) {
  for (let y = 0; y < height - 2; y++) {
    for (let x = 0; x < width - 2; x++) {
      // Check for 3x3 path clumps
      let pathCount = 0;
      for (let dy = 0; dy < 3; dy++) {
        for (let dx = 0; dx < 3; dx++) {
          if (maze[y + dy] && maze[y + dy][x + dx] && maze[y + dy][x + dx].isPath) {
            pathCount++;
          }
        }
      }

      // If too many paths in a cluster, add strategic walls to break it up
      if (pathCount > 6) {
        // Keep corners and center, block some middle edges
        if (maze[y + 1] && maze[y + 1][x] && !maze[y + 1][x].isStart && !maze[y + 1][x].isGoal) {
          maze[y + 1][x].isPath = false;
          maze[y + 1][x].isWall = true;
        }
        if (maze[y] && maze[y][x + 1] && !maze[y][x + 1].isStart && !maze[y][x + 1].isGoal) {
          maze[y][x + 1].isPath = false;
          maze[y][x + 1].isWall = true;
        }
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
  // Use BFS to check if there's a path from start to goal
  const visited = Array(height).fill(null).map(() => Array(width).fill(false));
  const queue: { x: number, y: number }[] = [{ x: startX, y: startY }];
  visited[startY][startX] = true;

  const directions = [
    { dx: 0, dy: -1 }, // Up
    { dx: 1, dy: 0 },  // Right
    { dx: 0, dy: 1 },  // Down
    { dx: -1, dy: 0 }  // Left
  ];

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.x === goalX && current.y === goalY) {
      return true;
    }

    for (const dir of directions) {
      const newX = current.x + dir.dx;
      const newY = current.y + dir.dy;

      if (
        newX >= 0 && newX < width &&
        newY >= 0 && newY < height &&
        !visited[newY][newX] &&
        (maze[newY][newX].isPath || maze[newY][newX].isGoal)
      ) {
        visited[newY][newX] = true;
        queue.push({ x: newX, y: newY });
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
): void {
  // Create a direct path from start to goal
  let currentX = startX;
  let currentY = startY;

  // Move horizontally first
  while (currentX !== goalX) {
    if (currentX < goalX) {
      currentX++;
    } else {
      currentX--;
    }

    if (currentX >= 0 && currentX < width && currentY >= 0 && currentY < height) {
      maze[currentY][currentX].isPath = true;
      maze[currentY][currentX].isWall = false;
    }
  }

  // Then move vertically
  while (currentY !== goalY) {
    if (currentY < goalY) {
      currentY++;
    } else {
      currentY--;
    }

    if (currentX >= 0 && currentX < width && currentY >= 0 && currentY < height) {
      maze[currentY][currentX].isPath = true;
      maze[currentY][currentX].isWall = false;
    }
  }
}

function getUnvisitedNeighbors(
  current: { x: number, y: number },
  directions: { dx: number, dy: number }[],
  visited: boolean[][],
  width: number,
  height: number
) {
  return directions
    .map(dir => ({ x: current.x + dir.dx, y: current.y + dir.dy }))
    .filter(pos => 
      pos.x > 0 && pos.x < width - 1 &&
      pos.y > 0 && pos.y < height - 1 &&
      !visited[pos.y][pos.x]
    );
}

function generateMazePath(maze: MazeCell[][], width: number, height: number, complexity: number) {
  // Use recursive backtracking to create challenging mazes with dead ends
  const stack: { x: number, y: number }[] = [];
  const visited: boolean[][] = Array(height).fill(null).map(() => Array(width).fill(false));

  const startX = 1, startY = 1;
  stack.push({ x: startX, y: startY });
  visited[startY][startX] = true;
  maze[startY][startX].isPath = true;
  maze[startY][startX].isWall = false;

  const directions = [
    { dx: 0, dy: -2 }, // Up
    { dx: 2, dy: 0 },  // Right
    { dx: 0, dy: 2 },  // Down
    { dx: -2, dy: 0 }  // Left
  ];

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(current, directions, visited, width, height);

    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];

      // Create path between current and next
      const betweenX = current.x + (next.x - current.x) / 2;
      const betweenY = current.y + (next.y - current.y) / 2;

      maze[betweenY][betweenX].isPath = true;
      maze[betweenY][betweenX].isWall = false;
      maze[next.y][next.x].isPath = true;
      maze[next.y][next.x].isWall = false;

      visited[next.y][next.x] = true;
      stack.push(next);
    } else {
      stack.pop();
    }
  }

  // Create additional challenging paths and dead ends
  addDeadEnds(maze, width, height, complexity);

  // Add extra branching paths for complexity
  addExtraPaths(maze, width, height, complexity);

  // More random openings for higher complexity
  addRandomOpenings(maze, width, height, complexity);
}

function addDeadEnds(maze: MazeCell[][], width: number, height: number, complexity: number) {
  // Add challenging dead-end paths to confuse players
  const deadEndCount = Math.floor(complexity * 3);

  for (let i = 0; i < deadEndCount; i++) {
    // Find random wall positions to create dead ends from
    let attempts = 0;
    while (attempts < 20) {
      const x = Math.floor(Math.random() * (width - 4)) + 2;
      const y = Math.floor(Math.random() * (height - 4)) + 2;

      if (maze[y][x].isWall) {
        // Check if adjacent to a path
        const adjacent = [
          { x: x-1, y }, { x: x+1, y }, { x, y: y-1 }, { x, y: y+1 }
        ];

        const hasPathNeighbor = adjacent.some(pos => 
          pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height &&
          maze[pos.y][pos.x].isPath
        );

        if (hasPathNeighbor) {
          // Create a short dead-end path
          const deadEndLength = Math.floor(Math.random() * 3) + 1;
          let currentX = x, currentY = y;

          for (let j = 0; j < deadEndLength && currentX > 0 && currentX < width-1 && currentY > 0 && currentY < height-1; j++) {
            maze[currentY][currentX].isPath = true;
            maze[currentY][currentX].isWall = false;

            // Move in a random direction
            const directions = [
              { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
            ];
            const dir = directions[Math.floor(Math.random() * directions.length)];
            currentX += dir.dx;
            currentY += dir.dy;
          }
          break;
        }
      }
      attempts++;
    }
  }
}

function addExtraPaths(maze: MazeCell[][], width: number, height: number, difficulty: number) {
  // Add many additional branching paths to create complex networks
  const extraPathCount = Math.floor(difficulty * 4);

  for (let i = 0; i < extraPathCount; i++) {
    // Find existing path cells to branch from
    const pathCells = [];
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        if (maze[y][x].isPath) {
          pathCells.push({ x, y });
        }
      }
    }

    if (pathCells.length > 0) {
      const startCell = pathCells[Math.floor(Math.random() * pathCells.length)];
      const branchLength = Math.floor(Math.random() * 5) + 2;

      let currentX = startCell.x;
      let currentY = startCell.y;

      for (let j = 0; j < branchLength; j++) {
        const directions = [
          { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
          { dx: 2, dy: 0 }, { dx: -2, dy: 0 }, { dx: 0, dy: 2 }, { dx: 0, dy: -2 }
        ];

        const validDirections = directions.filter(dir => {
          const newX = currentX + dir.dx;
          const newY = currentY + dir.dy;
          return newX > 0 && newX < width - 1 && newY > 0 && newY < height - 1;
        });

        if (validDirections.length > 0) {
          const dir = validDirections[Math.floor(Math.random() * validDirections.length)];
          currentX += dir.dx;
          currentY += dir.dy;

          maze[currentY][currentX].isPath = true;
          maze[currentY][currentX].isWall = false;

          // Also create connecting paths
          if (Math.abs(dir.dx) === 2 || Math.abs(dir.dy) === 2) {
            const betweenX = currentX - dir.dx / 2;
            const betweenY = currentY - dir.dy / 2;
            maze[betweenY][betweenX].isPath = true;
            maze[betweenY][betweenX].isWall = false;
          }
        }
      }
    }
  }
}

function addRandomOpenings(maze: MazeCell[][], width: number, height: number, complexity: number) {
  // Add more openings for higher complexity
  const openingCount = Math.floor((width * height) * complexity * 0.1);

  for (let i = 0; i < openingCount; i++) {
    const x = Math.floor(Math.random() * (width - 2)) + 1;
    const y = Math.floor(Math.random() * (height - 2)) + 1;

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

  return generateMaze