import { useState } from "react";
import { certifications } from "../data/portfolio";
import SectionHeading from "../components/SectionHeading";

export default function Certifications() {
  const [selectedCert, setSelectedCert] = useState(null);

  const openModal = (cert) => setSelectedCert(cert);
  const closeModal = () => setSelectedCert(null);

  return (
    <section id="certifications" className="content-section">
      <div className="section-inner">
        <SectionHeading label="Credentials" title="{Certifications}" />
      </div>
      
      <div className="cert-slider-wrapper">
        <div className={`cert-slider ${selectedCert ? 'paused' : ''}`}>
          {[...certifications, ...certifications].map((cert, index) => (
            <div 
              key={index} 
              className="cert-card"
              onClick={() => openModal(cert)}
            >
              <div className="cert-image-wrapper">
                <img src={cert.image} alt={cert.title} loading="lazy" />
              </div>
              <div className="cert-content">
                <h3 className="cert-title">{cert.title}</h3>
                <p className="cert-issuer">{cert.issuer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCert && (
        <div className="cert-modal-overlay" onClick={closeModal}>
          <div className="cert-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="cert-modal-close" onClick={closeModal}>×</button>
            <div className="cert-modal-image">
               <img src={selectedCert.image} alt={selectedCert.title} />
            </div>
            <div className="cert-modal-details">
              <h2>{selectedCert.title}</h2>
              <p className="issuer-text">{selectedCert.issuer}</p>
              <p className="date-text">Issued: {selectedCert.date}</p>
              {selectedCert.credentialUrl && selectedCert.credentialUrl !== "#" && (
                <a href={selectedCert.credentialUrl} target="_blank" rel="noopener noreferrer" className="hire-btn" style={{marginTop: '20px'}}>
                  View Credential
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
