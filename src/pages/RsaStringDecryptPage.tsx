import { useEffect, useState } from "react";
import { generateRSAKeyPair, encryptStringRsa, decryptStringRsa } from "../utils/RSA_encryption";
import { isBase64 } from "../utils/Rgx_test";

const RsaStringDecryptPage = () => {
  const [intputString, setIntputString] = useState("");
  const [decryptedString, setDecryptedString] = useState("");
  const [rsaKeyPair, setRsaKeyPair] = useState({
    publicKey: "",
    privateKey: "",
  });



  const changeFilePemPrivate = (files: FileList) => {
    const file = files[0];
    if (!file) {
      return;
    }
    if (file.size > 1024 * 1024 * 50) {
      return alert("文件太大");
    }
    const reader = new FileReader();
    reader.onload = async function () {
      const privateKey = reader.result as string;
      setRsaKeyPair({
        ...rsaKeyPair,
        privateKey: privateKey,
      });
    };
    reader.readAsText(file);
  };



  const decryptKeyRsa = async () => {
    try{
      const decryptedKey = await decryptStringRsa(intputString, rsaKeyPair.privateKey);
    
      setDecryptedString(decryptedKey);
    }catch(err){
      alert('Decryption failed.')
    }
    
    // const decryptedKey = await decryptStringRsa(encryptedKey, rsaKeyPair.privateKey);
    // console.log('decrypt: ',decryptedKey)
  };

  const onKeyInputChange = async (e) => {
    setIntputString(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col items-center">
      <h1 className="pt-[20px] pb-[20px]">RSA String Decrypt</h1>
        <div className="pt-[10px] text-left w-full flex-1">
          <div>
            <label
              htmlFor="small-input"
              className="whitespace-normal break-all font-bold block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Input Rsa Encrypted String (Base64) (ex.
                KbQhUn9U2mm96q4ZARf7k8gF7+Ir/HGn/Xa1EFkPvtGDJvyvxqi/SkF+jYUZk1Nb/5QZWl6MXjQhws242K3KGh7j4G2LC6/wv7lkHU4vm5DmYv5HnDKGrDQFzYioYL6/x3M2RSySDqCnTZ73bCR2MHhPL5Js5rxP2LkcDnuG8oePF3cd09PeFlyDBNjl/iY57Xx/7pWWi6T0MbQCQdMDeoFELQZIXaVTWLzHuJO6P8zrtCmLORarmdBtsnq7e1YaSWQJoPBjuGtcpzQYKiUjbwvDYBW69/9/u70V7G+F4m1cL2ESfu8+wsLIQgW3B6eRgo0RvPbvM+BiZxSl5LZWVQ==)
            </label>
            <input
              onChange={onKeyInputChange}
              type="text"
              id="small-input"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            {intputString && !isBase64(intputString) && (
              <div className="text-red-500">Key must be valid Base64 string</div>
            )}
          </div>

          {/* <div>
            <label
              htmlFor="small-input"
              className="whitespace-normal break-all font-bold block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Input Encrypted AES256 key  (ex.
                SVtCR+N481hggkOrn63NQdrhcTI5BTrTKIxmGRXKgz6TxmmfcL/wI5BXYVmSd7h25bl6ZqGss6PekgEmkjwgtRFZAQldHOyVLQgM3jaqR9ytTG2667Qm/YabLkYcHEF6c126WxWrZ9j+IUCOOL7L5MZKjZ2oMIAhfULMie0q+DsyNfzoiUcZVQm6/dsj2QVb9JEchG3bd1ndAjzFKe1A+jmaWoD7r6JUrKtt4v1YmpbZZYazcIgndtPX935BoAFcovqBe3w/1k7MD8eUAe56I3GRd2AD5iKdnSPOrT7msKjUzRrJwd2DfLJI7W9ilKDq0REYUwVJNzuapVnWhJQalw==)
            </label>
            <input
              onChange={onKeyInputChange}
              type="text"
              id="small-input"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            {aesKey && !is256BitHex(aesKey) && (
              <div className="text-red-500">Key must be 256bit hex</div>
            )}
          </div> */}
          <div className="flex mt-[10px]">
            {/* <button
              type="button"
              onClick={generateRSAKey}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Generate RSA Key
            </button>
            <button
              type="button"
              onClick={downloadPemFiles}
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              Download Pem Files
            </button> */}
            <div className="flex items-center justify-center">
              <label
                htmlFor="dropzone-file-pem-private"
                className="cursor-pointer text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Import Private Key Pem File
                <input
                  id="dropzone-file-pem-private"
                  type="file"
                  className="hidden"
                  onChange={(e) => changeFilePemPrivate(e.target.files)}
                />
              </label>
            </div>
            {/* <div className="flex items-center justify-center">
              <label
                htmlFor="dropzone-file-pem-public"
                className="cursor-pointer text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Import Public Pem File
                <input
                  id="dropzone-file-pem-public"
                  type="file"
                  className="hidden"
                  onChange={(e) => changeFilePemPublic(e.target.files)}
                />
              </label>
            </div> */}
          </div>
          {rsaKeyPair && (rsaKeyPair.privateKey || rsaKeyPair.publicKey) && (
            <>
              <div className="text-left">
                <span className="font-bold">Encryption algorithm:</span>{" "}
                RSA-OAEP
              </div>
              <div className="text-left">
                <span className="font-bold">Modulus length:</span> 2048
              </div>
              <div className="text-left">
                <span className="font-bold">Hash:</span> SHA-256
              </div>
              <div className="flex">
                {rsaKeyPair.privateKey && (
                  <div className="flex-1">
                    <textarea
                      disabled
                      value={rsaKeyPair.privateKey}
                      id="message"
                      rows="6"
                      className="resize-none block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Write your thoughts here..."
                    ></textarea>
                  </div>
                )}
                {rsaKeyPair.publicKey && (
                  <div className="flex-1">
                    <textarea
                      disabled
                      value={rsaKeyPair.publicKey}
                      id="message"
                      rows="6"
                      className="resize-none block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Write your thoughts here..."
                    ></textarea>
                  </div>
                )}
              </div>
              {(rsaKeyPair.privateKey && intputString && isBase64(intputString)) && (
                <>
                  <div className="flex mt-[10px]">
                    <button
                      type="button"
                      onClick={decryptKeyRsa}
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                      Decrypt the input key with RSA
                    </button>
                  </div>
                  {decryptedString && (
                    <div className="break-all">
                    <span className="font-bold">Decrypted Key: </span>{decryptedString}
                  </div>
                  )}
                  
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};


export default RsaStringDecryptPage;