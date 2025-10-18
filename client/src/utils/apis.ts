import { EventType } from "../types/eventType";
import { Recommendation } from "../types/featureType";
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

// on the specific feature page, get the options/recommendations for the selected feature
export const getFeatureOptionRecs = async (
  selectedFeature: string // the feature title (e.g.cake)
): Promise<Recommendation[]> => {
  // make a POST request to the server with the event data
  const response = await fetch(`/api/featureOptionRecs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(selectedFeature),
  });
  return response.json().then((data) => data.recommendations);
};

// get all the event options for the user to select in the form
export const getEventTypes = async (): Promise<string[]> => {
  const response = await fetch(`/api/getEventTypes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json().then((data) => data.list);
};

export const resetEventInfo = async (): Promise<boolean> => {
  await fetch(`/api/resetEventInfo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return true;
};

export const generateImage = async (): Promise<string> => {
  const response = await fetch(`/api/generateImage`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json().then((data) => data.image as string);
};

export const chatResp = async (
  chatmsgs: ChatMessage[],
  currRecs: Recommendation[]
): Promise<{ response: string; newRecs?: Recommendation[] }> => {
  const response = await fetch(`/api/chatResp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages: chatmsgs, currentRecs: currRecs }),
  });
  return response.json().then((data) => ({
    response: data.response,
    newRecs: data.newRecs,
  }));
};

export const recommendationClicked = async (
  feature: string,
  rec: Recommendation
): Promise<TodoType[]> => {
  // send the clicked recommendation to the server and get back the updated todo list
  const response = await fetch(`/api/recommendationClicked`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ feature: feature, recommendation: rec }),
  });
  return response.json().then((data) => data.todos as TodoType[]);
};

export const updateTodoRoute = async (
  feature: string,
  todo: TodoType
): Promise<boolean> => {
  // update the server's todos
  await fetch(`/api/updateTodo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ feature: feature, todo: todo }),
  });
  return true;
};
