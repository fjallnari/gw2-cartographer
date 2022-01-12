import { Canvas, createCanvas, loadImage, NodeCanvasRenderingContext2D } from "canvas";
import TYRIA_MAPS from "../data/TYRIA_MAPS";
import { MapDimensions } from "../interfaces/MapDimensions";
import MapInfo from "../interfaces/MapInfo";
import { mapDimensionsFromPoints } from "../util/mapUtil";
import { GW_API_URL } from "../data/GW_API_URL";

export default class BMapGen {
    private mapID: number;
    mapInfo: MapInfo;
    mapDims: MapDimensions;
    canvas: Canvas;
    context: NodeCanvasRenderingContext2D;
    tileSize = 256;

    constructor(id: number) {
        this.mapID = id;
        this.mapInfo = <MapInfo> TYRIA_MAPS.find( map => map.id === this.mapID);
        this.mapDims = mapDimensionsFromPoints(this.mapInfo.continent_rect);
        this.canvas = createCanvas(this.mapDims.width, this.mapDims.height);
        this.context = this.canvas.getContext('2d');
    }

    /**
     * return Image object of a given tile
     * can get the image either from saved tiles, or from the GW2 API directly
     */ 
    private getTile = async (x: number, y: number, silent: boolean = false, fromAPI: boolean = true) => {
        if(!silent) {
            console.log(`Getting the tile with coors: X: ${x} Y: ${y}`);
        };
        
        const tileSource = fromAPI ? `${GW_API_URL.TILES}/${x}/${y}.jpg` : `./tiles/1/1/7/${x}/${y}.jpg`;
        return loadImage(tileSource);
    }

    /**
     * Creates base map - i.e. only the cropped map of a given "region" without any icons or labels
     * 
     */
     public createBmap = async () => {
        // relative up-left tile (X, Y); is the first tile which collides with the map-rect
        const relULTileX = Math.floor(this.mapDims.upper_left.x / this.tileSize);
        const relULTileY = Math.floor(this.mapDims.upper_left.y / this.tileSize);
        
        // ACR == horizontal
        const tileCountACR = Math.ceil(this.mapDims.width / this.tileSize);
        const tileCountVERT = Math.ceil(this.mapDims.height / this.tileSize);

        let UPLCropY = this.mapDims.upper_left.y;
        // 2D for loop 
        for (let offsetY = 0; offsetY <= tileCountVERT; offsetY++){
            const absTileY = this.tileSize * (relULTileY + offsetY);

            const cropRectHeight = this.tileSize - (UPLCropY - absTileY);
            // up-left X coord for the (possibly) smaller cropped part of a given tile
            let UPLCropX = this.mapDims.upper_left.x;

            for (let offsetX = 0; offsetX <= tileCountACR; offsetX++){
                // absolute tile x coord
                const absTileX = this.tileSize * (relULTileX + offsetX);
                let cropRectWidth = this.tileSize - (UPLCropX - absTileX);
                
                // input for this are the relative (X,Y) coordinates of the tile
                const tile = await this.getTile(relULTileX + offsetX, relULTileY + offsetY);

                this.context.drawImage(tile,
                    this.tileSize - cropRectWidth, this.tileSize - cropRectHeight, // source (X, Y)
                    cropRectWidth, cropRectHeight, // source (width, height),
                    UPLCropX - this.mapDims.upper_left.x, UPLCropY - this.mapDims.upper_left.y, // destination (X, Y), aka relative Up-Left Crop Rect point
                    cropRectWidth, cropRectHeight // dont want resize the image -> should stay the same as source dims
                );

                UPLCropX += cropRectWidth;
            }

            UPLCropY += cropRectHeight;
        }

        return this.canvas;

        // const buffer = this.canvas.toBuffer('image/jpeg');
        // fs.writeFileSync(`./output/tiles/${this.mapID}.jpg`, buffer); // ${offsetX + tileCountACR * offsetY}
    }

}