import { StyleSheet, View } from 'react-native';
import React from 'react';
import GoLogo from '../../assets/images/logo.svg';

const TopBar = () => {
    return (
        <>
            <View style={styles.container}>
                <GoLogo width={65} height={34} />
            </View>
        </>
    );
};

export default TopBar;

const styles = StyleSheet.create({
    container: {
        paddingLeft: 15, paddingRight: 15, paddingTop: 15, paddingBottom: 15,
        borderBottomWidth: 1.5,
        borderBottomColor: "#1c2722",
    },
    image: { width: 65, height: 34 },
    text: { color: '#fff', fontSize: 28, marginTop: 10, fontStyle: 'italic' },
});
