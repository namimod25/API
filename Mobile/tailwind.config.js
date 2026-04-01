
/** @type {import('tailwindcss').Config} */
export const content = ["./app/**/*.{js,jsx,ts,tsx}", "./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"];
export const presets = [require("nativewind/preset")];
export const theme = {
  extend: {
    colors: {
      active: '#44ACFF',
      inactive: '#A9A9A9',
      bacground: '#FFF1F1',
      danger: "#FF0B55"
    },
    fontFamily: {
      mamalyRegular: ["MonteCarloRegular"],
      title: ["PinyonScriptRegular"],
      mamalySemibold: ["MonsieurLaDoulaiseRegular"]
    }
  },
};
export const plugins = [];

// module.exports = {
//   content: ["./app/**/*.{js,jsx,ts,tsx}","./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
//   presets: [require("nativewind/preset")],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }