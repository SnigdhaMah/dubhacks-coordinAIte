import { EventDataType } from '../types/eventDataType';
import { FeatureType } from '../types/featureType';

export const getFeatureRecommendations = async (eventData: EventDataType): Promise<FeatureType[]> => {
    try {
        // make a POST request to the server with the event data
        const response = await fetch(`/api/recFeatures`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        })

        // Check if request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // if response ok, parse the response as JSON
        const data = await response.json();
        return data.features as FeatureType[] || [];
    } catch (error) {
        console.error("Error fetching feature recommendations:", error);
        throw error; 
    }
}

