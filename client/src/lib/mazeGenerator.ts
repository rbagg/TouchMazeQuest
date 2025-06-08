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

  // Create highly complex mazes with many branching paths
  const pathComplexity = Math.min(difficulty * 0.8, 1.0); // Much higher complexity
  
  // Only use simple paths for the very first level
  if (difficulty <= 1) {
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
  // Create a simple L-shaped path from top-left to bottom-right for level 1 only
  const startX = 1, startY = 1;
  const goalX = width - 2, goalY = height - 2;
  
  // Horizontal path (narrower for more challenge)
  for (let x = startX; x <= goalX; x++) {
    maze[startY][x].isPath = true;
    maze[startY][x].isWall = false;
  }
  
  // Vertical path (single width)
  for (let y = startY; y <= goalY; y++) {
    maze[y][goalX].isPath = true;
    maze[y][goalX].isWall = false;
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
  
  return generateMaze({
    width: size,
    height: size,
    difficulty: level
  });
}
