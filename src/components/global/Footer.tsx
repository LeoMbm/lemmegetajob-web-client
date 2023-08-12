'use client';

import { Footer } from 'flowbite-react';
import type { CustomFlowbiteTheme } from 'flowbite-react';


const customTheme: CustomFlowbiteTheme['footer'] = {
    root: {
      base: 'w-full bg-gray-50 shadow dark:bg-gray-800 md:flex md:items-center md:justify-between',
    }
  };
  

  export default function DefaultFooter() {
    return (
      <Footer theme={customTheme} container>
        <Footer.Copyright
          by="LeoMbm™"
          year={2023}
        />
        <Footer.LinkGroup>
          <Footer.Link href="#">
            About
          </Footer.Link>
          <Footer.Link href="#">
            Privacy Policy
          </Footer.Link>
          <Footer.Link href="#">
            Licensing
          </Footer.Link>
          <Footer.Link href="#">
            Contact
          </Footer.Link>
        </Footer.LinkGroup>
      </Footer>
    )
  }


