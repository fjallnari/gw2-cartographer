
export interface FullMapInfo {
    name: string;
    min_level: number;
    max_level: number;
    default_floor: number;
    label_coord: number[];
    map_rect: number[][];
    continent_rect: number[][];
    points_of_interest: Record <string, LandmarkInfo>;
    tasks: Record <string, TaskInfo>;
    skill_challenges: HeroPointInfo[];
    sectors: Record<string, SectorInfo>;
    adventures: AdventureInfo[];
    mastery_points: MasteryPointInfo[];
    id: number;
    god_shrines?: any;
}

export interface GodShrinesInfo {
    id: number;
    name: string;
    name_contested: string;
    coord: number[];
    poi_id: number;
    icon: string;
    icon_contested: string;
}

export interface LandmarkInfo {
    name?: string;
    type: string; // This can be either "landmark" (for POIs), "waypoint", "vista" or "unlock".
    floor: number;
    coord: number[];
    id: number;
    chat_link: string;
    icon?: string; // Only specified if the type is set to "unlock", provides the render service url for the object's icon.
}

export interface TaskInfo {
    objective: string;
    level: number;
    coord: number[]; // The coordinates where it takes place.
    bounds: number[][]; // A list of coordinates marking the boundary of the heart.
    id: number;
    chat_link: string; // The renown heart chat link (provides an invalid link if attempting to display ingame).

}

export interface HeroPointInfo {
    coord: number[];
    id: string; // The hero challenge id, two numbers separated by a dash. 
    // The first number represents the expansion (0 for Core Tyria, 1 for Heart of Thorns and 2 for Path of Fire).
}

export interface SectorInfo {
    name: string;
    level: number;
    coord: number[]; // The coordinates of this area (this is usually the center position).
    bounds: number[][];
    chat_link: string; // The area chat link (provides an invalid link if attempting to display ingame).
    id: number;
}

interface AdventureInfo {
    coord: number[];
    id: string; // The adventure guid (token length 8-4-4-4-12 with a dash between each group of digits).
    name: string;
    description: string;
}

interface MasteryPointInfo {
    coord: number[];
    id: number;
    region: string; // The region of the mastery insight, which determines its color.
    // Options: "Tyria" (core tyria, red), "Maguuma" (heart of thorns, green), "Desert" (path of fire, purple), "Tundra" (LWS5, blue)
    
}

export default FullMapInfo;