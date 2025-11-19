import { Link } from "react-router-dom";
import "./Footer.scss";


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* LEFT SIDE */}
        <div className="footer-left">
          <div className="footer-logo">
            <img
          src="/Bastard.png"
          alt="Bastard Logo"
          height={64}
          className="logo h-12 w-auto object-contain"
        />
            <h2>bastard_wears</h2>
          </div>

          <p>A modern streetwear brand crafted for the bold.</p>
          <p>
            Built with love by{" "}
            <a href="https://instagram.com/bastard_wears" target="_blank">
              @bastard_wears
            </a>
          </p>
        </div>

        {/* RIGHT COLUMNS */}
        <div className="footer-right">

          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/new-arrivals">New Arrivals</Link>
            <Link to="/products">Products</Link>
            <Link to="/best-sellers">Best Sellers</Link>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <Link to="/contact">Contact</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/track-order">Track Order</Link>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/profile">My Account</Link>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <Link to="/privacy-policy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/returns">Returns</Link>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} bastard_wears. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
