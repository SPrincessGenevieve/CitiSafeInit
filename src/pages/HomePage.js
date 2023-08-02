import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import ConstButton from '../components/ConstButton';
import LogOutButton from '../components/LogOutButton';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import Clipboard from '@react-native-clipboard/clipboard';
import TextRecognition from 'react-native-text-recognition';

const DEFAULT_HEIGHT = 1200;
const DEFAULT_WITH = 600;
const defaultPickerOptions = {
  cropping: true,
  height: DEFAULT_HEIGHT,
  width: DEFAULT_WITH,
};

export default function HomePage({ onPress }) {
  const [isLoading, setIsLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [ocrDetails, setOcrDetails] = useState('');

  const copyToClipboard = () => {
    Clipboard.setString(ocrDetails); // Use the Clipboard from the library to copy the OCR details
  };

  const recognizeTextFromImage = async (path) => {
    setIsLoading(true);

    try {
      const recognizedText = await TextRecognition.recognize(path);

      const values = {
        name: extractValue(/Last Name, First Name, Middle Name\n(.*?)(?:\n|$)/s, recognizedText),
        nationality: extractValue(/Nationality\n(.*?)(?:\n|$)/s, recognizedText),
        sex: extractValue(/Sex\n(.*?)(?:\n|$)/s, recognizedText),
        dob: extractValue(/Date of Birth\n(.*?)(?:\n|$)/s, recognizedText),
        weight: extractValue(/Weight \(kg\)\n(.*?)(?:\n|$)/s, recognizedText),
        height: extractValue(/Height\(m\)\n(.*?)(?:\n|$)/s, recognizedText),
        address: extractValue(/Address\n(.*?)(?:\n|$)/s, recognizedText),
        licenseNo: extractValue(/License No\.\n(.*?)(?:\n|$)/s, recognizedText),
        expirationDate: extractValue(/Expiration Date\n(.*?)(?:\n|$)/s, recognizedText),
        agencyCode: extractValue(/Agency Code\n(.*?)(?:\n|$)/s, recognizedText),
        bloodType: extractValue(/Blood Type\n(.*?)(?:\n|$)/s, recognizedText),
        eyeColor: extractValue(/Eyes Color\n(.*?)(?:\n|$)/s, recognizedText),
        dlCodes: extractValue(/DL Codes\n(.*?)(?:\n|$)/s, recognizedText),
        condition: extractValue(/Condition\n(.*?)(?:\n|$)/s, recognizedText),
      };

      // Validate and format the values
      const formattedValues = {
        name: values.name.length > 5 ? values.name : 'Not found',
        nationality: values.nationality === 'PHL' ? values.nationality : 'Not found',
        sex: ['F', 'M'].includes(values.sex) ? values.sex : 'Not found',
        dob: /^\d{4}\/\d{2}\/\d{2}$/.test(values.dob) ? values.dob : 'Not found',
        weight: /^\d+(\.\d+)?$/.test(values.weight) ? values.weight : 'Not found',
        height: /^\d+(\.\d+)?$/.test(values.height) ? values.height : 'Not found',
        address: values.address || 'Not found',
        licenseNo: formatLicenseNo(values.licenseNo),
        expirationDate: /^\d{4}\/\d{2}\/\d{2}$/.test(values.expirationDate) ? values.expirationDate : 'Not found',
        agencyCode: formatAgencyCode(values.agencyCode),
        bloodType: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(values.bloodType)
          ? values.bloodType
          : 'Not found',
        eyeColor: ['Brown', 'Blue', 'Green', 'Hazel', 'Gray', 'Amber'].includes(values.eyeColor)
          ? values.eyeColor
          : 'Not found',
        dlCodes: validateDLCodes(values.dlCodes) ? values.dlCodes : 'Not found',
        condition: validateCondition(values.condition) ? values.condition : 'Not found',
      };

      // Concatenate the formatted values and set in the state
      setOcrDetails(
        `Last Name, First Name, Middle Name: ${formattedValues.name}\n` +
        `Nationality: ${formattedValues.nationality}\n` +
        `Sex: ${formattedValues.sex}\n` +
        `Date of Birth: ${formattedValues.dob}\n` +
        `Weight (kg): ${formattedValues.weight}\n` +
        `Height (m): ${formattedValues.height}\n` +
        `Address: ${formattedValues.address}\n` +
        `License No.: ${formattedValues.licenseNo}\n` +
        `Expiration Date: ${formattedValues.expirationDate}\n` +
        `Agency Code: ${formattedValues.agencyCode}\n` +
        `Blood Type: ${formattedValues.bloodType}\n` +
        `Eyes Color: ${formattedValues.eyeColor}\n` +
        `DL Codes: ${formattedValues.dlCodes}\n` +
        `Condition: ${formattedValues.condition}`
      );
    } catch (err) {
      console.error(err);
      setOcrDetails('');
    }

    setIsLoading(false);
  };

  const extractValue = (regex, text) => {
    const match = regex.exec(text);
    return match && match[1] ? match[1].replace(/\n/g, '').trim() : '';
  };

  const formatLicenseNo = (licenseNo) => {
    // Assuming the format is Region Code:Year Code:Sequence Number
    const [regionCode, yearCode, sequenceNumber] = licenseNo.split('-');
    return `${regionCode}${yearCode}-${sequenceNumber}`;
  };

  const formatAgencyCode = (agencyCode) => {
    // Assuming the agency code format is a single letter followed by two digits
    return /^[A-Z]\d{2}$/.test(agencyCode) ? agencyCode : 'Not found';
  };

  const validateDLCodes = (dlCodes) => {
    // Assuming DL Codes are comma-separated and contain only valid values
    const validDLCodes = ['A', 'A1', 'B', 'B1', 'B2', 'C', 'D', 'BE', 'CE'];
    const codes = dlCodes.split(',').map((code) => code.trim());
    return codes.every((code) => validDLCodes.includes(code));
  };

  const validateCondition = (condition) => {
    // Assuming valid conditions are listed
    const validConditions = [
      'Restriction 1*',
      'Restriction 2*',
      'Restriction 3',
      'Restriction 4*',
      'Restriction 5',
      'Restriction 6',
      'Restriction 7',
      'Restriction 8',
      'A',
      'A2',
      'B',
      'B1',
      'B2',
      'C',
      'D',
      'BE',
      'none',
      'None',
    ];
    return validConditions.includes(condition);
  };

  const recognizeFromPicker = async (options = defaultPickerOptions) => {
    try {
      const image = await ImagePicker.openPicker(options);
      setImgSrc({ uri: image.path });
      await recognizeTextFromImage(image.path);
    } catch (err) {
      if (err.message !== 'User cancelled image selection') {
        console.error(err);
      }
    }
  };

  const recognizeFromCamera = async (options = defaultPickerOptions) => {
    try {
      const cameraOptions = {
        ...options,
        cropping: false, // Set to false to allow horizontal scanning
        useFrontCamera: false, // Set to true to use the front-facing camera (if available)
      };

      const image = await ImagePicker.openCamera(cameraOptions);
      setImgSrc({ uri: image.path });
      await recognizeTextFromImage(image.path);
    } catch (err) {
      if (err.message !== 'User cancelled image selection') {
        console.error(err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <GradientBackground></GradientBackground>
      <View style={{ position: 'absolute', height: '100%', width: '80%', top: 1, marginTop: '30%' }}>
        <Text style={{ fontSize: 48, width: '100%', textAlign: 'center', marginBottom: '40%', color: 'white' }}>CITISAFE</Text>
        <Text style={{ fontSize: 20, textAlign: 'left', width: '80%', color: 'white' }}>HELLO</Text>
        <Text style={{ fontSize: 20, textAlign: 'left', marginBottom: 80, color: 'white' }}>Mr. John Wick Batumbakal</Text>
        <LogOutButton onPress={onPress}></LogOutButton>
        <ConstButton disabled={isLoading} name="scan1" title="Scan Driver’s License and OR/CR" onPress={() => { recognizeFromCamera(); }}></ConstButton>
        <ConstButton name="filetext1" title="Check Records"></ConstButton>
      </View>

      {/* Display OCR Details */}
      {ocrDetails !== '' && (
        <View style={styles.ocrDetailsContainer}>
          <Text style={styles.ocrDetailsTitle}>OCR Details:</Text>
          <Text style={styles.ocrDetailsText}>{ocrDetails}</Text>
          <Button onPress={() => setOcrDetails('')} title="BACK"></Button>
          <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
            <Text style={styles.copyButtonText}>Copy to Clipboard</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  ocrDetailsContainer: {
    paddingHorizontal: 12,
    paddingTop: 4,
    marginTop: 20,
    backgroundColor: 'red',
    borderRadius: 8,
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  ocrDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ocrDetailsText: {
    fontSize: 16,
  },
});
