import { Request, Response } from "express";
import { EventType } from "../types/eventType";
import { ChatMessage } from "../types/chatType";
import { Recommendation, FeatureType } from "../types/featureType";
import { TodoType } from "../types/todoType";


// Require type checking of request body.
// Request<Params, ResBody, ReqBody, ReqQuery>
// Response<ResBody>
type PossibleFeaturesRequest = Request<{}, {}, EventType>;
type PossibleFeaturesResponse = Response<{allFeatures: string[], recommendedFeatures: string[] }>

type GeneralRequest = Request;
type GeneralResponse = Response;  // only writing, so no need to check

type FeatureOptionsRequest = Request<{}, {}, string>;
type FeatureOptionsResponse = Response<Recommendation[]>;

type EventTypesResponse = Response<string[]>;

type ResetResponse = Response<boolean>;

type ImageResponse = Response<Base64URLString>;

type ChatbotRequest = Request<{}, {}, {chatmsgs: ChatMessage[], currRecs: Recommendation[]}>;
type ChatbotResponse = Response<{response: string, newRecs?: Recommendation[]}>;

type TodoListResponse = Response<TodoType[]>;

type updateTodoRequest = Request<{}, {}, {feature: string, todo: Recommendation}>; // todo list is stored as a map {key: feature, value: Recommendation}






// get the all features to be displayed in the feature grid, with the AI rec'd features first in the list
// and all other possible features after
// param: 
// eventDetails: EventType - Event Details
// return {allFeatures: string[], recommendedFeatures: string[] }
export const getPossibleFeatures = async (req: PossibleFeaturesRequest, res: PossibleFeaturesResponse): Promise<PossibleFeaturesResponse> => {
  try {
    // Extract data from request body
    const eventData = req.body;

    console.log('Received event data:', eventData);

    // Validate required fields
    const requiredFields = ['eventType'];
    
    if (requiredFields.length === 0) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    // TODO: call AI service to get feature recommendations based on the event Data 

    // 4. Send response back to client
    return res.json({ 
      success: true,
      features: [{title: 'Feature 1', description: 'description 1'}, {title: 'Feature 2', description: 'description 2'}], // TODO: Replace with actual features
      message: 'Feature recommendations generated successfully'
    });
  } catch (error: any) {
    console.error('❌ Error in getFeatureRecommendations:', error);
    
    return res.status(500).json({ 
      error: 'Failed to generate recommendations',
      message: error.message 
    });
  }

}



// // get the recommended options for a single selected feature
// app.post("/api/featureOptionRecs", getFeatureOptionRecs)
// param: 
// selectedFeature: String - the selected feature clicked
// return {recommendations: { title, description, booking link, images, price, date, color, contact info, justification }[ ] } based on the AI's response 
export const getFeatureOptionRecs = async (req: FeatureOptionsRequest, res: FeatureOptionsResponse): Promise<FeatureOptionsResponse> => {

}

// // get all the event options for the user to select in the form
// app.get("/api/getEventTypes", getEventTypes)
// return {eventTypes: string[]}
export const getEventTypes = async (req: GeneralRequest, res: EventTypesResponse): Promise<EventTypesResponse> => {
  
}


// // reset all event information within the server for the user to restart their planning
// app.post("/api/resetEventInfo", resetEventInfo)
// return {success: boolean}
export const resetEventInfo = async (req: GeneralRequest, res: ResetResponse) => {
  
}


// // get AI generated image based on the event details, selected features, and more
// app.post("/api/generateImage", generateImage)
// return {generatedImage: Image}
export const generateImage = async (req: GeneralRequest , res: ImageResponse): Promise<ImageResponse> => {
  
}


// // get Chatbot Response for when user talks to the chatbot 
// app.post("/api/chatResp", chatResp)
// param: 
// context: String - user chat context
// return {response: string}
export const chatResp = async (req: ChatbotRequest, res: ChatbotResponse): Promise<ChatbotResponse> => {
  
}


// // get the list of todos (all the selected stuff that the user has "locked in")
// app.get("/api/getListTodos", getListTodos)
// return {list: TodoType}
export const getListTodos = async (req: GeneralRequest, res: TodoListResponse): Promise<TodoListResponse> => {
  
}


// // send new Todo to server
// app.post("api/addNewTodo", addNewTodo)
// param: 
// todo: Recommendation - the desired todo to add
// return {success: boolean}
export const addNewTodo = async (req: updateTodoRequest, res: GeneralResponse) => {
  
}


