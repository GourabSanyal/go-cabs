import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Input } from '@ui-kitten/components'
import SendIcon from '../../assets/images/icons/sendIcon.svg';

const SuggestionInput = () => {
    return (
        <View style={styles.card}>
            <Text style={styles.heading}>
                Have a cool idea or suggestion?
            </Text>
            <View style={styles.inputContainer}>
                <Input style={styles.input} placeholder="Write your suggestion here..." />
                <TouchableOpacity style={styles.sendIcon}>
                    <SendIcon width={25} height={25} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SuggestionInput

const styles = StyleSheet.create({
    card: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#1c2722",
        // backgroundColor: '#1c2722',
        padding: 15,
        gap: 10,
    },
    heading: {
        color: '#fff', fontSize: 16,
        fontFamily: 'Montserrat-Bold',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
        alignContent: 'stretch'
    },
    input: {
        flex: 1,
        backgroundColor: '#021b11',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
    sendIcon: {
        height: 'auto',
        backgroundColor: '#021b11',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderLeftWidth: 0,
    }
})
