import React, { Component } from 'react';
import { View, StyleSheet, ScrollView , ActivityIndicator, KeyboardAvoidingView, Text} from 'react-native';
import LogInScreen from './LogInScreen';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import CustomButton from './CustomButton';


export default class Modify extends Component {
  constructor(props){
    super(props);
    const { navigation } = this.props;
        const fullName = navigation.getParam('fullName', '');
        const email = navigation.getParam('email', '');
        const pass = navigation.getParam('pass', '');
        const image = navigation.getParam('image', '');
    this.state = ({
        fullName: fullName,
        email: email,
        pass: pass,
        rePass: pass,
        image: image,
        loading: false,
        disabled: false
    });
}

  saveData = () =>
    {
        if(!(this.state.fullName==''||this.state.email==''||this.state.pass==''||this.state.rePass=='')){
        if(this.state.pass == this.state.rePass){
        this.setState({ loading: true, disabled: true }, () =>
        {
            const { navigation } = this.props;
            const email = navigation.getParam('email', '');
            const pass = navigation.getParam('pass', '');
            if(this.state.image==''){
                var image = 'NULL';
            }
            else {
                var image = this.state.image;
            }
            fetch('http://uztutor.com/mobileProgramming/userModify.php',
            {
                method: 'POST',
                headers: 
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                    fullName: this.state.fullName,
 
                    email: this.state.email,
                    
                    pEmail: email,

                    pass: this.state.pass,

                    pPass: pass,

                    image: image
                })
 
            }).then((response) => response.json()).then((responseJson) =>
            {
                if(responseJson == '1'){
                    this.setState({ loading: false, disabled: false });
                    navigation.navigate('Information', {
                        fullName: this.state.fullName,
                        email: this.state.email,
                        pass: this.state.pass,
                        message: 'You have successfully Modified your Account'
                      });
                }
                else{
                    alert(responseJson);
                    this.setState({ loading: false, disabled: false });
                }
                
            }).catch((error) =>
            {
                console.error(error);
                this.setState({ loading: false, disabled: false });
            });
        });
    }
    else{
        this.setState({
            loading: false,
            disabled: false
        });
        alert("Please Enter Same Password to Confirm Password Field");
    }
}
else{
    alert("Please Fill all the fields (Image URL can be empty)");
}
    }
    render() {
        return (
            <KeyboardAvoidingView style={[styles.container, { backgroundColor: '#106e7f' }]} contentContainerStyle={styles.content}>
            <ScrollView  >
            <View style={[styles.card2, { flex: 1 }]}>
            <Text style={{color: 'red'}}>Please only change fileds which you want to modify!</Text>
          <LogInScreen
            label={'Name'}
            isPass={false}
            iconClass={FontAwesomeIcon}
            iconName={'pencil'}
            iconColor={'white'}
            _onChangeText = {(text)=>{this.setState({fullName: text})}}
            _value = {this.state.fullName}
          />
          <LogInScreen
            label={'Email'}
            isPass={false}
            iconClass={FontAwesomeIcon}
            iconName={'pencil'}
            iconColor={'white'}
            _onChangeText = {(text)=>{this.setState({email: text})}}
            _value = {this.state.email}
          />
          <LogInScreen
            style={styles.input}
            label={'Create Password'}
            isPass={true}
            iconClass={FontAwesomeIcon}
            iconColor={'white'}
            _onChangeText = {(text)=>{this.setState({pass: text})}}
            _value = {this.state.pass}
          />
          <LogInScreen
            style={styles.input}
            label={'Confirm Password'}
            isPass={true}
            iconClass={FontAwesomeIcon}
            iconColor={'rePass'}
            _onChangeText = {(text)=>{this.setState({rePass: text})}}
            _value = {this.state.rePass}
          />
          <LogInScreen
            style={styles.input}
            label={'Personal Image Web URL'}
            isPass={false}
            iconClass={FontAwesomeIcon}
            iconColor={'white'}
            _onChangeText = {(text)=>{this.setState({image: text})}}
            _value = {this.state.image}
          />
          <View style={{ display : this.state.disabled? 'none':'flex',marginTop: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
          <CustomButton wiDth={300} _backgroundColor='#47cae0' _onPress={this.saveData} title='Do The Modification' />
          </View>
          {(this.state.loading)? <ActivityIndicator size = 'large' />:null}
        </View>
            </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 24,
      backgroundColor: 'white',
    },
    content: {
        
      // not cool but good enough to make all inputs visible when keyboard is active
      paddingBottom: 300,
    },
    card1: {
      paddingVertical: 16,
    },
    card2: {
        flex: 1,
        padding: 16,
    },
    input: {
      marginTop: 4,
    },
    title: {
      paddingTop: 15,  
      paddingBottom: 10,
      textAlign: 'center',
      color: '#404d5b',
      fontSize: 20,
      fontWeight: 'bold',
      opacity: 0.8,
    },
  });
