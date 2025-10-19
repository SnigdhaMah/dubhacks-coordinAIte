import { EventType } from "../types/eventType";
import { FeatureType, Recommendation } from "../types/featureType";
import { ChatMessage } from "../types/chatType";
import { TodoType } from "../types/todoType";
// import * as fs from "fs";

// global index to generate file
let index = 0;

// get the all features to be displayed in the feature grid, with the AI rec'd features first in the list
// and all other possible features after
// param:
// eventDetails: EventType - Event Details
// return {allFeatures: string[], recommendedFeatures: string[] }
export const getPossibleFeatures = async (
  eventData: EventType
): Promise<{
  allFeatures: string[];
  recommendedFeatures: string[];
}> => {
  try {
    // make a POST request to the server with the event data
    const response = await fetch(`/api/getPossibleFeatures`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    // Check if request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // if response ok, parse the response as JSON
    const data = await response.json();
    return {
      allFeatures: data.allFeatures,
      recommendedFeatures: data.recommendedFeatures,
    };
  } catch (error) {
    console.error("Error fetching feature recommendations:", error);
    throw error;
  }
};

// // get the recommended options for a single selected feature
// app.post("/api/featureOptionRecs", getFeatureOptionRecs)
// param:
// selectedFeature: String - the selected feature clicked
// chatmsgs: ChatMessage[] - a list of all the chat history for the selected feature
// currRecs: Recommendation[] - the current list of recommendations for the specific feature
// return {recommendations: { title, description, booking link, images, price, date, color, contact info, justification }[ ] } based on the AI's response
// return {recommendations: Recommendation[ ] } based on the AI's response
export const getFeatureOptionRecs = async (
  selectedFeature: string, // the feature title (e.g.cake)
  chatmsgs: ChatMessage[],
  currRecs: Recommendation[]
): Promise<Recommendation[]> => {
  // make a POST request to the server with the event data
  const response = await fetch(`/api/featureOptionRecs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ selectedFeature, chatmsgs, currRecs }),
  });
  return response.json().then((data) => {
    console.log("CLIENT GOT", data);
    return data.recommendations});
};

// get all the event options for the user to select in the form
// return {eventTypes: string[]}
export const getEventTypes = async (): Promise<string[]> => {
  const response = await fetch(`/api/getEventTypes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json().then((data) => data.list);
};

// reset all event information within the server for the user to restart their planning
// return {success: boolean}
export const resetEventInfo = async (): Promise<boolean> => {
  await fetch(`/api/resetEventInfo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return true;
};

// get AI generated image based on the event details, selected features, and more
// return { generatedImage: string | null }
export const generateImage = async (
  featureIndex: FeatureType[]
): Promise<string> => {
  const response = await fetch(`/api/generateImage`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ featureIndex }),
  });

  return response.json().then((data) => {
    const bytes = data.generatedImage;
    if (bytes == null) {
      return "";
    }
    // const buffer = Buffer.from(data, "base64");
    // fs.writeFileSync(
    //   `../img/generatedImage-${index}.png`,
    //   new Uint8Array(buffer)
    // );
    index++;
    return `../img/generatedImage-${index}.png`; // return the file
  });
};

// get Chatbot Response for when user talks to the chatbot
// param:
// chatmsgs: ChatMessage[] - the list of all the chat messages between user and bot
// currRect: Recommendation[] - current list of recommendations for the selected features
// return {response: string}
export const chatResp = async (
  chatmsgs: ChatMessage[],
  currRecs: Recommendation[],
  feature: string
): Promise<{ response: string; newRecs?: Recommendation[] }> => {
  const response = await fetch(`/api/chatResp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      feature,
      messages: chatmsgs,
      currentRecs: currRecs,
    }),
  });
  return response.json().then((data) => ({
    response: data.response,
    newRecs: data.newRecs,
  }));
};

// the feature option recommendation selected (e.g. a type of cake recommended for the feature "cake")
// the selected option should be added to the TODO list
// param
// feature: string - the selected feature in which the option recommendation comes from
// clickedRec: Recommendation - the option recommendation the user selected
// return ({newTodos: TodoType[]}) - updated list of todos to be displayed in the todo list
export const recommendationClicked = async (
  feature: string,
  clickedRec: Recommendation
): Promise<TodoType[]> => {
  // send the clicked recommendation to the server and get back the updated todo list
  const response = await fetch(`/api/recommendationClicked`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ feature: feature, recommendation: clickedRec }),
  });
  return response.json().then((data) => data.todos as TodoType[]);
};

// update a specific Todo element
// param:
// feature: string - the feature that the todo is associated with (e.g. cake)
// todo: TodoType - the desired todo alter
// return {success: boolean}
export const updateTodoRoute = async (
  feature: string,
  todo: TodoType
): Promise<boolean> => {
  // update the server's todos
  const response = await fetch(`/api/updateTodo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ feature: feature, todo: todo }),
  });
  return response.json().then((data) => data.success);
};
