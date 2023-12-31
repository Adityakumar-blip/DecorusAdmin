import { getStorage, ref, getDownloadURL } from "firebase/storage";

const storage = getStorage();

export function getImagesFromFirebase(imageUrl) {
  getDownloadURL(ref(storage, imageUrl))
    .then((url) => {
      return url;
      // const xhr = new XMLHttpRequest();
      // xhr.responseType = "blob";
      // xhr.onload = (event) => {
      //   const blob = xhr.response;
      // };
      // xhr.open("GET", url);
      // xhr.send();

      // // Or inserted into an <img> element
      // const img = document.getElementById("myimg");
      // img.setAttribute("src", url);
    })
    .catch((error) => {
      // Handle any errors
    });
}
