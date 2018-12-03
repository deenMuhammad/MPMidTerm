import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  ImageBackground,
  View,
} from 'react-native';
import Chat from './Chat/Chat';
import CustomButton from './CustomButton';
import { createStackNavigator } from 'react-navigation';
class Main extends React.Component {
  static navigationOptions = {
    title: 'Chatter',
  };

  state = {
    name: '',
  };

  onPress = () =>
    this.props.navigation.navigate('Chat', { name: this.state.name });

  onChangeText = name => this.setState({ name });

  render() {
    return (
        <ImageBackground
        source={require("./../img/AzurLane.jpg")}
        style={{ width: "100%", height: "100%" }}
      >
      <View>
        <Text style={styles.title}>Enter your name:</Text>
        <TextInput
          style={styles.nameInput}
          placeholder="John Cena"
          onChangeText={this.onChangeText}
          value={this.state.name}
        />
        <CustomButton wiDth={130} _backgroundColor='#47cae0' _onPress={this.onPress} title='Start Chatting' />
      </View>
      </ImageBackground>
    );
  }
}

const offset = 24;
const styles = StyleSheet.create({
  title: {
    marginTop: offset,
    marginLeft: offset,
    fontSize: offset,
  },
  nameInput: {
    height: offset * 2,

    margin: offset,
    paddingHorizontal: offset,
    borderColor: '#111111',
    borderWidth: 1,
  },
  buttonText: {
    marginLeft: offset,
    fontSize: offset,
  },
});
export default EntertainmentStack = createStackNavigator(
    {
        MainScreen: {
           screen: Main,
        },
        Chat: {
            screen: Chat,
        }
    },
    {
        navigationOptions: {
            headerStyle: { 
                backgroundColor: '#6060FF'
            }
        },
        initialRouteName: 'MainScreen'
    }
);