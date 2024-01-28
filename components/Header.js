import React, { useState, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import Colors from "../utils/Colors";
import SearchItem from "./SearchItem";
import HeaderTextExample from "./TextExample";
import { timeoutPromise } from "../utils/Tools";
import { API_URL } from "../utils/Config";
const { width } = Dimensions.get("window");

export const Header = () => {
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [keyword, setKeyword] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filtered, setFiltered] = useState(false);
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

    setProducts(() => {
      const dups = [...data];
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
  const handleFrom = (text) => {
    setFromValue(text);
    if (parseFloat(text)) {
      setFilteredProducts(() => {
        const filteredFrom = products.filter((el) => {
          return parseFloat(el.price) >= parseFloat(text);
        });
        const filteredTo = filteredFrom.filter((el) => {
          if (!toValue) {
            return parseFloat(el.price) <= parseFloat("999999999999");
          }
          return parseFloat(el.price) <= parseFloat(toValue);
        });
        filteredTo.sort((a, b) => a.price - b.price);
        return filteredTo;
      });
      setFiltered(true);
    } else {
      if (toValue) {
        setFilteredProducts(() => {
          const filteredTo = products.filter((el) => {
            return parseFloat(el.price) <= parseFloat(toValue);
          });
          filteredTo.sort((a, b) => a.price - b.price);
          return filteredTo;
        });
      } else {
        setFiltered(false);
      }
    }
  };
  const handleTo = (text) => {
    setToValue(text);
    if (parseFloat(text) || parseFloat(text) === 0) {
      setFilteredProducts(() => {
        const filteredTo = products.filter((el) => {
          return parseFloat(el.price) <= parseFloat(text);
        });
        const filteredFrom = filteredTo.filter((el) => {
          if (!fromValue) {
            return parseFloat(el.price) >= parseFloat("0");
          }
          return parseFloat(el.price) >= parseFloat(fromValue);
        });
        filteredFrom.sort((a, b) => a.price - b.price);
        return filteredFrom;
      });
      setFiltered(true);
    } else {
      if (fromValue) {
        setFilteredProducts(() => {
          const filteredFrom = products.filter((el) => {
            return parseFloat(el.price) >= parseFloat(fromValue);
          });
          filteredFrom.sort((a, b) => a.price - b.price);
          return filteredFrom;
        });
      } else {
        setFiltered(false);
      }
    }
  };
  return (
    <View>
      <View style={styles.input_box}>
        <TextInput
          maxLength={20}
          autoFocus
          placeholder="model to compare..."
          value={keyword}
          onChangeText={(value) => setKeyword(value)}
          style={[{ width: width - 30 }, styles.input]}
          placeholderTextColor={Colors.white}
        />
        <View style={{ flexDirection: "row" }}>
          <TextInput
            placeholderTextColor={Colors.white}
            style={[{ width: 130 }, styles.input]}
            placeholder="From"
            keyboardType="numeric"
            value={fromValue}
            onChangeText={handleFrom}
          />

          <TextInput
            placeholderTextColor={Colors.white}
            style={[{ width: 130 }, styles.input]}
            placeholder="To"
            keyboardType="numeric"
            value={toValue}
            onChangeText={handleTo}
          />

          <TouchableOpacity
            disabled={!isButtonActive || keyword.length < 3}
            onPress={() => onSubmit()}
            style={[
              styles.button,
              {
                backgroundColor:
                  keyword.length < 3 || !isButtonActive
                    ? Colors.grey
                    : Colors.bg,
              },
            ]}
          >
            <Text style={styles.text}>GO!</Text>
          </TouchableOpacity>
        </View>
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
            }}
          >
            {notFound ? (
              <HeaderTextExample>
                <Text style={styles.searchResultNotFound}>
                  Product was not found
                </Text>
              </HeaderTextExample>
            ) : (
              <FlatList
                nestedScrollEnabled={true}
                style={styles.flatList}
                data={filtered ? filteredProducts : products}
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
    marginTop: 30,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: Colors.bluegreen,
  },
  input: {
    height: 88,
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
    margin: 8,
    height: 88,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    borderRadius: 12,
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
