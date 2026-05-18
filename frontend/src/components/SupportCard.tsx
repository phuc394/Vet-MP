import React from 'react';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	StyleSheet,
	ImageSourcePropType,
} from 'react-native';

type SupportCardProps = {
	title?: string;
	description?: string;
	buttonText?: string;
	onPress?: () => void;
	imageSource?: ImageSourcePropType;
};

const defaultImage = require('../../assets/anh-cskh.png');

export default function SupportCard({
	title = 'Need to reschedule?',
	description = 'Call our help center for immediate changes to appointments within 24 hours.',
	buttonText = 'Call Support',
	onPress,
	imageSource = defaultImage,
}: SupportCardProps) {
	return (
		<View style={styles.supportCard}>
			<View style={styles.supportContent}>
				<Text style={styles.supportTitle}>{title}</Text>
				<Text style={styles.supportText}>{description}</Text>
				<TouchableOpacity
					style={styles.supportButton}
					activeOpacity={0.8}
					onPress={onPress}
				>
					<Text style={styles.supportButtonText}>{buttonText}</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.supportImageContainer}>
				<Image source={imageSource} style={styles.supportImage} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	supportCard: {
		backgroundColor: '#6E8A76',
		borderRadius: 24,
		padding: 24,
		flexDirection: 'row',
		overflow: 'hidden',
		minHeight: 160,
	},
	supportContent: {
		flex: 1,
		zIndex: 1,
		justifyContent: 'center',
	},
	supportTitle: {
		color: '#FFFFFF',
		fontSize: 18,
		fontWeight: '700',
		marginBottom: 8,
	},
	supportText: {
		color: '#D1DDD5',
		fontSize: 13,
		marginBottom: 18,
		lineHeight: 18,
		maxWidth: '85%',
	},
	supportButton: {
		backgroundColor: '#FFFFFF',
		borderRadius: 20,
		paddingVertical: 10,
		paddingHorizontal: 20,
		alignSelf: 'flex-start',
	},
	supportButtonText: {
		color: '#8CA694',
		fontWeight: '700',
		fontSize: 13,
	},
	supportImageContainer: {
		position: 'absolute',
		right: -20,
		bottom: -15,
		width: 150,
		height: 150,
		opacity: 0.3,
		zIndex: 0,
	},
	supportImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'contain',
	},
});
