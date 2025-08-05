import React from 'react';

const Footer: React.FC = () => (
  <footer className="w-full bg-white border-t shadow-inner py-4 text-center text-gray-500 text-sm mt-auto">
    &copy; {new Date().getFullYear()} MedPress. All rights reserved.
    {/* Optionally add contact/social links here */}
  </footer>
);

export default Footer;