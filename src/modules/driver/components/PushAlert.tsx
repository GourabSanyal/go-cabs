import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Icon } from '@ui-kitten/components'
import { primaryColor } from '../../../theme/colors'
import Margin from '../../../components/Margin'
import CustomButton from '../../../components/CustomButton'

const PushAlerts = () => {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.innerCard}>
                    <View style={{ alignItems: 'center' }}>
                        <Icon name="radio-button-on" width={15} height={15} fill={primaryColor} />
                        <View style={{ height: 21, width: 1, backgroundColor: primaryColor, marginVertical: -1 }} />
                        <Icon name="radio-button-on" width={15} height={15} fill={primaryColor} />
                    </View>
                    <View>
                        <Text style={styles.h3}>
                            Enter en-route location
                        </Text>
                        <Margin margin={8} />
                        <Text style={styles.h3}>
                            Enter destination
                        </Text>
                    </View>
                </View>
                <Margin margin={15} />
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <CustomButton
                            title="push alert for en-route"
                            status="primary"
                            size="small"
                        />
                    </View>
                    <Icon name="info-outline" width={30} height={30} fill={primaryColor} />
                </View>
            </View>
        </View>
    )
}

export default PushAlerts

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    card: {
        borderWidth: 1.5,
        borderColor: 'grey',
        borderRadius: 12,
        padding: 15,
    },
    innerCard: {
        padding: 10,
        paddingHorizontal: 20,
        borderWidth: 1.5,
        borderColor: "#1c2722",
        borderRadius: 10,
        flexDirection: 'row',
        gap: 15
    },
    h3: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: '#fff',
    }
})
