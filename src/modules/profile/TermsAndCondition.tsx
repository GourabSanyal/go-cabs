import { View, Text, StyleSheet, FlatList, } from 'react-native'
import React from 'react'
import BackButton from './common/BackButton';
import { primaryColor } from '../../theme/colors';
import Margin from '../../components/Margin';

const PrivacyPolicy = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>
                Terms & Conditions
            </Text>
            <Margin margin={10} />
            <View>
                <Text style={styles.h2}>
                    Welcome to Go Cabs. {'\n'}
                    By using our services, you agree to these terms and conditions. Please read them carefully.
                </Text>
                <Margin margin={10} />
                <Text style={styles.h1}>
                    1. Acceptance of Terms
                </Text>
                <Margin margin={10} />
                <Text style={styles.h2}>
                    By downloading, installing, or using the Go Cabs app or services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions, as well as our Privacy Policy.
                </Text>
                <Margin margin={10} />
                <Text style={styles.h1}>
                    2. Eligibility
                </Text>
                <Margin margin={10} />
                <FlatList
                    data={["You must be at least 18 years old to create an account and use the services.",
                        "By creating an account, you certify that the information you provide is accurate and complete."
                    ]}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={{ paddingLeft: 10, flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                            <Text style={[styles.h2, { marginTop: 1 }]}>•</Text>
                            <Text style={styles.h2}>{item}</Text>
                        </View>
                    )}
                />
            </View>
            <View style={{ flexGrow: 1 }} />
            <BackButton />
        </View>
    )
}

export default PrivacyPolicy

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    heading: {
        fontSize: 26,
        fontFamily: 'Montserrat-Bold',
        color: primaryColor,
    },
    h2: {
        fontSize: 15,
        fontFamily: 'Montserrat-SemiBold',
        color: "#fff",
    },
    h1: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        color: "#fff",
    }
})
