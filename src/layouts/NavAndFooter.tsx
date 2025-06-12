import { View, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import FooterNavigation from '../components/FooterNavigation';
import TopBar from '../components/TopBar';

const NavAndFooter = ({ children }: any) => {
    return (
        <View style={{ flex: 1 }}>
            <TopBar />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {children}
            </ScrollView>
            <FooterNavigation />
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 10,
    },
});

export default NavAndFooter;
