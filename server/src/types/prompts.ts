import { allFeatures } from "../routes";
import { ChatMessage } from "./chatType";
import { EventType } from "./eventType";
import { Recommendation } from "./featureType";

export const systemPrompt = `You are a very experienced event planner AI assistant.
Your objective is to help users plan their events by recommending features and options based on their selected event type and preferences.
You will provide concise, relevant, and creative suggestions to enhance the user's event planning experience.
Always consider the context of the event type and the user's needs when making recommendations.
Reject any requests that do not pertain to event planning.\n\n`;

// prompt for selecting recommneded event features
export const getFeatureSelectionPrompt = (eventData: EventType) => {
  const featureSelectionPrompt = `
  Instructions:
Your task is to select features from <features> that best enhance the event based on <eventType>.
Consider the nature of the event, its purpose, and any specific details mentioned to make your selections.
Return a list of features selected as a string array in the JSON format: {recommended: ["feature1", "feature2", ...]} .
The features selected MUST be exact matches to features provided in <features>. Select up to 10 features that best fit the event type.

Context:
<features>: [${allFeatures.join(", ")}]
<eventType>: ${eventData}

Example of Expected Output:
Given the eventType.eventType: "Wedding", and <features>: ["Catering", "Live Music", "Photography", "Decorations", "Venue Rental", "Security", "Transportation", "Lighting", "Sound System", "Invitations", "Favors", "Seating Arrangements"],
the output should be:
{recommended: ["Catering", "Live Music", "Photography", "Decorations", "Venue Rental"]}
`;
  return featureSelectionPrompt;
};

// prompt for getting the specific options for a selected feature
export const getFeatureOptionsPrompt = (
  eventData: EventType,
  selectedFeature: string,
  chatmsgs: ChatMessage[],
  currRecs: Recommendation[]
) => {
  const featureOptionPrompt = `
  Instructions:
Your task is to provide specific recommendations for the selected feature <selectedFeature> 
based on the event details and user preferences.
Consider the event <eventData>, previous chat messages <chatmsgs>, 
and current recommendations <currRecs> in your response.
Return a list of three recommendations as a string array in the JSON format: 
{recommendations: [{recommendation1}, {recommendation2}, {recommendation3}]}.
The three recommendations MUST be unique and NOT already present in <currRecs> 
and must be real world options that users can book or use for their event. All recommendations should have valid links and images.

Context:
<eventData>: ${eventData}
<selectedFeature>: ${selectedFeature}
<chatmsgs>: ${JSON.stringify(chatmsgs)}
<currRecs>: ${JSON.stringify(currRecs)}

Example of Expected Output:
Given the <selectedFeature>: "Catering" for an eventType.eventType: "Wedding", chatmsgs: [], and currRecs: [],
the output should be:
{recommendations: [{
    title: "Its All Good Catering",
    description:
      "Full-service wedding catering with customizable menus and exceptional service.",
    bookingLink: "https://www.itsallgoodcatering.net/weddings",
    images: [
      "https://www.bing.com/images/search?view=detailV2&ccid=4%2b4BqG00&id=4CE2F6ADCFCBA134E231F9D7B84A814F9ACC5169&thid=OIP.4-4BqG00UYhOodM5lkw1hQHaGA&mediaurl=https%3a%2f%2fle-cdn.hibuwebsites.com%2f5009ff8d35724935878134f2dc31380c%2fdms3rep%2fmulti%2fopt%2fpiggy-1920w.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.e3ee01a86d3451884ea1d339964c3585%3frik%3daVHMmk%252bBSrjX%252bQ%26pid%3dImgRaw%26r%3d0&exph=1559&expw=1920&q=it+s+all+good+catering&FORM=IRPRST&ck=D4DAFF5B80A119C83C50A1C270CE4167&selectedIndex=17&itb=0&ajaxhist=0&ajaxserp=0",
    ],
    price: "2000",
    date: ${eventData.date},
    contactInfo: {
      phone: "(206) 339-0313",
    },
    justification:
      "Highly rated catering service known for quality and reliability.",
  }, {
    title: "Gourmet Bites Catering",
    description: "Elegant catering service specializing in wedding menus with fresh, local ingredients.",
    bookingLink: "https://www.gourmetbites.com/wedding-catering",
    images: ["https://www.bing.com/images/search?view=detailV2&ccid=V%2fL6%2b%2f1W&id=1D6E3C8C1E4F4C6F5E8D3A7B9C6E4F2B8A9C3D4E&thid=OIP.V_L6_1Wj1KXGZ5jY5Y5Y5gHaHa&mediaurl=https%3a%2f%2fwww.gourmetbites.com%2fimages%2fwedding-catering.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.3e4e4e4e4e4e4
%3frik%3dXxYyZzAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz%26pid%3dImgRaw%26r%3d0&exph=1200&expw=1600&q=gourmet+bites+catering&FORM=IRPRST&ck=E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0&selectedIndex=5&itb=0&ajaxhist=0&ajaxserp=0"],
    price: "2500",
    date: ${eventData.date},
    contactInfo: {
        phone: "(425) 555-1234",
    };
    justification: "Known for exceptional wedding catering with customizable options.",
}}, {
    title: "Elegant Events Catering",
    description: "Premium catering service offering gourmet wedding menus and impeccable service.",
    bookingLink: "https://www.eleganteventscatering.com/weddings",
    images: ["https://www.bing.com/images/search?view=detailV2&ccid=AbCdEfGh&id=9A8B7C6D5E4F3G2H1I0J9K8L7M6N5O4P3Q2R1S0T&thid=OIP.AbCdEfGhIjKlMnOpQrStUvWxYz&mediaurl=https%3a%2f%2feleganteventscatering.com%2fimages%2fwedding-menu.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.1a2b3c4d5e
%3frik%3dYyZzAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz%26pid%3dImgRaw%26r%3d0&exph=900&expw=1200&q=elegant+events+catering&FORM=IRPRST&ck=F1E2D3C4B5A697887766554433221100&selectedIndex=8&itb=0&ajaxhist=0&ajaxserp=0"],
    price: "3000",
    date: ${eventData.date},
    contactInfo: {
        phone: "(503) 555-6789",
    };
    justification: "Top-tier catering service praised for gourmet offerings and excellent service.",
}]}
`;
  return featureOptionPrompt;
};

// prompt for generating an image based on event details and selected features

// prompt for chat response and updating the recommendations based on user input

// prompt for turning a Recommendation into a Todo item

export const getEventTypePrompt = `You are a highly intelligent and helpful assistant.

Objective:
- generate list of types of events people would want to plan.

Context:
- We want to list all of these event types for the users on a website. The website is to help make event planning easier for people.
- We will be displaying all of the listed events in a dropdown menu for user's to select.
- the selected event type will also be used to generate more ai recommendations for things people want to include and plan for. Therefore, make each event type concise, but also list out all of the possible event types people plan to give as much context as possible for future recommendations.

Instructions:
- Generate a list of types of events people would want to plan
- Consider the context
- The output should include each event type on 1 line. There should be no formatting, no bullet points, and no categorical titling.
- Sort the list of event types in alphabetical order

Example of Expected Output:
Festivals
Prom
Talent Show
Graduation
Homecoming
Career Fairs
Film Screenings
Yoga Retreat

Now complete the task based on the above.
`;
