import { BiLogoGmail } from "react-icons/bi";
import { SiNotion, SiLinkedin } from "react-icons/si";
import { FaGoogleDrive } from "react-icons/fa";

const appConfig = {
  platforms: [
    {
      name: "LinkedIn",
      icon: SiLinkedin,
      url: "https://linkedin.com",
    },
    {
      name: "Indeed",
      icon: SiLinkedin,
      url: "https://www.indeed.com",
    },
    {
      name: "Pylote",
      icon: SiLinkedin,
      url: "https://www.pylote.com",
    },
  ],
  plans: [
    {
      name: "Starter",
      dailyExecutions: 999,
      monthlyExecutions: 9999,
      modulesAllowed: 1,
      modules: ["LinkedIn"],
      priceMonthly: 10,
      priceYearly: 90,
      icon: BiLogoGmail,
      isPremium: true,
      url: "https://gmail.com",
      description: "This is a starter plan. You will be charged for the first 999 executions and 9999 monthly executions.",
      features: [
        {
          title: "Unlimited executions",
          description: "Unlimited executions"
        },
      ],
    },
    {
      name: "Hunter",
      dailyExecutions: 2000,
      monthlyExecutions: 20000,
      modulesAllowed: 3,
      modules: ["LinkedIn", "Indeed", "Pylote"],
      priceMonthly: 20,
      priceYearly: 180,
      icon: BiLogoGmail,
      isPremium: true,
    },
  ],
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
