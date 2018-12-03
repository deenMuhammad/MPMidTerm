import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import CustomButton from '../CustomButton';

export default class WifiComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            disabled: false,
            reload: false,
            noUsers: false,
            numUser: 0,
            users: []
        }
    }
    componentWillMount(){
        const users = [];
        fetch('http://uztutor.com/mobileProgramming/usersFetch.php',
            {
                method: 'POST',
                headers: 
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((response) => response.json()).then((responseJson) =>
            {
                if(responseJson.responseStatus == '0'){//if there are no users found
                    this.setState({ loading: false, disabled: false, noUsers: true});
                }
                else if(responseJson.responseStatus == '1'){
                    //if there are One or more than one users found in the db
                    this.setState({ loading: false, disabled: false, numUser: responseJson.num_rows});
                    for(var i = 0; i < responseJson.num_rows; i++){
                        users.push(responseJson[i]);
                    }
                    this.setState({users: users});
                }
                else{
                    alert("Something Went Wrong! Please reload the page");
                    this.setState({ loading: false, disabled: false, reload: true});
                }
                
            }).catch((error) =>
            {
                console.error(error);
                this.setState({ loading: false, disabled: false });
            });
    }
    renderRow(data) {
        return (
            <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', borderWidth: 1, borderBottomColor: 'rgb(121,121,121)', borderTopColor: 'none' }}>
                <View style={{ flex: 1, alignSelf: 'stretch'}} ><Text>{data.ID}</Text></View> 
                <View style={{ flex: 1, alignSelf: 'stretch' }} ><Text>{data.name}</Text></View>
                <View style={{ flex: 1, alignSelf: 'stretch' }} ><Text>{data.email}</Text></View>
            </View>
        );
    }
    reloadPage(){
        const users = [];
        fetch('http://localhost:8888/MobileProgrammingMidterm/usersFetch.php',
            {
                method: 'POST',
                headers: 
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((response) => response.json()).then((responseJson) =>
            {
                if(responseJson.responseStatus == '0'){//if there are no users found
                    this.setState({ loading: false, disabled: false, noUsers: true});
                }
                else if(responseJson.responseStatus == '1'){
                    //if there are One or more than one users found in the db
                    this.setState({ loading: false, disabled: false, numUser: responseJson.num_rows, reload: false});
                    for(var i = 0; i < responseJson.num_rows; i++){
                        users.push(responseJson[i]);
                    }
                    this.setState({users: users});
                }
                else{
                    alert("Something Went Wrong! Please reload the page");
                    this.setState({ loading: false, disabled: false, reload: true});
                }
                
            }).catch((error) =>
            {
                console.error(error);
                this.setState({ loading: false, disabled: false });
            });
    }
    renderRow(data) {
        return (
            <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', borderWidth: 1, borderBottomColor: 'rgb(121,121,121)', borderTopColor: 'none' }}>
                <View style={{ flex: 1, alignSelf: 'stretch'}} ><Text>{data.ID}</Text></View> 
                <View style={{ flex: 1, alignSelf: 'stretch' }} ><Text>{data.name}</Text></View>
                <View style={{ flex: 1, alignSelf: 'stretch' }} ><Text>{data.email}</Text></View>
            </View>
        );

    }

    render(){
        return(
            <ImageBackground source = {require('./../../img/AzurLane.jpg')} style={{width: '100%', height : '100%'}}>
            <ScrollView style = {{margin: 15}}>
            <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', backgroundColor: 'violet' }}>
                <View style={{ flex: 1, alignSelf: 'stretch' }} ><Text>ID</Text></View> 
                <View style={{ flex: 1, alignSelf: 'stretch' }} ><Text>Name</Text></View>
                <View style={{ flex: 1, alignSelf: 'stretch' }} ><Text>Email</Text></View>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {
                this.state.users.map((data) => { 
                    return this.renderRow(data);
                })
            }
            </View>
            <View style = {{display: this.state.noUsers?'flex':'none'}}>
            <Text>There are no users Signed Up so Far</Text>
            </View>
            <View style = {{display: this.state.reload?'flex':'none'}}>
            <Text>Something Went Wrong! Please reload the page</Text>
            <CustomButton wiDth={300} _backgroundColor='#47cae0' _onPress={this.reloadPage.bind(this)} title='Reload the Page' />
            </View>
            </ScrollView>
            </ImageBackground>
        );
    }
}

const styles=  StyleSheet.create({
    wifiView: {
        width: "100%",
        height: '100%',
        display: 'flex',
        justifyContent: "center",
        alignContent: "center"
    }
});