

const _uint8ArrayfromHexString = (hexString: string) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte: any) => parseInt(byte, 16)));




const _stringToArrayBuffer = (str: string)=>{
  const encoder = new TextEncoder();
  return encoder.encode(str).buffer;
}

const _digestMessage = async (message: string) => {
  const data = _stringToArrayBuffer(message);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return hash;
}

const _arrayBufferToHexString = (buffer: ArrayBuffer) => {
  const byteArray = new Uint8Array(buffer);
  const hexCodes = [...byteArray].map(value => {
      const hexCode = value.toString(16);
      const paddedHexCode = hexCode.padStart(2, '0');
      return paddedHexCode;
  });

  return hexCodes.join('');
}

export const getKeyFromPassphrase = async (passphrase: string) => {
  const key = await _digestMessage(passphrase);
  const keyHex = _arrayBufferToHexString(key);
  return keyHex
}




export const encryptAes = async (fileArrayBuffer: ArrayBuffer, keyHex: string, ivHex: string) => {
  const ivArrayBuffer = _uint8ArrayfromHexString(ivHex).buffer;
  const keyArrayBuffer = _uint8ArrayfromHexString(keyHex).buffer;

  // prepare the secret key for encryption
  const secretKey = await crypto.subtle.importKey('raw', keyArrayBuffer, {
      name: 'AES-CBC',
      length: 256
  }, true, ['encrypt', 'decrypt']);

  // encrypt the text with the secret key
  const ciphertextArrayBuffer = await crypto.subtle.encrypt({
      name: 'AES-CBC',
      iv: ivArrayBuffer
  }, secretKey, fileArrayBuffer);

  return ciphertextArrayBuffer
}


// openssl enc -aes-256-cbc -nosalt -d -in test_car_encrypted_web.jpg -out test_car_enc_web_dec_openssl.jpg -K <key in Hex> -iv <iv in Hex>
export const decryptAes = async (fileArrayBuffer: ArrayBuffer, keyHex: string, ivHex: string) => {
  // decode the base64-encoded ciphertext and IV
  const ivArrayBuffer = _uint8ArrayfromHexString(ivHex).buffer;
  const keyArrayBuffer = _uint8ArrayfromHexString(keyHex).buffer;

  // prepare the secret key for encryption
  const secretKey = await crypto.subtle.importKey('raw', keyArrayBuffer, {
    name: 'AES-CBC',
    length: 256
}, true, ['encrypt', 'decrypt']);

  // decrypt the ciphertext with the secret key
  const decryptedBuffer = await crypto.subtle.decrypt({
      name: 'AES-CBC',
      iv: ivArrayBuffer
  }, secretKey, fileArrayBuffer);

  // decode the decrypted plaintext
  // const plaintext = new TextDecoder().decode(decryptedPlaintext);

  // return the decrypted plaintext
  return decryptedBuffer;
}

export const getIvFromPassphrase = async (passphrase: string) => {
  const key = await _digestMessage(passphrase)
  // convert ArrayBuffer to hex string
  const keyHex = Array.from(new Uint8Array(key)).map(b => b.toString(16).padStart(2, '0')).join(''); 
  const ivHex = keyHex.substring(0, 32)
  return ivHex
}





