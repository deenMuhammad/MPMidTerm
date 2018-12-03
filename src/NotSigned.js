import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

export default class NotSigned extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image source={{uri: this.props._uri}} style={styles.userPngStyle} />
                <FontAwesomeIcon style={{ position: 'absolute', paddingLeft: 160, paddingTop: 160 }} name='user' color='red' size={30} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    userPngStyle: {
        borderRadius:60,
        width: 220,
        height: 220
    }, 
});
