import { View } from 'react-native'
import React from 'react'

const Margin = ({ margin }: { margin: number }) => {
    return (
        <View style={{ marginTop: margin, }} />
    )
}

export default Margin
