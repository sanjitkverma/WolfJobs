export function getFormBody(params: any) {
  const formBody: string[] = [];

  for (const property in params) {
    const encodedKey = encodeURIComponent(property);
    if (Array.isArray(params[property])) {
      params[property].forEach((value) => {
        const encodedValue = encodeURIComponent(value);
        formBody.push(`${encodedKey}=${encodedValue}`);
      });
    } else {
      // Handle other properties as usual
      const encodedValue = encodeURIComponent(params[property]);
      formBody.push(`${encodedKey}=${encodedValue}`);
    }
  }
  return formBody.join("&");
}
