import { Request, Response } from "express";
import { EventType } from "./types/eventType";
import { ChatMessage } from "./types/chatType";
import { Recommendation, FeatureType } from "./types/featureType";
import { TodoType } from "./types/todoType";
import { GoogleGenAI } from "@google/genai";

// list of todos
const todos = new Map<string, TodoType>();
const selectedFeatures = new Map<string, Recommendation>();

const EventData: EventType = {
  eventType: "",
  date: new Date(),
  location: "",
  price: "",
  attendees: "0",
};
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

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
type ImageResponse = Response<{ generatedImage: string } | { error: string }>;

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

type TodoListResponse = Response<{ newTodos: TodoType[] }>;

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

    // TODO: call AI service to get feature recommendations based on the event Data
    const recommendedFeatures: string[] = [];

    // 4. Send response back to client
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
    console.log(chatmsgs, currRecs);
    // call the AI to get three recommendations
    const recommendations: Recommendation[] = [];
    // TODO: ADD AI

    // Send response back to client
    return res.json({ recommendations });
  } catch (error: any) {
    console.error("❌ Error in getFeatureOptionRecs:", error);
    return res.status(500).json({
      error: "Failed to generate recommendations" + error.message,
    });
  }
};

// // get all the event options for the user to select in the form
// app.get("/api/getEventTypes", getEventTypes)
// return {eventTypes: string[]}
export const getEventTypes = async (
  _req: GeneralRequest,
  res: EventTypesResponse
): Promise<EventTypesResponse> => {
  return res.json({ list: events });
};

// // reset all event information within the server for the user to restart their planning
// app.post("/api/resetEventInfo", resetEventInfo)
// return {success: boolean}
export const resetEventInfo = async (
  _req: GeneralRequest,
  res: ResetResponse
) => {
  // clear the event data
  EventData.eventType = "";
  EventData.date = new Date();
  EventData.location = "";
  EventData.price = "";
  EventData.attendees = "";
  // clear the todos
  selectedFeatures.clear();
  todos.clear();
  return res.json(true);
};

// // get AI generated image based on the event details, selected features, and more
// app.post("/api/generateImage", generateImage)
// return {generatedImage: Image}
export const generateImage = async (
  req: ImageRequest,
  res: ImageResponse
): Promise<ImageResponse> => {
  try {
    // Extract data from request body
    const { featureIndex } = req.body;
    console.log("Received feature index for image generation.");
    // filter out to selected features only
    const selectedFeature = featureIndex
      .filter((feature) => feature.selected !== null)
      .map((feature) => feature.selected);

    // call the AI to generate an image based on the event details and selected features
    const imageData = ""; // TODO: ADD AI
    console.log(selectedFeature);

    return res.json({ generatedImage: imageData });
  } catch (error: any) {
    console.error("❌ Error in generateImage:", error);
    return res.status(500).json({
      error: "Failed to generate image" + error.message,
    });
  }
};

// // get Chatbot Response for when user talks to the chatbot
// app.post("/api/chatResp", chatResp)
// param:
// context: String - user chat context
// return {response: string}
export const chatResp = async (
  req: ChatbotRequest,
  res: ChatbotResponse
): Promise<ChatbotResponse> => {
  try {
    // Extract data from request body
    const { chatmsgs, currRecs } = req.body;
    console.log("Received chat messages for chatbot response.");
    // TODO: ADD AI
    const ai: { response: string; newRecs?: Recommendation[] } = {
      response: "This is a placeholder response from the chatbot.",
    };
    console.log(chatmsgs, currRecs);
    return res.json({ response: ai.response, newRecs: ai.newRecs });
  } catch (error: any) {
    console.error("❌ Error in chatResp:", error);

    return res.status(500).json({
      error: "Failed to generate chatResp" + error.message,
    });
  }
};

// // send new Todo to server
// app.post("api/addNewTodo", addNewTodo)
// param:
// todo: Recommendation - the desired todo to add
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

  // TODO: add AI
  // for the clicked recommendation, generate expected todos and save them as a TodoType
  // into the todos map

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

const allFeatures: string[] = [
  // Event Basics
  "Event Name",
  "Event Type",
  "Event Theme/Style",
  "Event Date Suggestions",
  "Event Duration",
  "Indoor or Outdoor Recommendation",
  "Location Suggestions (city, venue type)",

  // Attendee Planning
  "Estimated Guest Count",
  "Seating Arrangement Ideas",
  "RSVP Tracking Tools",
  "Guest List Planning",
  "Accessibility Considerations",

  // Budget Guidance
  "Budget Planning",
  "Cost Estimations by Category",
  "Vendor Cost Ranges",
  "Suggested Budget Allocation",
  "Low-Budget Event Tips",

  // Vendor Recommendations (Digital Support Only)
  "Catering Options & Styles",
  "Cake Ideas & Designs",
  "Beverage Options",
  "Food Truck Ideas",
  "Photographer/Videographer Suggestions",
  "DJ/Band/Music Suggestions",
  "Balloon Decor Ideas",
  "Florist/Decoration Styles",
  "Lighting Style Inspiration",
  "Table Setup Ideas",
  "Chair & Table Rental Types",
  "Clown or Children’s Entertainment Suggestions",
  "Magician/Performer Ideas",
  "Photo Booth Ideas",

  // Entertainment & Programming
  "Entertainment Options by Event Type",
  "Playlist Suggestions",
  "Stage/Performance Ideas",
  "MC/Host Guidelines",
  "Games and Activities",
  "Kids' Activities",
  "Interactive Booth Ideas",

  // Digital Tools & Technology
  "Event Website Builder Suggestions",
  "Online Invitations Tools",
  "Ticketing Platforms",
  "RSVP/Registration Platforms",
  "Event App Recommendations",
  "Live Streaming Setup Tips",
  "Photo Sharing Tools",
  "Check-in Tools",
  "QR Code Usage Ideas",

  // Visual Design & Aesthetics
  "Color Palette Generator",
  "Theme Inspiration",
  "Decoration Ideas",
  "Centerpiece Ideas",
  "Signage Style Suggestions",
  "Backdrop & Photo Area Inspiration",
  "Balloon Arch/Bouquet Inspiration",

  // Marketing & Promotion
  "Event Branding Tips",
  "Hashtag Suggestions",
  "Social Media Promotion Tips",
  "Email Campaign Templates",
  "Flyer and Poster Template Recommendations",
  "Countdown and Hype Strategies",

  // Hospitality Suggestions
  "Welcome Gift Ideas",
  "Guest Accommodation Ideas",
  "Transportation Ideas for Guests",
  "Food Allergy Planning Tips",

  // Schedule & Planning
  "Event Itinerary Generator",
  "Timeline Planning Tools",
  "Checklists & To-Dos",
  "Setup/Teardown Schedule Template",

  // Sustainability
  "Eco-Friendly Vendor Suggestions",
  "Zero-Waste Tips",
  "Sustainable Decor Ideas",
  "Digital Invitation Tools",

  // Post-Event
  "Thank You Message Templates",
  "Feedback Survey Tools",
  "Photo/Video Sharing Platforms",
  "Highlight Reel Ideas",

  // Miscellaneous
  "Pet-Friendly Event Tips",
  "Seasonal Theme Suggestions",
  "Cultural or Religious Custom Tips",
  "Weather Contingency Ideas",
  "Mood Board Generator",
];
