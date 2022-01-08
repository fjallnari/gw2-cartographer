import express from "express";
import dotenv from "dotenv";
import path from "path/posix";
import MapGenController from "./controllers/MapGenController";
import TYRIA_MAPS from "./data/TYRIA_MAPS";
const cloudinary = require('cloudinary').v2;

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true
});


const main = async () => {
  const app = express();

  app.get('/api/bmap/:name', async (req, res) => {
    const mapID = TYRIA_MAPS.find(map => map.name === req.params.name)?.id ?? 0;
    const controller = new MapGenController(mapID, 'bmap-only');
    await controller.generateMap()
      .then( (mapURL) => {
        res.send({
          success: true,
          data: [{mapURL: mapURL}]
        });
      })
      .catch((err) => {
        res.send({
          success: false,
          data: []
        })
      })

  });

  app.get('/api/maps', (req, res) => {
    res.json(TYRIA_MAPS);
  });

  app.use(express.static('src/client/public'));

  app.use('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client/public', 'index.html'));
  });

  app.listen(4000, () => {
    console.log("Server started on http://localhost:4000");
  });

};

main();