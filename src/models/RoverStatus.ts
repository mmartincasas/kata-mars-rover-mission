export type RoverStatus =
  | 'waiting'
  | 'executing'
  | 'success'
  | 'errorAppearInObstacle'
  | 'errorObstacle'
  | 'errorLimits'