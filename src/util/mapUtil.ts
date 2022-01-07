import { Coordinates, MapDimensions } from "../interfaces/MapDimensions";

export const pointArrToCoordinates = (pointArray: number[]) => {
    return <Coordinates> {x: pointArray[0], y: pointArray[1]};
}

export const mapDimensionsFromPoints = (cornerPoints: number[][]) => {
    const upperLeft = pointArrToCoordinates(cornerPoints[0]);
    const lowerRight = pointArrToCoordinates(cornerPoints[1]);
    
    return <MapDimensions> {
        upper_left: upperLeft, 
        lower_right: lowerRight, 
        width: lowerRight.x - upperLeft.x, 
        height: lowerRight.y - upperLeft.y
    };
}

/**
 * Translates coordinates of a point from tyrian-specific (tyria.jpg) to map-specific
 * Could be generalised to be simply coordinates subtraction as that is all this is
 */
 export const translateCoordinates = (pointCoords: Coordinates, mapDims: MapDimensions) => {
    return <Coordinates> {x: pointCoords.x - mapDims.upper_left.x, y: pointCoords.y - mapDims.upper_left.y};
}

/**
 * Just simple chaining of functions
*/
export const translatePointArray = (pointArray: number[], mapDimensions: MapDimensions) =>{
    return translateCoordinates(pointArrToCoordinates(pointArray), mapDimensions);
}