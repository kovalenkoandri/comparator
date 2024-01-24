import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  FlatList,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Button,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import Colors from "../utils/Colors";
import SearchItem from "./SearchItem";
import HeaderTextExample from "./TextExample";
import { timeoutPromise } from "../utils/Tools";
import { API_URL } from "../utils/Config";
const { height, width } = Dimensions.get("window");

export const Header = () => {
  const [keyword, setKeyword] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [products, setProducts] = useState([]);
  const [isButtonActive, setButtonActive] = useState(true);
  const fetchProductByGoogle = async (request) => {
    setButtonActive(false);
    let data = [];
    const response = await timeoutPromise(
      fetch(`${API_URL}/?url=${request}`, {
        method: "GET",
      }),
      setButtonActive,
    );

    // console.log(JSON.stringify(response, null, 2));

    const responseGoogle = await response.json();
    data = responseGoogle.map((item, index) => ({
      ...item,
      _id: index,
    }));
    data.length === 0 ? setNotFound(true) : setNotFound(false);

    setProducts((prevProducts) => {
      const dups = [...prevProducts, ...data];
      const filteredDups = dups.filter((value, index, self) => {
        return (
          index === self.findIndex((t) => t.siteAddress === value.siteAddress)
        );
      });
      filteredDups.sort((a, b) => a.price - b.price);
      setButtonActive(true);

      return filteredDups;
    });
  };
  const onSubmit = () => {
    try {
      fetchProductByGoogle(keyword);
    } catch (err) {
      console.log("error fetching products" + err);
    }
  };
  return (
    <View>
      <View style={styles.input_box}>
        <TextInput
          maxLength={20}
          autoFocus
          placeholder="Введіть код"
          value={keyword}
          onChangeText={(value) => setKeyword(value)}
          style={styles.input}
          // mode="outlined"
          outlineStyle={{ borderRadius: 12, borderColor: Colors.blue }}
        />
        <TouchableOpacity
          disabled={!isButtonActive || keyword.length < 3}
          onPress={() => onSubmit()}
          // mode="elevated"
          style={[
            styles.button,
            {
              backgroundColor:
                keyword.length < 3 || !isButtonActive ? Colors.grey : Colors.bg,
            },
          ]}
        >
          <Text style={styles.text}>GO!</Text>
        </TouchableOpacity>
      </View>

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {products.length === 0 && !notFound ? (
          <HeaderTextExample />
        ) : (
          <View
            style={{
              width,
              flex: 1,
              marginHorizontal: 20,
              marginTop: Platform.OS === "android" ? 0 : height < 668 ? 0 : 60,
            }}
          >
            {notFound ? (
              <HeaderTextExample>
                <Text
                  // variant="headlineMedium"
                  style={styles.searchResultNotFound}
                >
                  За даним кодом товар не знайдено
                </Text>
              </HeaderTextExample>
            ) : (
              <FlatList
                nestedScrollEnabled={true}
                style={styles.flatList}
                data={products}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                  return <SearchItem item={item} />;
                }}
              />
            )}
          </View>
        )}
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  flatList: {},
  input_box: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: Colors.bluegreen,
  },
  input: {
    width: "90%",
    height: 80,
    fontSize: 36,
    margin: 8,
    backgroundColor: Colors.dark,
    color: Colors.white,
    textAlign: "center",
    padding: 4,
    borderRadius: 12,
    borderColor: Colors.blue,
  },
  searchResultNotFound: {
    textAlign: "center",
    color: Colors.dark,
    padding: 4,
  },
  button: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: Colors.bg,
  },
  text: {
    fontSize: 32,
    lineHeight: 32,
    fontWeight: "bold",
    letterSpacing: 3,
    color: Colors.dark,
  },
});
