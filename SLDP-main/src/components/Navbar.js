import React from 'react';
import Favicon from '../assets/favicon.png';
const Navbar = () => {
  return (
    <div>
      <header class="text-gray-600 body-font">
        <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <div class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <img className="w-12" src={Favicon} alt="logo" />
            <span class="ml-3 text-xl">HearSay- Sign Language Detection</span>
          </div>
          <nav class="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
            {/* <a href="#home" class="mr-5 hover:text-gray-900">Home</a> */}
          </nav>
          
        </div>
      </header>
    </div>
  );
};

export default Navbar;
