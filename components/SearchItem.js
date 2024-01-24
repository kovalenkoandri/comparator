import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Text,
} from "react-native";
import Colors from "../utils/Colors";
import * as Linking from "expo-linking";

export default SearchItem = ({ item }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => Linking.openURL(item.siteAddress)}
        style={styles.btn}
      >
        <Text style={styles.name}>Price: {item.price}</Text>
        <Text style={styles.name}>{item.siteAddress}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light_grey,
    marginLeft: "auto",
    marginRight: "auto",
    width: '96%'
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
