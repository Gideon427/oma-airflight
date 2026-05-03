'use client';

import {
  FaShippingFast,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-company">
            <div className="footer-brand">
              <FaShippingFast className="footer-logo" />
              <span className="footer-brand-name">Oma-Airflight</span>
            </div>
            <p className="footer-description">
              Fast and reliable shipping services worldwide. We deliver your packages with care and precision.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" className="social-link" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" className="social-link" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" className="social-link" aria-label="LinkedIn"><FaLinkedin /></a>
              <a
                href="https://wa.me/16503020768"
                className="social-link"
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-group">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/pricing">Pricing</a></li>
              <li><a href="/locations">Locations</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/blog">Blog</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-links-group">
            <h3 className="footer-title">Services</h3>
            <ul className="footer-links">
              <li><a href="/track">Track Package</a></li>
              <li><a href="/send">Send Package</a></li>
              <li><a href="/quote">Get a Quote</a></li>
              <li><a href="/support">Support</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-contact">
            <h3 className="footer-title">Contact Us</h3>
            <address className="footer-address">
              <p>123 Shipping Avenue</p>
              <p>New York, NY 10001</p>
              <p>Email: <a href="mailto:Omahaairflighteasecargo@gmail.com">Omahaairflighteasecargo@gmail.com</a></p>
              <p>Phone: <a href="tel:+16503020768">Phone:+1 (650) 302-0768 📞</a></p>
              <p>Whatsapp: <a href="https://wa.me/16503020768" 
              className='social link'
              target="_blank" rel="noopener noreferrer">WhatsApp: +1 (650) 302-0768 📞</a></p>
            </address>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Oma-Airflight. All rights reserved.</p>
          <div className="footer-legal">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/cookies">Cookie Policy</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background-color: var(--gray-800);
          color: var(--white);
          padding: var(--space-2xl) 0 var(--space-xl);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-xl);
          margin-bottom: var(--space-xl);
        }

        .footer-brand {
          display: flex;
          align-items: center;
          margin-bottom: var(--space-md);
        }

        .footer-logo {
          font-size: 1.75rem;
          color: var(--primary-color);
          margin-right: var(--space-sm);
        }

        .footer-brand-name {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .footer-description {
          color: var(--gray-300);
          margin-bottom: var(--space-md);
          line-height: 1.6;
        }

        .footer-social {
          display: flex;
          gap: var(--space-md);
        }

        .social-link {
          color: var(--gray-300);
          font-size: 1.25rem;
          transition: color 0.2s ease;
        }

        .social-link:hover {
          color: var(--white);
        }

        .social-link[aria-label='WhatsApp']:hover {
          color: #25D366;
        }

        .footer-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: var(--space-md);
          color: var(--white);
        }

        .footer-links {
          list-style: none;
        }

        .footer-links li {
          margin-bottom: var(--space-sm);
        }

        .footer-links a {
          color: var(--white);
          transition: color 0.2s ease;
        }

        .footer-links a:hover {
          color: var(--white);
          text-decoration: none;
        }

        .footer-address {
          font-style: normal;
          color: var(--gray-300);
        }

        .footer-address p {
          margin-bottom: var(--space-sm);
        }

        .footer-address a {
          color: var(--gray-300);
          transition: color 0.2s ease;
        }

        .footer-address a:hover {
          color: var(--white);
          text-decoration: none;
        }

        .footer-bottom {
          border-top: 1px solid var(--gray-700);
          padding-top: var(--space-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          color: var(--gray-400);
          font-size: 0.875rem;
        }

        .footer-legal {
          display: flex;
          gap: var(--space-md);
          margin-top: var(--space-sm);
        }

        .footer-legal a {
          color: var(--gray-400);
          transition: color 0.2s ease;
        }

        .footer-legal a:hover {
          color: var(--white);
          text-decoration: none;
        }

        @media (min-width: 768px) {
          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }

          .footer-legal {
            margin-top: 0;
          }
        }
      `}</style>
    </footer>
  );
}
