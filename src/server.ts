import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

const path = require("path");
const fs = require("fs");

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get("/filteredimage", async (req, res) => {
    const filteredImgurl: string = req.query.image_url;
    // validate the image_url query
    if (!filteredImgurl) {
      return res
        .status(422)
        .send({ message: "image url is not unprocessable" });
    }
    // call filterImageFromURL(image_url) to filter the image
    // try this image "https://www.cdc.gov/healthypets/images/pets/cute-dog-headshot.jpg"
    filterImageFromURL(filteredImgurl)
      .then((result) => {
        // send the resulting file in the response
        res.status(200).sendFile(result, () => {
          // deletes any files on the server on finish of the response
          const imgdelDir: string = path.dirname(result);
          if (imgdelDir) {
            const imgNames: Array<string> = fs.readdirSync(imgdelDir);
            const imgdelFiles: Array<string> = imgNames.map(
              (imgFile) => imgdelDir + "/" + imgFile
            );
            // console.log(imgdelFiles);
            deleteLocalFiles(imgdelFiles);
          }
        });
      })
      .catch((reject) => {
        res.status(422).send({ message: +reject });
      });
  });

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
