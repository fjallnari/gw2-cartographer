import { UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import AssetInfo from "../interfaces/AssetInfo";
import gw2MapGen from "../services/gw2MapGen";
let cloudinary = require("cloudinary").v2;

export default class MapGenController {
    private mapGen: gw2MapGen;
    private public_id: string;
    private mode: string;
    

    constructor(id: number, mode: string) {
        this.mapGen = new gw2MapGen(id);
        this.mode = mode;
        this.public_id = `gw2-maps/${mode}/${id}`;
    }

    /**
     * Checks if a given image exists on our cloud
     */
    private getAssetInfoByPublicID = async (): Promise<AssetInfo> => {
        const response = await cloudinary.api.resources({max_results: 100});
        return response.resources.find((resource: AssetInfo) => resource.public_id === this.public_id);        
    }

    private async uploadMapToCloud(buffer: Buffer): Promise<UploadApiResponse> {
        console.log("Uploading to cloudinary");
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    public_id: this.public_id
                },
                (error: Error, result: UploadApiResponse) => {
                    result ? resolve(result) : reject(error);
                }
            );
            streamifier.createReadStream(buffer).pipe(stream);
        })        
    }

    private async createAndUploadBmap() {
        // checks first if the image exists on our cloud
        const assetInfo = await this.getAssetInfoByPublicID();
        if (assetInfo){
            return assetInfo.secure_url;
        }

        // generate and upload it if it doesn't
        const canvas = await this.mapGen.createBmap();
        const buffer = canvas.toBuffer('image/jpeg');
        console.log("Successful generation!");

        const uploadResponse = await this.uploadMapToCloud(buffer);
        console.log("Successful upload!");

        return uploadResponse.secure_url;
    }

    public async generateMap() {
        // console.log(`Generating ${this.mode}`);
        if (this.mode === "bmap"){
            return await this.createAndUploadBmap();
        }

        return "---";  
    }

}