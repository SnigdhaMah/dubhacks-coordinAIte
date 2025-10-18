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