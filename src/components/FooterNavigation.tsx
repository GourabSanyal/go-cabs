import { StyleSheet, View, Text } from 'react-native';
import React from 'react';
import { BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { backgroundPrimary, primaryColor } from '../theme/colors';

const FooterNavigation = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const activeColor = primaryColor;
    const inactiveColor = '#FFFFFF';

    const getSelectedIndex = () => {
        const serviceRoutes = ['Service', 'MatchedDrivers', 'Logistics', 'AirportService', 'EventService'];

        if (serviceRoutes.includes(route.name)) {
            return 1; // Service tab
        }

        switch (route.name) {
            case 'Home':
                return 0;
            case 'Community':
                return 2;
            case 'Profile':
                return 3;
            default:
                return 0;
        }
    };


    const handleNavigation = (index: number) => {
        const routes = ['Home', 'Service', 'Community', 'Profile'];
        navigation.navigate(routes[index] as never);
    };

    const renderIcon = (name: string, index: number) => (
        <Icon
            style={styles.icon}
            name={name}
            fill={getSelectedIndex() === index ? activeColor : inactiveColor}
        />
    );

    const renderTitle = (title: string, index: number) => (
        <Text style={getSelectedIndex() === index ? styles.activeTabTitle : styles.tabTitle}>
            {title}
        </Text>
    );

    return (
        <View>
            <BottomNavigation
                style={styles.bottomNavigation}
                selectedIndex={getSelectedIndex()}
                onSelect={handleNavigation}
            >
                <BottomNavigationTab
                    title={() => renderTitle('Home', 0)}
                    icon={() => renderIcon('home-outline', 0)}
                />
                <BottomNavigationTab
                    title={() => renderTitle('Services', 1)}
                    icon={() => renderIcon('grid-outline', 1)}
                />
                <BottomNavigationTab
                    title={() => renderTitle('Community', 2)}
                    icon={() => renderIcon('globe-2-outline', 2)}
                />
                <BottomNavigationTab
                    title={() => renderTitle('Profile', 3)}
                    icon={() => renderIcon('person-outline', 3)}
                />
            </BottomNavigation>
        </View>
    );
};

export default FooterNavigation;

const styles = StyleSheet.create({
    icon: {
        width: 28,
        height: 28,
    },
    bottomNavigation: {
        marginVertical: 8,
        backgroundColor: backgroundPrimary,
    },
    tabTitle: {
        fontSize: 13,
        fontFamily: 'Montserrat-SemiBold',
        color: '#FFFFFF',
        marginTop: 3,
    },
    activeTabTitle: {
        fontSize: 14,
        fontFamily: 'Montserrat-Bold',
        color: primaryColor,
        marginTop: 3,
    },
});
