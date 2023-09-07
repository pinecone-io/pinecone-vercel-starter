import { IUrlEntry } from './UrlButton';

let urls: IUrlEntry[] = [
  // Example
  // {
  //   url: "https://cleantechnica.com/2023/06/29/solar-82-of-power-capacity-growth-in-india-in-2022/",
  //   title: "Solar Power in India",
  //   seeded: false,
  //   loading: false,
  // }
];

export function getURLs() {
  return urls;
}

export function addURL(newURL: IUrlEntry) {
  return urls.push(newURL);
}

export function clearURLs() {
  urls = [];
}
