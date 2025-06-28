import React, {useState, useEffect} from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {Icon} from "@ui-kitten/components";

interface LocationInputProps {
  placeholder: string;
  onLocationSelect: (location: Location) => void;
  value?: string;
  isActive?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  mapboxAccessToken: string;
}

interface Location {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface Prediction {
  description: string;
  place_id: string;
  mapbox_id?: string;
  text?: string;
  place_name?: string;
  center?: [number, number];
}

const LocationInput: React.FC<LocationInputProps> = ({
  placeholder,
  onLocationSelect,
  value,
  isActive,
  onFocus,
  onBlur,
  mapboxAccessToken,
}) => {
  const [searchText, setSearchText] = useState(value || "");
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const searchPlaces = async (text: string) => {
    if (!mapboxAccessToken) {
      console.error("LocationInput: Mapbox Access Token is missing!");
      setPredictions([]);
      return;
    }
    if (text.length < 2) {
      setPredictions([]);
      return;
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      text,
    )}.json?access_token=${mapboxAccessToken}&autocomplete=true&limit=5`;

    try {
      const response = await fetch(url);
      const responseText = await response.text();

      if (!response.ok) {
        console.error(
          `LocationInput: Mapbox API Error - Status: ${response.status}`,
          responseText,
        );
        setPredictions([]);
        return;
      }

      const data = JSON.parse(responseText);

      if (data.features) {
        const mappedPredictions = data.features.map((feature: any) => ({
          description: feature.place_name,
          place_id: feature.id,
          mapbox_id: feature.id,
          text: feature.text,
          place_name: feature.place_name,
          center: feature.center,
        }));
        setPredictions(mappedPredictions);
      } else {
        setPredictions([]);
      }
    } catch (error) {
      console.error(
        "LocationInput: Error fetching or parsing Mapbox predictions:",
        error,
      );
      setPredictions([]);
    }
  };

  const handleSelectPlace = async (prediction: Prediction) => {
    setSearchText(prediction.place_name || prediction.description);
    setPredictions([]);
    if (prediction.center) {
      onLocationSelect({
        address: prediction.place_name || prediction.description,
        coordinates: {
          lng: prediction.center[0],
          lat: prediction.center[1],
        },
      });
    } else {
      console.warn("Selected place does not have coordinates:", prediction);
      onLocationSelect({
        address: prediction.place_name || prediction.description,
        coordinates: {lat: 0, lng: 0},
      });
    }
  };

  useEffect(() => {
    if (isActive && searchText) {
      searchPlaces(searchText);
    } else {
      setPredictions([]);
    }
  }, [searchText, isActive]);

  useEffect(() => {
    setSearchText(value || "");
  }, [value]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Icon name="search" fill="#fff" width={20} height={20} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#fff"
          value={searchText}
          onChangeText={setSearchText}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <Icon name="pin-outline" fill="#fff" width={20} height={20} />
      </View>
      {isActive && predictions.length > 0 && (
        <ScrollView
          style={styles.listView}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}>
          {predictions.map(item => (
            <TouchableOpacity
              key={item.mapbox_id || item.place_id}
              style={styles.row}
              onPress={() => handleSelectPlace(item)}>
              <Text style={styles.predictionText}>
                {item.place_name || item.description}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    minHeight: 45,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 45,
    backgroundColor: "#353f3b",
    borderRadius: 8,
  },
  input: {
    flex: 1,
    height: "100%",
    marginHorizontal: 10,
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
    color: "#fff",
  },
  listView: {
    backgroundColor: "#353f3b",
    borderRadius: 8,
    marginTop: 5,
    maxHeight: 200,
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  row: {
    backgroundColor: "#353f3b",
    padding: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#4a5751",
  },
  predictionText: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#fff",
  },
});

export default LocationInput;
