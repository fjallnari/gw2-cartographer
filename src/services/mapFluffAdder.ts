import { Canvas, createCanvas, Image, loadImage, NodeCanvasRenderingContext2D } from "canvas";
import { MAP_DETAILS } from "../data/MAP_DETAILS";
import FullMapInfo from "../interfaces/FullMapInfo";
import { MapDimensions } from "../interfaces/MapDimensions";
import { mapDimensionsFromPoints, translatePointArray } from "../util/mapUtil";

export default class MapFluffAdder {
    context: NodeCanvasRenderingContext2D;
    canvas: Canvas;
    mapDimensions: MapDimensions;
    fontStyles: Record<string, string> = {
        'default': 'italic 25px Candara',
        'sectorName': 'italic 25px Candara'
    };
    map: FullMapInfo;


    constructor (mapID: number) {
        // just some default values, will be overriden later
        this.canvas = createCanvas(0, 0);
        this.context = this.canvas.getContext('2d');
        this.mapDimensions = {upper_left: {x: 0, y: 0}, lower_right: {x: 0, y: 0}, width: 0, height: 0};

        this.map = MAP_DETAILS[mapID];
    }

    /**
     * Pretty simple - first it translates the coordinates into the map-specific system, then just  draws the image (centered on point)
     * @param point
     */
    private drawIconOnMap (
        pointArray: number[],
        image: Image
        ){
        const point = translatePointArray(pointArray, this.mapDimensions);

        // we want the image to be centered on the point
        this.context.drawImage(image, point.x - image.width/2, point.y - image.height/2);
    }

    private drawStrokedText(text: string, pointArr: number[], fontStyle: string = 'default') {
        const point = translatePointArray(pointArr, this.mapDimensions);

        this.context.font = this.fontStyles[fontStyle];
        this.context.textAlign = 'center';
        this.context.strokeStyle = 'black';
        this.context.lineWidth = 4;
        this.context.strokeText(text, point.x, point.y);
        this.context.fillStyle = 'white'; // #DBB975
        this.context.fillText(text, point.x, point.y);
    }

    public addFluffToMap = async (inputURL: string, wantLabels: boolean) => {        
        // check the mapDimensions object first -> then create canvas of the same size as the base map
        this.mapDimensions = mapDimensionsFromPoints(this.map.continent_rect);
    
        this.canvas = createCanvas(this.mapDimensions.width, this.mapDimensions.height);
        this.context = this.canvas.getContext('2d');
    
        // preload all images
        const icons: Record<string, Image> = {
            'landmark' : await loadImage('./public/poi.png'),
            'waypoint': await loadImage('./public/waypoint.png'),
            'vista': await loadImage('./public/vista.png'),
            'heart': await loadImage('./public/heart.png'),
            'hp': await loadImage('./public/hp.png'),
        }

        // TODO: Refactor this to be more DRY    
        // first draws base map as background, then adds all the icons
        await loadImage(inputURL).then((baseMap: Image) => {
            this.context.drawImage(baseMap, 0, 0);

            // pois + vistas + waypoints
            for (const key in this.map.points_of_interest){
                const landmark = this.map.points_of_interest[key];
                const iconImage = icons[landmark.type];
    
                if (iconImage){
                    this.drawIconOnMap(landmark.coord, icons[landmark.type]);
                }
                else {
                    // it is the 'unlock' type -> should have the url for image listed
                }
            }
    
            // hero points
            for (const challenge of this.map.skill_challenges){         
                this.drawIconOnMap(challenge.coord, icons['hp']);
            }
    
            // renown hearts
            for (const key in this.map.tasks){
                this.drawIconOnMap(this.map.tasks[key].coord, icons['heart']);
            }

            if (wantLabels) {
                // draw all sector names
                for (const key in this.map.sectors){
                    const sector = this.map.sectors[key];

                    this.drawStrokedText(sector.name, sector.coord, 'sectorName');
                }
            }            
        })
        
        console.log(`Sucessfully created full map ${wantLabels ? '(with labels)': '(icons only)'} of ${this.map.name}...`);
        return this.canvas;
    }
}