import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import ConstButton from '../components/ConstButton';
import LogOutButton from '../components/LogOutButton';
import ImagePicker from 'react-native-image-crop-picker';
import Clipboard from '@react-native-clipboard/clipboard';
import TextRecognition from 'react-native-text-recognition';


const API_KEY = 'a78e7328427e5da24f4e244acf557715'; // Replace with your Mindee API key

const DEFAULT_HEIGHT = 1200;
const DEFAULT_WIDTH = 600;
const defaultPickerOptions = {
  cropping: true,
  height: DEFAULT_HEIGHT,
  width: DEFAULT_WIDTH,
};

export default function HomePage({ onPress }) {
  const [isLoading, setIsLoading] = useState(false);
  const [ocrDetails, setOcrDetails] = useState('');

  const copyToClipboard = () => {
    Clipboard.setString(ocrDetails); // Use the Clipboard from the library to copy the OCR details
  };

  const recognizeTextFromImage = async (path) => {
    setIsLoading(true);
  
    try {
      const recognizedText = await TextRecognition.recognize(path);
      console.log('Recognized Text:', recognizedText); // Log the OCR text to the console
  
      // Define field labels and their variations (heuristics)
      const fieldLabels = {
        lastname: [/Apelyido\/Last Name:?\s+(.*)/i, /Apelyido\/Lastname:?\s+(.*)/i],
        givenNames: [/Mga Pangalan\/Given Names:?\s+(.*)/i, /Mga Pangalan\/Given\s*Names:?\s+(.*)/i],
        middleName: [/Gitnang Apelyido\/Middle Name:?\s+(.*)/i, /Gitnang Apelyido\/Middle\s*Name:?\s+(.*)/i],
        dob: [/Petsa ng Kapanganakan\/Date of Birth:?\s+(.*)/i, /Petsa\s*ng\s*Kapanganakan\/Date\s*of\s*Birth:?\s+(.*)/i],
      };
  
      // Extract field values using heuristics
      const extractedFields = Object.keys(fieldLabels).reduce((acc, field) => {
        const regexes = fieldLabels[field];
        for (const regex of regexes) {
          const match = recognizedText.match(regex);
          if (match) {
            acc[field] = match[1].replace(/\s+/g, ' ').trim();
            break;
          }
        }
        return acc;
      }, {});
  
      // Build the OCR details string
      const ocrDetails = `Apelyido/Lastname: ${extractedFields.lastname || 'Not found'}\n` +
        `Mga Pangalan/Given Names: ${extractedFields.givenNames || 'Not found'}\n` +
        `Gitnang Apelyido/Middle Names: ${extractedFields.middleName || 'Not found'}\n` +
        `Petsa ng Kapanganakan/Date of Birth: ${extractedFields.dob || 'Not found'}\n`;
  
      setOcrDetails(ocrDetails);
    } catch (err) {
      console.error(err);
      setOcrDetails('');
    }
  
    setIsLoading(false);
  };
  
  
  
  

  const extractValue = (regex, text) => {
    const match = regex.exec(text);
    return match && match[1] ? match[1].trim() : '';
  };

  const recognizeFromCamera = async (options = defaultPickerOptions) => {
    try {
      const cameraOptions = {
        ...options,
        cropping: false, // Set to false to allow horizontal scanning
        useFrontCamera: false, // Set to true to use the front-facing camera (if available)
      };

      const image = await ImagePicker.openCamera(cameraOptions);
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
    fontSize: 10,
    backgroundColor:"white",
    color:"black"
  },
});
