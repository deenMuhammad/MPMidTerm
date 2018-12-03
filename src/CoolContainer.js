import React, { Component } from 'react';
import {View, Text, StyleSheet } from 'react-native';

export default class CoolContainer extends Component {
    render(){
        return(
            <View style = {styles.container}>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'center'
    }
});