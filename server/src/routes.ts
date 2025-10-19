import { Request, Response } from "express";
import { EventType } from "./types/eventType";
import { ChatMessage } from "./types/chatType";
import { Recommendation, FeatureType } from "./types/featureType";
import { TodoType } from "./types/todoType";
import { GenerateImagesResponse, GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
  getChatbotResponsePrompt,
  getFeatureOptionsPrompt,
  getFeatureSelectionPrompt,
  getImageGenerationPrompt,
  getTodoCreationPrompt,
  systemPrompt,
} from "./types/prompts";
dotenv.config();

// list of todos
const todos = new Map<string, TodoType>();
const selectedFeatures = new Map<string, Recommendation>();

const eventData: EventType = {
  eventType: "",
  date: new Date(),
  location: "",
  price: "",
  attendees: "0",
};
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

// Require type checking of request body.
// Request<Params, ResBody, ReqBody, ReqQuery>
// Response<ResBody

type GeneralRequest = Request;
type GeneralResponse = Response; // only writing, so no need to check

type PossibleFeaturesRequest = Request<{}, {}, EventType>;
type PossibleFeaturesResponse = Response<
  | {
      allFeatures: string[];
      recommendedFeatures: string[];
    }
  | { error: string }
>;

type FeatureOptionsRequest = Request<
  {},
  {},
  {
    selectedFeature: string; // the feature title (e.g.cake)
    chatmsgs: ChatMessage[];
    currRecs: Recommendation[];
  }
>;
type FeatureOptionsResponse = Response<
  { recommendations: Recommendation[] } | { error: string }
>;

type EventTypesResponse = Response<{ list: string[] }>;

type ResetResponse = Response<boolean>;

type ImageRequest = Request<{}, {}, { featureIndex: FeatureType[] }>;
type ImageResponse = Response<
  { generatedImage: string | null } | { error: string }
>;

type ChatbotRequest = Request<
  {},
  {},
  { chatmsgs: ChatMessage[]; currRecs: Recommendation[] }
>;
type ChatbotResponse = Response<
  | {
      response: string;
      newRecs?: Recommendation[];
    }
  | { error: string }
>;

type TodoListResponse = Response<{ newTodos: TodoType[] } | { error: string }>;

type updateTodoRequest = Request<{}, {}, { feature: string; todo: TodoType }>;

type RecommendedRequest = Request<
  {},
  {},
  { feature: string; clickedRec: Recommendation }
>; // todo list is stored as a map {key: feature, value: Recommendation}

// get the all features to be displayed in the feature grid, with the AI rec'd features first in the list
// and all other possible features after
// param:
// eventDetails: EventType - Event Details
// return {allFeatures: string[], recommendedFeatures: string[] }
export const getPossibleFeatures = async (
  req: PossibleFeaturesRequest,
  res: PossibleFeaturesResponse
): Promise<PossibleFeaturesResponse> => {
  try {
    // Extract data from request body
    const eventData = req.body;

    console.log("Received event data:", eventData);

    // Validate required fields
    const requiredFields = ["eventType"];

    if (requiredFields.length === 0) {
      return res.status(400).json({
        error: "Missing required event data fields",
      });
    }

    // call AI service to get feature recommendations based on the event Data
    const prompt = getFeatureSelectionPrompt(eventData);
    const resp = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: prompt,
    });
    if (!resp?.text) {
      return res.status(500).json({
        error: "No text response from AI model" + resp,
      });
    } else if (!("recommended" in JSON.parse(resp.text))) {
      return res.status(500).json({
        error: "Invalid response format from AI model" + resp.text,
      });
    }
    const recommendedFeatures: string[] = [
      "Venue",
      ...JSON.parse(resp.text).recommended,
    ].filter((item, pos, arr) => arr.indexOf(item) === pos); // add "Venue" as default recommended feature and remove duplicates

    // Send response back to client
    return res.json({
      allFeatures,
      recommendedFeatures,
    });
  } catch (error: any) {
    console.error("❌ Error in getFeatureRecommendations:", error);

    return res.status(500).json({
      error: "Failed to generate recommendations" + error.message,
    });
  }
};

// // get the recommended options for a single selected feature
// app.post("/api/featureOptionRecs", getFeatureOptionRecs)
// param:
// selectedFeature: String - the selected feature clicked
// chatmsgs: ChatMessage[] - a list of all the chat history for the selected feature
// currRecs: Recommendation[] - the current list of recommendations for the specific feature
// return {recommendations: { title, description, booking link, images, price, date, color, contact info, justification }[ ] } based on the AI's response
export const getFeatureOptionRecs = async (
  req: FeatureOptionsRequest,
  res: FeatureOptionsResponse
): Promise<FeatureOptionsResponse> => {
  try {
    // Extract data from request body
    const { selectedFeature, chatmsgs, currRecs } = req.body;
    console.log("Received selected feature:", selectedFeature);

    // Validate required fields
    if (!selectedFeature) {
      return res.status(400).json({
        error: "Missing selected feature in request body",
      });
    }
    const prompt = getFeatureOptionsPrompt(
      eventData,
      selectedFeature,
      chatmsgs,
      currRecs
    );
    const resp = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: prompt,
    });
    if (!resp?.text) {
      return res.status(500).json({
        error: "No text response from AI model" + resp,
      });
    } else if (!("recommendations" in JSON.parse(resp.text))) {
      return res.status(500).json({
        error: "Invalid response format from AI model" + resp.text,
      });
    }
    const recommendations: Recommendation[] = JSON.parse(
      resp.text
    ).recommendations;

    // Send response back to client
    return res.json({ recommendations: recommendations });
  } catch (error: any) {
    console.error("❌ Error in getFeatureOptionRecs:", error);
    return res.status(500).json({
      error: "Failed to generate recommendations" + error.message,
    });
  }
};

// get all the event options for the user to select in the form
// return {eventTypes: string[]}
export const getEventTypes = async (
  _req: GeneralRequest,
  res: EventTypesResponse
): Promise<EventTypesResponse> => {
  return res.json({ list: events });
};

// reset all event information within the server for the user to restart their planning
// return {success: boolean}
export const resetEventInfo = async (
  _req: GeneralRequest,
  res: ResetResponse
) => {
  // clear the event data
  eventData.eventType = "";
  eventData.date = new Date();
  eventData.location = "";
  eventData.price = "";
  eventData.attendees = "";
  // clear the todos
  selectedFeatures.clear();
  todos.clear();
  return res.json(true);
};

// get AI generated image based on the event details, selected features, and more
// return { generatedImage: string | null }
export const generateImage = async (
  req: ImageRequest,
  res: ImageResponse
): Promise<ImageResponse> => {
  try {
    // Extract data from request body
    const { featureIndex } = req.body;
    console.log("Received feature index for image generation.");
    // filter out to selected features only
    const selectedFeatures: Recommendation[] = featureIndex
      .map((feature) => feature.selected)
      .filter((selected): selected is Recommendation => selected !== null);

    // call the AI to generate an image based on the event details and selected features
    const prompt = getImageGenerationPrompt(eventData, selectedFeatures);
    const imageData: GenerateImagesResponse = await ai.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt,
      config: {
        numberOfImages: 1,
      },
    });

    return res.json({
      generatedImage:
        imageData.generatedImages &&
        imageData.generatedImages[0].image?.imageBytes !== undefined
          ? imageData.generatedImages[0].image.imageBytes
          : null,
    });
  } catch (error: any) {
    console.error("❌ Error in generateImage:", error);
    return res.status(500).json({
      error: "Failed to generate image" + error.message,
    });
  }
};

// get Chatbot Response for when user talks to the chatbot
// param:
// chatmsgs: ChatMessage[] - the list of all the chat messages between user and bot
// currRect: Recommendation[] - current list of recommendations for the selected features
// return {response: string}
export const chatResp = async (
  req: ChatbotRequest,
  res: ChatbotResponse
): Promise<ChatbotResponse> => {
  try {
    // Extract data from request body
    const { chatmsgs, currRecs } = req.body;
    console.log("Received chat messages for chatbot response.");

    // call the AI service to get chatbot response based on the chat messages and current recommendations
    const prompt = getChatbotResponsePrompt(eventData, chatmsgs, currRecs);
    const resp = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: prompt,
    });
    if (!resp?.text) {
      return res.status(500).json({
        error: "No text response from AI model" + resp,
      });
    } else if (!("response" in JSON.parse(resp.text))) {
      return res.status(500).json({
        error: "Invalid response format from AI model" + resp.text,
      });
    }
    const botRespData = JSON.parse(resp.text);
    const botResp: { response: string; newRecs?: Recommendation[] } = {
      response: botRespData.response,
      newRecs: botRespData.newRecs,
    };

    return res.json({ response: botResp.response, newRecs: botResp.newRecs });
  } catch (error: any) {
    console.error("❌ Error in chatResp:", error);

    return res.status(500).json({
      error: "Failed to generate chatResp" + error.message,
    });
  }
};

// update a specific Todo element
// param:
// feature: string - the feature that the todo is associated with (e.g. cake)
// todo: TodoType - the desired todo alter
// return {success: boolean}
export const updateTodo = async (
  req: updateTodoRequest,
  res: GeneralResponse
) => {
  // get the feature and todo from the request body
  const { feature, todo } = req.body;
  // update the todos map
  todos.set(feature, todo);
  // return success
  return res.json({ success: true });
};

// the feature option recommendation selected (e.g. a type of cake recommended for the feature "cake")
// the selected option should be added to the TODO list
// param
// feature: string - the selected feature in which the option recommendation comes from
// clickedRec: Recommendation - the option recommendation the user selected
// return ({newTodos: TodoType[]}) - updated list of todos to be displayed in the todo list
export const recommendationClicked = async (
  req: RecommendedRequest,
  res: TodoListResponse
): Promise<TodoListResponse> => {
  const { feature, clickedRec } = req.body;

  selectedFeatures.set(feature, clickedRec);

  const prompt = getTodoCreationPrompt(clickedRec);
  const resp = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: systemPrompt,
    },
    contents: prompt,
  });
  if (!resp?.text) {
    return res.status(500).json({
      error: "No text response from AI model" + resp,
    });
  } else if (!("todo" in JSON.parse(resp.text))) {
    return res.status(500).json({
      error: "Invalid response format from AI model" + resp.text,
    });
  }
  const todoText: { todo: string; type: "invite" | "book" | "generic" } =
    JSON.parse(resp.text);

  const newTodo: TodoType = {
    uid: `${feature}-${Date.now()}`,
    feature: feature,
    todo: todoText.todo,
    completed: false,
    type: todoText.type,
  };
  // for the clicked recommendation, generate expected todos and save them as a TodoType
  // into the todos map
  todos.set(feature, newTodo);

  const newTodosArray: TodoType[] = Array.from(todos.values());

  return res.json({ newTodos: newTodosArray });
};

const events: string[] = [
  "Anniversary Party",
  "Baby Shower",
  "Bachelor Party",
  "Bachelorette Party",
  "Bar Mitzvah",
  "Birthday Party",
  "Book Launch",
  "Bridal Shower",
  "Business Conference",
  "Charity Gala",
  "College Orientation",
  "Community Fair",
  "Company Retreat",
  "Concert",
  "Conference",
  "Corporate Dinner",
  "Corporate Workshop",
  "Cultural Festival",
  "Dance Recital",
  "Engagement Party",
  "Family Reunion",
  "Farewell Party",
  "Fashion Show",
  "Film Screening",
  "Fundraiser",
  "Game Night",
  "Gender Reveal Party",
  "Graduation Party",
  "Hackathon",
  "Holiday Party",
  "Homecoming",
  "Housewarming Party",
  "Job Fair",
  "Kids Birthday Party",
  "Launch Party",
  "Networking Event",
  "Panel Discussion",
  "Photo Shoot",
  "Picnic",
  "Pop-Up Market",
  "Press Conference",
  "Product Launch",
  "Prom",
  "Recruiting Event",
  "Rehearsal Dinner",
  "Retirement Party",
  "School Dance",
  "Seminar",
  "Sports Tournament",
  "Team Building Event",
  "Theater Performance",
  "Trade Show",
  "Training Session",
  "Volunteer Event",
  "Wedding Ceremony",
  "Wedding Reception",
  "Wellness Retreat",
  "Workshop",
  "Yoga Retreat",
];

export const allFeatures: string[] = [
  "Venue",
  "Alcohol Bar",
  "Backdrop",
  "Balloons",
  "Banner",
  "Buffet",
  "Cake",
  "Caterer",
  "Centerpieces",
  "Champagne Toast",
  "Clown",
  "Cocktail Bar",
  "Dance Floor",
  "Decorations",
  "DJ",
  "Face Painting",
  "Fireworks",
  "Flowers",
  "Food Truck",
  "Games",
  "Gift Table",
  "Guestbook",
  "Inflatables",
  "Invitation Cards",
  "Karaoke",
  "Lighting",
  "Live Band",
  "Magician",
  "Makeup Artist",
  "MC",
  "Menu Cards",
  "Music Playlist",
  "Party Favors",
  "Photo Booth",
  "Photographer",
  "Seating Arrangement",
  "Security Staff",
  "Sound System",
  "Stage",
  "Table Settings",
  "Tent",
  "Theme Decorations",
  "Video Montage",
  "Videographer",
  "Waitstaff",
  "Welcome Sign",
  "Wine Bar",
];
