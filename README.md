# GW2 Cartographer
Web-based tool which generates high resolution GW2 maps; uses the official GW2 API tiles. There are three modes of generation:
- **BMAP** *(basic map)*: simply assembles the tiles into a single high-res map
- **IMAP** *(bmap + icons)*: adds all the important icons like renown hearts, waypoints, hero challenges etc.
- **FMAP** *(bmap + icons + labels)*: adds all the map region labels (such as *Arrowhead Vale* in *Auric Basin*)

More commonly requested bmaps/imaps are already cached, generating fresh fmaps might take a bit longer. Labels might be a bit off, the API is not that precise with them.

## Dev environment
If you'd like to try the tool out yourself, the `/bin/start-dev.sh` script spins up a new dev Docker container. Cloudinary is used as an CDN for the generated maps, so you will also need the following environment variables (in `.env`): `CLOUDINARY_URL`, `CLOUD_NAME`, `CLOUD_API_KEY` and `CLOUD_API_SECRET`.
