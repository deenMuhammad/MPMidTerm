import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Text, ImageBackground} from 'react-native';
import LogInScreen from './LogInScreen';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import CustomButton from './CustomButton';
import NotSigned from './NotSigned';
import { createStackNavigator } from 'react-navigation';
import SignUpPanel from './SignUpPanel';
import Information from './Information';
import Modify from './ModifyPanel';
import { iOSUIKit } from 'react-native-typography';

class LogInLogUpScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            fullName: '',
            email: '',
            pass: '',
            image: 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png',
            signed: false,
            loading: false,
            disabled: false
        } 
    }

    signIn = () =>
    {
        if(!(this.state.email ==''||this.state.pass=='')){
        this.setState({ loading: true, disabled: true }, () =>
        {
            fetch('http://uztutor.com/mobileProgramming/userSignIn.php',
            {
                method: 'POST',
                headers: 
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                    email: this.state.email, 

                    pass: this.state.pass
                })
 
            }).then((response) => response.json()).then((responseJson) =>
            {
                if(responseJson.responseStatus == '1'){
                    this.setState({ loading: false, disabled: false, signed: true, fullName: responseJson.name });
                    if(!(responseJson.image==null)){
                        this.setState({image: responseJson.image});
                    }
                }
                else if(responseJson.responseStatus == '0'){
                    alert("User Not Found");
                    this.setState({ loading: false, disabled: false });
                }
                else{
                    alert(responseJson.connection+' '+responseJson.message+' '+responseJson.email+' '+responseJson.pass+' '+responseJson.query);
                }
                
            }).catch((error) =>
            {
                console.error(error);
                this.setState({ loading: false, disabled: false });
            });
        });}
        else{
            if(this.state.pass==''&&this.state.email==''){
                alert('Please Fill email and password Field')
            }
            else if(this.state.pass == ''){
                alert('Please Fill password Field');
            }
            else if(this.state.email==''){
                alert('Please Fill email Field');
            }
        }

    }
    componentDidMount(){
    }
    render() {
        return (
            <ScrollView style={[styles.container, { backgroundColor: '#106e7f' }]} contentContainerStyle={styles.content} >
            <View style={[styles.card2, { flex: 1 }]}>
            <Text style={[iOSUIKit.title3Emphasized, {color: '#90f9f9', marginBottom: 25}]}>My Space</Text>
            <NotSigned  _uri = {this.state.image}/>
            <View style = {{display: this.state.signed?'none': 'flex'}}>
            {/* This View is for when the user has not sign in yet */}
          <LogInScreen
            label={'Email Address'}
            isPass={false}
            iconClass={FontAwesomeIcon}
            iconName={'pencil'}
            iconColor={'white'}
            _onChangeText = {(text)=>{this.setState({email: text})}}
            _value = {this.state.email}
          />
          <LogInScreen
            style={styles.input}
            label={'Password'}
            isPass={true}
            iconClass={FontAwesomeIcon}
            iconColor={'white'}
            _onChangeText = {(text)=>{this.setState({pass: text})}}
            _value = {this.state.pass}
          />
          <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
          <CustomButton wiDth={130} _backgroundColor='#47cae0' _onPress={() => {this.setState({image: 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'}); this.props.navigation.navigate('SignUpScreen', { text: 'You Have Signed Up to LSL. Please check your email and verify your account!' }); }} title='Sign Up' />
          <CustomButton wiDth={130} _backgroundColor='#47cae0' _onPress={this.signIn} title='Sign In' />
          </View>
          </View>
          <View style = {{display: this.state.signed? 'flex': 'none', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={[iOSUIKit.title3Emphasized, {color: '#90f9f9', marginTop: 10}]}>Name: <Text style={[iOSUIKit.title3Emphasized, {color: '#90f9aa'}]}>{this.state.fullName}</Text></Text>
          <Text style={[iOSUIKit.title3Emphasized, {color: '#90f9f9', marginTop: 10}]}>Email: <Text style={[iOSUIKit.title3Emphasized, {color: '#90f9aa'}]}>{this.state.email}</Text></Text>
          <Text></Text>
          <CustomButton wiDth={200} _backgroundColor='#47cae0' _onPress={()=>{this.setState({signed: false, email: '', pass: '',image: 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'}); this.props.navigation.navigate('Modify', {fullName: this.state.fullName, email: this.state.email, pass: this.state.pass,image: this.state.image, })}} title='Modify Account' />
          <CustomButton wiDth={200} _backgroundColor='#47cae0' _onPress={()=>{this.setState({signed: false, email: '', pass: '', image: 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'});}} title='Log Out' />
          </View>
        </View>
            </ScrollView>
        );
    }
}

export default createStackNavigator(
    {
        MainLogIn: { screen: LogInLogUpScreen,
            navigationOptions: {
                header: null
            }
        },
        SignUpScreen: { screen: SignUpPanel, 
            navigationOptions: {
                headerStyle: { 
                    backgroundColor: '#9955ff'
                },
                title: 'Sign Up'
            }
         },
         Information: { screen: Information, 
            navigationOptions: {
                headerStyle: { 
                    backgroundColor: '#f44242'
                },
                title: 'Information'
            }
         },
         Modify: { screen: Modify, 
            navigationOptions: {
                headerStyle: { 
                    backgroundColor: '#f44242'
                },
                title: 'Account Modification'
            }
         },
    },
    {
        initialRouteName: 'MainLogIn',
    }
);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 24,
      backgroundColor: 'white',
    },
    content: {
        justifyContent: 'center', 
        alignItems: 'center',
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
