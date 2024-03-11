import React from 'react';
import './Footer.css'
function Footer() {
  return (
    <footer className="text-center text-light py-4" id="footer-content">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <em><h3>Contact Us</h3></em>
            <em><p>Email: ProjectSync@gmail.com</p></em>
            <em><p>Phone: +40 720 605 262</p></em>
            <em><p>Address: 18 Videle, Ilfov, Voluntari</p></em>
          </div>
          <div className="col-md-4">
            <em><h3>Follow Us</h3></em>
            <em><p>Discord: @ProjectSync</p></em>
            <em><p>Twitter: @ProjectSync</p></em>
            <em><p>Instagram: ProjectSyncOfficial</p></em>
          </div>
          <div className="col-md-4">
            <em><h3>New Column</h3></em>
            <em><p>Ma mai gandesc ce scriu aici.</p></em>
            <em><p>Ma mai gandesc ce scriu aici.</p></em>
            <em><p>Ma mai gandesc ce scriu aici.</p></em>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-12">
            <p>&copy; 2024 ProjectSync. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
