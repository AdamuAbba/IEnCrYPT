import { MaterialIcons } from "@expo/vector-icons";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera, CameraType } from "expo-camera";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  StatusBar as RNStatusBar,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [numbers, setNumbers] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [scanned, setScanned] = useState(true);
  const [qrData, setQrData] = useState("");
  const inputRef = useRef(null);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const [permission, requestPermission] = Camera.useCameraPermissions();
  const handleOnNumberChange = (text) => {
    setNumbers(text);
  };

  const onTapGenerate = () => {
    inputRef?.current.clear();
    setQrValue(numbers);
  };
  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setQrData(data);
  };
  const onTapScan = async () => {
    if (!permission.granted) {
      await requestPermission();
    }
    setScanned(!scanned);
  };

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView} style={styles.container}>
      <RNStatusBar barStyle="light-content" />
      <View style={styles.header} />

      <ScrollView contentContainerStyle={styles.secondContainer}>
        <Text style={styles.title}>IEnCrYPT</Text>
        {scanned ? (
          <QRCode value={qrValue ? qrValue : "empty"} />
        ) : (
          <Camera
            onBarCodeScanned={handleBarCodeScanned}
            barCodeScannerSettings={{
              barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
            }}
            type={CameraType.back}
            style={{
              height: 250,
              width: 250,
            }}
          />
        )}
        {qrData && (
          <View>
            <Text style={{ fontWeight: "bold" }}>
              decoded QR code: <Text style={{ color: "green" }}>{qrData}</Text>
            </Text>
          </View>
        )}
        <TextInput
          ref={inputRef}
          style={styles.inputStyle}
          placeholder="enter number"
          onChangeText={handleOnNumberChange}
        />
        <TouchableOpacity style={styles.button} onPress={onTapGenerate}>
          <Text style={styles.buttonText}>Generate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cameraBtn]}
          onPress={onTapScan}
        >
          <Text style={styles.buttonText}>Scan</Text>
          <MaterialIcons name="camera-alt" size={24} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inputStyle: {
    borderWidth: 2,
    borderColor: "#09163C",
    height: 55,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    elevation: 8,
    backgroundColor: "white",
  },
  header: {
    width: "100%",
    backgroundColor: "#09163C",
    paddingTop: RNStatusBar.currentHeight + 30,
  },
  secondContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 90,
    rowGap: 30,
    paddingBottom: 20,
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#09163C",
    fontSize: 30,
  },
  button: {
    backgroundColor: "#09163C",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    padding: 9,
    paddingVertical: 13,
    elevation: 8,
  },
  buttonText: {
    color: "white",
  },
  cameraBtn: {
    flexDirection: "row",
    columnGap: 8,
  },
});
