import { UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import AssetInfo from "../interfaces/AssetInfo";
import BMapGen from "../services/bmapGen";
let cloudinary = require("cloudinary").v2;

export default class MapGenController {
    private bmapGen: BMapGen;
    private public_id: string;
    private mapID: number;
    private mode: string;
    

    constructor(id: number, mode: string) {
        this.bmapGen = new BMapGen(id);
        this.mode = mode;
        this.mapID = id;
        this.public_id = `gw2-maps/${mode}/${id}`;
    }

    /**
     * Checks if a given image exists on our cloud
     * publicID can be used if you need exact id, e.g. different mode than the one which is being used
     */
    private getAssetInfoByPublicID = async (publicID: string = this.public_id): Promise<AssetInfo> => {
        const response = await cloudinary.api.resources({max_results: 100});
        return response.resources.find((resource: AssetInfo) => resource.public_id === publicID);  
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

    private async getBmapUrl() {
        // checks first if the image exists on our cloud
        const assetInfo = await this.getAssetInfoByPublicID(`gw2-maps/bmap/${this.mapID}`);
        if (assetInfo){
            return assetInfo.secure_url;
        }

        // generate and upload it if it doesn't
        const canvas = await this.bmapGen.createBmap();
        const buffer = canvas.toBuffer('image/jpeg');
        console.log("Successful generation!");

        const uploadResponse = await this.uploadMapToCloud(buffer);
        console.log("Successful upload!");

        return uploadResponse.secure_url;
    }

    public async generateMap() {
        if (!this.mode) {return "---"};
        // console.log(`Generating ${this.mode} of ${this.id}`);

        const bmapUrl = await this.getBmapUrl();

        switch (this.mode) {
            case "bmap":
                return bmapUrl;
            case "imap":
                return "---"
            case "fmap":
                return "---"
        }

        return "---";  
    }

}