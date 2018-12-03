import React, { Component } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { RadioButton } from "react-native-paper";
import CheckBox from "react-native-check-box";

export default class EntertanmentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: "",
      isChecked: false,
      isChecked2: false
    };
  }
  render() {
    const { checked } = this.state;
    return (
      <ImageBackground
        source={require("./../../img/AzurLane.jpg")}
        style={{ width: "100%", height: "100%" }}
      >
        <View style={styles.entertanimentView}>
        <View style={{ flexDirection: "row" }}>
        <CheckBox
            style={{ flex: 1, padding: 10 }}
            onClick={() => {
              this.setState({
                isChecked: !this.state.isChecked
              });
            }}
            isChecked={this.state.isChecked}
            leftText={"CheckBox"}
          /></View>
          <View style={{ flexDirection: "row" }}>
        <CheckBox
            style={{ flex: 1, padding: 10 }}
            onClick={() => {
              this.setState({
                isChecked2: !this.state.isChecked2
              });
            }}
            isChecked={this.state.isChecked2}
            leftText={"CheckBox"}
          /></View>
          <View style={{ flexDirection: "row" }}>
            <Text>Check This</Text>
            <RadioButton
              value="first"
              status={checked === "first" ? "checked" : "unchecked"}
              onPress={() => {
                this.setState({ checked: "first" });
              }}
            />
          </View>
          <Text>or</Text>
          <Text />
          <View style={{ flexDirection: "row" }}>
            <Text>Check This</Text>
            <RadioButton
              value="second"
              status={checked === "second" ? "checked" : "unchecked"}
              onPress={() => {
                this.setState({ checked: "second" });
              }}
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  entertanimentView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
