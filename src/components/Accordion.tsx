import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Icon, Text } from '@ui-kitten/components';

const Accordion = ({ data }: any) => {
    const [expanded, setExpanded] = React.useState(false);
    return (
        <View style={styles?.listItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <Text style={[styles.h1, { width: "80%" }]}>{data?.title}</Text>
                <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                    <Icon name={expanded ? 'arrow-ios-upward-outline' : 'arrow-ios-downward-outline'} width={20} height={20} fill="#fff" />
                </TouchableOpacity>
            </View>

            {expanded && (
                <Text style={styles.h2}>{data?.content}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    h1: {
        fontSize: 17,
        fontFamily: 'Montserrat-SemiBold',
        color: "#fff",
    },
    h2: {
        fontSize: 15,
        fontFamily: 'Montserrat-Regular',
        color: "#fff",
    },
    listItem: {
        paddingLeft: 10,
        gap: 10,
        paddingVertical: 20,
        borderBottomWidth: 1.5,
        borderBottomColor: "#1c2722",
    }

});

export default Accordion;
