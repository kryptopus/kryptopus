/* @flow */
import fetch from "node-fetch"

export default class Variables
{
    staticBaseUrl:string;
    getAssetUrl:Function;
    manifest:any;

    constructor(staticBaseUrl:string)
    {
        this.staticBaseUrl = staticBaseUrl;
        this.manifest = {};
        this.getAssetUrl = (path:string) => {
            if (this.manifest.hasOwnProperty(path)) {
                return `${staticBaseUrl}/${this.manifest[path]}`;
            }
            return path;
        }

        // Load manifest
        const manifestUrl = `${staticBaseUrl}/manifest.json`;
        fetch(manifestUrl)
            .then(response => response.json())
            .then(manifest => {
                this.manifest = manifest;
            });
    }
}
