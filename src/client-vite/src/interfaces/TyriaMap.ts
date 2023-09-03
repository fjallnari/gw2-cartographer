export default interface TyriaMap {
    id: number,
    name: string,
    min_level: number,
    max_level: number,
    default_floor: number,
    type: string,
    floors: number[],
    region_id: number,
    region_name: string,
    continent_id: number,
    continent_name: string,
    map_rect: number[][],
    continent_rect: number[][]
}