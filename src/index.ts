import express from "express";
import dotenv from "dotenv";
import path from "path/posix";
import MapGenController from "./controllers/MapGenController";
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

  app.use(express.static('src/client/public'));

  app.use('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client/public', 'index.html'));
  });

  app.get('/api/bmap/:id', async (req, res) => {
    console.log(~ req.params.id);
    const controller = new MapGenController(~ req.params.id, 'bmap-only');
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

  app.listen(4000, () => {
    console.log("Server started on http://localhost:4000");
  });

};

main();