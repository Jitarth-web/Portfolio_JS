import TypewriterHeading from "./TypewriterHeading";

export default function SectionHeading({ label, title }) {
  return (
    <div className="section-heading reveal">
      <p>{label}</p>
      <h2><TypewriterHeading text={title} /></h2>
    </div>
  );
}
