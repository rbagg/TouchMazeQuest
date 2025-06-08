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

  // Create a simple path-based maze suitable for 4-year-olds
  // Use a simplified algorithm that creates wide, clear paths
  
  const pathComplexity = Math.min(difficulty * 0.3, 0.8); // Keep paths simple
  const minPathWidth = difficulty <= 3 ? 2 : 1; // Wider paths for easier levels
  
  // Generate a simple L-shaped or straight path for lower levels
  if (difficulty <= 3) {
    generateSimplePath(maze, width, height);
  } else {
    generateMazePath(maze, width, height, pathComplexity);
  }
  
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
  
  return maze;
}

function generateSimplePath(maze: MazeCell[][], width: number, height: number) {
  // Create a simple L-shaped path from top-left to bottom-right
  const startX = 1, startY = 1;
  const goalX = width - 2, goalY = height - 2;
  
  // Horizontal path
  for (let x = startX; x <= goalX; x++) {
    maze[startY][x].isPath = true;
    maze[startY][x].isWall = false;
    // Add some width to the path
    if (startY + 1 < height - 1) {
      maze[startY + 1][x].isPath = true;
      maze[startY + 1][x].isWall = false;
    }
  }
  
  // Vertical path
  for (let y = startY; y <= goalY; y++) {
    maze[y][goalX].isPath = true;
    maze[y][goalX].isWall = false;
    // Add some width to the path
    if (goalX - 1 > 0) {
      maze[y][goalX - 1].isPath = true;
      maze[y][goalX - 1].isWall = false;
    }
  }
}

function generateMazePath(maze: MazeCell[][], width: number, height: number, complexity: number) {
  // Use a simple recursive backtracking algorithm
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
  
  // Add some random openings for easier navigation
  addRandomOpenings(maze, width, height, complexity);
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

function addRandomOpenings(maze: MazeCell[][], width: number, height: number, complexity: number) {
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
  const baseSize = 7;
  const maxSize = 11;
  
  // Gradually increase maze size and complexity
  const size = Math.min(baseSize + Math.floor(level / 3), maxSize);
  
  return generateMaze({
    width: size,
    height: size,
    difficulty: level
  });
}
