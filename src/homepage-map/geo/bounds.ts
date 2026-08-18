import type { Geometry, Position } from 'geojson'

export function geoBounds(geometry: Geometry): {
  north: number
  south: number
  east: number
  west: number
} {
  let north = -90
  let south = 90
  let east = -180
  let west = 180

  const visitPos = (pos: Position) => {
    const lng = pos[0]
    const lat = pos[1]
    north = Math.max(north, lat)
    south = Math.min(south, lat)
    east = Math.max(east, lng)
    west = Math.min(west, lng)
  }

  const visit = (coords: Position | Position[] | Position[][] | Position[][][]) => {
    if (typeof coords[0] === 'number') {
      visitPos(coords as Position)
      return
    }
    for (const child of coords as Position[]) visit(child)
  }

  if (geometry.type === 'GeometryCollection') {
    for (const g of geometry.geometries) {
      const b = geoBounds(g)
      north = Math.max(north, b.north)
      south = Math.min(south, b.south)
      east = Math.max(east, b.east)
      west = Math.min(west, b.west)
    }
    return { north, south, east, west }
  }

  visit(geometry.coordinates)
  return { north, south, east, west }
}

export function padLiteral(
  b: { north: number; south: number; east: number; west: number },
  pad: number,
) {
  return {
    north: b.north + pad,
    south: b.south - pad,
    east: b.east + pad,
    west: b.west - pad,
  }
}
