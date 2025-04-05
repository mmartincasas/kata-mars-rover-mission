export interface Cell {
    x: number
    y: number
    hasRover?: boolean
    direction?: 'N' | 'S' | 'E' | 'W'
    isObstacle: boolean
}

export interface MapData {
    grid: Cell[][]
}