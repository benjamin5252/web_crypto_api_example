import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import  AesFileEncryptPage from "../pages/AesFileEncryptPage";
import RsaKeyEncryptPage from "./RsaStringEncryptPage";
import RsaKeyDecryptPage from "./RsaStringDecryptPage";
const HomePage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  useEffect(() => {
    // setSearchParams({page: 'aes_file_encrypt'})
    // navigate("/?page=aes_file_encrypt");
  }, []);
  
  

  return (
    <>
    
      {(!searchParams.get('page') || searchParams.get('page') === "aes_file_encrypt") && <AesFileEncryptPage/>}
      { searchParams.get('page') === "rsa_key_encrypt" && <RsaKeyEncryptPage/>}
      { searchParams.get('page') === "rsa_key_decrypt" && <RsaKeyDecryptPage/>}
      
    </>
  );
}

export default HomePage;