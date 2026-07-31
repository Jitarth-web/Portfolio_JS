import { useState } from "react";
import { certifications } from "../data/portfolio";
import SectionHeading from "../components/SectionHeading";
import FloatingSticker from "../components/FloatingSticker";

export default function Certifications() {
  const [selectedCert, setSelectedCert] = useState(null);

  const openModal = (cert) => setSelectedCert(cert);
  const closeModal = () => setSelectedCert(null);

  const row1Certs = certifications.filter((_, index) => index % 2 === 0);
  const row2Certs = certifications.filter((_, index) => index % 2 !== 0);
  const isPaused = selectedCert !== null;

  return (
    <section id="certifications" className="content-section">
      <FloatingSticker text="Undefined is not a function" theme="purple" size="md" top="25%" left="3%" rotation={-8} />
      <FloatingSticker text="404 Brain Not Found" theme="red" size="md" top="55%" right="4%" rotation={8} />
      <FloatingSticker text="404? Never." theme="blue" size="md" top="82%" left="2%" rotation={-6} />
      
      <div className="section-inner">
        <SectionHeading label="Credentials" title="Cert{ifica}tions" />
      </div>
      
      <div className="cert-slider-wrapper">
        {/* Row 1: Sliding Left */}
        <div className={`cert-slider slide-left ${isPaused ? 'paused' : ''}`}>
          {[...row1Certs, ...row1Certs].map((cert, index) => (
            <div 
              key={`row1-${index}`} 
              className="cert-card"
              onClick={() => openModal(cert)}
            >
              <div className="cert-card-arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </div>
              <div className="cert-image-wrapper">
                <img src={cert.image} alt={cert.title} loading="lazy" />
              </div>
              <div className="cert-card-overlay">
                <div className="cert-card-overlay-content">
                  <h3 className="cert-card-title">{cert.title}</h3>
                  <p className="cert-card-issuer">{cert.issuer}</p>
                  <p className="cert-card-date">{cert.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Sliding Right */}
        <div className={`cert-slider slide-right ${isPaused ? 'paused' : ''}`}>
          {[...row2Certs, ...row2Certs].map((cert, index) => (
            <div 
              key={`row2-${index}`} 
              className="cert-card"
              onClick={() => openModal(cert)}
            >
              <div className="cert-card-arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </div>
              <div className="cert-image-wrapper">
                <img src={cert.image} alt={cert.title} loading="lazy" />
              </div>
              <div className="cert-card-overlay">
                <div className="cert-card-overlay-content">
                  <h3 className="cert-card-title">{cert.title}</h3>
                  <p className="cert-card-issuer">{cert.issuer}</p>
                  <p className="cert-card-date">{cert.date}</p>
                </div>
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
