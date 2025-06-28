import { StyleSheet, View } from 'react-native'
import React from 'react'

const DullDivider = ({ margin }: { margin?: number }) => {
    return (
        <View style={[styles.divider, { marginVertical: margin || 10 }]} />
    )
}

export default DullDivider

const styles = StyleSheet.create({
    divider: {
        borderBottomWidth: 1.5,
        borderBottomColor: "#1c2722",
    }
})
