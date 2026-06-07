export default function SectionHeading({ label, title }) {
  return (
    <div className="section-heading reveal">
      <p>{label}</p>
      <h2>{title}</h2>
    </div>
  );
}
