export const isHex = (str: string) => {
  const re = /[0-9A-Fa-f]{6}/g;
  return re.test(str);
};

export const is256BitHex = (str: string) => {
  const re = /[0-9A-Fa-f]{64}/g;
  return re.test(str);
};

export const isBase64 = (str: string) => {
  try{
    atob(str);
    return true
  }catch(err){
    return false
  }
}