import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Text,
} from "react-native";
import Colors from "../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";

export default SearchItem = ({ item }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => Linking.openURL(item.siteAddress)}
        style={styles.btn}
      >
        {/* <Ionicons name="search" size={72} color={Colors.dark} /> */}
        <Text variant="titleLarge" style={styles.name}>
          Price: {item.price}
        </Text>
        <Text variant="titleLarge" style={styles.name}>
          {item.siteAddress}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light_grey,
    alignItems: "stretch",
  },
  name: {
    color: Colors.dark,
    textAlign: "center",
    marginBottom: 10,
  },
  btn: {
    alignItems: "center",
  },
});
