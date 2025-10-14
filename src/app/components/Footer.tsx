const Footer = () => {
  return (
    <footer className="bg-red-900 text-white p-4 text-center">
      <div className="container mx-auto">
        <p>
          &copy; {new Date().getFullYear()} Royal Resto. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;