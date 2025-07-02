import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Chip = ({ label }: { label: string }) => {
    return (
        <View style={styles.chipContainer}>
            <Text style={styles.text}>{label}</Text>
        </View>
    )
}

export default Chip

const styles = StyleSheet.create({
    chipContainer: {
        backgroundColor: "#85FFCE",
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: 14,
        fontFamily: 'Montserrat-Bold',
        color: "#00BF72",
    }
});
