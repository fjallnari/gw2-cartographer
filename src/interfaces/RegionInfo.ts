import FullMapInfo from "./FullMapInfo";

export interface RegionInfo {
    name: string;
    label_coord: number[]; // The coordinates of the region label.
    continent_rect: number[][];
    maps: Record <string, FullMapInfo>;
}

export default RegionInfo;