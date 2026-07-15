import TypewriterHeading from "./TypewriterHeading";

const headingMap = {
  "About": { outline: "ABOUT", solid: "ME" },
  "Skills": { outline: "SKILLS", solid: "TECH" },
  "Projects": { outline: "PROJECTS", solid: "SHOWCASE" },
  "Experience": { outline: "EXPERIENCE", solid: "JOURNEY" },
  "Credentials": { outline: "CERTIFICATIONS", solid: "CREDENTIALS" },
  "Contact": { outline: "CONTACT", solid: "ME" }
};

export default function SectionHeading({ label, title }) {
  const mapped = headingMap[label] || { outline: label?.toUpperCase() || "", solid: "" };

  const len = mapped.outline.length;
  let sizeClass = "";
  if (len > 12) {
    sizeClass = "heading-xl";
  } else if (len > 8) {
    sizeClass = "heading-lg";
  }

  return (
    <div className="premium-heading-container">
      <div className="premium-heading">
        <span className={`heading-outline ${sizeClass}`} data-text={mapped.outline}>{mapped.outline}</span>
        {mapped.solid && <span className={`heading-solid ${sizeClass}`}>{mapped.solid}</span>}
      </div>
      <h3 className="premium-subheading">
        <TypewriterHeading text={title} />
      </h3>
    </div>
  );
}
