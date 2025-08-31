import 'dotenv/config';
import axios from 'axios';
import fs from 'fs/promises'; // This import is correct
import path from 'path';
import FormData from 'form-data';

// Pinata API endpoint
const PINATA_API_ENDPOINT = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

async function main() {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) {
    throw new Error('PINATA_JWT is not set in the .env file');
  }

  // --- Step 1: Upload the Image ---
  console.log('Uploading image to Pinata...');
  const imagePath = path.join(process.cwd(), 'assets', 'logo.png');
  
  // Create a form and append the file
  const imageForm = new FormData();
  
  // --- THIS IS THE FIX ---
  // Read the whole file into a buffer instead of creating a stream
  const imageContent = await fs.readFile(imagePath);
  imageForm.append('file', imageContent, { filename: 'logo.png' });

  const imageResponse = await axios.post(PINATA_API_ENDPOINT, imageForm, {
    headers: {
      ...imageForm.getHeaders(),
      'Authorization': `Bearer ${jwt}`,
    },
  });

  const imageCid = imageResponse.data.IpfsHash;
  const imageUrl = `ipfs://${imageCid}`;
  console.log('Image uploaded successfully!');
  console.log('Image IPFS URL:', imageUrl);

  // --- Step 2: Prepare and Upload Metadata ---
  console.log('Preparing and uploading metadata to Pinata...');
  
  const metadataTemplatePath = path.join(process.cwd(), 'assets', 'token.json');
  const metadataTemplate = JSON.parse(await fs.readFile(metadataTemplatePath, 'utf8'));

  const finalMetadata = {
    ...metadataTemplate,
    image: imageUrl,
  };

  const metadataForm = new FormData();
  metadataForm.append('file', JSON.stringify(finalMetadata), { filename: 'token.json' });

  const metadataResponse = await axios.post(PINATA_API_ENDPOINT, metadataForm, {
    headers: {
      ...metadataForm.getHeaders(),
      'Authorization': `Bearer ${jwt}`,
    },
  });

  const metadataCid = metadataResponse.data.IpfsHash;
  const metadataUrl = `ipfs://${metadataCid}`;

  console.log('\n--- Upload Complete! ---');
  console.log('Your final Metadata URI is:', metadataUrl);
  console.log('Gateway URL:', `https://gateway.pinata.cloud/ipfs/${metadataCid}`);
}

main().catch((e) => {
  console.error('An error occurred:', e.response ? e.response.data : e.message);
  process.exit(1);
});