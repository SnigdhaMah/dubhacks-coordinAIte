import express, { Express } from "express";
import {
  updateTodo,
  chatResp,
  generateImage,
  getEventTypes,
  getPossibleFeatures,
  getFeatureOptionRecs,
  resetEventInfo,
  recommendationClicked,
} from "./routes";
import bodyParser from "body-parser";

// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());

// get the all features to be displayed in the feature grid, with the AI rec'd features first in the list
// and all other possible features after
app.post("/api/getPossibleFeatures/", getPossibleFeatures);

// get the recommended options for the selected feature
app.post("/api/featureOptionRecs", getFeatureOptionRecs);

// get all the event options for the user to select in the form
app.get("/api/getEventTypes", getEventTypes);

// reset all event information within the server for the user to restart their planning
app.post("/api/resetEventInfo", resetEventInfo);

// get AI generated image based on the event details, selected features, and more
app.get("/api/generateImage", generateImage);

// get Chatbot Response for when user talks to the chatbot
app.post("/api/chatResp", chatResp);

// send new Todo to server
app.post("api/updateTodo", updateTodo);

app.post("api/recommendationClicked", recommendationClicked);

app.listen(port, () => console.log(`Server listening on ${port}`));
