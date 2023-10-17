import { useState } from "react";
import { generateRSAKeyPair, encryptStringRsa } from "../utils/RSA_encryption";

const RsaStringEncryptPage = () => {
  const [inputString, setInputString] = useState("");
  const [encryptedString, setEncryptedString] = useState("");
  const [rsaKeyPair, setRsaKeyPair] = useState({
    publicKey: "",
    privateKey: "",
  });


  const downloadPemFile = (content: string, fileName: string) => {
    const link = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const generateRSAKey = async () => {
    const keyPair = await generateRSAKeyPair();
    setRsaKeyPair(keyPair);
  };

  const downloadPemFiles = () => {
    if (rsaKeyPair.privateKey) {
      downloadPemFile(rsaKeyPair.privateKey, "rsa_private.pem");
    }
    if (rsaKeyPair.publicKey) {
      downloadPemFile(rsaKeyPair.publicKey, "rsa_public.pem");
    }
  };


  const changeFilePemPublic = (files: FileList) => {
    const file = files[0];
    if (!file) {
      return;
    }
    if (file.size > 1024 * 1024 * 50) {
      return alert("文件太大");
    }
    const reader = new FileReader();
    reader.onload = async function () {
      const publicKey = reader.result as string;
      setRsaKeyPair({
        ...rsaKeyPair,
        publicKey: publicKey,
      });
    };
    reader.readAsText(file);
  };

  const encryptKeyRsa = async () => {
    try{
      const encryptedKey = await encryptStringRsa(inputString, rsaKeyPair.publicKey);
      setEncryptedString(encryptedKey);
    }catch(err){
      alert('Encryption failed.')
    }
  };

  const onKeyInputChange = async (e) => {
    setInputString(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="pt-[20px] pb-[20px]">RSA String Encrypt</h1>
        <div className="pt-[10px] text-left w-full flex-1">
          <div>
            <label
              htmlFor="small-input"
              className="whitespace-normal break-all font-bold block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Input string to encrypt
            </label>
            <input
              onChange={onKeyInputChange}
              type="text"
              id="small-input"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
           
          </div>
          <div className="flex mt-[10px]">
            <button
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
            </button>
            <div className="flex items-center justify-center">
              <label
                htmlFor="dropzone-file-pem-public"
                className="cursor-pointer text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Import Public Key Pem File
                <input
                  id="dropzone-file-pem-public"
                  type="file"
                  className="hidden"
                  onChange={(e) => changeFilePemPublic(e.target.files)}
                />
              </label>
            </div>
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
              {(rsaKeyPair.publicKey && inputString ) && (
                <>
                  <div className="flex mt-[10px]">
                    <button
                      type="button"
                      onClick={encryptKeyRsa}
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                      Encrypt the string with RSA
                    </button>
                  </div>
                  {encryptedString && (
                    <div className="break-all">
                    <span className="font-bold">Encrypted Key (Base64): </span>{encryptedString}
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


export default RsaStringEncryptPage;