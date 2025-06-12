import {EvChargingStation} from "../../types/evCharging/evChargingTypes";

const API_BASE_URL = "https://api.openchargemap.io/v3";
const API_KEY = "b76ee429-553c-4685-b594-aac6666c0dcd"; // Replace with actual API key

export const fetchEvChargingStations = async (
  latitude: number,
  longitude: number,
  distance: number = 10, // Default 10 miles radius
  maxResults: number = 20, // Default 20 results
): Promise<EvChargingStation[]> => {
  try {
    const params = new URLSearchParams({
      output: "json",
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      distance: distance.toString(),
      distanceunit: "Miles",
      maxresults: maxResults.toString(),
      compact: "true",
      verbose: "false",
      key: API_KEY,
    });

    const response = await fetch(`${API_BASE_URL}/poi/?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data as EvChargingStation[];
  } catch (error) {
    console.error("Error fetching EV charging stations:", error);
    throw error;
  }
};

// Get reference data like connection types
export const fetchEvChargingReferenceData = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/referencedata?key=${API_KEY}`,
    );

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching EV charging reference data:", error);
    throw error;
  }
};
