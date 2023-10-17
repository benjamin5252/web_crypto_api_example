
import { useEffect, useState } from "react";
import {
  encryptAes,
  getKeyFromPassphrase,
  getIvFromPassphrase,
  decryptAes,
} from "../utils/AES_encryption";
import { is256BitHex } from "../utils/Rgx_test";


function AesFileEncryptorPage() {
  const [inputFile, setInputFile] = useState(null);
  const [algorithm, setAlgorithm] = useState("AES256");
  const [passphrase, setPassphrase] = useState("");
  const [aesKey, setAesKey] = useState("");
  const [aesIv, setAesIv] = useState("");

  const [rsaKeyPair, setRsaKeyPair] = useState({});
  const changeFile = (files: FileList) => {
    const file = files[0];
    if (!file) {
      return;
    }
    if (file.size > 1024 * 1024 * 50) {
      return alert("文件太大");
    }
    console.log(files);

    setInputFile(file);
    setTimeout(() => {
      document.getElementById("file-input-form").reset();
      step(2);
    }, 50);
  };

  const onAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
  };

  const onPassPhraseChange = (e) => {
    setPassphrase(e.target.value);
  };
  const onKeyInputChange = async (e) => {
    setAesKey(e.target.value);
    const ivHex = await e.target.value.substring(0, 32);
    setAesIv(ivHex);
  };

  const step = (stepNum: number) => {
    console.log("step");
    if (stepNum) {
      const nextStep = document.getElementById("step" + stepNum);
      if (nextStep) {
        nextStep.scrollIntoView({ behavior: "smooth" });
      } else {
        const step1 = document.getElementById("step1");
        if (step1) {
          step1.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else {
      const step1 = document.getElementById("step1");
      if (step1) {
        step1.scrollIntoView({ behavior: "smooth" });
      }
    }
  };


  useEffect(() => {
    const getAesKey = async () => {
      if (passphrase) {
        const keyHex = await getKeyFromPassphrase(passphrase);
        setAesKey(keyHex);
      } else {
        setAesKey("");
      }
    };
    getAesKey();
    const getAesIv = async () => {
      if (passphrase) {
        const ivHex = await getIvFromPassphrase(passphrase);
        setAesIv(ivHex);
      } else {
        setAesIv("");
      }
    };
    getAesIv();
  }, [passphrase]);

  const encryptAes256 = () => {
    if (inputFile && (passphrase || is256BitHex(aesKey))) {
      const reader = new FileReader();
      reader.onload = async function () {
        try{
          const encrypted = await encryptAes(
            reader.result as ArrayBuffer,
            aesKey,
            aesIv
          );
          saveOrOpenBlob(new Blob([encrypted]), inputFile.name || "encrypted");
        }catch(err){
          alert('Encryption failed')
        }
        
      };
      reader.readAsArrayBuffer(inputFile);
    }
  };

  const decryptAes256 = () => {
    if (inputFile && (passphrase || is256BitHex(aesKey))) {
      const reader = new FileReader();
      reader.onload = async function () {
        try{
          const decrypted = await decryptAes(
            reader.result as ArrayBuffer,
            aesKey,
            aesIv
          );
          console.log(decrypted);
          saveOrOpenBlob(new Blob([decrypted]), inputFile.name || decrypted);
        }catch(err){
          alert('Decryption failed')
        }
       
      };
      reader.readAsArrayBuffer(inputFile);
    }
  };

  const saveOrOpenBlob = (blob, fileName) => {
    const tempEl = document.createElement("a");
    document.body.appendChild(tempEl);
    const url = window.URL.createObjectURL(blob);
    tempEl.href = url;
    tempEl.download = fileName;
    tempEl.click();
    window.URL.revokeObjectURL(url);
  };

  

  

  return (
    <>
      <div className="min-w-[1200px]">
        <div  className="h-[100vh] relative">
          <h1 className="pt-[20px] pb-[20px]">AES256 File Encrypt</h1>
          <form
            id="file-input-form"
            className="pt-[20px] flex items-center justify-center w-full"
          >
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Any file (MAX. 50mb)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={(e) => changeFile(e.target.files)}
              />
            </label>
          </form>
        </div>

        {inputFile && (
          <>
            <div id="step2" className="h-[100vh] relative">
              <button
                onClick={() => step(1)}
                type="button"
                className="mt-[10px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  className="w-4 h-4 rotate-[270deg]"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
                <span className="sr-only">Icon description</span>
              </button>
              <div className="pt-[10px]">
                <div className="text-left">
                  <div>
                    <span className="font-bold">File name:</span>{" "}
                    {inputFile.name}
                  </div>
                  <div>
                    <span className="font-bold">Last modified date:</span>{" "}
                    {inputFile.lastModifiedDate.toString()}
                  </div>
                  <div>
                    <span className="font-bold">Size:</span> {inputFile.size}
                  </div>
                  <div>
                    <span className="font-bold">Type:</span> {inputFile.type}
                  </div>
                </div>
              </div>
              <div className="pt-[10px] flex gap-[10px]">
               
              </div>
              {algorithm === "AES256" && inputFile && (
                <>
                  <div className="pt-[10px] text-left">
                    {((!passphrase && !aesKey) || passphrase) && (
                      <div>
                        <label
                          htmlFor="small-input"
                          className="font-bold block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Input passphrase (ex. 123456)
                        </label>
                        <input
                          onChange={onPassPhraseChange}
                          type="text"
                          id="small-input"
                          className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      </div>
                    )}

                    {((!passphrase && !aesKey) || (!passphrase && aesKey)) && (
                      <div>
                        <label
                          htmlFor="small-input"
                          className="font-bold block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Or Input key (256bit Hex) (ex.
                            8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92)
                        </label>
                        <input
                          onChange={onKeyInputChange}
                          type="text"
                          id="small-input"
                          className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                        {aesKey && !is256BitHex(aesKey) && (
                          <div className="text-red-500">
                            Key must be 256bit hex
                          </div>
                        )}
                      </div>
                    )}
                    {(passphrase || aesKey) && (
                      <>
                        <div className="pt-[20px]">
                          <div>
                            <span className="font-bold">
                              Encryption algorithm:
                            </span>{" "}
                            AES-CBC
                          </div>
                          {passphrase && (
                            <div>
                              <span className="font-bold">Key algorithm:</span>{" "}
                              Passphrase + SHA256
                            </div>
                          )}

                          <div>
                            <span className="font-bold">
                              Key (hex)(256bit):
                            </span>{" "}
                            {aesKey}
                          </div>
                          <div>
                            <span className="font-bold">Iv algorithm:</span> Key
                            + substring(0, 32)
                          </div>
                          <div>
                            <span className="font-bold">Iv (hex)(128bit):</span>{" "}
                            {aesIv}
                          </div>
                          <div>
                            <span className="font-bold">Padding :</span> PKCS#7
                          </div>
                        </div>
                        <div className="pt-[20px]">
                          <button
                            type="button"
                            onClick={encryptAes256}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                          >
                            Encrypt
                          </button>
                          <button
                            type="button"
                            onClick={decryptAes256}
                            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                          >
                            Decrypt
                          </button>
                        </div>
                        <div>
                          <span className="font-bold">Openssl Equivalent:</span>
                        </div>
                        <div>
                          <span className="font-bold">Encrypt:</span> openssl
                          enc -aes-256-cbc -nosalt -e -in input.jpg -out
                          output.jpg -K {aesKey} -iv {aesIv}
                        </div>
                        <div>
                          <span className="font-bold">Decrypt:</span> openssl
                          enc -aes-256-cbc -nosalt -d -in input.jpg -out
                          output.jpg -K {aesKey} -iv {aesIv}
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              {algorithm === "RSA" && inputFile && (
                <RsaKeyEncrypt/>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default AesFileEncryptorPage;
