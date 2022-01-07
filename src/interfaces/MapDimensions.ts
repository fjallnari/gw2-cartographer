export type Coordinates = {
    x: number;
    y: number;
}

export interface MapDimensions {
    upper_left: Coordinates;
    lower_right: Coordinates;
    width: number;
    height: number;
}