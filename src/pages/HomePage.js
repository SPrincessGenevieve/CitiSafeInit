import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import ConstButton from '../components/ConstButton';
import LogOutButton from '../components/LogOutButton';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import Clipboard from '@react-native-clipboard/clipboard';

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
      const apiKey = 'K82216846188957'; // Replace with your OCRSpace API key
      const apiUrl = 'https://api.ocr.space/parse/image';

      const formData = new FormData();
      formData.append('file', {
        uri: path,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
      formData.append('apikey', apiKey);
      formData.append('isOverlayRequired', 'false');

      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { data } = response;

      if (data && data.ParsedResults && data.ParsedResults.length > 0) {
        const recognizedText = data.ParsedResults[0].ParsedText;
        const lines = recognizedText.split('\n');
        const values = {};

        // Regular expressions to search for relevant patterns
        const nameRegex = /Last Name, First Name, Middle Name\n(.*?)(?:\n|$)/s;
        const nationalityRegex = /Nationality\n(.*?)(?:\n|$)/s;
        const sexRegex = /Sex\n(.*?)(?:\n|$)/s;
        const dobRegex = /Date of Birth\n(.*?)(?:\n|$)/s;
        const weightRegex = /Weight \(kg\)\n(.*?)(?:\n|$)/s;
        const heightRegex = /Height\(m\)\n(.*?)(?:\n|$)/s;
        const addressRegex = /Address\n(.*?)(?:\n|$)/s;
        const licenseNoRegex = /License No\.\n(.*?)(?:\n|$)/s;
        const expirationDateRegex = /Expiration Date\n(.*?)(?:\n|$)/s;
        const agencyCodeRegex = /Agency Code\n(.*?)(?:\n|$)/s;
        const bloodTypeRegex = /Blood Type\n(.*?)(?:\n|$)/s;
        const eyeColorRegex = /Eyes Color\n(.*?)(?:\n|$)/s;
        const dlCodesRegex = /DL Codes\n(.*?)(?:\n|$)/s;
        const conditionRegex = /Condition\n(.*?)(?:\n|$)/s;

        // Extracting the matched values
        const name = extractValue(nameRegex, lines);
        const nationality = extractValue(nationalityRegex, lines);
        const sex = extractValue(sexRegex, lines);
        const dob = extractValue(dobRegex, lines);
        const weight = extractValue(weightRegex, lines);
        const height = extractValue(heightRegex, lines);
        const address = extractValue(addressRegex, lines);
        const licenseNo = extractValue(licenseNoRegex, lines);
        const expirationDate = extractValue(expirationDateRegex, lines);
        const agencyCode = extractValue(agencyCodeRegex, lines);
        const bloodType = extractValue(bloodTypeRegex, lines);
        const eyeColor = extractValue(eyeColorRegex, lines);
        const dlCodes = extractValue(dlCodesRegex, lines);
        const condition = extractValue(conditionRegex, lines);

        // Concatenate the results and set in the state
        setOcrDetails(
          `Last Name, First Name, Middle Name: ${name}\n` +
          `Nationality: ${nationality}\n` +
          `Sex: ${sex}\n` +
          `Date of Birth: ${dob}\n` +
          `Weight (kg): ${weight}\n` +
          `Height (m): ${height}\n` +
          `Address: ${address}\n` +
          `License No.: ${licenseNo}\n` +
          `Expiration Date: ${expirationDate}\n` +
          `Agency Code: ${agencyCode}\n` +
          `Blood Type: ${bloodType}\n` +
          `Eyes Color: ${eyeColor}\n` +
          `DL Codes: ${dlCodes}\n` +
          `Condition: ${condition}`
        );
      } else {
        console.error('OCRSpace API response is empty or invalid.');
      }
    } catch (err) {
      console.error(err);
      setOcrDetails('');
    }

    setIsLoading(false);
  };

  const extractValue = (regex, lines) => {
    const matchedLine = lines.find((line) => regex.test(line));
    return matchedLine ? regex.exec(matchedLine)[1].replace(/\n/g, '').trim() : '';
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
