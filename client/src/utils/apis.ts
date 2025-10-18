import { EventType } from "../types/eventType";
import { FeatureType, Recommendation } from "../types/featureType";
import { ChatMessage } from "../types/chatType";
import { TodoType } from "../types/todoType";

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

export const getFeatureOptionRecs = async (
  selectedFeature: string
): Promise<Recommendation[]> => {
  return [];
};

export const getEventTypes = async (): Promise<string[]> => {
  return [];
};

export const resetEventInfo = async (): Promise<boolean> => {
  return true;
};

export const generateImage = async (): Promise<Base64URLString> => {
  return "";
};

export const chatResp = async (
  chatmsgs: ChatMessage[],
  currRecs: Recommendation[]
): Promise<{ response: string; newRecs?: Recommendation[] }> => {
  return { response: "Hello!" };
};

export const recommendationClicked = async (
  feature: string,
  rec: Recommendation
): Promise<TodoType[]> => {
  return [];
};

export const updateTodoRoute = async (
  feature: string,
  todo: TodoType
): Promise<boolean> => {
  // update the server's todos
  return true;
};
