export const isValidUrl = (url: string) => {
 const urlRegex =
   /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d?\d|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]|1\d\d|2[0-4]\d|25[0-5]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

  let x = urlRegex.test(url);
  return !!urlRegex.test(url)
}
