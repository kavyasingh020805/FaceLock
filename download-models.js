/**
 * Script to download face-api.js models
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const modelsDir = path.join(__dirname, 'models');
const modelNamesAndFiles = {
  'ssd_mobilenetv1': [
    'ssd_mobilenetv1_model-weights_manifest.json',
    'ssd_mobilenetv1_model-shard1',
    'ssd_mobilenetv1_model-shard2'
  ],
  'face_landmark_68': [
    'face_landmark_68_model-weights_manifest.json',
    'face_landmark_68_model-shard1'
  ],
  'face_recognition': [
    'face_recognition_model-weights_manifest.json',
    'face_recognition_model-shard1',
    'face_recognition_model-shard2'
  ]
};

// Base URL for models
const BASE_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

// Create models directory if it doesn't exist
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
  console.log(`Created directory: ${modelsDir}`);
}

// Download a file
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${url} to ${filePath}`);
    
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filePath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

// Download all model files
async function downloadModels() {
  console.log('Starting download of face-api.js models...');
  
  for (const [modelName, files] of Object.entries(modelNamesAndFiles)) {
    console.log(`Downloading ${modelName} model files...`);
    
    for (const fileName of files) {
      const url = `${BASE_URL}/${modelName}/${fileName}`;
      const filePath = path.join(modelsDir, fileName);
      
      try {
        await downloadFile(url, filePath);
      } catch (error) {
        console.error(`Error downloading ${fileName}: ${error.message}`);
      }
    }
  }
  
  console.log('All models downloaded successfully!');
}

// Run the download
downloadModels().catch(console.error);