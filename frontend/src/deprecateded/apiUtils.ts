export function getFormBody(params: any) {
  let formBody: string[] = [];

  for (let property in params) {
    let encodedKey = encodeURIComponent(property);
    if (Array.isArray(params[property])) {
      params[property].forEach((value) => {
        let encodedValue = encodeURIComponent(value);
        formBody.push(`${encodedKey}=${encodedValue}`);
      });
    } else {
      // Handle other properties as usual
      let encodedValue = encodeURIComponent(params[property]);
      formBody.push(`${encodedKey}=${encodedValue}`);
    }
  }
  return formBody.join("&");
}
