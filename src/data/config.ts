import { BiLogoGmail } from "react-icons/bi";
import { SiNotion } from "react-icons/si";
import { FaGoogleDrive } from "react-icons/fa";

const appConfig = {
  integration: [
    {
      name: "Gmail",
      icon: BiLogoGmail,
    },
    {
      name: "Google Drive",
      icon: FaGoogleDrive,
    },
    {
      name: "Notion",
      icon: SiNotion,
    },
  ],
};

export default appConfig;
