import type { Cell, MapData } from '@/models/Map'

export function createEmptyMap(maxValue: number): MapData {
  const grid: Cell[][] = []

  for (let y = 0; y < maxValue+1; y++) {
    const row: Cell[] = []
    for (let x = 0; x < maxValue+1; x++) {
      row.push({
        x,
        y,
        isObstacle: Math.random() < (1 / 10)
      })
    }
    grid.push(row)
  }

  return { grid }
}
