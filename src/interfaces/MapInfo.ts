// https://wiki.guildwars2.com/wiki/API:2/maps

interface MapInfo {
    id: number;
    name: string;
    min_level: number;
    max_level: number;
    default_floor: number;
    type: string; // our stuff should pretty much only be of the 'Public' type
    floors: number[];
    region_id: number;
    region_name?: string;
    continent_id: number;
    continent_name?: string;
    map_rect: number[][]; // Honestly not sure, what even are these coordinates
    continent_rect: number[][]; // Coordinates we care about - first item in array is upper-left (NW) point, second is the lower-right (SE) one 
}

export default MapInfo;