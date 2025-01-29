import { UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import AssetInfo from "../interfaces/AssetInfo";
import BMapGen from "../services/bmapGen";
import MapFluffAdder from "../services/mapFluffAdder";
let cloudinary = require("cloudinary").v2;

export default class MapGenController {
    private bmapGen: BMapGen;
    private mapFluffAdder: MapFluffAdder;
    private public_id: string;
    private mapID: number;
    private mode: string;
    

    constructor(id: number, mode: string) {
        this.bmapGen = new BMapGen(id);
        this.mapFluffAdder = new MapFluffAdder(id);
        this.mode = mode;
        this.mapID = id;
        this.public_id = `gw2-maps/${mode}/${id}`;
    }

    /**
     * Checks if a given image exists on our cloud
     * publicID can be used if you need exact id, e.g. different mode than the one which is being used
     */
    private getAssetInfoByPublicID = async (publicID: string = this.public_id): Promise<AssetInfo> => {
        const response = await cloudinary.api.resources({ max_results: 300});
        return response.resources.find((resource: AssetInfo) => resource.public_id === publicID);  
    }

    private async uploadMapToCloud(buffer: Buffer): Promise<UploadApiResponse> {
        // console.log("Uploading to cloudinary...");
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
    // TODO: Refactor those two functions to be DRY

    private async getBmapUrl() {
        // checks first if the image exists on our cloud
        const assetInfo = await this.getAssetInfoByPublicID(`gw2-maps/bmap/${this.mapID}`);

        if (assetInfo){
            console.log("Bmap is cached on cloudinary, returning...");
            return assetInfo.secure_url;
        }

        console.log("Bmap doesn't exist on cloudinary, generating...");

        // generate and upload it if it doesn't
        const canvas = await this.bmapGen.createBmap();
        const buffer = canvas.toBuffer('image/jpeg');
        const uploadResponse = await this.uploadMapToCloud(buffer);

        return uploadResponse.secure_url;
    }

    private async getModifiedMapUrl(bmapURL: string) {
        const assetInfo = await this.getAssetInfoByPublicID();
        if (assetInfo){
            return assetInfo.secure_url;
        }

        const canvas = await this.mapFluffAdder.addFluffToMap(bmapURL, this.mode === 'fmap');
        const buffer = canvas.toBuffer('image/jpeg');
        const uploadResponse = await this.uploadMapToCloud(buffer);

        return uploadResponse.secure_url;
    }

    public async generateMap() {
        if (!this.mode) {return "---"};
        // console.log(`Generating ${this.mode} of ${this.id}`);

        const bmapUrl = await this.getBmapUrl();

        if (this.mode === "bmap") {
            return bmapUrl;
        }

        else if (this.mode === "imap" || this.mode === "fmap") {
            return await this.getModifiedMapUrl(bmapUrl);
        }

        return "---";  
    }

}