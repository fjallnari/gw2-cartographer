import express from "express";
import dotenv from "dotenv";
import path from 'path';
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

const port = process.env.PORT || 4000;

const main = async () => {
  const app = express();

  app.get('/api/map-gen/', async (req, res) => {
    const mapName = req.query.name;
    const genMode = <string> req.query.mode;

    const mapID = TYRIA_MAPS.find(map => map.name === mapName)?.id ?? 0;
    const controller = new MapGenController(mapID, genMode);

    await controller.generateMap()
      .then( (mapURL) => {
        const wasSuccess = mapURL !== '---';
        res.send({
          success: wasSuccess,
          data: wasSuccess ? [{mapURL: mapURL}] : []
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

  app.use(express.static('dist/client'));

  app.use('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
  });

  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });

};

main();